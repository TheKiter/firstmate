---
name: multi-agent-orchestration
description: >-
  Agent-only skill for orchestrating multiple AI coding agents in flat
  teams rather than rigid hierarchies.
  Use when designing multi-agent workflows, when choosing between sub-agent
  hierarchies and peer-to-peer agent teams, when setting up agent
  communication channels, and when deciding whether a tool or platform
  supports programmatic agent control.
user-invocable: false
metadata:
  internal: true
---

# multi-agent-orchestration

Use when designing multi-agent workflows, when choosing between sub-agent
hierarchies and peer-to-peer teams, when setting up agent communication
channels, and when evaluating whether a tool supports programmatic agent
control.

Derived from IndyDevDan's Pi-to-Pi and CMUX multi-agent orchestration
frameworks. The core insight: flat teams beat hierarchy, and agentic access
(programmatic control) is a hard requirement for any tool in the stack.

## The problem with sub-agent hierarchies

Most multi-agent setups use a strict hierarchy: one master agent delegates
to sub-agents, which report back. This is the local maximum of multi-agent
orchestration.

Problems:
- The master becomes a bottleneck — everything flows through it
- Sub-agents have limited context and autonomy
- Information degrades as it passes up and down the hierarchy
- The best ideas die in agent hierarchies the same way they die in
  corporate hierarchies
- Recovery from a sub-agent failure requires the master to notice and
  re-delegate

## Flat teams beat hierarchy

Flat agent teams communicate directly. Any agent can prompt any other agent.
There is still an orchestrator, leads, and workers, but communication is
peer-to-peer, not strictly hierarchical.

Benefits:
- Agents share context directly without going through a bottleneck
- Parallel work is natural — agents don't wait for permission to communicate
- Recovery from failure is faster — another agent can pick up dropped work
- The orchestrator focuses on strategy, not message routing

## Three-tier agent orchestration

A practical structure that balances flat communication with clear roles:

### Tier 1: Orchestrator

One or two agents that own the overall mission. They decompose the goal,
assign work, and monitor progress. They do not do the work themselves.

- Sees the full picture
- Creates the plan and specs
- Monitors progress across all teams
- Intervenes only when a team is stuck or off-track

### Tier 2: Leads

Agents that coordinate a domain or workstream. They receive high-level tasks
from the orchestrator, break them down further, and manage a team of
specialist agents.

- Translate orchestrator goals into concrete tasks
- Review specialist output before passing it up
- Escalate blockers to the orchestrator
- Maintain context for their domain

### Tier 3: Specialists / Workers

Agents that execute specific, well-defined tasks. They have narrow context
and focused tools. They communicate results back to their lead.

- Implement code changes
- Run tests
- Research solutions
- Produce artifacts

### Communication rules

- Specialists can communicate directly with each other (flat) for
  coordination, not just through leads
- Leads communicate with the orchestrator and with other leads
- The orchestrator communicates with leads, not individual specialists
- Any agent can signal an emergency (blocker, failure) to any other agent
- All communication is visible to the orchestrator for monitoring

## Agentic access: the hard requirement

A tool that does not support programmatic agent control is a tool agents
cannot use. Evaluate every tool on whether agents can drive it without a
human in the loop.

Required capabilities for agentic access:
- **Send**: programmatically send input (commands, prompts, text) to a tool
- **Read**: programmatically read output from a tool
- **Open**: programmatically open or launch a tool session
- **Close**: programmatically close or clean up a tool session

CMUX is the reference implementation of agentic access for terminals:
agents control panes, windows, and surfaces with these four moves.
Pi-to-Pi is the reference implementation for agent-to-agent communication.

## Running agent teams: practical patterns

### Race and notify

Multiple agents work on the same problem in parallel. The first to produce
an acceptable result notifies the orchestrator, which cancels the remaining
agents. Used for hot fixes, exploration, and time-sensitive tasks.

### Spec-to-implement

One agent (orchestrator) produces a detailed spec. Multiple worker agents
implement different parts of the spec in parallel. A reviewer agent
validates all outputs against the spec. Used for feature development.

### Staggered review

As each worker completes a task, a reviewer agent immediately checks it.
If the review fails, the worker is notified with specific feedback and
iterates. The orchestrator is not involved in individual review cycles.

### Agent escalation

If a worker agent fails or gets stuck, it escalates to its lead. The lead
can reassign the task, provide more context, or escalate further to the
orchestrator. The key design principle: failure is contained at the lowest
possible tier.

## Bootstrapping an agent team

When launching a multi-agent session from scratch:

1. Define the goal and produce a structured spec (orchestrator's job)
2. Decompose the spec into independent work units
3. Launch lead agents, one per workstream
4. Each lead launches its specialist agents
5. Establish communication channels (CMUX panes, Pi-to-Pi links)
6. Set monitoring: the orchestrator can see all agent output
7. Define the completion signal: what tells the team the goal is met

One-tap instant-launch commands (saved as aliases or automation scripts)
are essential. Booting agents by hand kills agentic speed.

## References

Based on IndyDevDan's multi-agent orchestration content:
- Pi to Pi: Two-Way Agent Orchestration (47K views):
  https://www.youtube.com/watch?v=PIdETjcXNIk
- SEE CMUX SOLVE Multi-Agent Orchestration (34K views):
  https://www.youtube.com/watch?v=WAFUMBLOjHo
- Super Simple Software Factory (39K views):
  https://www.youtube.com/watch?v=haUfb1ievTE
