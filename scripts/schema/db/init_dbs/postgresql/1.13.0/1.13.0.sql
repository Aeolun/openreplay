DO
$$
    DECLARE
        previous_version CONSTANT text := 'v1.12.0';
        next_version     CONSTANT text := 'v1.13.0';
    BEGIN
        IF (SELECT openreplay_version()) = previous_version THEN
            raise notice 'valid previous DB version';
        ELSEIF (SELECT openreplay_version()) = next_version THEN
            raise notice 'new version detected, nothing to do';
        ELSE
            RAISE EXCEPTION 'upgrade to % failed, invalid previous version, expected %, got %', next_version,previous_version,(SELECT openreplay_version());
        END IF;
    END ;
$$
LANGUAGE plpgsql;

BEGIN;
CREATE OR REPLACE FUNCTION openreplay_version()
    RETURNS text AS
$$
SELECT 'v1.13.0'
$$ LANGUAGE sql IMMUTABLE;

CREATE TABLE IF NOT EXISTS public.feature_flags
(
    feature_flag_id integer generated BY DEFAULT AS IDENTITY PRIMARY KEY,
    project_id      integer                     NOT NULL REFERENCES projects (project_id) ON DELETE CASCADE,
    name            text                        NOT NULL,
    flag_key        text                        NOT NULL,
    description     text                        NOT NULL,
    flag_type       text                        NOT NULL,
    is_persist      boolean                     NOT NULL DEFAULT FALSE,
    is_active       boolean                     NOT NULL DEFAULT FALSE,
    created_by      integer                     REFERENCES users (user_id) ON DELETE SET NULL,
    updated_by      integer                     REFERENCES users (user_id) ON DELETE SET NULL,
    created_at      timestamp without time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at      timestamp without time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    deleted_at      timestamp without time zone NULL     DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_project_id ON public.feature_flags (project_id);

CREATE TABLE IF NOT EXISTS public.feature_flags_conditions
(
    condition_id       integer generated BY DEFAULT AS IDENTITY PRIMARY KEY,
    feature_flag_id    integer NOT NULL REFERENCES feature_flags (feature_flag_id) ON DELETE CASCADE,
    name               text    NOT NULL,
    rollout_percentage integer NOT NULL,
    filters            jsonb   NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE IF EXISTS public.sessions
    ADD COLUMN IF NOT EXISTS user_city  text,
    ADD COLUMN IF NOT EXISTS user_state text;

COMMIT;

CREATE INDEX CONCURRENTLY IF NOT EXISTS sessions_project_id_user_city_idx ON sessions (project_id, user_city);
CREATE INDEX CONCURRENTLY IF NOT EXISTS sessions_project_id_user_state_idx ON sessions (project_id, user_state);