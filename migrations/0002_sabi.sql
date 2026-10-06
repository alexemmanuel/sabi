create table if not exists profiles (
  user_id text primary key,
  handle text not null unique,
  display_name text not null,
  city text not null default 'Lagos',
  bio text not null default '',
  role text not null default 'both',
  primary_skill text not null default 'electrical',
  is_featured boolean not null default false,
  sabi_score int not null default 0,
  jobs_done int not null default 0,
  rating_avg numeric not null default 0,
  rating_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists challenges (
  id text primary key,
  skill_id text not null,
  title text not null,
  prompt text not null,
  rubric text not null,
  difficulty text not null,
  minutes int not null default 10
);

create table if not exists challenge_attempts (
  id serial primary key,
  user_id text not null,
  challenge_id text not null,
  answer text not null,
  score int not null,
  feedback text not null,
  created_at timestamptz not null default now()
);
create unique index if not exists challenge_attempts_user_chal on challenge_attempts (user_id, challenge_id);

create table if not exists jobs (
  id serial primary key,
  client_id text not null,
  skill_id text not null,
  title text not null,
  description text not null,
  city text not null,
  budget_naira int not null,
  status text not null default 'open',
  hired_id text,
  created_at timestamptz not null default now()
);
create index if not exists jobs_status_idx on jobs (status, created_at desc);

create table if not exists ratings (
  id serial primary key,
  job_id int not null,
  from_id text not null,
  to_id text not null,
  stars int not null,
  comment text not null default '',
  created_at timestamptz not null default now()
);
create unique index if not exists ratings_job_from on ratings (job_id, from_id);

create table if not exists endorsements (
  id serial primary key,
  from_id text not null,
  to_id text not null,
  skill_id text not null,
  note text not null default '',
  created_at timestamptz not null default now()
);
create unique index if not exists endorsements_unique on endorsements (from_id, to_id, skill_id);

create table if not exists app_meta (
  key text primary key,
  value text not null
);
