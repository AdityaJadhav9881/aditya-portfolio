# INFINITY DESIGN — PROJECT HANDOFF REPORT

> Read this file to get instantly up to speed on the project. Last updated: 2026-08-28.

---

## PROJECT OVERVIEW

**What:** Database-driven CMS portfolio for Aditya Jadhav (Infinity Design)
**Stack:** Next.js 16.3.2, App Router, Turbopack, TypeScript, React 19, Tailwind CSS v4, Framer Motion 13.1.1, Prisma 7.9.1, PostgreSQL (Neon)
**Repo:** `https://github.com/AdityaJadhav9881/aditya-portfolio` branch `master`
**Live:** `https://aditya-portfolio-nine-xi.vercel.app`
**Admin:** `https://aditya-portfolio-nine-xi.vercel.app/admin`
**Credentials:** `adityajadhav0167@gmail.com` / `admin123`

> **IMPORTANT:** There are two Vercel projects. The correct one is `aditya-portfolio` (NOT `portfolio`).
> Deploy with: `vercel link --project aditya-portfolio` then `vercel --yes --prod`

---

## ARCHITECTURE DECISIONS

| Decision | Choice | Why |
|----------|--------|-----|
| ORM | Prisma 7.9.1 | Type-safe, good Next.js integration |
| Database | PostgreSQL (Neon) | Serverless, scales well |
| Auth | HMAC-signed cookies + scrypt | No external auth service needed |
| Storage | Supabase Storage (primary) | Free tier, good API |
| Middleware | `src/proxy.ts` (not middleware.ts) | Next.js 16 deprecated middleware.ts |
| Image loading | Plain `<img>` + `/api/images` proxy | Mobile Edge tracking prevention blocks direct Supabase URLs |
| Prisma config | `prisma.config.ts` with only `schema` property | Prisma 7 broke `url` in schema.prisma; `earlyAccess`/`migrate` invalid |

---

## CRITICAL GOTCHAS

### 1. Next.js 16 Breaking Changes
- **`middleware.ts` is DEPRECATED.** Use `src/proxy.ts` with `export async function proxy()`. The proxy defaults to Node.js runtime.
- Proxy matcher: `["/admin/:path*", "/api/admin/:path*", "/api/upload"]`

### 2. Prisma 7 Breaking Changes
- `url` not supported in `schema.prisma` datasource block. Use `prisma.config.ts` or adapter pattern.
- `prisma.config.ts` must ONLY have `schema` property. `earlyAccess` and `migrate` cause build failures.
- Relation names changed: `researchProjects` (not `projectResearch`), `achievementProjects` (not `projectAchievements`).

### 3. Supabase Client Initialization
- **DO NOT** call `createClient()` at module evaluation time. It crashes builds when env vars are missing.
- Use lazy initialization pattern: `getSupabase()` function that creates client on first call.
- File: `src/lib/supabase-storage.ts`

### 4. Mobile Edge Image Rendering
- Direct Supabase URLs in `<img>` tags fail on mobile Edge (shows alt text instead of image).
- Fix: Route all `<img>` src through `/api/images?url=...` proxy.
- The proxy serves from same-origin, bypassing Edge tracking prevention.
- Applied to: `/projects/[projectId]` (gallery) and `/projects` (cover thumbnails).

### 5. Server Components
- **Cannot have `onClick` handlers.** Action buttons with confirm dialogs must be `"use client"` components.
- `ProjectActions.tsx` and `ProjectActionsMobile.tsx` are client components for this reason.

### 6. Two Vercel Projects
- `portfolio` — old/unused project, DO NOT deploy here
- `aditya-portfolio` — the REAL project, all env vars set here
- Always run `vercel link --project aditya-portfolio` before deploying
- Deploy command: `vercel --yes --prod`

