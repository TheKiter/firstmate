// Compress the firstmate session-start digest on context re-emit.
//
// The session-start digest (printed by bin/fm-session-start.sh) dumps full
// fleet state, every config file, and all learnings into the conversation.
// On context re-emit (Pi loses context and re-reads the session JSONL), that
// entire digest comes back as a message -- burning 5K-50K tokens every time.
//
// This extension hooks the `context` event (fired before every LLM call),
// detects the verbose digest blocks, and replaces them with a compact summary.
// The full context remains accessible via the `get_fleet_context` custom tool.

import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

const extensionFile = fileURLToPath(import.meta.url);
const extensionDir = dirname(extensionFile);
const root = resolve(extensionDir, "../..");
const fmHome = process.env.FM_HOME || process.env.FM_ROOT_OVERRIDE || root;

const SESSION_START_MARKER = "SESSION START";

// Sections whose full text is available on disk / via tool.
interface ContextFileEntry {
  path: string;
  label: string;
  maxLinesInSummary: number;
}

const CONTEXT_FILES: Record<string, ContextFileEntry> = {
  learnings: {
    path: resolve(fmHome, "data/learnings.md"),
    label: "Fleet Knowledge",
    maxLinesInSummary: 3,
  },
  "captain.md": {
    path: resolve(fmHome, "data/captain.md"),
    label: "Captain Preferences",
    maxLinesInSummary: 8,
  },
  projects: {
    path: resolve(fmHome, "data/projects.md"),
    label: "Project Registry",
    maxLinesInSummary: 20,
  },
  secondmates: {
    path: resolve(fmHome, "data/secondmates.md"),
    label: "Secondmate Registry",
    maxLinesInSummary: 10,
  },
};

// ---------------------------------------------------------------------------
// Message helpers
// ---------------------------------------------------------------------------

function getMessageText(msg: Record<string, unknown>): string | null {
  const content = msg.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    for (const block of content) {
      if (block && typeof block === "object" && "type" in block) {
        const b = block as Record<string, unknown>;
        if (b.type === "text" && typeof b.text === "string") return b.text;
      }
    }
  }
  return null;
}

function isDigestContent(text: string): boolean {
  return (
    text.includes(SESSION_START_MARKER) &&
    text.includes("FIRSTMATE_OP")
  );
}

// ---------------------------------------------------------------------------
// Digest compression
// ---------------------------------------------------------------------------

