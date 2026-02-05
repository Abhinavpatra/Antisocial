## TimerApp database schema

- **Source of truth**: `schema.sql`
- **How to apply**: open Supabase → **SQL Editor** → paste `schema.sql` → run.

### Notes

- The backend reads `DATABASE_URL` from environment variables.
- Supabase Postgres typically requires SSL; `backend/lib/db.ts` enables SSL with `rejectUnauthorized: false`.

