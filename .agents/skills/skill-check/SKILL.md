---
name: skill-check
description: >-
  Master skill router for firstmate and crewmates.
  Load at every task intake, before dispatching or steering work.
  Examines the task or prompt, matches it against the complete skill inventory
  across all registered skill directories, and loads every relevant skill before
  the worker begins.
  Covers agent-operations, captain-facing, design, development-workflow,
  GitHub, web, Obsidian, vector/AgentDB, swarm, and v3 skills.
user-invocable: false
metadata:
  internal: true
---

# Skill-Check

Load this at every task intake, before dispatching new work, steering an existing worker, or writing a brief.
It inventories every available skill across all registered directories, classifies them by domain, and applies a matching procedure that loads the right skills for the job at hand.

## Skill directory priority

Skill names are resolved in this order (first match wins):

1. `~/.claude/skills/` - global skills (defuddle, obsidian-*, no-mistakes, v3-*, github-*, agentdb-*, etc.)
2. `<firstmate>/.pi/skills/` - Pi project design/UI skills (brandkit, design-taste-frontend, etc.)
3. `<firstmate>/.agents/skills/` - firstmate internal agent-only (afk, bearings, harness-adapters, etc.)
4. `<firstmate>/skills/` - public installer-facing (grill-me, stow)
5. `<vault>/.claude/skills/` - vault-only (qmd, excalidraw-diagram, mermaid-visualizer)

The drill-down sections below organize every skill under its domain, regardless of directory.
When task analysis matches more than one domain, load ALL matching groups.
When no group matches, load nothing extra.

## Environment context (Sparks)

The fleet runs on Nvidia Sparks hardware. There are no token limits, rate limits, or API costs. Load skills without constraint. When a task remotely touches a domain, load the full group. When uncertain whether a group applies, load it anyway. The only bottleneck is wall-clock time, and reading a skill file is cheap compared to the work it enables.

## Decision procedure

At each intake, run this procedure before any other work:

1. **Read the task or prompt.** Understand the verb (build, fix, design, investigate, deploy, validate), the domain (frontend, backend, AI, data, ops, content), and the deliverable type (ship, scout, review, audit, deploy).

2. **Walk domain groups in order.** Start at group A (Agent Operations) because those are the most safety-critical. For each group, check if the task matches its trigger condition. When in doubt, load the group. If yes, load every skill in that group.

3. **Load resolved skills.** For each matched skill, read its full `SKILL.md` from the correct directory. The directory priority resolves name collisions.

4. **Proceed to intake.** With all relevant skills loaded, proceed with the normal brief, dispatch, or steer flow.

The sections below are ordered by group, each with a trigger condition and the skills it loads.

---

## A. Agent Operations and Safety

**Load when:** the task involves spawning, recovering, steering, or supervising an agent; debugging a stuck or confused worker; managing task state; handling trust dialogs; operating firstmate's own primitives; or administering the fleet.

- `harness-adapters` - spawn, recover, trust dialog, interrupt, exit, resume; every agent lifecycle action needs this.
- `stuck-crewmate-recovery` - stale wake, looping pane, unresponsive worker, answered-by-brief question, failed steer.
- `bootstrap-diagnostics` - session-start bootstrap lines (MISSING, TANGLE, FLEET_SYNC, etc.) that require action.
- `secondmate-provisioning` - creating, seeding, recovering, or retiring a secondmate home; editing data/secondmates.md.
- `project-management` - adding, creating, removing, cloning, or initializing a project.
- `process-event-sources` - arming a long-polling source; registering a condition->action watch; handling a procevent check wake.
- `fmx-respond` - handling a Relay mention, follow-up, or public commitment; only relevant when Relay is on.
- `quota-array-dispatch` - choosing among multiple matched crew-dispatch profile candidates at intake.
- `decision-hold-lifecycle` - completing an investigation or visual review that exposed unresolved captain decisions.
- `ask-user-authority` - deciding any ask-user finding, regardless of yolo posture.
- `firstmate-coding-guidelines` - editing firstmate's own shared tracked material (AGENTS.md, bin/, .agents/skills/).
- `firstmate-orca` - switching to, spawning in, supervising, or debugging the Orca runtime backend.
- `firstmate-codexapp` - coordinating visible Codex Desktop threads alongside firstmate.

---

## B. Captain-Facing and Session Tools

**Load when:** the task is a session-level command (bearings, recap, status, stow, update), an away-mode request, or any direct captain-facing utility.

- `bearings` - full fleet digest; captain asks for status, morning brief, catch-up, /bearings.
- `ahoy` - recap visible session decisions; captain invokes /ahoy.
- `afk` - entering away mode; captain says /afk or is going afk; state/.afk exists.
- `stow` - sweeping session knowledge to disk before context reset; captain invokes /stow.
- `updatefirstmate` - fast-forwarding firstmate and all secondmates; captain invokes /updatefirstmate.

---

## C. Design, UI, and Frontend

