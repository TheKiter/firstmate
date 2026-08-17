---
name: claude-code-5step
description: >-
  Agent-only skill for a structured 5-step Claude Code application-building
  system that goes from raw idea to functioning app.
  Use when scoping a new feature or app build with Claude Code, when the
  approach needs more structure than an open-ended session, and when
  breaking down a large build into manageable steps.
  The steps: hand-written PRD, research, Claude Design, vertically sliced
  epics, and spec-driven implementation loop.
user-invocable: false
metadata:
  internal: true
---

# claude-code-5step

Use when scoping a new feature or app build with Claude Code, when the approach
needs more structure than an open-ended session, and when breaking down a large
build into manageable steps.

The system is designed around a single insight: models fail when given a task
that is too large or too vague. Each step produces the input for the next,
creating a chain of well-scoped deliverables.

## Step 1: Hand-written PRD

Before the AI writes any code, write a Product Requirements Document yourself.
This step is intentionally manual because the exercise of writing forces
clarity that no prompt can substitute.

- State the problem the app solves, not just the features it has.
- List functional requirements: what must the system actually do?
- List non-functional requirements: performance, platform, constraints.
- Define the target user and the core workflow.
- Keep it concise (a single page or markdown file). This is a "light PRD,"
  not a 50-page document.
- Save to a `docs/` folder in the project.

Output: `docs/prd.md`

## Step 2: Research

Use Claude Code to research the problem domain before designing or building
anything. This prevents building a solution that already exists or missing
critical constraints.

- Have Claude search for existing solutions, libraries, and approaches in the
  domain.
- Ask about common pitfalls, edge cases, and established patterns.
- Research the API landscape: what services exist, their pricing, their limits.
- Document findings alongside the PRD.

Output: `docs/research.md` with findings, alternatives considered, and
recommendations.

## Step 3: Claude Design

Generate the visual and interaction design using Claude's design capabilities
before writing code. This separates design decisions from implementation,
preventing the model from making arbitrary UI choices while coding.

- Use Claude Design (or an equivalent design-generation tool) to produce screen
  layouts and flows.
- Choose a design template appropriate for the platform (mobile, web).
- Reuse an existing design system if available; do not reinvent tokens per
  project.
- Review and approve the design output before moving to implementation.

Output: a set of screen designs or design specifications that define layout,
visual hierarchy, and interaction patterns.

## Step 4: Vertically Sliced Epics

Break the PRD into vertically sliced epics: small, end-to-end feature slices
that deliver user value independently.

- Each epic is a vertical slice through the stack (UI + logic + data), not a
  horizontal layer (all UI first, then all API).
- Each epic should be independently testable and deployable.
- Document the epic breakdown into a project management tool or spec system
  (OpenSpec, issue tracker).
- Each epic gets acceptance criteria derived from the PRD.
- Order epics by dependency and user value, not implementation convenience.

Output: a set of epic specifications, each with scope, acceptance criteria,
and dependency ordering.

## Step 5: Spec-driven implementation loop

For each epic, use a spec-driven tool (OpenSpec, GitHub Speck Kit) to generate
structured change proposals and implement them in a tight feedback loop.

1. **Proposal**: the tool analyzes the epic spec and generates a change
   proposal detailing what files need to change and how.
2. **Review**: review the proposal before approving execution. Check that the
   scope matches the epic and nothing unrelated is being changed.
3. **Implement**: the AI tool executes the approved changes against a worktree
   or feature branch.
4. **Test**: verify the implementation against the epic's acceptance criteria.
5. **Commit**: commit with a message linked to the epic or spec artifact.
6. **Repeat**: move to the next epic.

Each loop is short (one epic, one change proposal). If the proposal is too
large, slice the epic smaller.

Output: implemented, tested, and committed code for each epic.

## Error recovery within the loop

If a proposal or implementation goes wrong:

- Revert the change in the spec tool (OpenSpec's rollback, git reset).
- Identify what made the task too big or the spec ambiguous.
- Re-slice the epic into smaller pieces and re-propose.
- Never let the model keep building on a drifting foundation. Revert to the
   last known-good state.

## References

Based on Sean Kochel's 5-step Claude Code system:
https://www.youtube.com/watch?v=i2rHVz5ZwYA
