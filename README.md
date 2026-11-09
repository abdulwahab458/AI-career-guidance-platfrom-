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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More about this

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
