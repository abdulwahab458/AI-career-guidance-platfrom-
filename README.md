# Mentora

Mentora is an AI-powered career guidance platform. It helps users understand an industry, plan their next career move, prepare application materials, practice interviews, and compare a resume with a job description.

## Features

- Clerk authentication with protected workspace routes
- Industry dashboard with AI-generated market insights
- Personalized career roadmaps
- Resume builder and AI resume improvement
- Cover-letter generation and saved cover letters
- Interview preparation quizzes and saved results
- Resume/job-description matching
- Responsive landing page and application workspace
- PostgreSQL persistence through Prisma
- Google Gemini integration for structured AI responses
- Inngest integration for background/event-driven workflows

## Technology

- **Framework:** Next.js App Router
- **Language:** JavaScript and JSX
- **UI:** React, Tailwind CSS, Radix UI, Lucide React
- **Animation:** Motion
- **Authentication:** Clerk
- **Database:** PostgreSQL
- **ORM:** Prisma
- **AI:** Google Gemini
- **Notifications:** Sonner
- **Validation:** Zod

## Prerequisites

Install the following before running the project:

- Node.js 20 or newer
- npm
- A PostgreSQL database
- A Clerk application
- A Google Gemini API key

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd ai-career
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
   GEMINI_API_KEY="your-gemini-api-key"

   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   ```

   Configure the Clerk sign-in and sign-up URLs in the Clerk dashboard if your Clerk application requires them.

4. Generate the Prisma client and apply migrations:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate the Prisma client |
| `npx prisma migrate dev` | Create and apply a development migration |
| `npx prisma migrate deploy` | Apply existing migrations |
| `npx prisma studio` | Open Prisma Studio |

## Application Routes

### Public routes

- `/` - Marketing landing page
- `/sign-in` - Clerk sign-in
- `/sign-up` - Clerk sign-up
- `/interprep/mock` - Interview mock page

### Protected routes

These routes require an authenticated Clerk user:

- `/dashboard` - Industry insights and performance overview
- `/onboarding` - User profile setup
- `/roadmap` - Career roadmap generation and review
- `/resume` - Resume builder and improvement
- `/cover-letter` - Saved cover letters
- `/cover-letter/[id]` - Individual cover letter
- `/interprep` - Interview preparation
- `/job-matcher` - Resume and job-description comparison

Authentication is enforced by [`middleware.js`](./middleware.js).

## API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `POST /api/onboarding` | Create or update onboarding profile data |
| `POST /api/roadmap` | Generate or save a career roadmap |
| `POST /api/resume/save` | Save resume content |
| `POST /api/resume/improve` | Improve resume content with AI |
| `POST /api/coverletter/generate` | Generate a cover letter |
| `POST /api/interview/generate` | Generate interview questions |
| `POST /api/interview/save` | Save interview results |
| `POST /api/job-matcher/analyze` | Analyze a resume against a job description |
| `POST /api/inngest` | Receive Inngest events and function requests |

Most application data endpoints require Clerk authentication. AI endpoints also require `GEMINI_API_KEY`, and database-backed endpoints require `DATABASE_URL`.

## Project Structure

```text
app/                 Next.js routes, pages, layouts, and API handlers
actions/             Server actions for dashboard, resume, interview, and letters
components/          Shared UI, application shell, landing page, and form components
data/                Static industry and feature data
lib/                 Prisma, Gemini, authentication, Inngest, and utility helpers
prisma/              Prisma schema and database migrations
public/              Static assets
middleware.js        Clerk authentication and protected-route middleware
```

## Database

The Prisma schema is in [`prisma/schema.prisma`](./prisma/schema.prisma). The main models are:

- `User`
- `Assessment`
- `Resume`
- `CoverLetter`
- `CareerRoadmap`
- `IndustryInsights`

After changing the schema during development:

```bash
npx prisma migrate dev --name describe-your-change
npx prisma generate
```

Do not commit `.env` files or API keys. Use environment variables in local development and deployment environments.

## Production Build

Run the same checks used before deployment:

```bash
npm run lint
npm run build
npm run start
```

The project currently uses Next.js 16. The Next.js build may report a deprecation warning for the `middleware.js` filename; this is a warning rather than a compilation failure.

## Troubleshooting

### Database connection errors

Verify that `DATABASE_URL` is present, correctly formatted, and points to a reachable PostgreSQL instance. For hosted databases, include the required SSL parameters.

### Authentication errors

Verify both Clerk keys are present and that the configured Clerk instance matches the current environment. Check the protected route patterns in [`middleware.js`](./middleware.js).

### AI generation errors

Verify `GEMINI_API_KEY` is valid and available to the server. Gemini generation expects JSON responses for the structured generation helpers.

### Stale browser or hydration errors

Restart the development server and refresh the browser with `Ctrl+Shift+R`. Avoid rendering browser-only values such as `window`, `localStorage`, or changing timestamps during the initial server render.

## License

No license has been specified for this project yet.
