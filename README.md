# Job Application Tracker

A full-stack job application tracking app built with Next.js, TypeScript, PostgreSQL, Prisma, and NextAuth.

## What It Does

- Sign in with a seeded demo user.
- Create, view, edit, archive, and delete job applications.
- Track status changes with history.
- Search and filter applications.
- View dashboard counts by status.

## Local Setup

1. Copy `.env.example` to `.env`.
2. Update `DATABASE_URL` if your PostgreSQL credentials are different.
3. Install dependencies with `npm install`.
4. Start PostgreSQL locally. If you use Docker, run `docker compose up -d`.
5. Run `npm run prisma:migrate -- --name init`.
6. Run `npm run db:seed`.
7. Run `npm run dev`.
8. Sign in with `demo@example.com` and `password123`.

## Testing

- Run unit tests with `npm test`.
- Run browser flow tests with `npm run test:e2e`.
- Run the full test suite with `npm run test:all`.
- End-to-end tests require PostgreSQL to be running and the schema to be migrated.
- GitHub Actions runs migrations, unit tests, production build, and browser tests on pushes and pull requests.

## Deployment

This app needs a Node.js host plus a PostgreSQL database. The simplest setup is Vercel for the Next.js app and Neon, Supabase, Railway, or Render PostgreSQL for the database.

### Required Environment Variables

- `DATABASE_URL`: production PostgreSQL connection string.
- `NEXTAUTH_SECRET`: long random secret. Generate one with `openssl rand -base64 32`.
- `NEXTAUTH_URL`: deployed app URL, for example `https://your-app.vercel.app`.

### Vercel + Hosted PostgreSQL

1. Push the repository to GitHub.
2. Create a PostgreSQL database with Neon, Supabase, Railway, or Render.
3. In Vercel, import the GitHub repository as a Next.js project.
4. Add the required environment variables in Vercel project settings.
5. Keep the default build command: `npm run build`.
6. Deploy the app.
7. Apply production migrations from your machine or CI:

   ```bash
   DATABASE_URL="your-production-database-url" npx prisma migrate deploy
   ```

8. Optional: seed a demo user in production only if you want demo credentials available:

   ```bash
   DATABASE_URL="your-production-database-url" npm run db:seed
   ```

### Generic Node Host

- Install command: `npm ci`
- Build command: `npm run build`
- Start command: `npm start`
- Before starting the production app for the first time, run `npx prisma migrate deploy`.
- Use Node.js 24 to match the GitHub Actions workflow, or configure the host to a supported current Node.js LTS version.

## Technical Highlights

- Authenticated user-owned data.
- Relational data modeling with application status history.
- Type-safe database access through Prisma.
- Server-side validation before database writes.
- Reusable create/edit form flow.
- Protected routes and server actions.
