# Sasantha Portfolio

Next.js App Router portfolio with a Supabase-backed Projects CMS and protected `/admin` dashboard.

## Environment Variables

Create `.env.local` with:

```env
DATABASE_URL=postgresql://...pooled-connection...
ADMIN_PASSWORD=your_admin_password
AUTH_SECRET=long_random_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## Database Setup

```bash
npm run db:seed
```

## Run Locally

```bash
npm i
npm run dev
```

## Admin CMS

- `/admin/login` for password login
- `/admin` dashboard list
- `/admin/projects/new` create
- `/admin/projects/[id]/edit` edit/delete

## Vercel Environment Setup

Set these variables in Vercel Project Settings:

- `DATABASE_URL` -> Supabase pooled connection string (runtime)
- `ADMIN_PASSWORD` -> admin login password
- `AUTH_SECRET` -> long random secret used for signed cookie token
- `NEXT_PUBLIC_SITE_URL` -> production URL (`https://sasantha-portfolio.vercel.app`)
- `NEXT_PUBLIC_SUPABASE_URL` -> `https://<project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` -> Supabase service role key (server-side only)

## Supabase RLS Policies

Apply policy SQL from:

- `supabase/rls-projects.sql`

How to apply:

1. Open Supabase dashboard -> SQL Editor.
2. Paste `supabase/rls-projects.sql`.
3. Run the query.

What it does:

- Enables RLS on the projects table (`Project` or `projects`).
- Allows public read (`SELECT`) for `anon` and `authenticated`.
- Does not allow public writes (no INSERT/UPDATE/DELETE policies for anon/authenticated).

Write operations should happen only through server routes using `SUPABASE_SERVICE_ROLE_KEY`.