### 7. Supabase Storage Bucket
- The bucket is named **`media`** (NOT `portfolio` — that was a mistake)
- Bucket config in `src/lib/supabase-storage.ts`: `process.env.SUPABASE_BUCKET || 'media'`
- If bucket is missing: go to Supabase Dashboard → Storage → create `media` bucket (Public)

### 8. Form Tab Persistence
- All project editor forms (new + edit) use controlled inputs with `formValues` state
- This ensures data persists when switching between tabs (Basic → Story → etc.)
- `handleSubmit` reads from `formValues` state, not `new FormData(form)`
- If adding new tabs, use the same controlled input pattern

---

## DATABASE MODELS (15 total)

| Model | Purpose |
|-------|---------|
| Admin | Auth user (email, name, passwordHash) |
| Project | Core entity (name, slug, status, technologies[], seo fields, etc.) |
| ProjectSection | Rich content blocks (12 section types, visible toggle) |
| SkillGroup | Skill categories |
| Skill | Individual skills |
| ProjectSkill | Many-to-many: Project ↔ Skill |
| JourneyEntry | Timeline events (MILESTONE/PROJECT/ONGOING) |
| JourneyProject | Many-to-many: JourneyEntry ↔ Project |
| ResearchEntry | Research papers (title, links JSON) |
| ResearchProject | Many-to-many: ResearchEntry ↔ Project |
| Achievement | Milestones/recognition |
| AchievementProject | Many-to-many: Achievement ↔ Project |
| Media | Uploaded files (url, alt, caption, role, projectId) |
| SiteSetting | Key-value store for all settings |
| ProjectRelatedProject | Self-referential many-to-many: Project ↔ Project |

---

## FILE STRUCTURE MAP

### Core Config
- `next.config.ts` — serverExternalPackages + images.remotePatterns for r2.dev, supabase.co, supabase.in
- `prisma/schema.prisma` — 15 models, 4 enums
- `prisma.config.ts` — Prisma 7 config (schema only, NO earlyAccess/migrate)
- `prisma/migrate.js` — Raw SQL migration runner
- `prisma/seed.ts` — Seeds 5 projects, skill groups, research, achievements, journey, settings
- `.env` — DATABASE_URL, AUTH_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, R2 placeholders, NEXT_PUBLIC_SITE_URL
- `.env.example` — Template with all vars documented
- `src/proxy.ts` — Auth proxy (replaces middleware.ts)

### Auth & Database
- `src/lib/auth.ts` — HMAC session tokens, scrypt password hashing, createSession/getSession/destroySession
- `src/lib/db.ts` — Singleton PrismaClient with PrismaPg adapter
- `src/lib/r2.ts` — Storage abstraction: Supabase > R2 > Local
- `src/lib/supabase-storage.ts` — Lazy-init Supabase client, upload/delete functions

### API Routes
- `src/app/api/auth/login/route.ts` — POST login
- `src/app/api/auth/logout/route.ts` — POST logout
- `src/app/api/auth/me/route.ts` — GET current session
- `src/app/api/upload/route.ts` — POST file upload (auth required)
- `src/app/api/images/route.ts` — GET image proxy (no auth, public)
- `src/app/api/projects/[id]/route.ts` — GET project with all relations
- `src/app/api/admin/skills/route.ts` — GET skills (auth required)
- `src/app/api/admin/research/route.ts` — GET research (auth required)
- `src/app/api/admin/achievements/route.ts` — GET achievements (auth required)
- `src/app/api/admin/projects-list/route.ts` — GET projects list (auth required)
- `src/app/api/admin/setup/route.ts` — POST first admin setup

### Server Actions
- `src/app/admin/actions/project.ts` — CRUD + duplicate + toggleFeatured + toggleHomepage
- `src/app/admin/actions/section.ts` — CRUD + toggleSectionVisible
- `src/app/admin/actions/relationship.ts` — Toggle skills/research/achievements/related projects + media assignment
- `src/app/admin/actions/skill.ts` — CRUD for skill groups + skills
- `src/app/admin/actions/research.ts` — CRUD for research entries
- `src/app/admin/actions/achievement.ts` — CRUD for achievements
- `src/app/admin/actions/journey.ts` — CRUD for journey entries
- `src/app/admin/actions/media.ts` — updateMedia + deleteMedia (with storage cleanup)
- `src/app/admin/actions/settings.ts` — getSiteSettings + updateSiteSetting

