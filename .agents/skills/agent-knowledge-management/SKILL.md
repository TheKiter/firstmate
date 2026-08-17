---
name: agent-knowledge-management
description: >-
  Agent-only skill for building, maintaining, and evolving an AI agent's
  knowledge base (second brain) so it stays accurate, current, and trustworthy
  over time.
  Use when setting up a project knowledge base for an agent, when maintaining
  an existing second brain that has drifted, when deciding what knowledge to
  keep vs. archive, and when scaling knowledge from personal to multi-user.
user-invocable: false
metadata:
  internal: true
---

# agent-knowledge-management

Use when setting up a project knowledge base for an agent, when maintaining
an existing second brain that has drifted, when deciding what knowledge to
keep vs. archive, and when scaling from personal to multi-user.

Derived from Cole Medin's experience running a 1.9-million-word second brain
with 10,000 words reaching the agent per session, and his work on scaling
knowledge from personal markdown folders to multi-user context layers.

## The knowledge rot problem

Every AI second brain has a shelf life. Knowledge drifts as the codebase
evolves, dependencies update, and the team learns new patterns. The agent
reads stale facts and makes wrong decisions based on outdated context.

Symptoms of knowledge rot:
- The agent references APIs that no longer exist
- The agent follows patterns the team stopped using months ago
- The agent's suggestions contradict recent code
- The agent seems less capable than it was when the knowledge base was new
- You start ignoring or overriding the agent's recommendations

## Compression: getting the right 10,000 words

An agent cannot read a million words every session. Compression is the
process of distilling the essential knowledge into the agent's context
window.

### Compression strategies

**Hierarchical summaries**: top-level documents summarize the full knowledge
base. The agent reads the summary first and drills into specific documents
only when needed.

- Root CLAUDE.md or OKF index with one-paragraph summaries per document
- Agent reads the index, identifies relevant documents, reads those
- Unreferenced documents never enter context

**Recency-weighted**: recent knowledge is more likely to be accurate. Order
documents by last-updated date and prioritize recent ones.

- Date-stamp every knowledge document
- Surface the most recent N documents by default
- Older documents are available on request but not loaded automatically

**Relevance-gated**: use the task description to select which knowledge
documents to load.

- The agent classifies the incoming task
- Loads only the knowledge documents tagged for that task category
- Documents outside the category are not loaded unless explicitly requested

## Curation: keeping knowledge true

Compression is not the hard part. Keeping the compressed knowledge accurate
is. Cole Medin's insight: "What reaches the agent every session is about
10,000 words. Compressing was never the hard part -- keeping those 10,000
words TRUE is."

### Curation cadence

- **Weekly**: review knowledge documents touched by the agent in the past
  week. Flag any that seem stale.
- **Monthly**: full audit of all knowledge documents. Archive anything that
  has not been referenced in a month.
- **Per-milestone**: after a major feature or refactor, review and update
  all knowledge documents that touch the changed areas.

### Curation rules

1. If a fact is referenced by the agent and produces incorrect output,
   fix the source document immediately.
2. If a document has not been referenced in N cycles, archive it. It can
   always be restored.
3. When updating a document, update the date in frontmatter and note what
   changed and why.
4. When deleting a document, check for cross-references and update or
   remove them.
5. Contradictions between documents must be resolved, not accumulated.
   The agent will find both and act on the wrong one.

### The curation agent

Assign a dedicated agent the job of knowledge curation. This agent:

- Scans new knowledge before it enters the base (quality gate)
- Periodically reviews existing documents for staleness
- Identifies contradictions between documents
- Archives unreferenced documents
- Reports its actions for human review

## Scaling from personal to multi-user

A personal markdown folder works well for one user. When you ship the agent
or knowledge base to others, scale the storage layer without changing the
schema.

### Personal (single user)

- A folder of OKF markdown files
- Git for version control and rollback
- The agent reads and writes files directly

### Team (multiple users)

Swap the folder for a database. The OKF schema (title, tags, related,
updated, markdown content) stays the same. The database adds:

- **Access control**: who can read, write, or delete knowledge
- **Real-time updates**: multiple users editing without merge conflicts
- **Retrieval**: search and filter at scale (hundreds to thousands of
  documents)
- **Audit log**: who changed what and when

Suitable backends: Redis (fast, simple), Postgres (relational, queryable),
or a purpose-built context layer.

## Knowledge management checklist

- [ ] Every knowledge document has a date stamp in frontmatter
- [ ] A hierarchical summary or index exists at the root
- [ ] Knowledge documents are tagged by category/topic
- [ ] Stale documents are archived, not deleted (restorable)
- [ ] Contradictions are resolved when discovered
- [ ] A curation cadence is defined and followed
- [ ] The agent's context includes only relevant knowledge, not everything
- [ ] For multi-user: access control, audit log, conflict resolution

## References

Based on Cole Medin's knowledge management content:
- Your AI Second Brain Is Slowly Rotting (9K views):
  https://www.youtube.com/watch?v=xOFkpf9KgKg
- I Love the Karpathy LLM Wiki but it Doesn't Scale (34K views):
  https://www.youtube.com/watch?v=R-5_2nsF_ZM
- The Ultimate Knowledge Base: Bring YouTube Into Your AI Second Brain (11K views):
  https://www.youtube.com/watch?v=8JWhwhxWtJw