**Load when:** the task involves website or app design, visual UI, frontend development, redesign, brand identity, image generation for design reference, or any visual presentation layer.
This is the largest single domain across `.pi/skills/`, `.agents/skills/`, and `~/.claude/skills/`.

### Design systems and taste

- `design-taste-frontend` - current default anti-slop frontend skill for landing pages, portfolios, redesigns (v2 experimental).
- `design-taste-frontend-v1` - exact backward-compatible original v1 taste skill; use only when pinned.
- `high-end-visual-design` - fonts, spacing, shadows, card structures, animations for expensive-looking sites.
- `minimalist-ui` - clean editorial: warm monochrome, typographic contrast, flat bento grids, muted pastels.
- `industrial-brutalist-ui` - raw mechanical: Swiss typography, military terminal, extreme contrast, analog degradation.
- `stitch-design-taste` - semantic design system skill for Google Stitch; generates anti-generic DESIGN.md files.
- `gpt-taste` - Python-driven randomization, AIDA page structure, wide editorial typography, gapless bento grids, GSAP ScrollTriggers.
- `redesign-existing-projects` - upgrades existing sites to premium quality without breaking functionality.

### Image generation for design reference

- `brandkit` - brand-guidelines boards, logo systems, identity decks, visual-world presentations; minimalist/cinematic/editorial/dark-tech.
- `imagegen-frontend-web` - one separate horizontal image per section; conversion-aware landing page references.
- `imagegen-frontend-mobile` - premium app-native mobile screen concepts; iOS/Android, phone mockups, clean hierarchy.
- `image-to-code` - generate design images, analyze them, then implement matching code.

### Code generation enforcement

- `full-output-enforcement` - override truncation, enforce complete code generation, ban placeholder patterns; apply when the deliverable must be exhaustively complete.

---

## D. Development Workflows and Methodology

**Load when:** the task involves planning, building, validating, debugging, deploying, or auditing software; following a structured development methodology; or taking a prototype to production.

- `claude-code-5step` - structured 5-step system: PRD, research, design, vertical epics, spec-driven implementation.
- `claude-code-cheats` - context-saving commands, session health, debugging project setup.
- `claude-code-skills` - building and maintaining skills that drive a complete development process.
- `app-idea-validation` - validating app/product ideas before building (Proven Better New framework).
- `vibe-to-production` - taking an AI-generated prototype to production-ready: spec, docs, auth, security, deployment, observability.
- `diagnostic-reasoning` - diagnosing reported bugs: reproduction, causal separation, counterfactual testing.
- `agentic-engineering` - designing AI-assisted development workflows; avoiding fragile loops; building software factories.
- `agentic-observability` - measuring, monitoring, and observing agent behavior and cost in real time.
- `agentic-security` - securing agent access to production, sandboxing, shell tool safety.
- `ai-coding-levels` - choosing the right autonomy level; from spicy autocomplete to dark factories.
- `multi-agent-orchestration` - designing multi-agent workflows; flat teams vs hierarchies; communication channels.
- `model-fusion` - combining multiple models for cost optimization and role-specific selection.
- `open-knowledge-format` - structuring knowledge for any AI agent to read without plugins or vector DBs.
- `agent-knowledge-management` - building, maintaining, and evolving an agent knowledge base (second brain).
- `pi-agent-customization` - customizing the Pi harness: hooks, widgets, themes, subagents, multi-agent patterns.
- `no-mistakes` - validating changes through automated review, tests, lint, docs, push, PR, and CI.
- `skill-builder` - creating new skills with proper YAML frontmatter and directory organization.
- `hooks-automation` - pre/post task hooks, session management, Git integration, memory coordination.
- `pair-programming` - driver/navigator modes, TDD, debugging, refactoring, real-time verification.
- `sparc-methodology` - Specification, Pseudocode, Architecture, Refinement, Completion development methodology.
- `stream-chain` - Stream-JSON chaining for multi-agent pipelines and data transformation.

---

## E. GitHub and Repository Management

**Load when:** the task involves GitHub operations: reviews, pull requests, releases, CI/CD workflows, multi-repo coordination, or project board management.

- `github-code-review` - comprehensive code review with AI-powered swarm coordination.
- `github-multi-repo` - multi-repository coordination, synchronization, architecture management.
- `github-project-management` - issue tracking, project board automation, sprint planning.
- `github-release-management` - automated versioning, testing, deployment, rollback management.
- `github-workflow-automation` - GitHub Actions, CI/CD pipelines, advanced repository management.

---

## F. Web, Browser, and Content

**Load when:** the task involves reading web pages, scraping content, extracting markdown from URLs, browser automation, or processing online documentation.

- `defuddle` - extract clean markdown from web pages; preferred over raw fetch for articles, docs, blogs.
- `browser` - web browser automation with AI-optimized snapshots for agent workflows.
- `graphify` - codebase questions, architecture analysis, knowledge graph construction from code, docs, images, video.

---

## G. Obsidian and Note Management

**Load when:** the task involves Obsidian vault operations, markdown formatting, canvas files, base files, or note management.

