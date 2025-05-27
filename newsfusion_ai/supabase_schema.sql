-- Supabase/Postgres schema for NewsFusion AI

-- Table to store app users (optionally, anonymous users can use only bookmarks table with 'user_id' as uuid)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table to store bookmarked articles
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade, -- or nullable if supporting anonymous bookmarks (better: always link to a user)
  article_url text not null,
  title text not null,
  description text,
  url_to_image text,
  source text,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  constraint unique_user_article unique (user_id, article_url)
);

-- Recommended for Supabase Row Level Security (RLS) to protect bookmarks per user:
-- Example policy ("only owner can read/write their bookmarks"):
-- Enable RLS
-- alter table bookmarks enable row level security;
-- CREATE POLICY "Bookmarks are only accessible to the user" ON bookmarks
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Note: For local dev, populate users using supabase.auth or insert dummy user(s) as needed.
