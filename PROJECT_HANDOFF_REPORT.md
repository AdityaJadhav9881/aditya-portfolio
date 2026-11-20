# INFINITY DESIGN — PROJECT HANDOFF REPORT

> Read this file to get instantly up to speed on the project. Last updated: 2026-11-20.

---

## PROJECT OVERVIEW

**What:** Database-driven CMS portfolio for Aditya Jadhav (Infinity Design)
**Stack:** Next.js 16.3.2, App Router, Turbopack, TypeScript, React 19, Tailwind CSS v4, Framer Motion 13.1.1, Prisma 7.9.1, PostgreSQL (Neon)
**Repo:** `https://github.com/AdityaJadhav9881/aditya-portfolio` branch `master`
**Live:** `https://aditya-portfolio-nine-xi.vercel.app`
**Admin:** `https://aditya-portfolio-nine-xi.vercel.app/admin`
**Credentials:** See `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`, or use `/admin/setup` to create the first admin. **Never commit real credentials.**

> **IMPORTANT:** There are two Vercel projects. The correct one is `aditya-portfolio` (NOT `portfolio`).
> Deploy with: `vercel link --project aditya-portfolio` then `vercel --yes --prod`
> Vercel CLI requires `vercel login` or `VERCEL_TOKEN`. Pushing to GitHub may auto-deploy if Git integration is connected.

---

## RECENT CHANGES (2026-11-20 — commit `7ed863f`)

26-issue batch landed on `master` (33 files, +1364/−296):

### Functional / admin
- Shared form helpers in `src/lib/forms.ts` — `isChecked`, `parseYear`, `parseOrder`, `parseTechnologies`
- Fixed always-true `visible` checkbox bug (`!== "off"` → proper `isChecked`) in section/journey/research/achievement actions
- Fixed featured/showOnHomepage parsing (`"true"/"false"` vs `"on"`) in project create/update
- Project edit form no longer wipes untouched fields — `handleSubmit` merges full project state with `formValues`
- Save/delete errors surface in UI on new + edit project pages and all managers
- Edit forms prefill current values (skills, journey, research, achievements)
- Delete confirms on skill group/skill; project deletes already confirmed
- Server actions rethrow Next `NEXT_REDIRECT` errors so save→navigate works

### Media / PDF / APK
- Media multi-file upload + `res.ok` checks; PDF + APK badges in admin
- Public gallery renders image / video / PDF / APK with **Download PDF** / **Download APK** (`/api/images?...&download=1`)
- `mediaSrc()` helper proxies storage URLs through `/api/images`
- Upload accepts `application/pdf` and APK mimes (`application/vnd.android.package-archive`, `application/x-android-package-archive`) + `.apk` extension fallback (20MB max)

### Security
- `/api/images` host allowlist via `src/lib/media.ts` — only `*.supabase.co`, `*.supabase.in`, `*.r2.dev`, `*.r2.cloudflarestorage.com`; blocks localhost (SSRF)
- `/api/projects/[id]` returns 404 for non-PUBLISHED projects unless admin session
- Login rate limit: 5 failures / 15 min per IP (`src/app/api/auth/login/route.ts`)
- Hardcoded admin credentials scrubbed from README, handoff, and `prisma/seed.ts`

### SEO / chrome / UX
- `/api/og` — `ImageResponse` OG image route (`src/app/api/og/route.tsx`, edge runtime; use `.tsx` for JSX)
- Root `generateMetadata` reads SiteSettings (`siteTitle`, `siteDescription`, `ogImage`)
- `SiteChrome` hides public Nav/Footer on `/admin*` paths
- Achievements link in Navigation + Footer
- `/skills#groupId` anchors (`id={group.id}` + `scroll-mt-24`)
- `globals.css` uses `var(--font-inter, "Inter")` for `--font-sans` / `--font-display`

