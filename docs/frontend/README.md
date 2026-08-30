# Frontend (Nexus Frontend)

A Next.js (App Router) application built with React, TypeScript, and Tailwind
CSS. It is deployed to Vercel (free tier) for hosting.

## Tech Stack

- Next.js 16 (App Router, standalone output)
- React 19, TypeScript 5
- Tailwind CSS 4
- ESLint (Next.js config)

## Project Structure

```
frontend/nexus-frontend/
├── app/
│   ├── (app)/          # Authenticated application pages
│   ├── (auth)/         # Login / register pages
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/
│   ├── auth/           # Login / register forms
│   ├── common/         # Shared UI components
│   ├── history/        # History views
│   ├── home/           # Dashboard / home view
│   ├── navigation/     # Nav / layout components
│   ├── profile/        # Profile views
│   └── workout/        # Workout tracking views
├── lib/
│   ├── api/            # API client helpers
│   ├── Interfaces/     # TypeScript interfaces
│   ├── workouts.ts     # Workout helpers
│   └── ActivityLevels.ts
├── proxy.ts            # Auth-gating middleware
├── next.config.ts      # Next.js config (standalone output)
└── package.json
```

## Features / Pages

| Path                          | Description                     |
|-------------------------------|---------------------------------|
| `/`                           | Home / dashboard                 |
| `/workout/...`                | Workout and set tracking         |
| `/history/...`                | Historical data views            |
| `/profile/...`                | User profile                     |
| `/login`, `/register`         | Authentication pages             |

## Authentication Gating (Middleware)

`proxy.ts` is a Next.js middleware that guards routes based on cookie presence:

- Users **without** an `access_token`/`refresh_token` cookie are redirected to
  `/login` when visiting protected pages.
- Users **with** a session cookie visiting `/login` or `/register` are
  redirected to `/`.

The middleware only checks for cookie presence; real validation happens in the
API's `[Authorize]` handlers.

## API Integration

The frontend talks to the backend REST API through the client in `lib/api`.
The base URL is supplied by the `NEXT_PUBLIC_API_URL` environment variable.

## Environment Variables

| Variable                | Purpose                              |
|-------------------------|--------------------------------------|
| `NEXT_PUBLIC_API_URL`   | Base URL of the Nexus API            |

## Running Locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The frontend expects the API to be running (e.g. the docker-compose stack on
port 5181) and `NEXT_PUBLIC_API_URL` set accordingly.

## Building

```bash
npm run build      # produces standalone output (configured in next.config.ts)
npm run lint
```

## Deployment (Vercel)

1. Connect the `frontend/nexus-frontend` directory to a Vercel project.
2. Set `NEXT_PUBLIC_API_URL` to the deployed API URL (or the local
   `http://localhost:5181` for development).
3. Vercel builds and serves the Next.js app on its free tier.
