# Database Schema Plan (SQLite)

## Conventions
- Primary keys are `TEXT` UUIDs unless noted.
- Timestamps stored as `INTEGER` epoch ms.
- JSON stored as `TEXT` (stringified).
- Foreign keys enabled with `PRAGMA foreign_keys = ON;`.

## Enums
- `theme`: `light` | `dark` | `system`
- `challenge_status`: `pending` | `active` | `completed` | `failed` | `forfeited`
- `participant_status`: `pending` | `active` | `completed` | `failed` | `forfeited`
- `friend_request_status`: `pending` | `accepted` | `declined` | `cancelled`
- `notification_type`: `badge_earned` | `challenge_completed` | `challenge_reminder` | `friend_request`
- `leaderboard_scope`: `friends` | `global`
- `leaderboard_period`: `today` | `week` | `month`
- `sync_operation`: `upsert` | `delete`
- `sync_status`: `pending` | `in_flight` | `failed` | `completed`

## Tables

### users
- `id` TEXT PRIMARY KEY
- `username` TEXT NOT NULL UNIQUE
- `email` TEXT
- `profile_image_uri` TEXT
- `total_coins` INTEGER NOT NULL DEFAULT 0 CHECK (total_coins >= 0)
- `created_at` INTEGER NOT NULL
- `updated_at` INTEGER NOT NULL

### user_preferences
- `user_id` TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
- `theme` TEXT NOT NULL DEFAULT 'system'
- `notifications_enabled` INTEGER NOT NULL DEFAULT 1
- `haptic_enabled` INTEGER NOT NULL DEFAULT 1
- `audio_enabled` INTEGER NOT NULL DEFAULT 1
- `privacy_hidden_apps_json` TEXT NOT NULL DEFAULT '[]'
- `data_retention_days` INTEGER NOT NULL DEFAULT 60
- `updated_at` INTEGER NOT NULL

### app_metadata
- `app_id` TEXT PRIMARY KEY
- `app_name` TEXT NOT NULL
- `icon_uri` TEXT
- `category` TEXT
- `platform` TEXT
- `last_seen_at` INTEGER

### usage_sessions
- `id` TEXT PRIMARY KEY
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `app_id` TEXT NOT NULL REFERENCES app_metadata(app_id)
- `start_time` INTEGER NOT NULL
- `end_time` INTEGER NOT NULL
- `duration_seconds` INTEGER NOT NULL
- `device_id` TEXT
- `is_hidden` INTEGER NOT NULL DEFAULT 0

### usage_daily_aggregates
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `app_id` TEXT NOT NULL REFERENCES app_metadata(app_id)
- `day_start` INTEGER NOT NULL
- `total_seconds` INTEGER NOT NULL
- `session_count` INTEGER NOT NULL
- `last_used_at` INTEGER
- `is_hidden` INTEGER NOT NULL DEFAULT 0
- PRIMARY KEY (`user_id`, `app_id`, `day_start`)

### challenges
- `id` TEXT PRIMARY KEY
- `creator_id` TEXT NOT NULL REFERENCES users(id)
- `name` TEXT NOT NULL
- `description` TEXT
- `target_app_id` TEXT NOT NULL REFERENCES app_metadata(app_id)
- `time_limit_minutes` INTEGER NOT NULL
- `duration_days` INTEGER NOT NULL
- `status` TEXT NOT NULL
- `is_popular` INTEGER NOT NULL DEFAULT 0
- `coin_reward` INTEGER NOT NULL DEFAULT 0
- `coin_penalty` INTEGER NOT NULL DEFAULT 0
- `start_at` INTEGER
- `end_at` INTEGER
- `created_at` INTEGER NOT NULL
- `updated_at` INTEGER NOT NULL

### challenge_participants
- `id` TEXT PRIMARY KEY
- `challenge_id` TEXT NOT NULL REFERENCES challenges(id) ON DELETE CASCADE
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `status` TEXT NOT NULL
- `joined_at` INTEGER NOT NULL
- `completed_at` INTEGER
- `forfeited_at` INTEGER
- UNIQUE (`challenge_id`, `user_id`)

### badges
- `id` TEXT PRIMARY KEY
- `type` TEXT NOT NULL
- `name` TEXT NOT NULL
- `description` TEXT
- `icon_uri` TEXT
- `created_at` INTEGER NOT NULL

