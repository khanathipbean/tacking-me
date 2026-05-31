-- ============================================================
-- TaskFlow Seed Data
-- Description: Example data for development and testing
-- Note: Run AFTER creating a user via Supabase Auth
-- Replace <USER_ID> with actual auth.users UUID
-- ============================================================

-- ============================================================
-- HOW TO USE:
-- 1. Create a user via Supabase Auth (sign up in your app)
-- 2. Get the user's UUID from auth.users table
-- 3. Replace all '<USER_ID>' below with that UUID
-- 4. Run this SQL in Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
  v_project_1 UUID := gen_random_uuid();
  v_project_2 UUID := gen_random_uuid();
  v_cat_frontend UUID := gen_random_uuid();
  v_cat_backend UUID := gen_random_uuid();
  v_cat_design UUID := gen_random_uuid();
  v_cat_marketing UUID := gen_random_uuid();
BEGIN
  -- Get the first user (for development only)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please sign up first.';
  END IF;

  -- ========================================================
  -- PROJECTS
  -- ========================================================
  INSERT INTO projects (id, user_id, name, description, color, status) VALUES
  (v_project_1, v_user_id, 'TaskFlow App', 'Main web application for task management', '#6366f1', 'ACTIVE'),
  (v_project_2, v_user_id, 'Marketing Website', 'Landing page and marketing site', '#f59e0b', 'ACTIVE');

  -- ========================================================
  -- CATEGORIES
  -- ========================================================
  INSERT INTO categories (id, user_id, project_id, name, description) VALUES
  (v_cat_frontend, v_user_id, v_project_1, 'Frontend', 'UI components and pages'),
  (v_cat_backend, v_user_id, v_project_1, 'Backend', 'API and database work'),
  (v_cat_design, v_user_id, v_project_1, 'Design', 'UI/UX design tasks'),
  (v_cat_marketing, v_user_id, v_project_2, 'Content', 'Blog posts and copy');

  -- ========================================================
  -- TASKS
  -- ========================================================
  INSERT INTO tasks (user_id, project_id, category_id, title, description, priority, status, start_date, end_date) VALUES
  -- TaskFlow App - Frontend
  (v_user_id, v_project_1, v_cat_frontend, 'Setup project structure', 'Initialize Next.js with TypeScript and Tailwind', 'HIGH', 'DONE', '2026-05-01', '2026-05-03'),
  (v_user_id, v_project_1, v_cat_frontend, 'Create dashboard layout', 'Build responsive sidebar and main content area', 'HIGH', 'DONE', '2026-05-04', '2026-05-06'),
  (v_user_id, v_project_1, v_cat_frontend, 'Build task table view', 'Implement TanStack Table with sorting and filtering', 'MEDIUM', 'IN_PROGRESS', '2026-05-07', '2026-05-12'),
  (v_user_id, v_project_1, v_cat_frontend, 'Implement Kanban board', 'Drag and drop task board using dnd-kit', 'MEDIUM', 'DRAFT', '2026-05-13', '2026-05-18'),
  (v_user_id, v_project_1, v_cat_frontend, 'Add calendar view', 'Calendar component showing task deadlines', 'LOW', 'DRAFT', '2026-05-19', '2026-05-23'),

  -- TaskFlow App - Backend
  (v_user_id, v_project_1, v_cat_backend, 'Design database schema', 'Create tables, indexes, and RLS policies', 'URGENT', 'DONE', '2026-05-01', '2026-05-02'),
  (v_user_id, v_project_1, v_cat_backend, 'Implement authentication', 'Setup Supabase Auth with email/password', 'HIGH', 'IN_PROGRESS', '2026-05-03', '2026-05-05'),
  (v_user_id, v_project_1, v_cat_backend, 'Create CRUD operations', 'Build service layer for projects and tasks', 'HIGH', 'DRAFT', '2026-05-06', '2026-05-10'),

  -- TaskFlow App - Design
  (v_user_id, v_project_1, v_cat_design, 'Design system setup', 'Define colors, typography, and components', 'MEDIUM', 'DONE', '2026-05-01', '2026-05-02'),
  (v_user_id, v_project_1, v_cat_design, 'Dashboard wireframe', 'Create wireframe for main dashboard', 'LOW', 'IN_PROGRESS', '2026-05-03', '2026-05-05'),

  -- Marketing Website
  (v_user_id, v_project_2, v_cat_marketing, 'Write landing page copy', 'Hero section and feature descriptions', 'MEDIUM', 'DRAFT', '2026-06-01', '2026-06-05'),
  (v_user_id, v_project_2, v_cat_marketing, 'Create blog post', 'Introduction article about TaskFlow', 'LOW', 'DRAFT', '2026-06-06', '2026-06-10'),
  (v_user_id, v_project_2, NULL, 'Setup analytics', 'Integrate Plausible or similar', 'LOW', 'DRAFT', NULL, NULL);

END $$;
