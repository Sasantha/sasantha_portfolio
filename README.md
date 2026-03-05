# Sasantha Portfolio

Next.js App Router portfolio with a PostgreSQL-backed Projects CMS (Supabase + Prisma) and protected `/admin` dashboard.

## Environment Variables

Create `.env.local` with:

```env
DATABASE_URL=postgresql://...pooled-connection...
DIRECT_URL=postgresql://...direct-connection...
ADMIN_PASSWORD=your_admin_password
AUTH_SECRET=long_random_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Setup

```bash
npx prisma migrate dev
npm run db:seed
```

If your managed Postgres provider blocks shadow DB creation in `migrate dev`, use:

```bash
npx prisma db push
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
- `DIRECT_URL` -> Supabase direct connection string (migrations/CLI)
- `ADMIN_PASSWORD` -> admin login password
- `AUTH_SECRET` -> long random secret used for signed cookie token
- `NEXT_PUBLIC_SITE_URL` -> production URL (`https://sasantha-portfolio.vercel.app`)