### Ops
- Idempotent `prisma/seed.ts` (journey/research/achievements upsert/findFirst); admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`
- `package.json`: `prisma.seed` → `node --import tsx prisma/seed.ts`; scripts `db:migrate`, `db:seed`
- Removed unused deps: `effect`, `@neondatabase/serverless`; added `tsx`
- `.env.example`: `SUPABASE_BUCKET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- `getSiteSettings` server action requires admin session

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
| Form parsing | `src/lib/forms.ts` helpers | Consistent checkbox/year/order/tech parsing across actions |
| Media URLs | `mediaSrc()` + host allowlist | One place for proxy + SSRF protection |
| Chrome | `SiteChrome` client wrapper | Nav/Footer off on admin; padding only on public routes |

---

## CRITICAL GOTCHAS

### 1. Next.js 16 Breaking Changes
- **`middleware.ts` is DEPRECATED.** Use `src/proxy.ts` with `export async function proxy()`. The proxy defaults to Node.js runtime.
- Proxy matcher: `["/admin/:path*", "/api/admin/:path*", "/api/upload"]`
- OG routes with JSX must be `.tsx` (not `.ts`) — `src/app/api/og/route.tsx`
- Prefer `generateMetadata` over manual `<head>` in layouts

### 2. Prisma 7 Breaking Changes
- `url` not supported in `schema.prisma` datasource block. Use `prisma.config.ts` or adapter pattern.
- `prisma.config.ts` must ONLY have `schema` property. `earlyAccess` and `migrate` cause build failures.
- Relation names changed: `researchProjects` (not `projectResearch`), `achievementProjects` (not `projectAchievements`).
- JSON null writes: use `Prisma.DbNull` (see `toPrismaJson` in research actions)

### 3. Supabase Client Initialization
- **DO NOT** call `createClient()` at module evaluation time. It crashes builds when env vars are missing.
- Use lazy initialization pattern: `getSupabase()` function that creates client on first call.
- File: `src/lib/supabase-storage.ts`

### 4. Mobile Edge Image Rendering
- Direct Supabase URLs in `<img>` tags fail on mobile Edge (shows alt text instead of image).
- Fix: Route all `<img>` src through `/api/images?url=...` or `mediaSrc()`.
- The proxy serves from same-origin, bypassing Edge tracking prevention.
- Applied to: project gallery, project list covers, admin media grid, project edit media tab.

### 5. Server Components
- **Cannot have `onClick` handlers.** Action buttons with confirm dialogs must be `"use client"` components.
- `ProjectActions.tsx` and `ProjectActionsMobile.tsx` are client components for this reason.

### 6. Two Vercel Projects
- `portfolio` — old/unused project, DO NOT deploy here
- `aditya-portfolio` — the REAL project, all env vars set here
- Always run `vercel link --project aditya-portfolio` before deploying
- Deploy command: `vercel --yes --prod` (requires login/token)

### 7. Supabase Storage Bucket
- The bucket is named **`media`** (NOT `portfolio` — that was a mistake)
- Bucket config in `src/lib/supabase-storage.ts`: `process.env.SUPABASE_BUCKET || 'media'`
- If bucket is missing: go to Supabase Dashboard → Storage → create `media` bucket (Public)

### 8. Form Tab Persistence + Save
- All project editor forms (new + edit) use controlled inputs with `formValues` state
- This ensures data persists when switching between tabs (Basic → Story → etc.)
- **Edit save merges:** full `project` defaults + `formValues` overrides — never send only touched fields
- Checkboxes store `"true"/"false"` strings; server accepts via `isChecked()` (`on`/`true`/`1`)
- Unchecked checkboxes submit nothing — server must treat missing as `false`, not `!== "off"`

### 9. Checkbox / Visible Bugs (fixed — do not regress)
- Never use `formData.get("visible") !== "off"` — unchecked is `null`, so that is always true
- Always use `isChecked(formData.get(...))` from `@/lib/forms`

