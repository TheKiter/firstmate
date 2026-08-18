# Learnings

## Skill Directory Reference

5 skill directories. Priority order (first match wins on name collisions):

1. `~/.claude/skills/` -- global skills (37: defuddle, obsidian-*, no-mistakes, v3-*, github-*, etc.)
2. `firstmate/.pi/skills/` -- Pi project design/UI skills (brandkit, design-taste, etc.)
3. `firstmate/.agents/skills/` -- firstmate internal agent-only (afk, bearings, harness-adapters, etc.)
4. `firstmate/skills/` -- public installer-facing (grill-me, stow)
5. `Obsidian Vault/.claude/skills/` -- vault-only (qmd, excalidraw-diagram, mermaid-visualizer)

Always look in `~/.claude/skills/` first. The vault `CLAUDE.md` ("Obsidian Mind") is its agent manual, not a skill file.

## Token and compute environment

All inference runs on Nvidia Sparks (self-hosted hardware). There are no token limits, rate limits, or API costs. This applies to every agent and every task in the fleet. Do not optimize for token count, context budget, or API cost. Load all relevant skills at every intake. Load full skill files without concern for length. Keep broad context for the entire session rather than trimming for efficiency. The only bottleneck is wall-clock time, and even that is generous on Spark hardware.

## Client Contacts

All listed are CEOs of their respective companies.

### Excelstra
- **CEO:** Eunicia
- **Projects:** Named after solar system bodies, working outward from the sun.
- **Sun** (Phase 1): Analytics dashboard, NL query, email reminders.
  - Stack: Next.js on Vercel, DeepSeek on 2x NVIDIA Sparks, Eve agents
  - Infrastructure: Sparks on Tailscale, Buzz server on Tailscale Funnel
  - Data sources: GHL, Google (OAuth), Microsoft Graph, Stripe
  - Delivery: OAuth-first, live data pulls, email via MS Graph

### Remembrance Codex
- **CEO:** Zack
- **Project:** Structured codex build (content extraction, corpora, agent workflows)
- **Dir:** ~/Documents/Remembrance-Codex/

### We Are Ilu
- **CEO:** Jamie
- **Project:** Brand work, website (no project directory yet)

### Star Cleaners
- **CEO:** Thuy-An
- **Project:** GHL operations, outreach pipelines, brand assets
- **Dir:** ~/Documents/Star Cleaners/
- **GitHub:** TheKiter/star-cleaners

### Personal
- **spark-dashboard:** Glassmorphic dashboard monitoring 3 NVIDIA Spark instances on local network

## Firstmate persistent-cd guard

The primary firstmate checkout lives at a path with spaces (`/Users/robinz.media/Documents/Default Project/firstmate/`). The PreToolUse seatbelt (`bin/fm-arm-pretool-check.sh`) blocks `cd` into the firstmate home because a persistent top-level directory change would move the shell into a project clone, causing bare commands to run in the wrong repo.

**Never use `cd` when running a firstmate-owned command.** Use the absolute path with proper quoting, or a subshell. Examples:
- Correct: `"/Users/robinz.media/Documents/Default Project/firstmate/bin/fm-wake-drain.sh"`
- Correct: `(cd "/Users/robinz.media/Documents/Default Project/firstmate" && bin/fm-wake-drain.sh)`
- Wrong: `cd /Users/robinz.media/Documents/Default\ Project/firstmate/` then `bin/fm-wake-drain.sh`

The guard does not apply to paths outside the primary checkout (e.g., `/tmp`, `projects/` clones) -- only to the home directory itself.

## Session Context Recovery

Pi does not persist conversation history across restarts. To recover previous session context:

1. Pi stores session logs at `~/.pi/agent/sessions/--Users-robinz.media-Documents-Default\ Project-firstmate--/*.jsonl`
2. Each file is a JSONL log of the full conversation (messages, tool calls, thinking, results)
3. Search with `grep -l "<topic>" ~/.pi/agent/sessions/*.jsonl` to find relevant sessions
4. Read specific lines with `grep -i "<topic>" <file>.jsonl` to extract context
5. The most recent session is the one with the latest timestamp in filename

## GBrain + Obsidian Vault (2026-08-15)

GBrain is the agentic brain. The Obsidian Vault is the file-backed knowledge source.
Agents should use GBrain for persistent memory across sessions.

