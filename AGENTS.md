<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Agent notes — Infinity Design portfolio (P-12)

**Stack:** Next.js 16.3.2 App Router + Turbopack, React 19, Tailwind v4, Prisma 7.9.1 + Neon Postgres, Supabase Storage, Vercel project `aditya-portfolio` (NOT `portfolio`). Live: `https://aditya-portfolio-nine-xi.vercel.app`.

**Read before large changes:** `PROJECT_HANDOFF_REPORT.md`, `ADMIN_USER_MANUAL.md`, `AGENTS.md` gotchas below, and `node_modules/next/dist/docs/`.

## Next.js 16 (breaking)

- Auth gate is **`src/proxy.ts`** with `export async function proxy()` — not `middleware.ts`.
- Matcher: `["/admin/:path*", "/api/admin/:path*", "/api/upload"]`.
- OG/image routes that use JSX must be **`.tsx`** (`src/app/api/og/route.tsx`).
- Root SEO: `generateMetadata` in `src/app/layout.tsx` (reads SiteSettings). Do not hand-roll `<head>`.
- After edits, run `npm run build` (must pass) and `npm run lint` (ignore pre-existing `no-explicit-any` / `set-state-in-effect` in old files unless you touch them).

## Conventions

- **Forms:** use `src/lib/forms.ts` — `isChecked`, `parseYear`, `parseOrder`, `parseTechnologies`. Never `formData.get("visible") !== "off"` (unchecked is `null` → always true). Checkboxes may be `"on"` or `"true"`.
- **Media URLs:** use `mediaSrc()` from `src/lib/media.ts`. `/api/images` only allowlists Supabase/R2 hosts; optional `?download=1`. Upload types: images/video/pdf/**apk** (`application/vnd.android.package-archive`).
- **Settings values:** `settingString` / `getSiteSettingsStrings` from `src/lib/settings.ts`.
- **Project edit save:** merge full project state with `formValues` — never send only touched fields.
- **Admin chrome:** public Nav/Footer only via `SiteChrome`; `/admin*` must stay bare.
- **Server actions that `redirect()`** must rethrow Next redirect errors (see `isRedirectError` in `actions/project.ts`).
- **JSON columns:** write `Prisma.DbNull` for empty (see research `toPrismaJson`).

## Security / ops

- No hardcoded passwords or personal admin emails in docs or seeds — use `ADMIN_EMAIL` / `ADMIN_PASSWORD` or `/admin/setup`.
- Login rate limit lives in `src/app/api/auth/login/route.ts` (in-memory, 5/15min/IP).
- Draft projects: `/api/projects/[id]` 404s unless PUBLISHED or admin session.
- Two Vercel projects; deploy only to `aditya-portfolio`. CLI needs login/token; GitHub push may auto-deploy.
- Supabase bucket name is **`media`** (`SUPABASE_BUCKET`).
- Local Neon DNS can fail on some networks; app runtime on Vercel is fine. Ad-hoc DB scripts may need DNS workaround — do not bake hacks into app code.

## Commands

```bash
npm run lint
npm run build
npm run db:migrate   # prisma/migrate.js
npm run db:seed      # prisma db seed (tsx)
```

## Temp files

Do not leave `_*inspect*.mjs`, seed endpoints, or DNS patches in the tree. Clean before commit.
