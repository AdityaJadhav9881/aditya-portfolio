# Aditya Jadhav — Infinity Design Portfolio

A fully database-driven, authenticated CMS portfolio built with Next.js 16, Prisma, and PostgreSQL.

**Last updated:** 2026-11-20 (docs aligned with commit `7ed863f`+)

## Tech Stack

- **Framework:** Next.js 16.3.2 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon) via Prisma 7.9.1
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion 13.1.1
- **Storage:** Supabase Storage (primary) / Cloudflare R2 / Local fallback
- **Auth:** HMAC-signed session cookies with scrypt password hashing + login rate limiting

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
| `SUPABASE_BUCKET` | No | Bucket name (defaults to `media`) |
| `ADMIN_EMAIL` | Seed | Admin email used by `prisma/seed` (or create via `/admin/setup`) |
| `ADMIN_PASSWORD` | Seed | Admin password for seed (setup route requires min 8 chars) |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 account ID (fallback storage) |
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_PUBLIC_URL` | No | R2 public URL |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO (defaults to `http://localhost:3000`) |

**Do not commit real credentials.** Docs reference env vars only.

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your database URL and secrets

# 3. Run database migrations (raw SQL runner, idempotent)
npm run db:migrate

# 4. Seed the database (idempotent)
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint    # ESLint
npm run build   # prisma generate && next build (run before push)
```

## Admin Access

1. Navigate to `/admin`
2. First visit: go to `/admin/setup` to create the owner account (password min 8 chars)
3. Login with your credentials
4. Admin panel is fully mobile-friendly
5. Public nav/footer are hidden on `/admin*` (`SiteChrome`)
6. Login is rate-limited (5 failures / 15 minutes / IP)

### Seed credentials

- **Email:** `ADMIN_EMAIL` env var (or `/admin/setup`)
- **Password:** `ADMIN_PASSWORD` env var (or `/admin/setup`)

## Database

### Schema

15 models covering: Projects, Skills, Skill Groups, Research, Achievements, Journey, Media, Sections, Relationships (Project↔Skill, Project↔Research, Project↔Achievement, Project↔Project), Site Settings, Admin Users.

### Migrations

```bash
# Apply raw SQL migrations (AchievementProject, Achievement.event/organization, etc.)
npm run db:migrate
# or
node prisma/migrate.js

# Generate Prisma Client
npx prisma generate
```

> Prisma 7: `prisma.config.ts` must only contain `schema`. Do not put `url` in `schema.prisma`.

### Seed

```bash
npm run db:seed
# runs: node --import tsx prisma/seed.ts
```

Seed data is **idempotent**: 5 sample projects, skill groups, research, achievements, journey, site settings. Admin comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Media Storage

Priority: **Supabase Storage** > Cloudflare R2 > Local filesystem

- Upload via `/admin/media` (multi-file supported)
- Supported types: JPEG, PNG, GIF, WebP, SVG, MP4, WebM, PDF, **APK**
- Max file size: 20MB
- Images are proxied through `/api/images` (`mediaSrc()` helper) for cross-origin / Edge compatibility
- Proxy **host allowlist**: only Supabase and R2 hosts (SSRF protection)
- Download force: `/api/images?url=...&download=1`
- Public gallery: images inline, video player, PDF card + **Download PDF**, APK card + **Download APK**
- **Supabase bucket name:** `media` (set `SUPABASE_BUCKET` if different)

## SEO

- Root metadata from SiteSettings (`siteTitle`, `siteDescription`, `ogImage`) via `generateMetadata`
- Dynamic OG images: `GET /api/og?title=...&subtitle=...`
- Project pages use `seoTitle` / `seoDescription` or fall back to name + one-liner

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Link to the correct project (there are two; use aditya-portfolio)
vercel link --project aditya-portfolio

# Deploy (requires vercel login or VERCEL_TOKEN)
vercel --yes --prod

# Or push to GitHub if Vercel Git integration is connected
git push origin master
```

### Vercel Environment Variables

Set these in Vercel dashboard or via CLI (on the `aditya-portfolio` project — **not** `portfolio`):

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
│   │   ├── actions/     # Server actions (CRUD, form helpers)
│   │   ├── components/  # Admin UI components
│   │   ├── media/       # Media library
│   │   ├── projects/    # Project editor (8 tabs)
│   │   ├── settings/    # Site settings
│   │   └── page.tsx     # Dashboard
│   ├── api/
│   │   ├── auth/        # login (rate-limited), logout, me
│   │   ├── images/      # Media proxy + allowlist + download
│   │   ├── og/          # Dynamic OG ImageResponse (route.tsx)
│   │   ├── projects/    # Project API (drafts need session)
│   │   └── upload/      # File upload (image/video/pdf/apk)
│   ├── projects/        # Public project pages (gallery img/video/pdf)
│   ├── skills/          # Public skills pages (#id anchors)
│   └── ...              # Other public pages
├── components/
│   ├── SiteChrome.tsx   # Public shell; hides chrome on /admin*
│   ├── Navigation.tsx   # Includes Achievements
│   └── Footer.tsx       # Includes Achievements
├── lib/
│   ├── forms.ts         # isChecked, parseYear, parseOrder, parseTechnologies
│   ├── media.ts         # isAllowedMediaUrl, mediaSrc
│   ├── settings.ts      # settingString / settings map helpers
│   ├── auth.ts, db.ts, r2.ts, supabase-storage.ts
├── sections/            # Homepage sections
└── proxy.ts             # Auth proxy (replaces middleware)
```

## Key Features

- **No-code project creation** — add projects from your phone
- **8-tab project editor** — full-state save (no wipe), error banners
- **Section visibility** — toggle any project section on/off (`isChecked`)
- **Homepage control** — per-project homepage visibility + per-section toggles
- **Draft/Preview/Publish** — full content workflow; drafts not public via API
- **Media library** — multi-upload, search, filter, edit, assign; PDF/video/APK support
- **Relationships** — Skills, Research, Achievements, Related Projects
- **SEO** — settings-driven metadata, `/api/og`, canonical URLs, Twitter cards
- **Mobile-first admin** — touch-friendly; no public nav on admin routes
- **Image proxy** — allowlisted hosts only; `mediaSrc()` everywhere
- **Security** — sessions, rate-limited login, no credentials in repo

## License

Private — Aditya Jadhav

## Further Reading

- `PROJECT_HANDOFF_REPORT.md` — architecture, gotchas, file map, deploy
- `ADMIN_USER_MANUAL.md` — every admin field and public mapping
- `AGENTS.md` / `CLAUDE.md` — agent instructions for this repo
