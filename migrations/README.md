# Database Migrations

This folder contains SQL migration files for the database schema.

## Migration Naming Convention
```
001_create_user_profiles_table.sql
002_add_user_preferences.sql
003_create_posts_table.sql
```

## How to Run Migrations

1. **Via Supabase Dashboard:**
   - Go to SQL Editor
   - Copy and paste the migration content
   - Run the SQL

2. **Via Supabase CLI (future):**
   ```bash
   supabase db reset
   ```

## Migration History

- `001_create_user_profiles_table.sql` - Initial user profiles table for NextAuth integration

## Notes

- Always backup your database before running migrations in production
- Test migrations in development first
- Each migration should be idempotent (safe to run multiple times)
