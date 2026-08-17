---
name: model-fusion
description: >-
  Agent-only skill for combining multiple AI models (model fusion / model
  stacking) rather than relying on a single model for all work.
  Use when designing an agentic workflow where different tasks benefit from
  different models, when cost optimization matters, and when scoping which
  model should handle which role in a multi-agent system.
user-invocable: false
metadata:
  internal: true
---

# model-fusion

Use when designing multi-model workflows, when optimizing cost across
different task types, when reviewing whether you are overpaying by using
one model for everything, and when building agent teams with specialized
roles.

Derived from IndyDevDan's model fusion framework and the broader industry
pattern of combining specialized models rather than picking one winner.

## The fusion mindset: AND, not OR

The AI industry and model vendors want you to pick one model. That is a trap.
Different models have different strengths, cost profiles, latency
characteristics, and capability ceilings. The winning approach is to combine
them — using each model where it excels and paying for capability only when
the task demands it.

## Model roles in a fused system

A fused system assigns models to roles based on their strengths, not their
brand names.

### Orchestrator / Planner

Strongest reasoning model. Handles complex planning, architecture decisions,
and decomposing large tasks into sub-tasks. This model sees the full picture
and delegates work.

- Best for: planning, architecture, spec generation, task decomposition
- Characteristics: highest intelligence per token, slower, expensive
- Candidates: Claude Opus 4.8, GPT-5.5, Claude Fable 5 (for very complex
  orchestration)

### Executor / Worker

Fast, cheap model that implements well-defined sub-tasks. Given a clear spec
and bounded scope, this model executes without needing the full context.

- Best for: implementation of scoped tasks, routine code generation, tests
- Characteristics: fast, cheap, good at following detailed instructions
- Candidates: Claude Sonnet, GPT-5.5-mini, Gemini 3.5 Flash, GLM-5.2

### Reviewer / Verifier

Critical model that reviews outputs before they are accepted. Different
from the executor to catch blind spots. Often benefits from a model with
stronger reasoning than the executor.

- Best for: code review, security audit, spec compliance checking
- Characteristics: different from executor to avoid shared blind spots
- Candidates: Claude Opus 4.7/4.8, GPT-5.5 (different model from executor)

### Researcher / Knowledge worker

Model strong at retrieval, synthesis, and exploration. May have web search
or tool-use capabilities that other models lack.

- Best for: research, exploration, documentation, finding edge cases
- Characteristics: good tool use, retrieval, synthesis
- Candidates: Gemini 3.5 Flash (fast research), GPT-5.5 (broad knowledge)

### Designer / Visual worker

Model or tool specialized for visual output, UI generation, or design.

- Best for: UI design, screen layouts, image generation, HTML/CSS specs
- Characteristics: visual capability, design system awareness
- Candidates: GPT Image 2, Claude Design, dedicated design models

## Cost optimization via fusion

The dirty secret of 2026: open-weight models like GLM-5.2 and MiniMax-M3
deliver 85-90% of Opus capability at roughly 1/5 the price. Model stacking
lets you use these for routine work and reserve premium models for tasks
that genuinely need them.

### Price per intelligent agent hour

Stop comparing price per token. The real metric is what a model costs to
complete a unit of work. A cheaper model that takes 3x as many rounds or
hallucinates more costs more in the end. Measure completion cost, not
token cost.

- For routine, well-defined tasks: use the cheapest model that can do the
  job correctly (GLM-5.2, Sonnet, Gemini Flash)
- For planning and architecture: use the strongest reasoning model (Opus,
  Fable 5, GPT-5.5)
- For review: use a different model than the executor to get independent
  verification

## Fusion patterns

### Architect + Editor

A strong planner model writes a detailed spec. A cheaper executor model
implements it. The planner never writes code; the executor never designs.
This is the most common and most effective fusion pattern.

### Prompt chaining

The output of one model becomes the input for the next. Each model handles
one stage of a pipeline. Example: Planner -> Researcher -> Executor ->
Reviewer.

### Agent chaining

Each model runs as an autonomous agent with its own tools and context.
Agents communicate results to the next agent in the chain. This is more
powerful than prompt chaining because each agent can use tools and iterate.

### Parallel fusion

Multiple models work on the same problem in parallel. The first to produce
an acceptable result wins. Used for hot fixes, code generation races, and
exploration.

## Implementation checklist

- [ ] Identify distinct task types in your workflow
- [ ] Match each task type to the cheapest model that can do it correctly
- [ ] Designate one strong model as the orchestrator/planner
- [ ] Use a different model for review than for execution
- [ ] Measure completion cost, not token cost
- [ ] Re-evaluate the stack when new models launch
- [ ] Keep a fallback: if the cheap model fails, escalate to a stronger one

## References

Based on IndyDevDan's model fusion content:
- STOP Picking GPT-5.6 Sol OR Claude Fable 5... FUSE THEM (38K views):
  https://www.youtube.com/watch?v=AQl5Q-0l7FQ
- GLM-5.2 vs MiniMax-M3: Opus Has REAL COMPETITION (22K views):
  https://www.youtube.com/watch?v=cFYdiynrxpQ
- Fusion Harness: https://github.com/disler/fusion-harness
