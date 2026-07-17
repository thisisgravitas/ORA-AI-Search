-- ORA Super Site POC: pgvector schema for semantic retrieval.
-- Run once in the Supabase SQL editor (Database > SQL) before ingesting.
-- Embeddings come from all-MiniLM-L6-v2, which produces 384 dimensions.

create extension if not exists vector;

create table if not exists documents (
  id text primary key,
  content text not null,
  metadata jsonb not null default '{}',
  embedding vector(384) not null
);

create index if not exists documents_embedding_idx
  on documents using hnsw (embedding vector_cosine_ops);

-- Cosine similarity search used by the /api/ask route
create or replace function match_documents(
  query_embedding vector(384),
  match_count int default 6
)
returns table (
  id text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;
