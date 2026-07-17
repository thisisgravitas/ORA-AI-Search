# ORA Super Site: AI Search POC

A working proof of concept of the AI powered search experience proposed for the
ORA Developers Holding Limited Super Site, Workstream 2. Content, imagery and
the ORA logo come from the live oradevelopers.com site; conversational answers
are generated live by Claude when a key is configured, with a scripted fallback
so the demo can never fail mid pitch.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the Super Site homepage. The AI search lives in
the navigation (or Cmd K); the full search experience is at /search. Every deck
ready state is indexed at **http://localhost:3000/screens**.

## Live AI answers

Copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY`. The Ask mode
then runs a real RAG loop: in process retrieval over the crawled ORA content
(the Optimizely Graph stand in) feeds numbered sources to Claude (the Opal AI
stand in), which answers with inline citations in English or Arabic. A green
"Live" badge shows on generated answers. Without a key, or on any API failure,
the demo silently falls back to pre scripted answers.

## Supabase pgvector retrieval

Semantic retrieval runs on Supabase pgvector with **all-MiniLM-L6-v2**
embeddings computed locally via Transformers.js (384 dimensions, no embedding
API, no extra keys). Setup:

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor
   (creates the `documents` table, HNSW index and `match_documents` function)
2. Put `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env.local`
   (Project Settings, API Keys)
3. `npm run ingest` embeds all content items, including the full crawled page
   copy with Product Mix tables, and upserts them into Supabase

The ask endpoint then embeds each question locally, retrieves by cosine
similarity through the `match_documents` RPC, and the answer badge reads
"Live · pgvector". If Supabase is unreachable or not configured, retrieval
falls back to the in process hybrid engine automatically, and if the Claude
key is absent the scripted answers take over, so the demo never fails.

## Deploy to Vercel

```bash
vercel deploy
```

Set `ANTHROPIC_API_KEY`, `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the Vercel
project settings. The Supabase publishable key is not used: this app only
talks to Supabase from the server. Content and images are bundled with the
app, so nothing else is needed.

## Real content pipeline

- `scripts/crawl.mjs` crawls oradevelopers.com (24 pages) into `data/crawl.json`
- `scripts/download-images.mjs` pulls curated imagery into `public/images`,
  resized to a maximum of 1600px
- `lib/fixtures.ts` holds 50 plus items shaped like flattened Optimizely Graph
  results, with live URLs, local imagery, facet metadata and segment boosts.
  Careers and events are drafted for the POC; everything else reflects the
  live site, including Madinat Al Ward (Iraq) and Yi Hotel Mykonos (Greece)

Re run both scripts any time to refresh content.

## How the screens map to the Section 5.1 search asks

| Requirement | Where to see it | Production equivalent |
| --- | --- | --- |
| Semantic search | /search screens 03 and 04: natural language queries resolved by intent with synonym expansion in the understanding strip | Optimizely Graph semantic and vector search |
| Intelligent autocomplete | Screen 02 and the Cmd K overlay: type ahead with content aware grouping | Graph autocomplete queries |
| Faceted results | Screens 03 and 04: multi select facets on OPCO, market, vertical, content type, language | Graph faceted GraphQL queries |
| Conversational search | Screens 06 to 08: generated answer with numbered citations linking to live ORA pages. Live via Claude when a key is set | Graph retrieval plus Opal AI (RAG) |
| Personalized results | Screens 10 to 12: segment toggle reorders and reframes results with boost tags | Graph queries boosted by visitor attributes |
| Business user search management | Screen 13: pinned results, synonyms, boosting weights | Graph Search Management portal |
| Search analytics | Screen 14: query volume, top terms, CTR, zero result queue | Graph query telemetry |
| Ranking A/B testing | Screen 15: two ranking strategies behind the search_ranking_strategy flag | Optimizely Web and Feature Experimentation |

Arabic is first class: screens 08 and 09 run fully mirrored RTL with Arabic
content, and the live Claude answers respond in the language of the question.

## Notes

- The homepage (screen 00) is a Super Site composition with the real ORA logo,
  crossfading live imagery, search in the navigation and an Ask ORA AI entry
  point, plus destinations, hospitality, news and stats sections with working
  links to oradevelopers.com
- The proposed production stack is Optimizely SaaS CMS 13 (headless) with
  Optimizely Graph, Opal AI, and Optimizely Web and Feature Experimentation on
  Next.js; this POC keeps the same App Router shape and swaps the backends for
  the crawled content and the Claude API