function compressDigest(original: string): string {
  const lines = original.split("\n");
  const compressed: string[] = [];

  compressed.push("--- FIRSTMATE FLEET (COMPRESSED) ---");
  compressed.push("");

  // 1. Lock status
  const lockLine = lines.find(
    (l) => l.includes("lock") && (l.includes("acquired") || l.includes("refused"))
  );
  if (lockLine) {
    compressed.push(`Lock: ${lockLine.trim()}`);
  } else {
    compressed.push("Lock: acquired");
  }

  // 2. AFK
  const afkIdx = lines.findIndex((l) => l.trim() === "AFK");
  if (afkIdx >= 0 && lines[afkIdx + 1]?.includes("absent")) {
    compressed.push("AFK: inactive");
  } else if (afkIdx >= 0 && lines[afkIdx + 1]?.trim()) {
    compressed.push(`AFK: ${lines[afkIdx + 1].trim()}`);
  }

  // 3. Bootstrap diagnostics (only if actionable)
  const bootIdx = lines.findIndex((l) => l.trim() === "BOOTSTRAP");
  if (bootIdx >= 0) {
    const bootContent = extractSectionBody(lines, bootIdx + 1);
    const diagLines = bootContent
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.includes("silent") && !l.includes("all good"));
    if (diagLines.length > 0) {
      compressed.push("Bootstrap diagnostics:");
      for (const dl of diagLines) compressed.push(`  ${dl}`);
    }
  }

  // 4. Wake queue -- count and types, plus full lines for actionable items
  const wakeIdx = lines.findIndex((l) => l.trim() === "WAKE QUEUE");
  if (wakeIdx >= 0) {
    const wakeBody = extractSectionBody(lines, wakeIdx + 1);
    const wakeRegex = /^(\d+\t\d+\t\w+\t.+)$/gm;
    const wakeMatches = [...wakeBody.matchAll(wakeRegex)];
    if (wakeMatches.length > 0) {
      const typeCount = new Map<string, number>();
      for (const m of wakeMatches) {
        const kind = m[0].split("\t")[2] || "?";
        typeCount.set(kind, (typeCount.get(kind) || 0) + 1);
      }
      const typeSummary = [...typeCount.entries()]
        .map(([k, c]) => `${c}x ${k}`)
        .join(", ");
      compressed.push(`Wakes: ${wakeMatches.length} pending (${typeSummary})`);
      // Print raw wake lines so the agent can see the exact payload
      for (const m of wakeMatches) {
        compressed.push(`  ${m[1]}`);
      }
    } else {
      compressed.push("Wakes: none pending");
    }
  }

  // 5. Fleet state -- task summaries
  compressed.push("");
  compressed.push("Fleet:");
  const fleetIdx = lines.findIndex(
    (l) => l.includes("Work under way") && l.includes("state/*.meta")
  );
  if (fleetIdx >= 0) {
    const fleetBody = extractSectionBody(lines, fleetIdx + 1);
    const tasks = fleetBody
      .split("\n---\n")
      .map((t) => t.trim())
      .filter((t) => t);
    for (const task of tasks) {
      const tLines = task.split("\n");
      const nameLine = tLines.find((l) => l.startsWith("--- "));
      const name = nameLine
        ? nameLine.replace("--- ", "").replace(" ---", "").trim()
        : "";
      const epLine = tLines.find((l) => l.includes("endpoint:"));
      const metaVals = tLines
        .filter(
          (l) =>
            l.includes("=") &&
            !l.includes("endpoint:") &&
            !l.includes("status tail")
        )
        .map((l) => l.trim());
      if (!name) continue;
      const epStatus = epLine?.includes("alive")
        ? "alive"
        : epLine?.includes("dead")
          ? "dead"
          : "unknown";
      const kindVal = metaVals
        .find((l) => l.startsWith("kind="))
        ?.split("=")[1] || "?";
      const summary = metaVals
        .filter((l) => !l.startsWith("kind=") && !l.startsWith("window="))
        .join("; ");
      compressed.push(
        `  ${name} (${kindVal}, ${epStatus}): ${summary}`
      );

      // Last 2 status lines, truncated
      const tailStart = tLines.findIndex((l) => l.includes("status tail"));
      if (tailStart >= 0) {
        const tailLines = tLines
          .slice(tailStart + 1)
          .filter((l) => l.trim());
        const last2 = tailLines.slice(-2);
        for (const tl of last2) {
          compressed.push(`    last: ${tl.replace(/^done \[key=.*?\] /, "done: ").substring(0, 140)}`);
        }
      }
    }
  }

  // 6. Orphans
  const orphanIdx = lines.findIndex((l) => l.includes("Orphan status logs"));
  if (orphanIdx >= 0 && (lines[orphanIdx + 1] || "").includes("(none)")) {
    compressed.push("  (no orphan status logs)");
  }

  // 7. Network checks (only if relevant)
  const netIdx = lines.findIndex((l) => l.includes("NETWORK CHECKS"));
  if (netIdx >= 0) {
    const netBody = extractSectionBody(lines, netIdx + 1);
    const netRelevant = netBody
      .split("\n")
      .map((l) => l.trim())
      .filter(
        (l) =>
          l &&
          !l.includes("completed") &&
          !l.includes("silent") &&
          !l.includes("no problems found")
      );
    if (netRelevant.length > 0) {
      compressed.push("");
      compressed.push("Network:");
      for (const rl of netRelevant) compressed.push(`  ${rl}`);
    }
  }

  // 8. Context file summaries
  compressed.push("");
  compressed.push("Context (full text via get_fleet_context tool):");
  for (const [, cf] of Object.entries(CONTEXT_FILES)) {
    if (!existsSync(cf.path)) {
      compressed.push(`  ${cf.label}: (absent)`);
      continue;
    }
    const content = readFileSync(cf.path, "utf-8");
    const lineCount = content.split("\n").length;
    const charCount = content.length;
    const tasteLines: string[] = [];
    for (const cl of content.split("\n")) {
      if (/^#+\s/.test(cl)) tasteLines.push(cl.replace(/^#+\s*/, ""));
      if (tasteLines.length >= cf.maxLinesInSummary) break;
    }
    const taste =
      tasteLines.length > 0 ? ` (${tasteLines.join("; ")})` : "";
    compressed.push(
      `  ${cf.label}: ${lineCount} lines, ${charCount} chars${taste}`
    );
  }

  // 9. GBrain reference
  compressed.push("");
  compressed.push(
    "Full context is stored in GBrain and on disk. " +
      "Use `get_fleet_context(section)` to retrieve any section."
  );

  compressed.push("");
  compressed.push("--------------------------------------");

  return compressed.join("\n");
}

