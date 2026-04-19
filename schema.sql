-- =============================================
-- הרץ את זה ב-Supabase → SQL Editor
-- =============================================

CREATE TABLE clients (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT    NOT NULL,
  token       TEXT    UNIQUE NOT NULL,
  goals       JSONB   DEFAULT '{"calories":2000,"protein":150,"carbs":200,"fat":65}'::jsonb,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE food_log (
  id              UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id       UUID    NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date            DATE    NOT NULL DEFAULT CURRENT_DATE,
  food_name       TEXT    NOT NULL,
  food_id         TEXT,
  meal            TEXT    NOT NULL,
  grams_consumed  NUMERIC,
  display_qty     TEXT,
  calories        INTEGER DEFAULT 0,
  protein         NUMERIC DEFAULT 0,
  carbs           NUMERIC DEFAULT 0,
  fat             NUMERIC DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_food_log_client_date ON food_log(client_id, date);

-- RLS: גישה חופשית דרך ה-anon key (האבטחה היא דרך ה-token הייחודי)
ALTER TABLE clients  ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_clients"  ON clients  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_food_log" ON food_log FOR ALL USING (true) WITH CHECK (true);
