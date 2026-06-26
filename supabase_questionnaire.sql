-- Questionnaire answers table for workspace
CREATE TABLE IF NOT EXISTS public.questionnaire_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  answer text DEFAULT '',
  note text DEFAULT '',
  status text NOT NULL DEFAULT 'unanswered'
    CHECK (status IN ('unanswered', 'draft', 'completed')),
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, question_id)
);

ALTER TABLE public.questionnaire_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members can read answers"
  ON public.questionnaire_answers FOR SELECT
  USING (public.is_project_member(project_id));

CREATE POLICY "members can insert answers"
  ON public.questionnaire_answers FOR INSERT
  WITH CHECK (public.is_project_member(project_id));

CREATE POLICY "members can update answers"
  ON public.questionnaire_answers FOR UPDATE
  USING (public.is_project_member(project_id));