### GBrain setup
- Installed via `bun install -g github:garrytan/gbrain` (v0.46.1.0)
- **Engine:** Local Postgres on this Mac (`postgresql://robinz.media@localhost:5432/gbrain`, pgvector)
- **Config file:** `~/.gbrain/config.json`
- **Search mode:** `conservative` (keyword-only, no LLM query expansion)
- **69 skills loaded** (10 recommended not yet installed: cold-start, book-mirror, article-enrichment, etc.)
- `OLLAMA_BASE_URL=http://100.79.189.5:11434/v1` set in `~/.zshrc` and firstmate `.env`

### Vault imported
- **Source:** `~/Documents/Obsidian Vault/` (225 real markdown files, excluding 34K junk in Projects/Star Cleaners)
- **80 pages** imported, **311 chunks** embedded, all indexed
- **Excluded from import:** Star Cleaners (34K __dirname_*.md cache files), generated-images, previews, graphify-out, .shardmind, .claude/skills, .obsidian

### How to query
- `gbrain think "question" --model "anthropic:deepseek-ai/DeepSeek-V4-Flash"` — synthesis with citations (needs --model for non-Anthropic endpoint)
- `gbrain recall --query "topic"` — retrieval only
- `gbrain remember "fact" --provenance <source>` — write to brain
- Always set both env vars: `OLLAMA_BASE_URL=http://100.79.189.5:11434/v1` (embeddings) and the LLM points at the Spark

### Infrastructure (Sparks on Tailscale)
| Purpose | Host | Credentials |
|---|---|---|
| **Embeddings (Ollama)** | `100.79.189.5:11434` (Codex Spark) | `nomic-embed-text` (768d), also has `qwen3-embedding` (4096d) |
| **Synthesis LLM (vLLM)** | `100.82.55.92:8000/v1` (Excelstra Spark) | DeepSeek-V4-Flash, Hermes-4-70B |
| **Obsidian vault** | `~/Documents/Obsidian Vault/` | Local, synced to Spark via Syncthing for Eve agents |

## Source (Vibrate Intention) -- rebranded ODS fork (2026-08-16)

ODS (Osmantic/ODS v2.6.0) was forked to a private GitHub repo: `https://github.com/TheKiter/Source`

Full rebrand from "ODS / Osmantic" to "Vibrate Intention / Source":
- Splash screen shows "Source" title with "Vibrate Intention" subtitle, "Intelligent Infrastructure" tagline
- Browser tab reads "Source by Vibrate Intention"
- Dashboard, sidebar, footer, PWA manifest all use "Source" / "Vibrate Intention"
- Sidebar: bold "SOURCE" text ("S" when collapsed) instead of logo image
- Subtitle changed from "OSMANTIC DEPLOYMENT SYSTEM" to "SOURCE INTELLIGENCE"
- All code references to "Osmantic" replaced with "Vibrate Intention" in source files
- Favicon is a simple "SOURCE" SVG wordmark
- Demo placeholder "VI" logo removed (captain has a real Vibrate Intention logo somewhere)
- Theme selector label changed from "ODS" to "Source"
- PWA install prompt: "Make Source feel like an app"
- First-boot setup: "Welcome to Source", "Full Stack" option
- Extensions panel: "managed by Source", "from Source extension library"
- Internal identifiers (`ods-*` container names, `ODS_*` env vars, `ods-` CSS classes) kept as-is for stack stability
- 21 source files committed as `feat: rebrand ODS to Vibrate Intention / Source`
- JS patches applied to running container via sed (browser cache busting needed: Cmd+Shift+R)

**Running stack on spark-4511:**
- Dashboard SPA: port 3001
- Open WebUI: port 3000
- Dashboard API: port 3002
- External LLM mode pointing at Excelstra Spark vLLM (100.82.55.92:8000/v1, DeepSeek-V4-Flash / Hermes-4-70B)
- Core services only: dashboard, webui, dashboard-api, remote-provider-egress, remote-provider-ssh-tunnel
- llama-server and model-router stopped (not needed in external mode)

**Machine:** spark-4511 (100.113.39.55)
**Hardware:** NVIDIA GB10, 121GB RAM, 3TB free, Docker 29.2.1, CUDA 13.0
**SSH access:** `ssh spark-4511` (Tailscale)
**SSH tunnels from this Mac to spark-4511:**
- `ssh -L 3001:127.0.0.1:3001 spark-4511` (dashboard)
- `ssh -L 3000:127.0.0.1:3000 spark-4511` (Open WebUI)

