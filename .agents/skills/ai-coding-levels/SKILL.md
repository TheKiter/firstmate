---
name: ai-coding-levels
description: >-
  Agent-only skill for understanding and choosing the right level of AI coding
  autonomy, from spicy autocomplete to fully autonomous dark factories.
  Use when scoping how autonomous an agent should be for a given task, when
  deciding whether to stay in the loop or step back, and when evaluating
  whether your current autonomy level matches your risk tolerance and outcome
  requirements.
user-invocable: false
metadata:
  internal: true
---

# ai-coding-levels

Use when scoping how autonomous an agent should be for a given task, when
deciding whether to stay in the loop or step back, and when evaluating
whether your current autonomy level matches your risk tolerance.

Derived from Dan Shapiro's five levels of AI coding (mapped to self-driving
car levels) as popularized by Cole Medin. The framework gives a vocabulary
for where you are and where you should be, which are often different places.

## The five levels

### Level 1: Spicy autocomplete

The AI suggests completions, inline code, or small snippets. You review and
accept or reject each suggestion before it enters the codebase.

- AI role: suggestion engine
- Human role: decision maker for every change
- Risk: minimal
- Speed: slowest
- Best for: learning, exploration, unfamiliar languages or frameworks

### Level 2: Chat-assisted

You describe what you want in a chat interface. The AI produces a block of
code or a file. You read it, decide whether to use it, and manually integrate
it.

- AI role: pair programmer you talk to
- Human role: architect, reviewer, integrator
- Risk: low (you review everything before it lands)
- Speed: faster than L1 for one-off tasks
- Best for: prototyping, one-off scripts, utility functions

### Level 3: In the loop

The AI operates in your editor or terminal with access to your project. It
writes files, runs commands, and makes changes. You review and approve every
change before it is committed.

- AI role: autonomous executor under supervision
- Human role: planner and reviewer. You decide what to build and verify
  every output.
- Risk: moderate (the AI can make changes you miss in review)
- Speed: significantly faster than L2 for feature work
- Best for: most production development. This is the sweet spot for
  reliability and speed.

Cole Medin's recommended default: "for most people that's Level 3, in the
loop, planning the work and reviewing every change, because that's what
keeps software reliable."

### Level 4: Validated autonomous

The AI plans, implements, and tests changes autonomously. It runs its own
validation suite and presents results for human approval before merging.

- AI role: autonomous builder with self-validation
- Human role: spec writer and approval gate
- Risk: moderate-high (depends on validation quality)
- Speed: fast, especially for well-scoped tasks
- Best for: well-defined features, bug fixes with good test coverage,
  refactoring with type system support

### Level 5: Dark factory

A spec goes in and working software comes out the other end. The AI system
plans, builds, validates, and deploys with no human in the loop except
defining what to build. The factory ships its own code.

- AI role: full autonomous development pipeline
- Human role: define the spec, review the outcome
- Risk: high (requires mature validation, rollback, and monitoring)
- Speed: fastest, runs while you sleep
- Best for: mature codebases with excellent test coverage, internal tools,
  teams with strong observability and rollback practices

## Where to aim

Most engineers should target Level 3 as their daily driver. It maximizes
speed without sacrificing reliability. Higher levels require infrastructure
(test coverage, sandboxing, monitoring, rollback) that most projects do not
have.

Move up a level when:
- You have the safety infrastructure for the next level
- The current level is a bottleneck you can measure
- The task is well-understood and low-risk

Move down a level when:
- You are in an unfamiliar domain
- The codebase has no tests
- Errors would be expensive or hard to undo
- You are learning a new tool or framework

## Dark factory readiness checklist

Before attempting Level 5, verify each item:

- [ ] Full test suite that runs automatically
- [ ] Spec-driven development with structured specs
- [ ] Automated code review (verifier agent)
- [ ] Sandboxed execution environment per agent
- [ ] Automated rollback on failure
- [ ] Observability (cost, time, success rate per run)
- [ ] Approval gate for production deployments
- [ ] Monitoring and alerting for production issues
- [ ] Documented escalation path for failures

## References

Based on Cole Medin's breakdown of Dan Shapiro's AI coding levels:
- The Best AI Coding Setup Isn't the Most Autonomous One (10K views):
  https://www.youtube.com/watch?v=muwRbfuKbR4
- How to Build the Most Powerful System for AI Coding (2.2K views):
  https://www.youtube.com/watch?v=eecUhBpTz_g
