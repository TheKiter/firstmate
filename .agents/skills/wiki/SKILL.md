---
name: wiki
description: >-
  Firstmate-only wiki operations — research, query, and lint the LLM Wiki in
  the Obsidian vault. Detailed page conventions and directory layout live in
  wiki/_schema.md in the vault (the single owner of those contracts).
user-invocable: true
metadata:
  internal: true
---

# Wiki Operations

Firstmate is the sole maintainer of the LLM Wiki in the Obsidian vault.
Crewmates/secondmates never read or write wiki files directly — firstmate answers queries for them.

Page conventions, directory layout, frontmatter schema, and cross-referencing rules are defined in `wiki/_schema.md` in the vault.
This file owns only the invoke procedures.

## Operations

### research <topic>

Run a last30days multi-source research + full wiki ingest on a topic.

Procedure:
1. Run the last30days engine:
   ```
   SKILL_DIR="$HOME/.agents/skills/last30days"
   python3 "$SKILL_DIR/scripts/last30days.py" "<topic>" --emit=md --save-dir=<tmpdir>
   ```
   Export `XAI_API_KEY` from the captain's config when available for X/Twitter coverage.
2. Read the raw output and extract key signals from the evidence clusters.
3. Create `wiki/sources/last30days-<slug>.md` with summary, key claims, and concepts touched.
4. For each concept the research touches:
   - If a page exists in `wiki/concepts/`, update it with new signal.
   - If no page exists, create one using `wiki/templates/concept.md`.
5. Update `wiki/index.md` — add new pages to the appropriate section.
6. Append entry to `wiki/log.md` using the format:
   ```
   ## [YYYY-MM-DD] ingest | last30days: <Topic>
   - New: [[page]] (source/concept)
   - Updated: [[page]] (what changed)
   - Key signals: <brief bullets>
   - Files touched: <paths>
   ```
7. Report outcome in plain English — pages created, concepts updated, signal strength.

### query <question>

Search the wiki and synthesize an answer with citations.

Procedure:
1. Read `wiki/index.md` to locate relevant pages.
2. Read those pages.
3. Synthesize answer using `[[wikilink]]` citations.
4. If the answer reveals a synthesis worth keeping, file it as `wiki/queries/<slug>.md` with frontmatter.
5. Update `wiki/index.md` (add to Filed Queries section).
6. Append entry to `wiki/log.md`.

### lint

Health check the wiki. Advisory only — report findings, do not apply fixes without captain approval.

Procedure:
1. Walk each page and check:
   - Orphan pages — no inbound links from other wiki pages or index.md.
   - Stale claims — contradicted by newer sources without resolution.
   - Missing pages — concepts mentioned in 3+ pages but lacking their own page.
   - Broken `[[wikilinks]]` — target page doesn't exist.
2. Report findings in chat with suggested fixes.
3. Append entry to `wiki/log.md`.

## Integration

- **skill-check** routes to this skill via domain K (Wiki Knowledge Base).
- **stow skill** calls wiki ingest at session end for durable knowledge.
- **last30days** is the research engine for source ingestion.
- **GBrain** is the vector index — complementary, not redundant.
