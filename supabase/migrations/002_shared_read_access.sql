-- ============================================================
-- Update RLS policies: Allow all authenticated users to read all data
-- ============================================================

-- Projects: allow all authenticated users to SELECT
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  USING (auth.role() = 'authenticated');

-- Categories: allow all authenticated users to SELECT
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
CREATE POLICY "Authenticated users can view all categories"
  ON categories FOR SELECT
  USING (auth.role() = 'authenticated');

-- Tasks: allow all authenticated users to SELECT
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
CREATE POLICY "Authenticated users can view all tasks"
  ON tasks FOR SELECT
  USING (auth.role() = 'authenticated');

-- Profiles: allow all authenticated users to SELECT
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- Notes: allow all authenticated users to SELECT (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notes') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Users can view own notes" ON notes';
    EXECUTE 'CREATE POLICY "Authenticated users can view all notes" ON notes FOR SELECT USING (auth.role() = ''authenticated'')';
  END IF;
END $$;
