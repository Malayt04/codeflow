# CodeFlow

CodeFlow is an AI-powered development platform that allows users to create, preview, and manage web projects using natural language prompts. Built with Next.js, Clerk authentication, Prisma, TRPC, and a modern UI, CodeFlow enables you to describe your ideas in plain English and watch them come to life instantly.

https://github.com/user-attachments/assets/47a6d01c-13d5-4b58-bdb3-4a079c10a341


## Features

- **AI-Powered Project Generation:** Describe your project in natural language and let the AI generate code and project structure for you.
- **Live Preview & Sandbox:** Instantly preview your generated projects in a secure, isolated environment.
- **Modern UI:** Beautiful, responsive design using Tailwind CSS and Shadcn UI components.
- **Project Management:** View, edit, and manage multiple projects with a clean dashboard.
- **Authentication:** Secure sign-in and sign-up with Clerk.
- **Pricing Plans:** Flexible pricing with a free tier and paid options.
- **Dark/Light Theme:** Seamless theme switching across the entire app.
- **Collaboration Ready:** Built for teams and individuals alike.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Clerk** (Authentication & Pricing Table)
- **Prisma** (PostgreSQL ORM)
- **TRPC** (Type-safe API)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/codeflow.git
   cd codeflow
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (database URL, Clerk keys, OpenAI key, etc.)
4. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Folder Structure

- `src/app/` - Next.js app directory (pages, layouts, API routes)
- `src/components/ui/` - Reusable UI components (Shadcn)
- `src/modules/` - Feature modules (projects, messages, etc.)
- `src/trpc/` - TRPC client and server setup
- `prisma/` - Prisma schema and migrations

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

