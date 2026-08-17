---
name: agentic-observability
description: >-
  Agent-only skill for measuring, monitoring, and observing AI coding agent
  behavior and cost in real time.
  Use when setting up agent workflows in production, when reviewing agent
  cost and effectiveness, when debugging why an agent run produced wrong
  results, and when deciding whether an agent system is actually delivering
  value.
user-invocable: false
metadata:
  internal: true
---

# agentic-observability

Use when setting up agent workflows in production, when reviewing agent
cost and effectiveness, when debugging agent behavior, and when deciding
whether an agent system is delivering value.

Derived from IndyDevDan's Pi Agent Observability framework and the broader
principle that an agent you cannot see is an agent you cannot improve.

## Why observability matters for agents

Most agentic setups are black boxes. A prompt goes in, code comes out, and
the engineer has no idea what happened in between. This makes it impossible
to:

- Know what an agent run actually cost
- Debug why an agent produced a wrong result
- Compare two different agent configurations
- Determine whether a workflow is actually more efficient than doing it
  manually
- Catch agents that are stuck in loops or burning tokens

The core principle: **if you don't measure your agents, you are not
engineering. You are gambling with tokens.**

## What to measure

### Cost per run

Track every model call an agent makes during a workflow. Include:

- Tokens in (prompt, context, system message)
- Tokens out (completion)
- Per-model pricing (different models have different rates)
- Total cost for the complete workflow

Without per-run cost tracking, you cannot optimize. You do not know which
step is expensive or whether the workflow is cost-effective.

### Time per step

Track how long each step of a workflow takes:

- Wall clock time (total elapsed)
- Model response time (latency per call)
- Idle time (agent waiting for tools, I/O, or other agents)

Time reveals bottlenecks. An agent spending 80% of its time waiting on a
slow tool is not an agent problem; it is an infrastructure problem.

### Success rate

Track whether each workflow step succeeds or fails on the first attempt:

- First-attempt success rate per step
- Retry count per step
- Failure modes (model error, tool error, timeout, hallucination)

A low success rate on a specific step tells you the spec or the model
assignment for that step needs improvement.

### Output quality

Track quality metrics specific to your domain:

- Spec compliance (did the output match the requirements?)
- Review outcomes (did a reviewer agent pass or fail the output?)
- Bug rate (how often does output from this workflow introduce bugs?)

## Implementing agent observability

### Structured logging

Every agent action should produce a structured log entry:

- Timestamp
- Agent ID
- Step name
- Model used
- Tokens consumed
- Input summary (not full input, to save space)
- Output summary
- Duration
- Status (success, failure, timeout)

Store logs in a queryable format (JSON, SQLite, a log service) so you can
aggregate and analyze across runs.

### Spec-level tracking

Associate every agent run with the spec it was executing against. This lets
you answer: "Did this spec produce good results across multiple runs?"
and "Which specs consistently cause agents to fail?"

HTML specs (specs rendered as HTML with visual elements) provide a richer
artifact for tracking than plain text, because they include design intent
alongside functional requirements.

### Dashboards

Build or use a dashboard that shows at a glance:

- Active agent runs and their current step
- Cost accrued in the current session
- Success/failure rate for the current session
- Cost per completed task

The dashboard should be visible while agents are running, not something
you look at after the fact. Real-time visibility lets you catch problems
before they waste significant tokens.

### Post-run analysis

After each agent workflow completes, produce a summary:

```
Run ID: abc-123
Workflow: feature-implementation
Duration: 4m 32s
Total cost: $0.87
Steps: 6 (5 success, 1 retry)
Models used: Opus 4.8 (planning), Sonnet (implementation),
             GLM-5.2 (review)
Output: 342 lines changed, 3 files modified
Spec compliance: pass
```

This summary is the feedback loop that lets you optimize the factory.

## Agent observability checklist

- [ ] Every agent run produces structured logs (timestamp, agent, model,
  tokens, duration, status)
- [ ] Cost is tracked per run, not just per model call
- [ ] Success rate is tracked per workflow step
- [ ] A real-time dashboard shows active runs and cost
- [ ] Post-run summaries are generated automatically
- [ ] Logs are queryable across runs for trend analysis
- [ ] Specs are associated with runs for spec-effectiveness analysis
- [ ] The observability system itself costs less than the waste it prevents

## References

Based on IndyDevDan's agentic observability content:
- Pi Coding Agent Observability: HTML Specs with Gemini (17K views):
  https://www.youtube.com/watch?v=o4KZH_KSqYQ
- GPT-5.5 VERIFIED Opus 4.7: A Pi Coding Agent That REVIEWS Like You (32K views):
  https://www.youtube.com/watch?v=EnXKysJNz_8
- Pi Agent Observability codebase:
  https://github.com/disler/pi-agent-observability
