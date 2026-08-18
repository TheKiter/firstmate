---
name: agentic-security
description: >-
  Agent-only skill for securing AI coding agent access to your system,
  especially the bash/shell tool that most agent harnesses provide.
  Use when configuring a new agent harness, before giving an agent access
  to a production environment, when reviewing the security posture of your
  agentic setup, and when choosing between agent sandboxing approaches.
user-invocable: false
metadata:
  internal: true
---

# agentic-security

Use when configuring a new agent harness, before giving an agent access to a
production or sensitive environment, when reviewing your agentic setup's
security posture, and when choosing between sandboxing approaches.

Derived from IndyDevDan's bash security framework and the broader agent
sandboxing ecosystem. The core principle: risk compounds with runtime.
Every second an agent has unrestricted shell access increases the
probability of accidental or exploit-driven damage.

IndyDevDan's framing: "If your agents have a problem, you have a problem.
There's a tool that every agent has that is an agentic security ticking time
bomb. 95% of all engineers are one bad prompt away from their agents using
this tool to cause irreversible production damage. This isn't hypothetical."

## The bash tool problem

The bash/shell tool inside every agent harness is the single highest-risk
attack surface in agentic coding. One bad prompt, one confused model, one
adversarial input injection, and an agent can:

- Delete or corrupt files
- Exfiltrate credentials and secrets
- Modify production configurations
- Install malware
- Wipe databases

The math is brutal: risk compounds with runtime. Every second an agent
has unrestricted shell access increases the probability of something going
wrong. The longer an agent runs, the more likely it is to encounter an input
it misinterprets.

## The Five Levels of Bash Security

### Level 0: Unrestricted

The agent has full shell access to your machine. The bash tool executes
anything, anywhere, with your user's permissions.

- Risk: extreme
- Use case: throwaway experiments on isolated machines only
- Rule: never on a machine with production data, credentials, or
  irreplaceable work

### Level 1: Read-only by default

The agent's bash tool starts in read-only mode. It can read files, list
directories, and inspect the system, but cannot write, delete, or execute
anything that mutates state. Write access must be explicitly granted per
command or per session.

- Risk: moderate for reads, low for mutations
- Use case: code review agents, research agents, documentation agents
- Implementation: custom tool wrapper that checks command safety before
  execution, or a read-only filesystem mount

### Level 2: Sandboxed environment

Each agent runs in its own isolated environment (Docker container, VM,
sandbox service). The agent has full shell access inside the sandbox but
zero access to the host machine or other sandboxes.

- Risk: contained. Damage stays inside the sandbox.
- Use case: implementation agents, build agents, test agents
- Implementation: Docker containers per agent, exe.dev, e2b.dev, or
  similar sandbox services

### Level 3: Sandboxed with controlled egress

Like Level 2, but the sandbox has controlled egress — the agent can access
specific external resources (a git remote, a package registry, a specific
API) but cannot reach arbitrary network destinations or the host filesystem.

- Risk: well-contained. Even a compromised sandbox cannot exfiltrate
  broadly.
- Use case: agents working with sensitive codebases or data
- Implementation: network policies, allowed-host lists, egress proxies

### Level 4: Ephemeral sandbox with approval gate

Each agent runs in an ephemeral sandbox that is destroyed after the task
completes. Any output that needs to persist (code, config, data) must pass
through an approval gate — a review step where a human or a verifier agent
inspects the output before it leaves the sandbox.

- Risk: minimal. Even a compromised agent cannot persist damage without
  approval.
- Use case: production deployments, sensitive operations, high-value
  targets
- Implementation: approval queue, verifier agent, one-shot sandboxes

## Agent sandboxing approaches

### Local containers (Docker)

Each agent gets a Docker container with the project code mounted (ideally
read-only). The container has no host network access by default.

- Pro: free, local, well-understood
- Con: container escapes are possible, Docker socket access is dangerous

### Cloud sandboxes (exe.dev, e2b.dev)

Each agent gets a cloud VM or micro-VM that is provisioned per task and
destroyed after.

- Pro: strong isolation, no local resource contention, scalable
- Con: network latency, cost, dependency on external service

### Worktrees with restricted permissions

Git worktrees with restricted filesystem permissions. The agent's user
account can only write to its assigned worktree directory.

- Pro: simple, no additional infrastructure
- Con: weak isolation compared to containers, shared process namespace

## Security checklist for agentic setups

- [ ] No agent runs with unrestricted shell access by default
- [ ] Secrets and credentials are not accessible from agent environments
- [ ] Each agent has its own isolated environment (container, worktree)
- [ ] Network egress is restricted to approved destinations
- [ ] Agent environments are ephemeral (destroyed after task completion)
- [ ] Output from agent environments passes through an approval gate
  before persisting
- [ ] The bash tool is replaced with a safe wrapper that validates
  commands
- [ ] Read-only access is the default; write access is explicitly granted
- [ ] Monitoring detects unexpected file modifications or network calls
- [ ] The agent cannot access other agents' environments or data

## References

Based on IndyDevDan's agentic security content:
- Engineers, DELETE the BASH Tool: Agentic Security (28K views):
  https://www.youtube.com/watch?v=yBcmIoA-vGs
- Your Software Factory NEEDS Agent Sandboxes (19K views):
  https://www.youtube.com/watch?v=SEI_qIW4o2c
- Damage From Within codebase: https://github.com/disler/bash-damage-from-within