### user_badges
- `id` TEXT PRIMARY KEY
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `badge_id` TEXT NOT NULL REFERENCES badges(id)
- `earned_at` INTEGER NOT NULL
- UNIQUE (`user_id`, `badge_id`)

### coin_transactions
- `id` TEXT PRIMARY KEY
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `amount` INTEGER NOT NULL
- `reason` TEXT NOT NULL
- `source_type` TEXT
- `source_id` TEXT
- `balance_after` INTEGER NOT NULL CHECK (balance_after >= 0)
- `created_at` INTEGER NOT NULL

### friends
- `id` TEXT PRIMARY KEY
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `friend_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `created_at` INTEGER NOT NULL
- UNIQUE (`user_id`, `friend_id`)

### friend_requests
- `id` TEXT PRIMARY KEY
- `requester_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `addressee_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `status` TEXT NOT NULL
- `created_at` INTEGER NOT NULL
- `responded_at` INTEGER
- UNIQUE (`requester_id`, `addressee_id`)

### leaderboards_cache
- `id` TEXT PRIMARY KEY
- `scope` TEXT NOT NULL
- `period` TEXT NOT NULL
- `app_id` TEXT NOT NULL REFERENCES app_metadata(app_id)
- `generated_at` INTEGER NOT NULL
- `expires_at` INTEGER
- `payload_json` TEXT NOT NULL

### notifications
- `id` TEXT PRIMARY KEY
- `user_id` TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE
- `type` TEXT NOT NULL
- `title` TEXT NOT NULL
- `body` TEXT
- `data_json` TEXT
- `scheduled_for` INTEGER
- `delivered_at` INTEGER
- `read_at` INTEGER
- `created_at` INTEGER NOT NULL

### sync_queue
- `id` TEXT PRIMARY KEY
- `entity_type` TEXT NOT NULL
- `entity_id` TEXT NOT NULL
- `operation` TEXT NOT NULL
- `payload_json` TEXT
- `status` TEXT NOT NULL DEFAULT 'pending'
- `attempts` INTEGER NOT NULL DEFAULT 0
- `last_attempt_at` INTEGER
- `created_at` INTEGER NOT NULL
- `updated_at` INTEGER NOT NULL

### schema_migrations
- `version` INTEGER PRIMARY KEY
- `applied_at` INTEGER NOT NULL

## Indexes
- `usage_sessions`: (`user_id`, `app_id`, `start_time`)
- `usage_sessions`: (`user_id`, `start_time`)
- `usage_daily_aggregates`: (`user_id`, `app_id`, `day_start`)
- `usage_daily_aggregates`: (`user_id`, `day_start`)
- `challenge_participants`: (`user_id`, `status`)
- `coin_transactions`: (`user_id`, `created_at`)
- `friends`: (`user_id`)
- `friend_requests`: (`addressee_id`, `status`)
- `leaderboards_cache`: (`app_id`, `scope`, `period`)
- `notifications`: (`user_id`, `created_at`)
- `sync_queue`: (`status`, `updated_at`)

## Aggregation Strategy
- Store raw `usage_sessions` for accuracy and auditing.
- Maintain `usage_daily_aggregates` keyed by (`user_id`, `app_id`, `day_start`) for fast leaderboard queries.
- Update aggregates on session insert/update.

## Migration Outline
1. `0001_initial_schema`: create all tables, indexes, and `schema_migrations`.
2. Future migrations add/alter columns with backfills and new indexes.

## Requirements Mapping (Traceability)
- R1 (usage tracking): `usage_sessions`, `usage_daily_aggregates`
- R2 (user accounts): `users`, `user_preferences`
- R3 (friends/privacy): `friends`, `friend_requests`, `user_preferences.privacy_hidden_apps_json`
- R4 (leaderboards): `usage_daily_aggregates`, `leaderboards_cache`
- R5/R9 (challenges): `challenges`, `challenge_participants`
- R6 (popular challenges): `challenges.is_popular`
- R7 (coins/global ranking): `coin_transactions`, `users.total_coins`
- R8 (badges): `badges`, `user_badges`
- R10/R11 (UX/feedback): `notifications`
- R12/R13 (privacy/sync): `sync_queue`