### 10. Admin chrome
- Public site uses `SiteChrome` → Navigation + main padding + Footer
- `/admin*` gets bare chrome (admin layout provides sidebar); do not double-mount Nav/Footer

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
| ResearchEntry | Research papers (title, links JSON as `[{label,url}]`) |
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
- `prisma/migrate.js` — Raw SQL migration runner (`npm run db:migrate`) — AchievementProject + Achievement.event/organization
- `prisma/seed.ts` — Idempotent seed (projects, skills, research, achievements, journey, settings); admin via env
- `.env` — DATABASE_URL, AUTH_SECRET, SUPABASE_*, ADMIN_*, R2 placeholders, NEXT_PUBLIC_SITE_URL
- `.env.example` — Template with all vars documented
- `src/proxy.ts` — Auth proxy (replaces middleware.ts)

### Shared libs
- `src/lib/auth.ts` — HMAC session tokens, scrypt password hashing, createSession/getSession/destroySession
- `src/lib/db.ts` — Singleton PrismaClient with PrismaPg adapter
- `src/lib/r2.ts` — Storage abstraction: Supabase > R2 > Local
- `src/lib/supabase-storage.ts` — Lazy-init Supabase client, upload/delete functions
- `src/lib/forms.ts` — **isChecked, parseYear, parseOrder, parseTechnologies** (use in all admin actions)
- `src/lib/media.ts` — **isAllowedMediaUrl allowlist + mediaSrc()** (use for all external media `<img>`)
- `src/lib/settings.ts` — **settingString + getSiteSettingsMap/Strings** (normalize SiteSetting values)

### API Routes
- `src/app/api/auth/login/route.ts` — POST login (rate-limited 5/15min/IP)
- `src/app/api/auth/logout/route.ts` — POST logout
- `src/app/api/auth/me/route.ts` — GET current session
- `src/app/api/upload/route.ts` — POST file upload (auth; image/video/pdf/apk; 20MB)
- `src/app/api/images/route.ts` — GET media proxy (public; host allowlist; `?download=1`)
- `src/app/api/og/route.tsx` — GET dynamic OG ImageResponse (`?title=&subtitle=`)
- `src/app/api/projects/[id]/route.ts` — GET project (PUBLISHED or admin session)
- `src/app/api/admin/skills/route.ts` — GET skills (auth required)
- `src/app/api/admin/research/route.ts` — GET research (auth required)
- `src/app/api/admin/achievements/route.ts` — GET achievements (auth required)
- `src/app/api/admin/projects-list/route.ts` — GET projects list (auth required)
- `src/app/api/admin/setup/route.ts` — POST first admin setup

### Server Actions
- `src/app/admin/actions/project.ts` — CRUD + duplicate + toggleFeatured + toggleHomepage (isChecked + redirect rethrow)
- `src/app/admin/actions/section.ts` — CRUD + visibility (isChecked)
- `src/app/admin/actions/relationship.ts` — Toggle skills/research/achievements/related projects + media assignment
- `src/app/admin/actions/skill.ts` — CRUD for skill groups + skills
- `src/app/admin/actions/research.ts` — CRUD; links normalized to `[{label,url}]` via `toPrismaJson`
- `src/app/admin/actions/achievement.ts` — CRUD (isChecked)
- `src/app/admin/actions/journey.ts` — CRUD (isChecked)
- `src/app/admin/actions/media.ts` — updateMedia + deleteMedia (with storage cleanup; typed MediaRole)
- `src/app/admin/actions/settings.ts` — getSiteSettings (admin-only) + updateSiteSetting

### Admin Pages
- `src/app/admin/page.tsx` — Dashboard (8 stats, 4 quick actions)
- `src/app/admin/projects/page.tsx` — Project list with search/filter
- `src/app/admin/projects/[id]/page.tsx` — 8-tab project editor (full-state save + error banner)
- `src/app/admin/projects/new/page.tsx` — New project (5 tabs + error banner)
- `src/app/admin/skills/page.tsx` + `SkillManager.tsx` — Skill groups + skills (prefill + errors + delete confirm)
- `src/app/admin/research/page.tsx` + `ResearchManager.tsx` — Research (prefill + errors)
- `src/app/admin/achievements/page.tsx` + `AchievementManager.tsx` — Achievements (prefill + errors)
- `src/app/admin/journey/page.tsx` + `JourneyManager.tsx` — Journey (prefill + errors)
- `src/app/admin/media/page.tsx` — Media library
- `src/app/admin/media/MediaManager.tsx` — Multi-upload, res.ok, mediaSrc, PDF/APK badges
- `src/app/admin/settings/page.tsx` — Settings page
- `src/app/admin/settings/SettingsManager.tsx` — Client-side settings form + homepage toggles
- `src/app/admin/preview/[id]/page.tsx` — Draft preview
- `src/app/admin/login/page.tsx`, `src/app/admin/setup/page.tsx` — Auth entry points

