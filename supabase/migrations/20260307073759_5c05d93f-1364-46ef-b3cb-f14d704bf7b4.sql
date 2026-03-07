CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  assignee_name TEXT,
  assignee_avatar TEXT,
  due_date DATE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tasks (title, category, status, priority, assignee_name, due_date, position) VALUES
  ('Design landing page wireframes', 'Design', 'todo', 'high', 'Anna Taylor', '2026-03-15', 0),
  ('Set up CI/CD pipeline', 'DevOps', 'todo', 'medium', 'Marcus Chen', '2026-03-18', 1),
  ('Write API documentation', 'Documentation', 'todo', 'low', 'Sarah Kim', '2026-03-20', 2),
  ('Implement user authentication', 'Development', 'in_progress', 'high', 'Jake Rivera', '2026-03-12', 0),
  ('Create social media assets', 'Design', 'in_progress', 'medium', 'Lena Park', '2026-03-14', 1),
  ('Deploy staging environment', 'DevOps', 'done', 'high', 'Marcus Chen', '2026-03-10', 0),
  ('Design system components', 'Design', 'done', 'medium', 'Anna Taylor', '2026-03-08', 1);