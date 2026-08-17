---
name: claude-code-skills
description: >-
  Agent-only skill for building and using Claude Code skills that drive a
  complete development process: decide, spec, plan, build, validate, review.
  Use when creating new skills for Claude Code or Codex, when designing a
  development workflow that skills should enforce, and when reviewing whether
  existing skills are still pulling their weight.
user-invocable: false
metadata:
  internal: true
---

# claude-code-skills

Use when creating new skills for Claude Code or Codex, when designing a
development workflow that skills should enforce, and when reviewing whether
existing skills are still pulling their weight.

Derived from Cole Medin's actual development process skills -- the folder
he works out of daily for real codebases and enterprise training. These
skills are minimalistic on purpose: drop them into any project, start from
zero, or just take the ideas.

## The development process as skills

A complete development process spans six phases. Each phase can be a skill
or a command within a skill.

### 1. Decide: what to build

Before writing a spec, validate the idea. This skill answers: is this worth
building, and what is the smallest useful version?

- Takes a raw idea or problem statement
- Checks against existing project goals and constraints
- Produces a go/no-go recommendation with the smallest viable scope
- Output: a decision record: "build this, don't build this, or build this
  smaller version first"

Keep this skill lightweight. The goal is to stop bad ideas before they
consume spec and implementation time, not to produce a business case.

### 2. Spec: PRD to tickets

Translate a go decision into a structured specification broken into
implementable tickets.

- Takes the decision record and any additional context
- Produces a PRD or technical spec in the project's spec format
- Breaks the spec into independent, vertically sliced tickets
- Each ticket has acceptance criteria and a scope boundary
- Output: spec document + ticket list in the project's tracking system

The spec is the contract. Tickets that are too large or vague will fail
in implementation. Slice until each ticket is independently implementable.

### 3. Plan: per-ticket implementation plan

Before building a ticket, create a concrete implementation plan.

- Takes one ticket from the list
- Reads the relevant codebase context
- Produces a plan: which files to change, what to add, what to remove,
  what to test
- The plan is reviewed before implementation begins
- Output: implementation plan for one ticket

This is the step that prevents the model from making arbitrary design
decisions during implementation. The plan is approved before the model
writes code.

### 4. Build: implement the plan

Execute the approved implementation plan.

- Follows the plan exactly, file by file
- Writes tests alongside implementation
- Commits with messages linked to the ticket
- If the plan proves unworkable, stops and escalates rather than diverging
- Output: committed code with passing tests

### 5. Validate: verify the implementation

Check that the implementation meets the ticket's acceptance criteria.

- Runs tests
- Checks spec compliance (did we build what we said we would?)
- Checks for regressions (did we break anything else?)
- Produces a validation report: pass, fail, or needs-changes
- Output: validation report

### 6. Review: code review

The final quality gate before the code lands.

- Reviews the diff for correctness, style, security, and edge cases
- Checks that the implementation matches the spec
- Looks for common AI coding blind spots (hardcoded values, missing error
  handling, over-engineered solutions)
- Approves, requests changes, or blocks
- Output: review outcome

## Skill design principles

Cole Medin's principles for effective Claude Code skills:

### Minimalistic on purpose

Each skill does one thing and does it well. A skill that tries to do
everything will do nothing reliably. If a skill's description needs "and"
more than once, split it.

### Drop-in, not setup-heavy

A skill should work in any project with zero configuration. If the skill
needs project-specific constants, read them from convention (standard file
paths, package.json fields) rather than requiring setup.

### Self-cleaning

Skills should not leave artifacts, temp files, or partial state behind.
If a skill is interrupted, the project should be in the same state as
before the skill ran.

### Auditable

Every skill action should produce a trace that can be reviewed. Skills
that make changes silently are dangerous. Log decisions, file changes, and
reasons.

## Context freshness: when to delete skills

Boris Cherny (creator of Claude Code) recommends deleting CLAUDE.md, skills,
and hooks every few months to see what the model does without them.

The nuance:
- Some skills genuinely have expired: model capabilities have improved and
  the skill is now redundant or counterproductive
- Some skills encode hard-won project knowledge that no model update will
  replace

Test each skill periodically: run the project without it and see if quality
drops. If it does not, delete it. If it does, keep it and note why.

## References

Based on Cole Medin's Claude Code skills:
- Every Claude Code Skill I Use to Drive My Entire Development Process (12K views):
  https://www.youtube.com/watch?v=MbiMwgbGdxw
- The Creator of Claude Code Said to Do What Now?! (14K views):
  https://www.youtube.com/watch?v=VnyGs43eiAA
- How to Build the Most Powerful System for AI Coding (2.2K views):
  https://www.youtube.com/watch?v=eecUhBpTz_g