### Admin Components
- `src/app/admin/components/ProjectActions.tsx` — Desktop + mobile action buttons
- `src/app/admin/components/SectionManager.tsx` — Section CRUD with visibility toggle
- `src/app/admin/components/RelationshipManager.tsx` — 4 checklist panels for relationships
- `src/app/admin/hooks/useUnsavedChanges.ts` — beforeunload + popstate warning

### Error Boundaries
- `src/app/error.tsx` — Route-level error boundary
- `src/app/global-error.tsx` — Root-level error boundary

### Public Pages
- `src/app/page.tsx` — Homepage (DB queries + section toggles)
- `src/app/projects/page.tsx` — Project list with cover thumbnails
- `src/app/projects/[projectId]/page.tsx` — Detail + generic SECTION_LABELS renderer + media gallery (img/video/pdf/apk)
- `src/app/skills/page.tsx` + `SkillsPageClient.tsx` — Skill groups with `#groupId` anchors
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
- `src/sections/SkillsPreview.tsx` — Skill groups from DB (links `/skills#${group.id}`)
- `src/sections/JourneyPreview.tsx` — Journey entries from DB
- `src/sections/ResearchPreview.tsx` — Research entries from DB
- `src/sections/Future.tsx` — Hardcoded
- `src/sections/ContactSection.tsx` — Email/LinkedIn/GitHub from SiteSetting
- `src/sections/Continuation.tsx` — Hardcoded

### Shared Components
- `src/components/SiteChrome.tsx` — Public shell (Nav + main + Footer); no chrome on `/admin*`
- `src/components/Navigation.tsx` — Nav links incl. Achievements; mobile hamburger
- `src/components/Footer.tsx` — Footer links incl. Achievements; queries SiteSetting for GitHub/LinkedIn
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
| `ADMIN_EMAIL` | Seed | Default admin email for `prisma/seed` (or use `/admin/setup`) |
| `ADMIN_PASSWORD` | Seed | Default admin password for seed (min 8 chars on setup route) |
| `R2_ACCOUNT_ID` | No | Cloudflare R2 (fallback storage) |
| `R2_ACCESS_KEY_ID` | No | R2 access key |
| `R2_SECRET_ACCESS_KEY` | No | R2 secret key |
| `R2_BUCKET_NAME` | No | R2 bucket name |
| `R2_PUBLIC_URL` | No | R2 public URL |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for SEO / OG absolute URLs |

> All vars must be set on the `aditya-portfolio` Vercel project (NOT `portfolio`).

---

## HOMEPAGE DATA FLOW

```
SiteSetting (homepage_*_visible) → conditionally render sections
SiteSetting (bio, email, linkedin, github) → pass as props
Project (PUBLISHED, showOnHomepage=true, top 5) → SelectedProjects
SkillGroup → SkillsPreview (href /skills#id)
JourneyEntry (visible=true) → JourneyPreview
ResearchEntry (visible=true) → ResearchPreview
```

---

## PROJECT DETAIL DATA FLOW

```
Project (by slug, PUBLISHED only)
├── sections (visible=true, ordered by displayOrder) → SECTION_LABELS headings
├── projectSkills → skill
├── media (visible=true) → image | video | PDF | APK (+ download link)
├── relatedProjects → relatedProject (slug, name)
├── researchProjects → researchEntry
└── achievementProjects → achievement
OG: project.ogImage || /api/og?title=...
```

