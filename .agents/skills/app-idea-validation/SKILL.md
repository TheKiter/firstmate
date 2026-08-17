---
name: app-idea-validation
description: >-
  Agent-only skill for validating app and product ideas before building.
  Based on Mark Pincus's (Zynga founder) "Proven Better New" framework adapted
  for AI-assisted development.
  Use before scoping a new project, before writing a brief for a new build,
  and when evaluating whether an idea is worth building in its current form.
user-invocable: false
metadata:
  internal: true
---

# app-idea-validation

Use this before scoping a new project or writing a brief for a new build.
It helps separate genuine product instincts from premature implementation ideas.

This skill is adapted from Mark Pincus's (Zynga founder) "Proven Better New"
framework, originally developed for evaluating game and social-product ideas.
The core insight: most new things fail, so build where demand is already proven,
then make it better, then add genuinely new angles as experiments.

## The framework: Proven Better New

Every product idea should be evaluated against three axes, in order.

### Proven

Is there already established demand in this space?

- Do people already pay for something like this?
- Is there an existing market with known pricing and expectations?
- Can you point to real competitors or adjacent products that have traction?
- What is the established baseline you are comparing yourself to?

If there is no proven demand, the idea needs significantly more investment to
educate the market. The framework considers this the highest-risk path.

### Better

What specific frustrations or gaps exist in the current proven solutions?

- What are people complaining about in existing tools?
- Where is the user experience rough, slow, or missing?
- What do competitors not do well that users actually care about?
- Can you make one specific thing meaningfully better without making everything
  else worse?

"Better" should be concrete and measurable, not a general claim of superiority.
Frame it as: "Users of X are frustrated by Y, and here is how we fix that."

### New

What genuinely novel angle can you add on top of proven-and-better?

- New approaches are experiments, not the foundation.
- Run multiple "new" bets to find the unique wedge.
- Each new angle should be testable independently.
- Accept that most new angles will not work; the portfolio matters.

Place your bets on new angles, but build on the proven base.

## Instincts vs. Ideas

Most people share the same instincts about a problem: something is broken,
something should exist, a process is painful. The difference between winning
and losing is how that instinct translates into a concrete, buildable idea.

- An **instinct** is a shared recognition that a problem exists.
  "Tracking workout progress from video comments is terrible."
- An **idea** is a specific, opinionated implementation.
  "An app that parses weekly PDF exercise programs into a trackable workout
  tracker with progressive overload tracking."

When evaluating an idea, check whether it is one plausible implementation of
the instinct or the only possible one. If the instinct is sound but the idea
is narrow, the framework helps find the better expression of that instinct.

## Using the framework for agent-assisted builds

When scoping an AI-assisted project:

1. State the **proven** market or category with at least one real competitor or
   adjacent product. If you cannot name one, stop and research first.
2. Define the **better** in concrete, testable terms.
   "Faster" or "cheaper" is not testable unless quantified.
3. List the **new** angles as explicit bets, not requirements.
   Tag each as "experiment" in the spec.
4. Distinguish the **instinct** (the problem) from the **idea** (the solution).
   If the instinct sounds right but the idea feels off, try a different
   expression of the same instinct before abandoning the problem.
5. Write the brief as: proven market + better delta + new experiments.
   The build scope is the proven and better parts; new angles are optional
   post-MVP additions.

## References

Based on Sean Kochel's breakdown of Mark Pincus's framework:
https://www.youtube.com/watch?v=HUMUXeoWtCk