**Key files on spark-4511 at ~/ods/:**
- `.env` -- ODS_MODE=external, EXTERNAL_LLM_URL/EXTERNAL_LLM_CONTAINER_URL=http://100.82.55.92:8000
- `extensions/services/dashboard/src/components/SplashScreen.jsx` -- splash branding
- `extensions/services/dashboard/src/App.jsx` -- main app branding
- `extensions/services/dashboard/src/components/Sidebar.jsx` -- sidebar branding
- `extensions/services/dashboard/index.html` -- HTML title/favicon/meta
- `extensions/services/dashboard/public/manifest.webmanifest` -- PWA manifest

**Lavish review artifact:** `~/.lavish/source-branding-review.html` (some questions about tagline, color palette, and product name still unanswered)

**Pending branding decisions:**
1. Real Vibrate Intention logo (captain has one, location unknown) to replace text wordmark
2. Tagline: "Intelligent Infrastructure" -- keep or change?
3. Color palette: keep purple/violet or shift?
4. Product name architecture: "Source" = product, "Vibrate Intention" = company?

**Sun Phase 1:** PR #2 merged (Next.js + shadcn/ui + Google OAuth + dashboard shell). Crewmate torn down.
**Excelstra secondmate:** Stood down, awaiting handoff of stable Sun build.

## YouTube transcript re-harvest (2026-08-17)

Re-harvested transcripts from 3 YouTube channels and 1 extra video to enrich 14 .agents/skills/ SKILL.md files with genuine transcript-sourced content.

### Source channels and mapping:
- **Sean Kochel (@iamseankochel):** 4 skills (app-idea-validation, claude-code-5step, claude-code-cheats, vibe-to-production)
- **IndyDevDan (@indydevdan):** 5 skills (agentic-engineering, model-fusion, multi-agent-orchestration, agentic-observability, agentic-security) + 1 extra video for pi-agent-customization
- **Cole Medin (@ColeMedin):** 4 skills (ai-coding-levels, open-knowledge-format, claude-code-skills, agent-knowledge-management)

### Extraction method:
- Used `yt-dlp --write-auto-subs --sub-lang en --skip-download --convert-subs srt` for all 13 videos
- All transcripts verified: 61K-196K chars each, genuine spoken content confirmed
- SRT files cleaned of duplicate segments and converted to plain text for analysis
- Each SKILL.md enriched with direct quotes and framework details from the video transcripts

### Transcript files:
Stored under `transcripts/` in the firstmate worktree (not tracked in git).

## Obsidian Vault structure
```
Obsidian Vault/
├── brain/           North Star, Memories, Key Decisions, Patterns, Gotchas, Skills
├── work/active/     Codex, Excelstra, Star Cleaners, Thuyan, Vibrate Intention
├── reference/       Hermes configs, Knowledge (PDF), Master MD, Apple Notes
├── org/             People, Teams
├── perf/            Brag, Competencies, Evidence
├── templates/
├── thinking/        Decision records
├── .claude/commands/  18 /om-* obsidian-mind commands
├── Hermes/          Agent configs, MCP servers, workflows (preserved original)
├── Projects/        Original project dirs (Star Cleaners has 34K junk .md files)
└── Knowledge/       PDF Knowledge Base (preserved original)
```

## Source Dashboard rebrand sweep (2026-08-16)

Complete ODS-to-Source rebrand of the dashboard UI:

1. **Sidebar** - Logo removed, shows "SOURCE INTELLIGENCE" + tier/version
2. **ODSTalk -> SourceTalk** - Component/file renamed, all references updated
3. **User-facing text** - All 35 files swept: "ODS" -> "Source" in labels, titles, error messages, descriptions, welcome text
4. **Fixed function name bug** - `Vibrate IntentionLogo` had a space in the JS function name (invalid), renamed to `BrandLogo` then removed entirely
5. **Fixed Talk import** - App.jsx imported `./pages/Talk` but the file was `ODSTalk.jsx` (now `SourceTalk.jsx`)

**External LLM feature fix** (`routers/features.py`):
- AI Chat and Document Q&A require `llama-server` service to be healthy
- In external LLM mode (LLM_BACKEND=external), local llama-server is stopped
- Patched `calculate_feature_status` to skip llama-server requirement when LLM_BACKEND=external
- Open WebUI connects to remote vLLM endpoint directly in this mode

**Committed** to Source repo on spark-4511 as `e2d2dcf`
