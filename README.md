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

## Technical Highlights

- Authenticated user-owned data.
- Relational data modeling with application status history.
- Type-safe database access through Prisma.
- Server-side validation before database writes.
- Reusable create/edit form flow.
- Protected routes and server actions.