- `obsidian-cli` - create, search, manage notes; plugin/theme development; vault operations.
- `obsidian-markdown` - Obsidian Flavored Markdown: wikilinks, embeds, callouts, properties, frontmatter.
- `obsidian-bases` - Obsidian Bases: database-like views, filters, formulas, summaries (.base files).
- `json-canvas` - JSON Canvas files: nodes, edges, groups, connections (.canvas files).

---

## H. Vector Search, AgentDB, and Memory

**Load when:** the task involves vector databases, semantic search, RAG, reinforcement learning, memory systems, agent learning plugins, or performance optimization of search/memory at scale.

- `agentdb-vector-search` - semantic vector search, RAG, document retrieval, similarity matching.
- `agentdb-memory-patterns` - persistent memory: session memory, long-term storage, pattern learning, context management.
- `agentdb-advanced-features` - QUIC sync, multi-database management, custom distance metrics, hybrid search.
- `agentdb-learning-plugins` - 9 reinforcement learning algorithms: Decision Transformer, Q-Learning, SARSA, Actor-Critic.
- `agentdb-performance-optimization` - quantization (4-32x reduction), HNSW indexing (150x faster), caching, batch ops.
- `reasoningbank-intelligence` - adaptive learning: pattern recognition, strategy optimization, continuous improvement.
- `reasoningbank-agentdb` - ReasoningBank with AgentDB: trajectory tracking, verdict judgment, memory distillation.

---

## I. Swarm Orchestration

**Load when:** the task involves parallel agent execution, dynamic topologies, multi-agent coordination at scale, or distributed workflows.

- `swarm-orchestration` - multi-agent swarms with agentic-flow: parallel execution, dynamic topology, intelligent coordination.
- `swarm-advanced` - advanced patterns for research, development, testing, distributed workflows.
- `verification-quality` - truth scoring, code quality verification, automatic rollback with 0.95 accuracy threshold.

---

## J. v3 Project (Claude-Flow / Agentic-Flow v3)

**Load when:** the task involves the claude-flow v3 migration, DDD architecture, core implementation, CLI modernization, deep integration, MCP optimization, memory unification, performance targets, security overhaul, or swarm coordination for the v3 effort.

- `v3-ddd-architecture` - Domain-Driven Design: bounded context architecture, clean separation, microkernel pattern.
- `v3-core-implementation` - DDD domains, clean architecture, dependency injection, modular TypeScript, comprehensive testing.
- `v3-cli-modernization` - interactive prompts, command decomposition, enhanced hooks, intelligent workflow automation.
- `v3-deep-integration` - agentic-flow@alpha deep integration; ADR-001; eliminate 10,000+ duplicate lines.
- `v3-mcp-optimization` - connection pooling, load balancing, tool registry, sub-100ms response times.
- `v3-memory-unification` - unify 6+ memory systems into AgentDB with HNSW; ADR-006, ADR-009.
- `v3-performance-optimization` - 2.49x-7.47x Flash Attention, 150x-12,500x search, 50-75% memory reduction.
- `v3-security-overhaul` - critical CVEs, secure-by-default patterns, complete security architecture.
- `v3-swarm-coordination` - 15-agent hierarchical mesh for parallel execution across security, core, integration.

---

## K. Firstmate Public Skills

**Load when:** the task involves public firstmate features visible to the installer surface: the grill-me Q&A flow, or the public stow knowledge-sweep.

- `grill-me` - public firstmate Q&A skill for the installer surface (from `<firstmate>/skills/`).
- `stow` - public installer-facing knowledge-sweep (from `<firstmate>/skills/`; the `.agents/skills/stow` version is the internal one).

---

## Matching examples

| Task description | Groups matched | Skills loaded |
|---|---|---|
| "Build a landing page for a fintech startup" | C (Design) | design-taste-frontend, high-end-visual-design, imagegen-frontend-web, full-output-enforcement |
| "Debug why the crewmate stopped responding" | A (Agent Ops) | harness-adapters, stuck-crewmate-recovery |
| "Redesign the dashboard, it looks generic" | C (Design) | redesign-existing-projects, design-taste-frontend, high-end-visual-design |
| "Take this prototype to production" | D (Workflows) | vibe-to-production, no-mistakes, app-idea-validation |
| "Review this PR on the monorepo" | E (GitHub) | github-code-review |
| "Scrape docs from the landing page" | F (Web) | defuddle |
| "Search the knowledge base semantically" | H (Vector/Memory) | agentdb-vector-search |
| "Validate these changes before push" | D (Workflows) | no-mistakes |
| "Summarize the codebase architecture" | F (Web) | graphify |
| "Build a multi-agent research pipeline" | I (Swarm) | swarm-orchestration, agentic-engineering |

## Supervision discipline

Skill-Check is a read-only router.
It loads skills, inspects the task, and tells the agent what to read.
It never spawns workers, edits files, or changes any fleet state.
All actual work begins only after the matched skills are loaded.
