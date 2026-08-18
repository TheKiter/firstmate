---
name: open-knowledge-format
description: >-
  Agent-only skill for structuring knowledge in the Open Knowledge Format (OKF)
  so that any AI agent can read and use it without plugins, RAG pipelines, or
  vector databases.
  Use when building or maintaining an AI-readable knowledge base, when
  documenting a project or domain for agent consumption, when sharing
  knowledge between different AI tools, and when designing a second brain
  that other agents can use.
user-invocable: false
metadata:
  internal: true
---

# open-knowledge-format

Use when building an AI-readable knowledge base, when documenting a project
or domain for agent consumption, when sharing knowledge between AI tools,
and when designing a second brain that other agents can use.

Derived from Google's Open Knowledge Format (OKF) as detailed by Cole Medin.
OKF is an open standard that formalizes Andrej Karpathy's LLM wiki pattern
into plain markdown any AI can read with zero integration.

Cole Medin's framing: "Andrej Karpathy released the idea of the LLM wiki.
It's a pattern for building personal knowledge bases using LLMs and it totally
took off for good reason. This single markdown document in GitHub called a
gist got to 40,000 stars. Seriously, you can take this idea and run with it."

## The problem OKF solves

You have a personal coding agent and a second brain. It works well for you.
But handing your knowledge to someone else's AI — or having another AI tool
use your knowledge — requires plugins, RAG pipelines, vector databases, and
integration work. There is no shared format.

OKF is that shared format: plain markdown with a predictable structure that
any AI can read. No plugin, no RAG, no vector DB. Point your agent at a
folder and ask it anything, as long as it knows OKF.

## OKF structure

An OKF knowledge base is a folder of markdown files following these rules.

### File organization

- One markdown file per concept, topic, or document
- Files are flat or nested in a shallow hierarchy
- File names are descriptive and kebab-case
- An optional `index.md` at the root lists all documents with brief
  descriptions

### Frontmatter

Each file starts with YAML frontmatter:

```yaml
---
title: "Concept Name"
tags: [tag1, tag2, tag3]
related:
  - related-document.md
  - another-document.md
updated: 2026-07-01
---
```

- `title`: human-readable name of the concept
- `tags`: keywords for categorization and retrieval
- `related`: relative paths to related documents (agent follows these for
  deeper context)
- `updated`: last revision date (agents can use this to assess freshness)

### Content rules

- Write in plain markdown
- Use headings (## and ###) for structure
- Keep each document focused on one concept
- Use lists and tables for structured data
- Include code examples in fenced blocks with language tags
- Define terms inline rather than assuming prior knowledge
- Prefer concrete examples over abstract descriptions
- Keep documents concise (agents have context limits)

### Agent instructions

The root `index.md` or a `CLAUDE.md` should tell the agent:

```
This knowledge base uses the Open Knowledge Format (OKF).
Files are plain markdown with YAML frontmatter.
The index.md at the root lists all documents.
Related documents are linked in each file's frontmatter.
Read the index first, then follow links to specific topics.
Knowledge may be stale; check the `updated` field in frontmatter.
```

## Building an OKF knowledge base

### From scratch

1. Create an `okf/` or `knowledge/` directory in your project
2. Write an `index.md` listing every document with a one-line description
3. For each concept, write one markdown file with frontmatter and content
4. Link related documents in the frontmatter
5. Point your agent at the directory

### From an existing second brain

1. Ensure each concept has its own file
2. Add OKF frontmatter (title, tags, related, updated)
3. Write or update the root index
4. Review for stale content

### From a YouTube channel or external source

1. Fetch the content (transcript, description)
2. Distill into one markdown file per concept
3. Add OKF frontmatter
4. Add to the knowledge base index

## Scaling beyond a single folder

A folder of markdown works great for a single user. When you ship the agent
to other people, you need a context layer:

- Real-time data changes: the knowledge base is updated by many users
- Access control: some knowledge is private, some is shared
- Retrieval at scale: a flat folder does not scale past a few hundred files
- Consistency: multiple users writing markdown with slightly different styles

At that point, replace the folder with a database (Redis, Postgres) that
serves the same OKF structure but with proper access control, real-time
updates, and efficient retrieval. The OKF schema stays the same; only the
storage layer changes.

## OKF checklist

- [ ] Each concept has its own markdown file
- [ ] Every file has OKF frontmatter (title, tags, related, updated)
- [ ] A root index.md lists all documents
- [ ] Agent instructions explain OKF at the root or in CLAUDE.md
- [ ] Related documents are linked bidirectionally
- [ ] Stale content is reviewed and updated or archived
- [ ] New external knowledge is distilled into OKF format before adding

## References

Based on Cole Medin's coverage of the Open Knowledge Format (81K views):
- Finally, an Open Standard for the Karpathy LLM Wiki is HERE:
  https://www.youtube.com/watch?v=T33iI6izAKw
- I Love the Karpathy LLM Wiki but it Doesn't Scale (34K views):
  https://www.youtube.com/watch?v=R-5_2nsF_ZM
- The Ultimate Knowledge Base: Bring YouTube Into Your AI Second Brain (11K views):
  https://www.youtube.com/watch?v=8JWhwhxWtJw
