---
name: pi-agent-customization
description: >-
  Agent-only skill for customizing the Pi coding agent harness beyond
  defaults: hooks, widgets, themes, tool overrides, subagents, and
  multi-agent patterns.
  Use when setting up a new Pi agent, when extending Pi's behavior for a
  specific task, when building multi-agent workflows in Pi, and when
  designing custom agent configurations that go beyond what the default
  harness provides.
user-invocable: false
metadata:
  internal: true
---

# pi-agent-customization

Use when setting up a new Pi agent, when extending Pi's behavior for a
specific task, when building multi-agent workflows in Pi, and when
designing custom agent configurations.

Derived from IndyDevDan's deep dive into the Pi coding agent (243K views),
which builds 14 progressively more sophisticated Pi configurations from
minimal focused agents to full meta-agent orchestration systems.

Pi is open-source, unopinionated, and customizable through hooks, footers,
widgets, key bindings, tool overrides, and theme cycling. Unlike opinionated
tools that dictate how you work, Pi gives you a harness and gets out of the
way.

## The progression: from default to meta-agent

Each configuration builds on the previous one. Start at the level that
matches your needs and move up as your workflows demand more.

### v0: Default Pi

The out-of-the-box Pi agent. Good for getting started but unoptimized.

- Default system prompt
- Default tools
- Default key bindings
- Use as a baseline before customizing

### v1: Pure Focus Pi

A stripped-down version with minimal system prompt and tools. Only the
bare essentials for a specific task.

- Minimal system prompt targeting exactly one job
- Only the tools needed for that job (no file search, no git, no shell
  unless required)
- Results in faster responses and fewer hallucinations
- Best for: well-defined, repetitive tasks

### v2: Minimal Pi

Even more stripped than v1. Removes everything non-essential including
widgets, footers, and status decorations.

- No widgets, no status bars, no decorative elements
- Absolute minimum context footprint
- Fastest iteration speed
- Best for: quick edits, simple scripts, single-file changes

### v3: Cross Agent Pi

Pi configured to communicate with other agent instances or tools.

- Custom tools for agent-to-agent messaging
- Shared context channels
- Can prompt other agents and receive their output
- Best for: coordinating with Claude Code, Codex, or other agents

### v4: Purpose Gate Pi

A Pi agent that refuses tasks outside its declared purpose.

- Hard-coded purpose statement in the system prompt
- Custom tool or hook that checks incoming requests against the purpose
- Rejects or escalates out-of-scope requests
- Best for: specialized agents that should not drift (a reviewer agent
  that will not write code, a security agent that will not deploy)

### v5: Tool Counter Pi

Adds a tool that tracks how many times each tool has been called in the
session.

- Per-tool call counter
- Can pause or flag when a tool exceeds a threshold
- Reveals which tools are consuming the most context and tokens
- Best for: debugging agent behavior, optimizing tool usage

### v6: Tool Counter Widget Pi

Like v5, but the tool counter is rendered as a persistent widget in the
Pi UI rather than a command you must invoke.

- Widget displays live tool usage in the status bar or side panel
- Always visible, no need to ask
- Best for: real-time monitoring during long sessions

### v7: Subagent Widget Pi

Adds a widget that shows the status of subagents (running, waiting, done,
failed).

- Live status display for all spawned subagents
- Can click or command to inspect a subagent's output
- Best for: multi-agent sessions where you need to track parallel work

### v8: Tilldone Pi

A Pi agent that loops on a task until completion criteria are met.

- Defines completion criteria in the system prompt
- After each attempt, self-evaluates against criteria
- Loops back with improvements if criteria not met
- Exits or escalates after max retries
- Best for: tasks where the first attempt is rarely correct (complex
  refactoring, multi-file changes, unfamiliar APIs)

### v9: Agent Team Pi

Pi orchestrates a team of specialized subagents, each with its own purpose,
tools, and model.

- One orchestrator Pi agent
- Multiple specialized subagents (planner, builder, reviewer, tester)
- Orchestrator decomposes tasks and assigns to subagents
- Subagents report results back to orchestrator
- Best for: complex features that benefit from specialized attention

### v10: System Select Pi

Pi dynamically selects which subagent or tool to invoke based on the
task's characteristics.

- Classification step at intake: "is this planning, coding, review, or
  research?"
- Routes to the appropriate subagent or model
- Different subagents can use different models (Opus for planning, Sonnet
  for coding, Gemini for research)
- Best for: heterogeneous workloads where different tasks need different
  capabilities

### v11: Damage Control Pi

Pi with safeguards that prevent destructive operations.

- Pre-execution hook checks every write, delete, or shell command
- Flags dangerous operations for confirmation
- Automatically creates backups before modifications
- Rolls back on failure
- Best for: production environments, shared codebases, learning sessions

### v12: Agent Chain Pi

A pipeline of Pi agents where each agent's output feeds the next.

- Agent 1: Scout (explores the codebase, gathers context)
- Agent 2: Plan (produces a spec based on scout findings)
- Agent 3: Build (implements the spec)
- Agent 4: Review (reviews the implementation)
- Each agent has a different purpose, tools, and model
- Output of one is automatically passed as input to the next
- Best for: structured workflows where each phase needs different focus

### v13: Meta Pi

A Pi agent that builds other Pi agents.

- Given a task description, produces a new Pi configuration tailored to
  that task
- Generates the system prompt, tool list, hooks, and widgets
- Can then spawn the new agent and hand off the task
- Best for: automating agent creation, scaling to many specialized agents
  without manual configuration

## Pi customization surface

Pi exposes these customization points:

- **System prompt**: the core instruction. Change per agent role.
- **Tools**: add, remove, or override tools. Pi's tool system is pluggable.
- **Hooks**: over 25 lifecycle hooks (pre-tool, post-tool, pre-turn,
  post-turn, on-error, on-start, on-exit, etc.).
- **Footers**: custom footer content rendered at the bottom of each turn.
- **Widgets**: persistent UI elements showing agent state, counters, stats.
- **Key bindings**: custom keyboard shortcuts for common actions.
- **Themes**: cycling themes for visual differentiation between agents.
- **Model selection**: any model for any agent, per-call or per-session.

## Strategy: 80/20 with Pi

From IndyDevDan: "Bet big on the leader (Claude Code), but hedge with open
source. 80% Claude Code, 20% Pi for deep customization."

Use Claude Code for mainstream work where its ecosystem and defaults excel.
Use Pi for:
- Custom agent configurations that Claude Code's opinionated design cannot
  express
- Multi-agent orchestration patterns
- Experimental or next-generation workflows
- Agents that need different models for different steps
- Meta-agents that build other agents

## References

Based on IndyDevDan's Pi coding agent deep dive (243K views):
- The Pi Coding Agent: The ONLY REAL Claude Code COMPETITOR:
  https://www.youtube.com/watch?v=f8cfH5XX-XU
- Pi coding agent: https://pi.dev/
- Pi vs Claude Code extensions repo:
  https://github.com/disler/pi-vs-claude-code
