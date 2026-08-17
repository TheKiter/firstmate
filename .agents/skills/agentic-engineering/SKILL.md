---
name: agentic-engineering
description: >-
  Agent-only skill for the agentic engineering philosophy: building software
  factories instead of engineering loops.
  Use when designing an AI-assisted development workflow, when reviewing
  whether your current approach is a sustainable system or a fragile loop,
  and when scoping how to decouple yourself from being in every cycle.
user-invocable: false
metadata:
  internal: true
---

# agentic-engineering

Use when designing an AI-assisted development workflow, when reviewing whether
your current approach is a sustainable system or a fragile loop, and when
scoping how to decouple yourself from being in every cycle.

This skill is adapted from IndyDevDan's agentic engineering philosophy.
The core distinction: loop engineering keeps you in the loop as the bottleneck.
Agentic engineering builds a software factory where workflows replace prompts.

## Loop engineering vs. Agentic engineering

**Loop engineering**: you sit in a chat session, iterate on prompts, review
every output, and manually steer the model back on track. You are the
control loop. The model is stateless between turns. Every new task starts
from scratch.

Signs you are loop engineering:
- You manually review and accept every code change
- You restart sessions frequently because context fills up
- You spend more time prompting than reviewing output
- Your workflow breaks when you step away from the keyboard
- You feel like the model's babysitter, not its architect

**Agentic engineering**: you build a system (software factory) that takes
prompts as input and produces results through a structured workflow of
agents and code. You design the factory, not the individual outputs.

Signs you are doing agentic engineering:
- You have structured specs that agents execute autonomously
- Agents can run without you watching
- You spend time designing workflows, not writing prompts
- Multiple agents collaborate without hand-holding
- The system improves over time as you refine the factory

## The Software Factory pattern

A software factory is a repeatable system that takes a specification and
produces working software through a combination of agents and code.

### Core elements

1. **Spec in**: a structured specification (PRD, technical spec, HTML spec)
   that defines the requirements unambiguously.
2. **Workflow**: a defined sequence of steps that transforms the spec into
   working code. This is code + agents, not just agent prompts.
3. **Orchestration**: a controller that manages which agents do what, in
   what order, and how results flow between them.
4. **Validation**: automated checks that verify the output against the spec.
5. **Output out**: working code, tests, documentation, or deployment.

### Key insight: agents alone are not enough

Skills, sub-agents, and MCP servers plugged into a raw chat session create
fragile results. The cost multiplies (tokens, speed, hallucinations, broken
runs) without a structural framework. The factory provides the structure;
agents fill the execution layer.

## Building your software factory

Start small and iterate. A factory is not built in one session.

1. **Pick one workflow**: choose a single repetitive task (code review,
   feature implementation, bug fix) and build a workflow for it.
2. **Spec first**: define the input format and output requirements before
   writing any agent configuration.
3. **Code the workflow**: implement the workflow logic in code (shell scripts,
   automation files, harness extensions). Agents execute steps; code defines
   the process.
4. **Add agents**: plug agents into the workflow steps where human-like
   reasoning is needed. Use cheaper models for routine steps.
5. **Measure**: track cost, time, and quality per run. Optimize the factory,
   not the prompts.
6. **Expand**: add more workflows as patterns emerge.

## The Five Pillars of Agentic Engineering

From IndyDevDan's framework, the five dimensions that separate sustainable
agentic systems from fragile loops:

1. **Agentic access**: can your agents drive their tools programmatically?
   A tool without programmatic access (send, read, open, close) is a
   human-only tool.
2. **Observability**: can you see what your agents are doing in real time?
   An agent you cannot see is an agent you cannot improve.
3. **Sandboxing**: does each agent run in its own isolated environment?
   Shared environments create cascading failures.
4. **Model stacking**: do you use multiple models for different roles rather
   than one model for everything?
5. **Spec-driven development**: is there a structured specification that
   agents execute against, or are they guessing at intent?

## References

Based on IndyDevDan's agentic engineering series:
- Forget Loop Engineering (112K views):
  https://www.youtube.com/watch?v=VQy50fuxI34
- Super Simple Software Factory (39K views):
  https://www.youtube.com/watch?v=haUfb1ievTE
- Top #1 Opportunity for Senior Engineers (32K views):
  https://www.youtube.com/watch?v=2KcITKKJikA
