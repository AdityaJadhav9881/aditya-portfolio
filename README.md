# Aditya Jadhav — Infinity Design Portfolio

A fully database-driven, authenticated CMS portfolio built with Next.js 16, Prisma, and PostgreSQL.

## Tech Stack

- **Framework:** Next.js 16.3.2 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon) via Prisma 7.9.1
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 13.1.1
- **Storage:** Supabase Storage (primary) / Cloudflare R2 / Local fallback
- **Auth:** HMAC-signed session cookies with scrypt password hashing

## Prerequisites

- Node.js 18+
- npm
- PostgreSQL database (e.g. [Neon](https://neon.tech))

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (with `?sslmode=require`) |
| `AUTH_SECRET` | Yes | Random secret for session signing (generate with `openssl rand -hex 32`) |
| `SUPABASE_URL` | Yes | Supabase project URL (for media storage) |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 account ID (fallback storage) |
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_PUBLIC_URL` | No | R2 public URL |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO (defaults to `http://localhost:3000`) |

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed the database
npx prisma db seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

1. Navigate to `/admin`
2. First visit: go to `/admin/setup` to create the owner account
3. Login with your credentials
4. Admin panel is fully mobile-friendly

### Default seed credentials

- **Email:** adityajadhav0167@gmail.com
- **Password:** admin123

## Database

### Schema

15 models covering: Projects, Skills, Skill Groups, Research, Achievements, Journey, Media, Sections, Relationships (Project↔Skill, Project↔Research, Project↔Achievement, Project↔Project), Site Settings, Admin Users.

### Migrations

```bash
# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate
```

### Seed

```bash
npx prisma db seed
```

Seed data includes 5 sample projects, skill groups, research entries, achievements, journey entries, and site settings.

## Media Storage

Priority: **Supabase Storage** > Cloudflare R2 > Local filesystem

- Upload via `/admin/media`
- Supported types: JPEG, PNG, GIF, WebP, SVG, MP4, WebM, PDF
- Max file size: 20MB
- Images are proxied through `/api/images` for cross-origin compatibility
- **Supabase bucket name:** `media` (set `SUPABASE_BUCKET` env var if different)

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --yes --prod
```

### Vercel Environment Variables

Set these in Vercel dashboard or via CLI (on the `aditya-portfolio` project):

```bash
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```

## Project Structure

```
src/
├── app/
│   ├── admin/           # CMS admin panel (35+ routes)
│   │   ├── actions/     # Server actions (CRUD)
│   │   ├── components/  # Admin UI components
│   │   ├── media/       # Media library
│   │   ├── projects/    # Project editor (8 tabs)
│   │   ├── settings/    # Site settings
│   │   └── page.tsx     # Dashboard
│   ├── api/             # API routes
│   │   ├── images/      # Image proxy
│   │   ├── upload/      # File upload
│   │   └── auth/        # Authentication
│   ├── projects/        # Public project pages
│   ├── skills/          # Public skills pages
│   └── ...              # Other public pages
├── components/          # Shared UI components
├── lib/                 # Utilities (auth, db, storage)
├── sections/            # Homepage sections
└── proxy.ts             # Auth proxy (replaces middleware)
```

## Key Features

- **No-code project creation** — add projects from your phone
- **8-tab project editor** — Basic, Story, Technical, Sections, Media, Links, Settings, SEO
- **Section visibility** — toggle any project section on/off
- **Homepage control** — per-project homepage visibility + per-section toggles
- **Draft/Preview/Publish** — full content workflow
- **Media library** — search, filter, edit, assign to projects
- **Relationships** — Skills, Research, Achievements, Related Projects
- **SEO** — OG images, canonical URLs, Twitter cards
- **Mobile-first admin** — touch-friendly, works on phones
- **Image proxy** — cross-origin compatible image loading

## License

Private — Aditya Jadhav
