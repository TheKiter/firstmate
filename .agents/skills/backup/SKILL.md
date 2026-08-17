---
name: backup
description: >-
  Back up session outcomes to durable storage: Obsidian vault for human reading,
  GBrain for agentic memory across sessions, and git for firstmate's tracked
  state. Load at session end, before context compaction, or when the captain
  invokes /stow, /backup, or asks to save progress.
user-invocable: true
metadata:
  internal: true
---

# backup

Back up the current session's outcomes so the next session -- or a crewmate in
another home -- can pick up without relying on conversation history.

This skill works with `stow` (which handles firstmate's tiered startup memory)
but focuses on **external durable stores** that survive a full home wipe:

- Obsidian vault (human-readable durable knowledge)
- GBrain (agentic cross-session memory)
- Git (firstmate tracked state)

## Triggers

Load this skill when:
- The captain invokes `/stow`, `/backup`, or asks to save/back up
- Before a session reset, context compaction, or context-full tool switch
- At a natural milestone (PR merged, investigation complete, decision made)
- When teardown indicates the task has a deliverable or decision worth preserving

## Procedure

### 1. Sweep learnings.md

First, run `stow`'s session sweep if it hasn't run yet this turn.
`stow` writes new and updated entries into `data/learnings.md`,
`data/captain.md`, and `data/backlog.md` as needed.
Do not duplicate that work; use its output as input for the steps below.

After `stow` completes, read and curate `data/learnings.md`:
- Remove stale or superseded entries
- Merge related entries under the most specific heading
- Add dated markers for perishable facts (`<!--p:YYYY-MM-DD-->`)

### 2. Write to Obsidian vault

The Obsidian vault lives at `~/Documents/Obsidian Vault/`.
Write one note per major session outcome under `work/active/`:

```
~/Documents/Obsidian Vault/work/active/<project>-<date>.md
```

Content format:
```markdown
---
date: YYYY-MM-DD
project: <project-name>
tags: [session, <project>]
---

# <Project>: <short title>

## Outcome
<!-- one-paragraph summary -->

## Key decisions
- <decision 1>
- <decision 2>

## Next actions
- [ ] <action 1>
- [ ] <action 2>

## Infrastructure / config changes
- <change 1>
```

Keep the note concise -- the session digest in learnings.md has the full detail.
This is for the human captain to find in Obsidian later.

Write separate notes only for genuinely distinct sessions.
Append to an existing note if the same project/date already exists.

### 3. Write to GBrain

GBrain is installed at `~/.gbrain/` with a local Postgres backend.
Use it for durable agentic memory that survives firstmate home resets.

Commands:
```bash
# Important fact
gbrain remember "<fact>" --provenance "<source>"

# Question about existing knowledge (uses the Spark LLM)
gbrain think "<question>" --model "anthropic:deepseek-ai/DeepSeek-V4-Flash"
# Or just recall (keyword-only)
gbrain recall --query "<topic>"
```

Set these env vars before any GBrain command:
```bash
OLLAMA_BASE_URL=http://100.79.189.5:11434/v1  # embeddings on Codex Head Spark
```

Write to GBrain when:
- A project's architecture or design decisions are set
- Infrastructure credentials or access info changes
- A decision with long-term consequences is made
- A new project or client is added
- A reusable pattern or gotcha is discovered

### 4. Commit firstmate tracked state to git

Firstmate's operational state includes:
- `data/learnings.md` (curated in step 1)
- `data/projects.md` (fleet registry)
- `data/captain.md` and `data/captain-shared.md` (captain preferences)

Commit these files when they change:
```bash
cd <firstmate-repo>
git add data/learnings.md data/projects.md data/captain.md
git diff --cached --stat
git commit -m "docs: session backup <date> (<project> updates)"
```

Never force push. Never include `state/` or `data/` runtime files.
Push only when the captain explicitly asks or when you know the repo is
configured for push (check `git remote get-url origin`).

### 5. Verify

After writing, confirm:
- Obsidian note exists at the expected path
- GBrain recall returns the written facts
- Git diff shows the expected changed files

Summarise what was backed up for the captain in one line:
"Backed up <project> decisions to Obsidian/GBrain/git."

## Reference

### Obsidian vault paths
```
~/Documents/Obsidian Vault/
  brain/     -- North Star, Memories, Key Decisions, Patterns, Gotchas, Skills
  work/active/  -- Current project sessions (Source, Excelstra, Star Cleaners, etc.)
  reference/    -- Hermes configs, Knowledge (PDF), Master MD, Apple Notes
  org/          -- People, Teams
  thinking/     -- Decision records
  templates/    -- Note templates
```

### GBrain endpoints
```
Embeddings:  http://100.79.189.5:11434/v1  (Codex Head Ollama, nomic-embed-text)
Synthesis:   http://100.82.55.92:8000/v1   (Excelstra Spark vLLM, DeepSeek-V4-Flash)
```

### Git repo
```
origin: https://github.com/TheKiter/Source
local:  ~/ods/ on spark-4511
```