### Admin Pages
- `src/app/admin/page.tsx` — Dashboard (8 stats, 4 quick actions)
- `src/app/admin/projects/page.tsx` — Project list with search/filter
- `src/app/admin/projects/[id]/page.tsx` — 8-tab project editor
- `src/app/admin/projects/new/page.tsx` — New project (5 tabs)
- `src/app/admin/skills/page.tsx` — Skill groups + skills
- `src/app/admin/research/page.tsx` — Research entries
- `src/app/admin/achievements/page.tsx` — Achievements
- `src/app/admin/journey/page.tsx` — Journey entries
- `src/app/admin/media/page.tsx` — Media library
- `src/app/admin/media/MediaManager.tsx` — Client-side media UI
- `src/app/admin/settings/page.tsx` — Settings page
- `src/app/admin/settings/SettingsManager.tsx` — Client-side settings form + homepage toggles
- `src/app/admin/preview/[id]/page.tsx` — Draft preview

### Admin Components
- `src/app/admin/components/ProjectActions.tsx` — Desktop + mobile action buttons (Feature, Homepage, Duplicate, Delete)
- `src/app/admin/components/SectionManager.tsx` — Section CRUD with visibility toggle
- `src/app/admin/components/RelationshipManager.tsx` — 4 checklist panels for relationships
- `src/app/admin/hooks/useUnsavedChanges.ts` — beforeunload + popstate warning

### Error Boundaries
- `src/app/error.tsx` — Route-level error boundary
- `src/app/global-error.tsx` — Root-level error boundary

### Public Pages
- `src/app/page.tsx` — Homepage (5 DB queries, 10 sections)
- `src/app/projects/page.tsx` — Project list with cover thumbnails
- `src/app/projects/[projectId]/page.tsx` — Project detail with gallery
- `src/app/skills/page.tsx` — All skill groups
- `src/app/skills/[skillId]/page.tsx` — Individual skill with related projects
- `src/app/journey/page.tsx` — Full timeline
- `src/app/research/page.tsx` — Research entries
- `src/app/achievements/page.tsx` — Achievements
- `src/app/about/page.tsx` — About page
- `src/app/contact/page.tsx` — Contact page

### Homepage Sections
- `src/sections/Hero.tsx` — Hardcoded hero
- `src/sections/Identity.tsx` — Bio from SiteSetting
- `src/sections/SelectedProjects.tsx` — Projects from DB
- `src/sections/Philosophy.tsx` — Hardcoded
- `src/sections/SkillsPreview.tsx` — Skill groups from DB
- `src/sections/JourneyPreview.tsx` — Journey entries from DB
- `src/sections/ResearchPreview.tsx` — Research entries from DB
- `src/sections/Future.tsx` — Hardcoded
- `src/sections/ContactSection.tsx` — Email/LinkedIn/GitHub from SiteSetting
- `src/sections/Continuation.tsx` — Hardcoded

### Shared Components
- `src/components/Navigation.tsx` — Hardcoded nav links, mobile hamburger
- `src/components/Footer.tsx` — Queries SiteSetting for GitHub/LinkedIn
- `src/components/FadeIn.tsx` — Framer Motion fade animations
- `src/components/SectionLabel.tsx` — Accent-colored section label

---

## ENVIRONMENT VARIABLES

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon) |
| `AUTH_SECRET` | Yes | Session signing secret |
| `SUPABASE_URL` | Yes | Supabase project URL (`https://xxx.supabase.co`) |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_BUCKET` | No | Supabase bucket name (defaults to `media`) |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 (fallback storage) |
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_PUBLIC_URL` | No | R2 public URL |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO |

