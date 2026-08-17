// Write a compact data/last-session.md on /new, /resume, and /fork so the next
// session start digest immediately knows what we were working on without reading
// JSONL session logs.
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const extensionFile = fileURLToPath(import.meta.url);
const extensionDir = dirname(extensionFile);
const root = resolve(extensionDir, "../..");
const fmHome = process.env.FM_HOME || process.env.FM_ROOT_OVERRIDE || root;
const sessionFile = `${fmHome}/data/last-session.md`;

function extractText(content: string | unknown[]): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    for (const block of content) {
      if (block && typeof block === "object" && "type" in block && block.type === "text") {
        return block.text as string;
      }
    }
  }
  return "";
}

function firstLine(text: string): string {
  const trimmed = text.trim().split("\n")[0];
  if (!trimmed) return "";
  return trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed;
}

function formatTimestamp(ts: string | number | undefined): string {
  if (!ts) return "unknown";
  const d = typeof ts === "string" ? new Date(ts) : new Date(ts);
  if (isNaN(d.getTime())) return "unknown";
  return d.toISOString().split("T")[0];
}

function writeLastSession(ctx: {
  sessionManager?: {
    getHeader?: () => { timestamp?: unknown; cwd?: string } | null;
    buildContextEntries?: () => unknown[];
    getSessionName?: () => string | undefined;
  };
}): void {
  const lines: string[] = [];
  const header = ctx.sessionManager?.getHeader?.();
  const sessionDate = formatTimestamp(
    typeof header?.timestamp === "string" || typeof header?.timestamp === "number"
      ? header.timestamp
      : undefined,
  );
  const sessionName = ctx.sessionManager?.getSessionName?.();
  const entries = ctx.sessionManager?.buildContextEntries?.() ?? [];

  // Session date and name
  lines.push(`# Last Session (${sessionDate})`);
  if (sessionName) lines.push(`**Name:** ${sessionName}`);

  // Walk entries for user messages, model changes, and tool info
  const userTopics: string[] = [];
  let lastUserTopic = "";
  let lastAssistantWork = "";
  let modelInfo = "";

  for (const entry of entries) {
    const e = entry as Record<string, unknown>;
    const type = e.type as string;
    const msg = e.message as Record<string, unknown> | undefined;

    if (type === "message" && msg) {
      const role = msg.role as string;

      if (role === "user") {
        const text = extractText(msg.content as string | unknown[]);
        const topic = firstLine(text);
        if (topic) {
          userTopics.push(topic);
          lastUserTopic = topic;
        }
      } else if (role === "assistant") {
        const content = msg.content as unknown[];
        if (Array.isArray(content)) {
          for (const block of content) {
            if (
              block &&
              typeof block === "object" &&
              "type" in block &&
              block.type === "text"
            ) {
              const text = (block as { text: string }).text;
              const trimmed = text.trim();
              // Capture first substantive sentence from each assistant response
              if (trimmed && !lastAssistantWork) {
                const sentence = trimmed.split("\n")[0];
                lastAssistantWork =
                  sentence.length > 100
                    ? sentence.slice(0, 97) + "..."
                    : sentence;
              }
            }
          }
        }
        // Track model info from last assistant message
        const provider = msg.provider as string | undefined;
        const model = msg.model as string | undefined;
        if (provider && model) {
          modelInfo = `${provider}/${model}`;
        }
      }
    } else if (type === "model_change") {
      const e2 = e as { provider?: string; modelId?: string };
      modelInfo = `${e2.provider ?? "?"}/${e2.modelId ?? "?"}`;
    } else if (type === "compaction") {
      const e2 = e as { summary?: string };
      if (e2.summary) {
        lines.push(`**Compaction:** ${firstLine(e2.summary)}`);
      }
    } else if (type === "session_info") {
      const e2 = e as { name?: string };
      if (e2.name && !sessionName) {
        lines.push(`**Name:** ${e2.name}`);
      }
    }
  }

  // Topics we worked on
  if (userTopics.length > 0) {
    // Take first as the main topic, last as what we were doing
    const mainTopic = userTopics[0];
    lines.push(`**Topic:** ${mainTopic}`);
    if (userTopics.length > 1 && lastUserTopic !== mainTopic) {
      lines.push(`**Last:** ${lastUserTopic}`);
    }
  }

  // What the assistant was doing
  if (lastAssistantWork && lastAssistantWork.length > 0) {
    lines.push(`**Work:** ${lastAssistantWork}`);
  }

  // Model used
  if (modelInfo) {
    lines.push(`**Model:** ${modelInfo}`);
  }

  // Conversation length
  const messageCount = entries.filter((e) => {
    const entry = e as { type?: string };
    return entry.type === "message";
  }).length;
  if (messageCount > 0) {
    lines.push(`**Messages:** ${messageCount}`);
  }

  // Write
  const fmDataDir = resolve(fmHome, "data");
  if (!existsSync(fmDataDir)) mkdirSync(fmDataDir, { recursive: true });
  writeFileSync(sessionFile, lines.join("\n") + "\n");
}

export default function (pi: ExtensionAPI): void {
  pi.on("session_shutdown", (event, ctx) => {
    const ev = event as { reason?: string };
    // Write on /new, /resume, and /fork — not on quit or reload
    if (ev.reason === "new" || ev.reason === "resume" || ev.reason === "fork") {
      try {
        writeLastSession(ctx);
      } catch {
        // Best-effort: failing to write the summary should never block shutdown
      }
    }
  });
}