// Extract text from `startIdx` until the next double-separator or EOF.
function extractSectionBody(lines: string[], startIdx: number): string {
  const result: string[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("===") && line.includes("===") && !line.startsWith("---FIRSTMATE")) {
      break;
    }
    if (line.startsWith("---") && line.includes("---") && line.length > 20) {
      // Check if this is a section break like "--- codex ---"
      if (line.trim().startsWith("--- ") && !line.startsWith("---FIRSTMATE")) {
        // This is a sub-section header within the digest -- include it
        result.push(line);
        continue;
      }
      break;
    }
    // Only break at major section markers
    if (line.startsWith("data/") || /^[A-Z]/.test(line)) continue;
    result.push(line);
  }
  return result.join("\n").trim();
}

// ---------------------------------------------------------------------------
// GBrain seeding (best-effort)
// ---------------------------------------------------------------------------

function seedGbrain(): void {
  for (const [key, cf] of Object.entries(CONTEXT_FILES)) {
    if (!existsSync(cf.path)) continue;
    try {
      execSync(
        `OLLAMA_BASE_URL=${process.env.OLLAMA_BASE_URL || "http://100.79.189.5:11434/v1"} ` +
        `gbrain put "firstmate-context-${key}" < "${cf.path}"`,
        {
          timeout: 15_000,
          stdio: "ignore",
        }
      );
    } catch {
      // Best-effort -- non-blocking
    }
  }
}

// ---------------------------------------------------------------------------
// Extension entry point
// ---------------------------------------------------------------------------