> All vars must be set on the `aditya-portfolio` Vercel project (NOT `portfolio`).

---

## HOMEPAGE DATA FLOW

```
SiteSetting (homepage_*_visible) → conditionally render sections
SiteSetting (bio, email, linkedin, github) → pass as props
Project (PUBLISHED, showOnHomepage=true, top 5) → SelectedProjects
SkillGroup → SkillsPreview
JourneyEntry (visible=true) → JourneyPreview
ResearchEntry (visible=true) → ResearchPreview
```

---

## PROJECT DETAIL DATA FLOW

```
Project (by slug, PUBLISHED only)
├── sections (visible=true, ordered by displayOrder)
├── projectSkills → skill
├── media (visible=true, ordered by displayOrder)
├── relatedProjects → relatedProject (slug, name)
├── researchProjects → researchEntry
└── achievementProjects → achievement
```

---

## DEPLOYMENT

```bash
# Link to correct Vercel project (run once)
vercel link --project aditya-portfolio

# Build
npm run build

# Deploy to production
vercel --yes --prod

# Env vars on Vercel (only on aditya-portfolio project)
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
```

---

## WHAT'S COMPLETE (per Master Prompt)

All 48 sections of the master prompt are implemented:

- ✅ Database (Prisma + PostgreSQL, 15 models)
- ✅ Authentication (HMAC sessions, scrypt hashing)
- ✅ Admin Panel (35+ routes, 8-tab project editor)
- ✅ Dashboard (8 stats, 4 quick actions)
- ✅ Project CMS (full CRUD, draft/preview/publish/archive/duplicate)
- ✅ Section Visibility (12 section types, per-section toggle)
- ✅ Media System (Supabase Storage, upload/delete, roles)
- ✅ Skills/Research/Achievements/Journey CMS
- ✅ Site Settings (14 fields)
- ✅ Homepage Control (per-project + per-section toggles)
- ✅ Preview (draft preview route)
- ✅ Content Status (Draft/Published/Archived)
- ✅ Slugs (validation)
- ✅ SEO (OG, canonical, Twitter)
- ✅ Public Design Preserved
- ✅ Mobile Admin
- ✅ Security (auth, validation, env vars, try/catch everywhere)
- ✅ Error Boundaries (error.tsx + global-error.tsx)
- ✅ Documentation (README + ADMIN_USER_MANUAL.md + .env.example)

---

## COMMON TASKS

### Add a new project from phone
1. Go to `/admin` → Login
2. Click "Add Project"
3. Fill in Basic tab (name required)
4. Add Story content
5. Add Technologies
6. Add Sections if needed
7. Upload media at `/admin/media`, assign to project
8. Link skills/research/achievements in Links tab
9. Set status to PUBLISHED in Settings tab
10. Check "Show on Homepage" if desired
11. Preview at `/admin/preview/[id]`
12. Done — project appears on public site

### Change homepage content
- Edit bio: Settings → Personal → Bio
- Edit contact: Settings → Social → email/LinkedIn/GitHub
- Toggle sections: Settings → Homepage Sections
- Control which projects appear: Edit project → Settings tab → "Show on Homepage"

### Upload and assign images
1. Go to `/admin/media`
2. Click "Upload Media"
3. Select file (image/video/PDF) — uploads to Supabase `media` bucket
4. After upload, click edit icon
5. Set Alt Text, Caption, Role (COVER for thumbnails)
6. Assign to a project from the Project dropdown
7. Image appears in project gallery and/or list thumbnail

### Fix "Using local file storage" warning
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set on the `aditya-portfolio` Vercel project
- Check that the `media` bucket exists in Supabase Storage
- Redeploy after adding env vars

### Fix a broken image on mobile
- Ensure image src uses `/api/images?url=...` proxy, not direct Supabase URL
- Check that the image is assigned to the correct project
- Verify the media item has `visible = true`
