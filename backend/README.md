# KrushiMitr Backend

This backend is built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Setup

1. Install dependencies:

```bash
cd backend
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` values:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (optional)

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run Prisma migrations:

```bash
npm run prisma:migrate -- --name init
```

## Run

- Development:

```bash
npm run dev
```

- Build:

```bash
npm run build
```

- Start:

```bash
npm start
```

## API Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/profile`
- `POST /api/analysis`
- `GET /api/analysis`
- `GET /api/analysis/:id`
- `DELETE /api/analysis/:id`
- `GET /api/reports`
- `GET /api/reports/:id`

## Notes

- JWT auth is stubbed in `src/middleware/auth.ts`.
- Image upload middleware is configured for `jpg`, `png`, and `webp` with a 5MB limit.
- Prisma is configured for PostgreSQL using the Prisma v7 adapter model.
