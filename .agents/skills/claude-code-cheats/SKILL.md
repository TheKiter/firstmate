---
name: claude-code-cheats
description: >-
  Agent-only reference for Claude Code commands that save context, prevent
  wasted tokens, and keep sessions productive.
  Use when starting a new Claude Code session, when context is running low,
  when debugging project setup issues, and when reviewing session health.
  Covers /checkup (doctor), /goal, /statusline, /recap, and /btw.
user-invocable: false
metadata:
  internal: true
---

# claude-code-cheats

Use when starting a new Claude Code session, before context fills up, when
debugging setup or tool issues, and when reviewing session health.

These commands are built into Claude Code and require no skills or plugins.
They are most valuable for keeping sessions productive without blowing through
context budgets.

## /checkup (also /doctor)

Audits the current session's configuration and setup before any real work
begins.

Checks these parameters:
- **General setup health**: are there broken config files, dangling install
  files, or misconfigured paths?
- **Unused extensions**: plugins and MCP servers installed but never used.
  These consume context on every session. Disable what you do not need.
- **CLAUDE.md quality**: are the project rule files too long, contradictory,
  or beyond warning thresholds?
- **MCP server health**: are all configured MCP servers reachable?
- **Global vs. local skills**: skills installed globally get loaded into every
  session. Move project-specific skills local.
- **Context budget usage**: what percentage of the context window is consumed
  by setup vs. actual work?

Run `/checkup` at the start of every new project session. It prevents the
common pattern of blowing through a context budget on configuration overhead
before writing a single line of code.

## /goal

Sets a persistent goal that the model keeps working toward across automatic
context compactions.

- The goal survives context resets and compactions.
- The model will auto-compact earlier context to keep the goal visible.
- Use for multi-step tasks where the model should remember the end state even
  as intermediate steps fill the window.
- Update the goal as progress is made to keep it accurate.

This is the single most important command for long-running sessions. Without
it, the model may forget the overall objective after a few context compactions
and drift into unrelated improvements or rabbit holes.

## /statusline

Customizes the status line shown in the Claude Code terminal to display
context-relevant information.

The recommended /statusline format:
```
/statusline I want to visualize the model in use, the working directory, the
worktree/branch, current context % used, 5h, 7d context usage limits
```

A good statusline shows at a glance:
- Which model is active
- The working directory and branch
- Current context usage percentage
- Context usage trends (5-hour, 7-day)

Check the statusline periodically during long sessions to catch context
pressure before it degrades output quality.

## /recap

Generates a one-line summary of what the current project is and what was being
worked on.

Use `/recap` when:
- Returning to a project after a break
- Switching between multiple project sessions
- The session was interrupted and needs reorientation
- Context was compacted and you want to confirm the model still knows what
  the project is about

The output is a single line describing the project and current task. Confirm
it matches your intent before continuing; if the recap drifts, the model has
lost context and needs reinforcement.

## /btw

Tells the model to watch for a specific pattern, concern, or constraint across
the rest of the session.

Use `/btw` when:
- You notice the model starting to repeat a mistake
- There is a project-specific constraint the model keeps forgetting
- You want the model to flag a concern rather than silently proceed
- The early session context (where the constraint was defined) has been
  compacted

The model will remember the `/btw` instruction for the remainder of the
session. Re-issue it if context compacts aggressively.

## Session health checklist

- [ ] Run `/checkup` at session start to audit setup overhead
- [ ] Set a `/goal` for multi-step tasks before context fills
- [ ] Configure `/statusline` to show model, branch, and context %
- [ ] Run `/recap` after interruptions to confirm the model knows the project
- [ ] Use `/btw` to reinforce constraints the model keeps forgetting

## References

Based on Sean Kochel's breakdown of Claude Code commands:
https://www.youtube.com/watch?v=7tX7YMLDJjM