export default function (pi: ExtensionAPI): void {
  // Seed GBrain on session start
  pi.on("session_start", async () => {
    seedGbrain();
  });

  // Compress the digest on context re-emit
  pi.on("context", async (event) => {
    const messages = event.messages as Record<string, unknown>[];
    let modified = false;

    const compressedMessages = messages.map((msg) => {
      const text = getMessageText(msg);
      if (text && isDigestContent(text)) {
        modified = true;
        const compressed = compressDigest(text);

        if (typeof msg.content === "string") {
          return { ...msg, content: compressed };
        }
        if (Array.isArray(msg.content)) {
          return {
            ...msg,
            content: msg.content.map((block: Record<string, unknown>) => {
              if (
                block &&
                typeof block === "object" &&
                "type" in block &&
                (block as Record<string, unknown>).type === "text"
              ) {
                return { ...block, text: compressed };
              }
              return block;
            }),
          };
        }
      }
      return msg;
    });

    if (modified) {
      return { messages: compressedMessages };
    }
  });

  // Register the on-demand context retrieval tool
  pi.registerTool({
    name: "get_fleet_context",
    label: "Get Fleet Context",
    description:
      "Retrieve the full text of a firstmate fleet context section. " +
      "Sections: learnings (fleet knowledge, infra, contacts), " +
      "captain.md (captain preferences and standing instructions), " +
      "projects (project registry with delivery modes), " +
      "secondmates (secondmate registry), " +
      "fleet (current fleet state: tasks, endpoints, statuses), " +
      "backlog (task queue), " +
      "agents-reference (AGENTS.md reference sections stored in GBrain: " +
      "layout, dispatch, validate, escalation, skills). " +
      "Use this when you need the full text of a section previously " +
      "compressed in the session-start digest.",
    parameters: Type.Object({
      section: Type.String({
        description:
          "Which section: learnings, captain.md, projects, secondmates, fleet, backlog, or agents-reference",
      }),
      subtopic: Type.Optional(Type.String({
        description:
          "For agents-reference, optional subtopic: layout, dispatch, validate, escalation, or skills",
      })),
    }),
    async execute(toolCallId, rawParams, signal, onUpdate, ctx) {
      const params = rawParams as { section: string };
      const section = params.section;

      if (section === "fleet") {
        const stateDir = resolve(fmHome, "state");
        const lines: string[] = ["# Full Fleet State"];
        if (!existsSync(stateDir)) {
          lines.push("(no state directory)");
        } else {
          for (const f of readdirSync(stateDir).sort()) {
            if (!f.endsWith(".meta")) continue;
            try {
              const content = readFileSync(resolve(stateDir, f), "utf-8");
              lines.push(`\n--- ${f.replace(".meta", "")} ---\n${content}`);
            } catch {
              // skip unreadable
            }
          }
        }
        return {
          content: [{ type: "text", text: lines.join("\n") }],
          details: {},
        };
      }

      if (section === "backlog") {
        const backlogFile = resolve(fmHome, "data/backlog.md");
        if (!existsSync(backlogFile)) {
          return {
            content: [
              { type: "text", text: "Backlog is absent (no backlog tasks)." },
            ],
            details: {},
          };
        }
        return {
          content: [{ type: "text", text: readFileSync(backlogFile, "utf-8") }],
          details: {},
        };
      }

      if (section === "agents-reference") {
        const sub = (rawParams as Record<string, string>).subtopic || "";
        const gbrainSlugs: Record<string, string> = {
          layout: "firstmate-s2-layout",
          dispatch: "firstmate-s4-dispatch",
          validate: "firstmate-s7-validate",
          escalation: "firstmate-s9-escalation",
          skills: "firstmate-s13-skills",
        };
        const obsPath = resolve(
          fmHome.replace("Documents/Default Project/firstmate", "Documents/Obsidian Vault"),
          "reference/firstmate"
        );
        if (sub && gbrainSlugs[sub]) {
          // Try GBrain first, fall back to Obsidian vault
          try {
            const result = execSync(
              `OLLAMA_BASE_URL=${process.env.OLLAMA_BASE_URL || "http://100.79.189.5:11434/v1"} ` +
              `gbrain get "${gbrainSlugs[sub]}"`,
              { timeout: 10_000, encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] }
            );
            return {
              content: [{ type: "text", text: result.stdout || "(empty)" }],
              details: {},
            };
          } catch {
            // Fall back to Obsidian vault
            const vaultFile = resolve(obsPath, `fm-agent-${sub}.md`);
            if (existsSync(vaultFile)) {
              return {
                content: [{ type: "text", text: readFileSync(vaultFile, "utf-8") }],
                details: {},
              };
            }
          }
        }
        // List available
        const available = Object.keys(gbrainSlugs).join(", ");
        return {
          content: [{
            type: "text",
            text: `AGENTS.md reference sections available: ${available}. Pass subtopic to retrieve one (e.g. agents-reference with subtopic: layout).`
          }],
          details: {},
        };
      }

      const cf = CONTEXT_FILES[section];
      if (!cf) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown section "${section}". Available: ${Object.keys(CONTEXT_FILES).join(", ")}, fleet, backlog, agents-reference`,
            },
          ],
          details: {},
          isError: true,
        };
      }

      if (!existsSync(cf.path)) {
        return {
          content: [
            {
              type: "text",
              text: `Section "${section}" file not found at ${cf.path}`,
            },
          ],
          details: {},
        };
      }

      return {
        content: [{ type: "text", text: readFileSync(cf.path, "utf-8") }],
        details: {},
      };
    },
  });
}
