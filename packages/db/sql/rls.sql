-- Inkprint — Row-Level Security policies
--
-- The app sets `app.user_id` per request via `set_config('app.user_id', '<uuid>', true)`.
-- Policies derive teacher ownership from that setting.
-- Admin paths use the owner role (DATABASE_URL) which has BYPASSRLS on Neon.
-- Regular app traffic uses the `inkprint_app` role (APP_DATABASE_URL) which does not.
--
-- This file is idempotent — safe to re-apply after schema migrations.

create or replace function current_user_id() returns uuid
  language sql stable as $$
    select nullif(current_setting('app.user_id', true), '')::uuid
  $$;

alter table classes        enable row level security;
alter table classes        force  row level security;
alter table students       enable row level security;
alter table students       force  row level security;
alter table submissions    enable row level security;
alter table submissions    force  row level security;
alter table process_traces enable row level security;
alter table process_traces force  row level security;
alter table analyses       enable row level security;
alter table analyses       force  row level security;

drop policy if exists classes_owner_all on classes;
create policy classes_owner_all on classes
  for all
  using (teacher_id = current_user_id())
  with check (teacher_id = current_user_id());

drop policy if exists students_owner_all on students;
create policy students_owner_all on students
  for all
  using (exists (
    select 1 from classes c where c.id = students.class_id and c.teacher_id = current_user_id()
  ))
  with check (exists (
    select 1 from classes c where c.id = students.class_id and c.teacher_id = current_user_id()
  ));

drop policy if exists submissions_owner_all on submissions;
create policy submissions_owner_all on submissions
  for all
  using (exists (
    select 1 from students s
    join classes c on c.id = s.class_id
    where s.id = submissions.student_id and c.teacher_id = current_user_id()
  ))
  with check (exists (
    select 1 from students s
    join classes c on c.id = s.class_id
    where s.id = submissions.student_id and c.teacher_id = current_user_id()
  ));

drop policy if exists process_traces_owner_all on process_traces;
create policy process_traces_owner_all on process_traces
  for all
  using (exists (
    select 1 from submissions sub
    join students s on s.id = sub.student_id
    join classes c on c.id = s.class_id
    where sub.id = process_traces.submission_id and c.teacher_id = current_user_id()
  ))
  with check (exists (
    select 1 from submissions sub
    join students s on s.id = sub.student_id
    join classes c on c.id = s.class_id
    where sub.id = process_traces.submission_id and c.teacher_id = current_user_id()
  ));

drop policy if exists analyses_owner_all on analyses;
create policy analyses_owner_all on analyses
  for all
  using (exists (
    select 1 from submissions sub
    join students s on s.id = sub.student_id
    join classes c on c.id = s.class_id
    where sub.id = analyses.submission_id and c.teacher_id = current_user_id()
  ))
  with check (exists (
    select 1 from submissions sub
    join students s on s.id = sub.student_id
    join classes c on c.id = s.class_id
    where sub.id = analyses.submission_id and c.teacher_id = current_user_id()
  ));
