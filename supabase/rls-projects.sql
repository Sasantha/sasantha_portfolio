-- RLS policies for portfolio projects table.
-- This script is idempotent and supports either:
--   public."Project"  (Prisma-style quoted table)
--   public.projects   (lowercase table)

do $$
declare
  target_table text;
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'Project'
  ) then
    target_table := '"Project"';
  elsif exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'projects'
  ) then
    target_table := 'projects';
  else
    raise exception 'Neither public."Project" nor public.projects exists.';
  end if;

  execute format('alter table public.%s enable row level security', target_table);

  execute format('drop policy if exists public_read_projects on public.%s', target_table);
  execute format(
    'create policy public_read_projects on public.%s for select to anon, authenticated using (true)',
    target_table
  );

  -- No write policies for anon/authenticated are created.
  -- With RLS enabled, INSERT/UPDATE/DELETE are denied by default for non-service-role users.
end $$;

