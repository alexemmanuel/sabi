create index if not exists profiles_score_idx on profiles (sabi_score desc, rating_count desc);
create index if not exists profiles_skill_score_idx on profiles (primary_skill, sabi_score desc);
create index if not exists profiles_city_score_idx on profiles (city, sabi_score desc);
create index if not exists ratings_to_idx on ratings (to_id, created_at desc);
create index if not exists endorsements_to_idx on endorsements (to_id, created_at desc);
create index if not exists attempts_user_idx on challenge_attempts (user_id, score desc);