---

## LINT / BUILD

```bash
npm run lint    # eslint — pre-existing no-explicit-any / set-state-in-effect remain in old files
npm run build   # prisma generate && next build — must pass before push
```

Do not introduce new `as any` in admin actions; prefer typed Prisma fields (`SectionType`, `MediaRole`).

---

## DEPLOYMENT

```bash
# Link to correct Vercel project (run once)
vercel link --project aditya-portfolio

# Build
npm run build

# Deploy to production (requires vercel login or VERCEL_TOKEN)
vercel --yes --prod

# Or push to GitHub if Vercel Git integration is connected
git push origin master

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
- ✅ Authentication (HMAC sessions, scrypt hashing) + login rate limiting
- ✅ Admin Panel (35+ routes, 8-tab project editor, full-state save)
- ✅ Dashboard (8 stats, 4 quick actions)
- ✅ Project CMS (full CRUD, draft/preview/publish/archive/duplicate)
- ✅ Section Visibility (12 section types, per-section toggle; isChecked)
- ✅ Media System (Supabase Storage, multi-upload, PDF/video/APK, roles)
- ✅ Skills/Research/Achievements/Journey CMS (prefill + errors)
- ✅ Site Settings (admin-gated getSiteSettings)
- ✅ Homepage Control (per-project + per-section toggles)
- ✅ Preview (draft preview route)
- ✅ Content Status (Draft/Published/Archived); draft API not public
- ✅ Slugs (validation)
- ✅ SEO (generateMetadata from settings, /api/og, canonical, Twitter)
- ✅ Public Design Preserved (SiteChrome; Achievements in nav/footer)
- ✅ Mobile Admin
- ✅ Security (auth, SSRF allowlist, rate limit, env vars, no committed creds)
- ✅ Error Boundaries (error.tsx + global-error.tsx) + UI error banners
- ✅ Documentation (README + ADMIN_USER_MANUAL + .env.example + this report)

---

## COMMON TASKS

### Add a new project from phone
1. Go to `/admin` → Login
2. Click "Add Project"
3. Fill in Basic tab (name required)
4. Add Story content
5. Add Technologies
6. Add Sections if needed
7. Upload media at `/admin/media` (multi-select OK), assign to project
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

### Upload and assign images / PDFs / APKs / video
1. Go to `/admin/media`
2. Click "Upload Files" (multi-select supported)
3. Select file (image/video/PDF/APK) — uploads to Supabase `media` bucket
4. After upload, click Edit
5. Set Alt Text, Caption, Role (COVER for thumbnails)
6. Assign to a project from the Project dropdown
7. Public gallery shows images inline; video with player; PDF with **Download PDF**; APK with **Download APK**

### Fix "Using local file storage" warning
- Check that `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set on the `aditya-portfolio` Vercel project
- Check that the `media` bucket exists in Supabase Storage
- Redeploy after adding env vars

### Fix a broken image on mobile
- Ensure image src uses `mediaSrc()` / `/api/images?url=...` proxy, not direct Supabase URL
- Check allowlist host is supabase/r2 (not arbitrary domains)
- Check that the image is assigned to the correct project
- Verify the media item has `visible = true`

### Reset / reseed local DB
```bash
npm run db:migrate   # node prisma/migrate.js (raw SQL, idempotent)
npm run db:seed      # prisma db seed (idempotent; uses ADMIN_EMAIL/PASSWORD)
```

### Login rate limited (429)
- Wait 15 minutes or clear by restarting dev server (in-memory map)
- Production: keyed by `x-forwarded-for` IP

---

## KNOWN FOLLOW-UPS

- Vercel CLI not logged in in this environment — deploy via GitHub integration or `vercel login`
- Pre-existing ESLint `no-explicit-any` across older public pages (build still passes)
- `react-hooks/set-state-in-effect` warnings in Navigation / admin layout (pre-existing pattern)
- Local Neon DNS may fail on some networks; use Google DNS / known Neon IP only for ad-hoc scripts, not app runtime (Vercel has no issue)
