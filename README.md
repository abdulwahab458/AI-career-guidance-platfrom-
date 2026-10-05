# Mentora — AI Career Guidance Platform

Mentora is a Next.js 16 application that helps users plan and improve their career journey with AI-assisted tools. It combines onboarding + industry insights, resume and cover-letter generation, interview practice, roadmap generation, and resume-to-job matching in one authenticated workspace.

## What this repository includes

### Core user flows
- **Authentication and protected app areas** using Clerk.
- **Onboarding** to capture industry, experience, bio, and skills.
- **Career dashboard** with AI-generated market insights (salary ranges, growth rate, demand level, trends, recommended skills).
- **Career roadmap builder** that creates and tracks personalized, multi-phase plans.
- **Resume builder** with markdown preview, save-to-database, and PDF export.
- **Cover letter generator** using AI prompts and markdown editing/export.
- **Interview prep** with AI-generated MCQ quizzes, scoring, saved assessments, and performance charts.
- **Job matcher** that parses PDF/DOCX/TXT resumes and compares them against a job description.

### Background processing
- **Inngest cron function** to periodically refresh stored industry insights.

## Architecture overview

- **Frontend**: Next.js App Router pages in `app/`, UI components in `components/`, Tailwind CSS + shadcn/ui.
- **Server logic**:
  - Server Actions in `actions/` for user/profile, dashboard insights, resume, cover letter, and interview logic.
  - Route Handlers in `app/api/` for roadmap generation, onboarding submission, resume save, interview generation/save, job-matcher analysis, and Inngest endpoint.
- **Database layer**: Prisma ORM with PostgreSQL schema in `prisma/schema.prisma`.
- **AI layer**: Google Gemini (`gemini-2.5-flash`) for structured JSON and content generation.
- **Auth & protection**: Clerk middleware protects `/dashboard`, `/roadmap`, `/resume`, `/cover-letter`, `/interprep`, and `/job-matcher`.

## Tech stack

- **Runtime / framework**: Next.js 16, React 19
- **Language**: JavaScript (JS/JSX)
- **Styling**: Tailwind CSS v4, shadcn/ui, Radix UI
- **Auth**: Clerk (`@clerk/nextjs`)
- **Database / ORM**: PostgreSQL + Prisma
- **AI**: Google Generative AI SDK (`@google/generative-ai`)
- **Background jobs**: Inngest
- **Validation / forms**: Zod, React Hook Form
- **Charts**: Recharts
- **Document utilities**: jsPDF, marked, mammoth, pdf-parse

## Prerequisites

- Node.js (current LTS recommended)
- npm (repo includes `package-lock.json`)
- PostgreSQL database accessible via connection string
- Clerk application credentials
- Google Gemini API key

## Environment variables

Create a `.env.local` file in the repository root.

Required by this codebase:

- `DATABASE_URL` — PostgreSQL connection string for Prisma
- `GEMINI_API_KEY` — used by AI generation in actions/routes

Required for Clerk integration (`@clerk/nextjs`):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

If you use additional Clerk options (URLs, redirect settings, etc.), set them per your Clerk project configuration.

## Installation

```bash
npm install
```

> `postinstall` runs `prisma generate` automatically.

## Development

Start the app locally:

```bash
npm run dev
```

Default local URL: `http://localhost:3000`

### Useful commands

```bash
npm run lint      # ESLint (Next core-web-vitals config)
npm run build     # Production build (Next + Turbopack)
npm run start     # Run built app
```

### Prisma workflow (when schema changes)

```bash
npx prisma migrate dev
npx prisma generate
```

## Testing status

There is currently **no test script** defined in `package.json`.

## Build and deployment

- Build with `npm run build`
- Run production server with `npm run start`
- The repo does not include platform-specific deployment/IaC configuration; deploy as a standard Next.js app with required environment variables and database access.

## Project structure

```text
app/                  # App Router pages, layouts, and API route handlers
actions/              # Server Actions for app features
components/           # Reusable UI and feature components
data/                 # Static app data (industries, homepage feature metadata)
lib/                  # Shared helpers (Prisma client, Gemini wrapper, Inngest client/functions, utils)
prisma/               # Prisma schema and migrations
public/               # Static assets
middleware.js         # Clerk auth middleware + route protection
```

## Contributing

No dedicated contribution guide is present in this repository. If you plan to contribute, open an issue or pull request and follow the existing project patterns.

## License

No license file is present in this repository.
