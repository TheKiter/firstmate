---
name: skill-check
description: >-
  Skill router for firstmate and crewmates. Load at every task intake.
  Classifies the task by domain, then produces a list of skill names to
  load on demand (does not read skill files at intake).
user-invocable: false
metadata:
  internal: true
---

# Skill-Check

Load at every task intake, before dispatching, steering, or writing a brief.
Classify the task into one or more domains below, then produce a list of matching skill names.
Do not read any skill's full SKILL.md at intake -- load them on demand when the specific action needs them.

## Resolution order (first match wins)

1. `~/.claude/skills/` (global: defuddle, obsidian-*, no-mistakes, github-*, agentdb-*)
2. `<firstmate>/.pi/skills/` (design/UI: brandkit, design-taste-frontend)
3. `<firstmate>/.agents/skills/` (firstmate internal: afk, bearings, harness-adapters, etc.)
4. `<firstmate>/skills/` (public installer-facing: grill-me, stow)
5. `<vault>/.claude/skills/` (vault-only: qmd, excalidraw-diagram, mermaid-visualizer)

## Environment

The fleet runs on Nvidia Sparks hardware. No token limits or API costs. When in doubt, include the group.

## Domains

Match the task against these groups in order. Produce the list of skill names; do not read their files.

### A. Agent Operations
**Trigger:** spawn, recover, steer, or supervise an agent; debug stuck worker; manage task state; fleet admin.
- harness-adapters, stuck-crewmate-recovery, bootstrap-diagnostics, secondmate-provisioning, project-management, process-event-sources, fmx-respond, quota-array-dispatch, decision-hold-lifecycle, ask-user-authority, firstmate-coding-guidelines, firstmate-orca, firstmate-codexapp

### B. Captain-Facing
**Trigger:** session command (bearings, status, stow, update), away mode.
- bearings, ahoy, afk, stow, updatefirstmate

### C. Design / UI / Frontend
**Trigger:** website or app design, visual UI, frontend dev, redesign, brand identity, image generation, any visual layer.
- design-taste-frontend, high-end-visual-design, minimalist-ui, industrial-brutalist-ui, stitch-design-taste, gpt-taste, redesign-existing-projects, brandkit, imagegen-frontend-web, imagegen-frontend-mobile, image-to-code, full-output-enforcement

### D. Development Workflows
**Trigger:** planning, building, validating, debugging, deploying software; structured methodology; prototype-to-production.
- claude-code-5step, claude-code-cheats, claude-code-skills, app-idea-validation, vibe-to-production, diagnostic-reasoning, agentic-engineering, agentic-observability, agentic-security, ai-coding-levels, multi-agent-orchestration, model-fusion, open-knowledge-format, agent-knowledge-management, pi-agent-customization, no-mistakes, skill-builder, hooks-automation

### E. GitHub
**Trigger:** GitHub operations: reviews, PRs, releases, CI/CD, multi-repo, project boards.
- github-code-review, github-multi-repo, github-project-management, github-release-management, github-workflow-automation

### F. Web / Browser / Content
**Trigger:** reading web pages, scraping, browser automation, online docs, codebase queries.
- defuddle, browser, graphify

### G. Obsidian
**Trigger:** vault operations, markdown, canvas files, bases, note management.
- obsidian-cli, obsidian-markdown, obsidian-bases, json-canvas

### H. Vector / Memory / AgentDB
**Trigger:** vector search, RAG, reinforcement learning, memory systems, agent learning, semantic search.
- agentdb-vector-search, agentdb-memory-patterns, agentdb-advanced-features, agentdb-learning-plugins, agentdb-performance-optimization, reasoningbank-intelligence, reasoningbank-agentdb

### I. Swarm
**Trigger:** parallel agents, dynamic topologies, multi-agent coordination, distributed workflows.
- swarm-orchestration, swarm-advanced, verification-quality

### J. Business Knowledge
**Trigger:** client strategy, offer design, pricing, business scaling, business assessment.
- business-knowledge

### K. Wiki Knowledge Base
**Trigger:** research a topic into the wiki, query the wiki, lint the wiki, ingest knowledge, any wiki maintenance.
- wiki

### L. Firstmate Public
**Trigger:** public Q&A flow, knowledge sweep.
- grill-me, stow

## Procedure

1. Read the task. Understand the verb (build, fix, design), domain, and deliverable type (ship, scout).
2. Walk domains A-K in order. For each match, note the skill names.
3. Proceed to intake with the list. Load each skill's SKILL.md only when the specific action requires it -- not at intake.
