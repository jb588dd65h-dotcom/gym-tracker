-- Gym Tracker Database Schema
-- Run this in the Supabase SQL editor to set up the schema from scratch.

-- Exercises table
CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  jour TEXT NOT NULL,
  groupe_musculaire TEXT NOT NULL,
  exercice TEXT NOT NULL,
  poids_initial NUMERIC NOT NULL,
  serie1_reps_cible INT NOT NULL,
  serie2_reps_cible INT NOT NULL,
  serie3_reps_cible INT NOT NULL,
  repos TEXT,
  ordre INT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Workout logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id SERIAL PRIMARY KEY,
  session_date DATE NOT NULL,
  exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  poids NUMERIC NOT NULL,
  serie1_reps INT,
  serie2_reps INT,
  serie3_reps INT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise_id ON workout_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_session_date ON workout_logs(session_date);
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user_id ON workout_logs(user_id);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Drop old open policies if they exist
DROP POLICY IF EXISTS "Allow all for anon on exercises" ON exercises;
DROP POLICY IF EXISTS "Allow all for anon on workout_logs" ON workout_logs;
DROP POLICY IF EXISTS "Public read exercises" ON exercises;
DROP POLICY IF EXISTS "Public write exercises" ON exercises;
DROP POLICY IF EXISTS "Public read logs" ON workout_logs;
DROP POLICY IF EXISTS "Public write logs" ON workout_logs;
DROP POLICY IF EXISTS "Public update logs" ON workout_logs;

-- RLS Policies: each user can only access their own data
CREATE POLICY "Users read own exercises"   ON exercises FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own exercises" ON exercises FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own exercises" ON exercises FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own exercises" ON exercises FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users read own logs"   ON workout_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own logs" ON workout_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own logs" ON workout_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own logs" ON workout_logs FOR DELETE USING (auth.uid() = user_id);

-- ── Migration: add user_id to existing tables ─────────────────────────────
-- If your tables already exist without user_id, run these instead:
--
-- ALTER TABLE exercises ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- Then drop old policies and create the new ones above.

-- ── Account deletion function ─────────────────────────────────────────────
-- Allows a user to delete their own auth.users record (SECURITY DEFINER runs as DB owner)
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
