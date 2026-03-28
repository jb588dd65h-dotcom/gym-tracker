-- Gym Tracker Database Schema

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
  ordre INT NOT NULL
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise_id ON workout_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_session_date ON workout_logs(session_date);

-- Enable Row Level Security
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: allow all operations for anon role (personal app)
CREATE POLICY "Allow all for anon on exercises"
  ON exercises
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all for anon on workout_logs"
  ON workout_logs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
