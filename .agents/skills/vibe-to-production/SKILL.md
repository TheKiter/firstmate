---
name: vibe-to-production
description: >-
  Agent-only skill for taking an AI-generated (vibe-coded) prototype to a
  production-ready application.
  Use before deploying a demo or prototype built with AI coding tools, when
  reviewing a project for production readiness, and when scoping the work
  between demo and ship.
  Covers spec-driven development, documentation, version control,
  authentication, authorization, error handling, databases, security, hosting,
  deployment, and observability.
user-invocable: false
metadata:
  internal: true
---

# vibe-to-production

Use before deploying a vibe-coded demo, when reviewing for production readiness,
and when scoping the gap between prototype and ship.

Sean Kochel's framing: "There are two types of vibe coders. The ones that
actually ship real stuff, and the ones that become the source material for
all of those vibe coding memes. The difference isn't talent and it's not tools.
It is the processes they follow and the vocabulary that they have."

The organizing mental model is **gates vs. nets**:
- **Gates** prevent bad inputs from reaching production in the first place.
  Specs, types, linting, auth, code review.
- **Nets** catch what gets past the gates.
  Error handling, monitoring, rollbacks, observability.

Build gates first, then nets. A production app needs both.

## 1. Spec-driven development

This is the single highest-leverage practice for AI-assisted builds.
Without a spec as a contract, the model will drift, hallucinate features, and
produce untestable results.

- Use a spec-driven tool (OpenSpec, GitHub Speck Kit) that generates structured
  change proposals from requirements.
- The spec becomes a contract the model must abide by.
- Break large features into small, digestible chunks the model can implement
  reliably.
- Every change is documented and traceable: artifacts, issues, commits, all
  linked.
- Do not rely on a skill plugin alone without an underlying process.

## 2. Project documentation

Maintain structured project documentation that is hooked into the AI tool's
context (CLAUDE.md, cursor rules, etc.).

- Document the project's architecture, not just its setup.
- Describe the data model, key flows, and design decisions.
- Keep CLAUDE.md files focused and non-contradictory.
- Document the deployment architecture and environment differences.
- Regularly audit documentation for drift from the actual codebase.

## 3. Version control

Without structured version control, an AI-assisted project cannot reach real
users reliably.

- Use Git with meaningful commit messages that an AI can parse later.
- Use branching strategies that isolate features (feature branches, worktrees).
- Never let the AI tool write directly to main or the primary branch.
- Tag releases so rollbacks are precise.
- Link commits to spec artifacts (OpenSpec changes, issue numbers).

## 4. Authentication vs. Authorization

These are distinct concerns, and confusing them is one of the most common
beginner mistakes in AI-built apps.

- **Authentication** is verifying identity: "Who is this user?"
  Use established providers (Clerk, Auth0, Supabase Auth) rather than building
  your own. Passwordless or OAuth is preferred for indie projects.
- **Authorization** is verifying permissions: "Is this user allowed to do X?"
  Define authorization at the resource level. A user should see only their own
  data. Public resources (a shared foods database) are read-access by default.
- AI tools frequently conflate these. Review generated auth code explicitly.

## 5. Error handling

AI-generated code tends to assume the happy path. Production apps must handle
the unhappy path gracefully.

- Does a single error crash the entire page or just the component?
- Are errors surfaced to the user in human language, not stack traces?
- Are unexpected errors caught globally (error boundaries, try-catch at
  service boundaries)?
- Are external API failures handled with retries, fallbacks, or clear messages?
- Log errors to a service (Sentry, Logtail) not just the console.

## 6. Databases

AI tools generate naive data access patterns. Review and harden them.

- Use an ORM or query builder, not raw SQL strings concatenated in-line.
- Define access patterns before schema: "what queries does this feature need?"
- Set up migrations, not ad-hoc schema changes.
- Use connection pooling for serverful deployments.
- Seed test data so the AI can reason about real query patterns.
- Review N+1 query patterns and missing indexes.

## 7. Security

AI coding tools will not surface security concerns unless explicitly asked.

- Never store secrets in code or environment files committed to Git.
- Use environment variables injected at deploy time (Vercel, Railway, Fly env).
- Validate and sanitize all user input on the server side, not just the client.
- Set up CSP headers, HTTPS enforcement, and cookie security flags.
- Rate-limit public endpoints.
- Review AI-generated code for hardcoded credentials, open CORS, and
  injection vulnerabilities.

## 8. Hosting

Choose a host based on your experience level and the app's cost model.

- **Platform-as-a-service** (Vercel, Railway, Fly.io, Render): good for
  beginners. Handles SSL, scaling, and deployment out of the box.
- **Self-hosted** (a VPS): more control but requires system administration
  skills the AI cannot reliably provide.
- For stateful apps (databases), PaaS with managed DB add-ons reduces risk.
- Understand the pricing model before committing; AI tools cannot predict your
  bill.

## 9. Deployment

Set up deployment before the first user, not after.

- Automate deployment with CI/CD (GitHub Actions, Vercel deploys).
- Deploy to a staging environment first, not directly to production.
- Use blue-green or preview deployments for zero-downtime releases.
- Have a rollback plan: a known-good commit hash or deployment that can be
  restored instantly.
- Deployment should be boring: the same script every time, no manual steps.

## 10. Observability

Know what is happening inside your app without hoping users tell you.

- **Logging**: structured, searchable logs (not console.log scattered in
  handlers).
- **Metrics**: request latency, error rates, database query performance.
- **Tracing**: follow a single request through your entire stack.
- Set up a dashboard (Grafana, Datadog, or simpler: Logtail + Sentry) before
  launch.
- Know your baseline: what is normal so you can spot abnormal.

## The vibe-coder's checklist

Before shipping to real users, verify each item:

- [ ] Spec-driven development is in use for every feature change
- [ ] Project documentation exists and is linked into AI context
- [ ] Version control is structured with meaningful commits and branching
- [ ] Authentication uses an established provider
- [ ] Authorization is implemented per-resource, not just per-route
- [ ] Error boundaries catch failures at component and service level
- [ ] Database uses migrations and an ORM
- [ ] No secrets are committed to the repository
- [ ] User input is validated server-side
- [ ] Hosting platform is chosen and understood
- [ ] CI/CD deployment is automated
- [ ] Rollback plan exists and is tested
- [ ] Observability tools are configured before launch

## References

Based on Sean Kochel's "Turning a Vibe-Coded Demo Into a Real Product":
https://www.youtube.com/watch?v=wur4BdeE8jk
