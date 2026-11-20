# INFINITY DESIGN — ADMIN USER MANUAL

> Complete guide to every admin feature, what it controls, and where it appears on the public website.
> Last updated: 2026-11-20.

---

## TABLE OF CONTENTS

1. [Dashboard](#1-dashboard)
2. [Projects](#2-projects)
3. [Project Editor — All 8 Tabs](#3-project-editor)
4. [Skills](#4-skills)
5. [Research](#5-research)
6. [Achievements](#6-achievements)
7. [Journey](#7-journey)
8. [Media Library](#8-media-library)
9. [Site Settings](#9-site-settings)
10. [Homepage Section Visibility](#10-homepage-section-visibility)
11. [Quick Reference — Public Page Map](#11-public-page-map)
12. [Behavior Notes (2026-11 fixes)](#12-behavior-notes)

---

## 1. DASHBOARD

**Route:** `/admin`

### What You See

8 stat cards + 4 quick-action buttons.

| Stat | What It Counts | Color |
|------|---------------|-------|
| Total Projects | All projects regardless of status | White |
| Published | Projects with status = PUBLISHED | Green |
| Drafts | Projects with status = DRAFT | Yellow |
| Featured | Projects with `featured = true` | Cyan |
| Skills | Total individual skills | White |
| Research | Total research entries | White |
| Achievements | Total achievements | White |
| Media | Total uploaded media files | White |

### Quick Actions

| Button | Goes To | Purpose |
|--------|---------|---------|
| Add Project | `/admin/projects/new` | Create new project |
| Add Research | `/admin/research` | Create new research entry |
| Add Achievement | `/admin/achievements` | Create new achievement |
| Upload Media | `/admin/media` | Upload images/videos/PDFs |

### Admin chrome

- Public site navigation and footer are **hidden** on all `/admin*` routes (`SiteChrome`).
- Admin uses its own sidebar layout (Dashboard, Projects, Skills, Journey, Research, Achievements, Media, Settings).

---

## 2. PROJECTS

**Route:** `/admin/projects`

### What You See

Table of all projects with columns: Name, Year, Category, Status, Featured, Homepage, Actions.

### Features

| Feature | How | What It Does |
|---------|-----|-------------|
| **Search** | Type in search box | Filters projects by name |
| **Status Filter** | Dropdown (All/Published/Draft/Archived) | Shows only matching status |
| **Featured Filter** | Toggle button | Shows only featured projects |
| **Clear Filters** | Clear button | Resets all filters |

### Action Buttons (Per Project)

| Button | What It Does | Public Effect |
|--------|-------------|---------------|
| **Feature/Unfeature** | Toggles `Project.featured` | Featured projects show on homepage featured section |
| **Show Home/Hide Home** | Toggles `Project.showOnHomepage` | Controls if project appears in homepage "Selected Projects" |
| **Duplicate** | Creates copy with all sections/relationships | New draft project, hidden from homepage |
| **Delete** | Permanently removes project (confirm dialog) | Project page returns 404 |
| **Edit** | Opens project editor | N/A (admin only) |

---

## 3. PROJECT EDITOR

**Route:** `/admin/projects/[id]` (edit) or `/admin/projects/new` (create)

### Save behavior (important)

- Tabs share controlled `formValues` state so data persists when switching tabs.
- **Save sends the full project**, not only fields you touched — untouched fields are never wiped.
- Errors (validation, server) appear in a red banner under the header.
- After a successful save you are redirected back to the project list.
- Checkbox values are stored as `"true"` / `"false"` and parsed server-side with `isChecked`.

### Tab 1: BASIC

| Field | Required | Database Field | Public Display |
|-------|----------|---------------|----------------|
| Project Name | Yes | `Project.name` | Page title, project list, homepage cards |
| Slug | No (auto-generated) | `Project.slug` | URL: `/projects/{slug}` |
| One-liner | No | `Project.oneLine` | Subtitle on detail page, homepage cards, project list |
| Year | No | `Project.year` | Displayed next to category on detail page and list |
| Category | No | `Project.category` | Displayed on detail page, project list, homepage cards |

### Tab 2: STORY

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Description | `Project.description` | "Why I Built It" section on project detail |
| Problem | `Project.problem` | "The Problem" section on project detail |
| Designed | `Project.designed` | "What I Designed" section on project detail |
| How It Works | `Project.howItWorks` | "How It Works" section on project detail |
| Engineering | `Project.engineering` | "Engineering" section on project detail |
| Result | `Project.result` | "Result" section on project detail |
| Learned | `Project.learned` | "What I Learned" section on project detail |

**Note:** Empty fields are NOT rendered. Only sections with content appear on the public page.

### Tab 3: TECHNICAL

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Technologies | `Project.technologies` (String[]) | Comma-separated tags on detail page and project list. Parsed from comma-separated input. |

### Tab 4: SECTIONS

Manages rich content blocks via `SectionManager` component.

**Section Types Available:**

| Type | Public Heading |
|------|---------------|
| STORY | Story |
| FEATURES | Key Features |
| HARDWARE | Hardware |
| SOFTWARE | Software |
| TECHNICAL | Technical |
| HOW_IT_WORKS | How It Works |
| TESTING | Testing |
| CHALLENGES | Challenges |
| LESSONS | Lessons |
| RESEARCH | Research |
| FUTURE | Future |
| GALLERY | Gallery |

**Per Section Fields:**

| Field | Database Field | Notes |
|-------|---------------|-------|
| Section Type | `ProjectSection.sectionType` | Dropdown of 12 types |
| Title | `ProjectSection.title` | Custom heading (optional, type default used if empty) |
| Content | `ProjectSection.content` | Main text content |
| Display Order | `ProjectSection.displayOrder` | Controls sort order |
| Visible | `ProjectSection.visible` | Toggle on/off — unchecked means hidden (server uses `isChecked`) |

**Note:** Only sections with `visible = true` AND non-empty content render on the public page.

### Tab 5: MEDIA

Shows all media files assigned to this project (images via proxy; PDF badge). To upload/assign media, go to `/admin/media`.

### Tab 6: LINKS (Relationships)

Four relationship panels:

| Relationship | Database Table | Public Display |
|-------------|---------------|----------------|
| **Skills** | `ProjectSkill` | "Related Skills" section on project detail page |
| **Research** | `ResearchProject` | Research related to the project |
| **Achievements** | `AchievementProject` | Achievement ↔ project links |
| **Related Projects** | `ProjectRelatedProject` | "Related Projects" links on project detail page |

### Tab 7: SETTINGS

| Field | Database Field | Public Effect |
|-------|---------------|---------------|
| Status | `Project.status` | DRAFT = hidden from public, PUBLISHED = visible, ARCHIVED = hidden from listings |
| Display Order | `Project.displayOrder` | Controls sort order in project list and homepage |
| Featured | `Project.featured` | Featured projects highlighted |
| Show on Homepage | `Project.showOnHomepage` | If checked, appears in homepage "Selected Projects" (max 5) |

### Tab 8: SEO

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| SEO Title | `Project.seoTitle` | `<title>` tag, OG title, Twitter title |
| SEO Description | `Project.seoDescription` | Meta description, OG description, Twitter description |

**Auto-generated if empty:**
- Title: `{Project.name} | Aditya Jadhav`
- Description: `{Project.oneLine}`
- OG Image: `{siteUrl}/api/og?title={project.name}` (dynamic route exists)
- Canonical URL: `{siteUrl}/projects/{slug}`

Draft projects are **not** returned by the public project API without an admin session.

---

## 4. SKILLS

**Route:** `/admin/skills`

### What You Manage

Two levels: **Skill Groups** (categories) and **Skills** (individual items).

### Skill Groups

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Name | `SkillGroup.name` | Group heading on `/skills` page |
| Slug | `SkillGroup.slug` | Internal identifier |
| Description | `SkillGroup.description` | Group description text |
| Display Order | `SkillGroup.displayOrder` | Sort order on `/skills` page |

**Anchors:** Homepage SkillsPreview links to `/skills#{group.id}` (database id, not slug). The `/skills` page wraps each group card with `id={group.id}` for deep links.

### Skills

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Name | `Skill.name` | Skill name tag in group, also appears in project "Related Skills" |
| Slug | `Skill.slug` | Internal identifier |
| Skill Group | `Skill.skillGroupId` | Determines which group the skill belongs to |
| Display Order | `Skill.displayOrder` | Sort order within group |

### Edit / delete behavior

- **Edit** prefills the form with the current skill or group values (name, slug, order, group).
- **Save errors** show in a banner; forms stay open on failure.
- **Delete** asks for confirmation (skill group delete ungroups skills).

**Public Pages:**
- `/skills` — Shows all skill groups with their skills (+ `#id` anchors)
- `/skills/[skillId]` — Individual skill page showing related projects
- Homepage `SkillsPreview` — Skill groups linking to `/skills#id`

---

## 5. RESEARCH

**Route:** `/admin/research`

### Fields

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Title | `ResearchEntry.title` | Entry heading on `/research` page |
| Slug | `ResearchEntry.slug` | URL/anchor identifier |
| Description | `ResearchEntry.description` | Entry description text |
| Links | `ResearchEntry.links` (JSON) | Normalized to `[{ "label": "...", "url": "https://..." }]` |
| Display Order | `ResearchEntry.displayOrder` | Sort order on `/research` page |
| Visible | `ResearchEntry.visible` | Hidden entries don't appear on `/research` or homepage |

### Links input

- Prefer a JSON array: `[{"label": "Paper", "url": "https://..."}]`
- A single object `{"label":"...","url":"..."}` or a bare `https://...` URL is also accepted
- Server normalizes everything to `[{label, url}]` before saving (`parseResearchLinks` + `Prisma.DbNull` when empty)

### Edit / delete behavior

- Edit prefills title, slug, description, links (pretty-printed JSON), order, visible
- Errors surface in a banner; delete asks for confirmation

**Public Pages:**
- `/research` — Lists all visible research entries
- Homepage `ResearchPreview` — Shows all visible research entries

---

## 6. ACHIEVEMENTS

**Route:** `/admin/achievements`

### Fields

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Title | `Achievement.title` | Achievement heading on `/achievements` page |
| Description | `Achievement.description` | Achievement description |
| Year | `Achievement.year` | Year badge |
| Category | `Achievement.category` | Category label |
| Display Order | `Achievement.displayOrder` | Sort order on `/achievements` page |
| Visible | `Achievement.visible` | Hidden entries don't appear publicly |

### Edit / delete behavior

- Edit prefills all fields including `visible`
- Delete confirms; errors show in banner

**Public Page:** `/achievements` — Lists all visible achievements  
**Nav/Footer:** Achievements is linked in both public Navigation and Footer.

---

## 7. JOURNEY

**Route:** `/admin/journey`

### Fields

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Year | `JourneyEntry.year` | Timeline year label |
| Title | `JourneyEntry.title` | Entry heading |
| Description | `JourneyEntry.description` | Entry text |
| Type | `JourneyEntry.type` | MILESTONE / PROJECT / ONGOING color dots |
| Display Order | `JourneyEntry.displayOrder` | Sort order on `/journey` page |
| Visible | `JourneyEntry.visible` | Hidden entries don't appear publicly |

### Edit / delete behavior

- Edit prefills year, type, title, description, order, visible
- Delete confirms; errors show in banner

**Public Pages:**
- `/journey` — Full timeline of all visible entries
- Homepage `JourneyPreview` — Mini timeline of visible entries

---

## 8. MEDIA LIBRARY

**Route:** `/admin/media`

### Features

| Feature | How | What It Does |
|---------|-----|-------------|
| **Upload** | Click **+ Upload Files**, select one or more files | Multi-file upload (images, video, PDF, **APK**); failures listed in error banner |
| **Search** | Type in search box | Filters by filename or alt text |
| **Role Filter** | Dropdown (All/Cover/Hero/Gallery/Diagram/Hardware/Testing/Other) | Filters by media role |
| **Type Filter** | Buttons (All/Images/Videos/PDFs/**APKs**) | Filters by MIME type |
| **Edit** | Click Edit on any media item | Opens modal (project, role, alt, caption) |
| **Delete** | Click Delete (confirm) | Removes from storage + database |

### Previews

- Images: proxied thumbnail via `mediaSrc()` → `/api/images?url=...`
- PDF: red PDF badge (not rendered as `<img>`)
- APK: green APK badge (Android package icon)
- Other files: generic FILE badge

### Media Roles

| Role | Where It Appears |
|------|-----------------|
| COVER | Project list thumbnail (64x64px) |
| HERO | Project detail hero area |
| GALLERY | Project detail gallery section |
| DIAGRAM | Technical diagrams |
| HARDWARE | Hardware photos |
| TESTING | Testing photos |
| OTHER | General media |

### Edit Modal Fields

| Field | Database Field | Notes |
|-------|---------------|-------|
| Alt Text | `Media.alt` | Image description, shown in gallery captions |
| Caption | `Media.caption` | Additional context text |
| Role | `Media.role` | Determines where media appears |
| Project | `Media.projectId` | Assigns media to a project |

### Upload Rules

- **Accepted types:** JPEG, PNG, GIF, WebP, SVG, MP4, WebM, PDF, APK (`application/vnd.android.package-archive`)
- **Max size:** 20MB per file
- **Storage:** Supabase Storage (primary) → Cloudflare R2 → Local filesystem
- **Auth:** Session required (`/api/upload` is behind proxy + session check)

### Public gallery rendering

| MIME | Public project page |
|------|---------------------|
| `image/*` | `<img>` through `/api/images` proxy |
| `video/*` | `<video controls>` with proxied source |
| `application/pdf` | Filename card + **Download PDF** button (`?download=1`) |
| APK (`application/vnd.android.package-archive`) | Green APK card + **Download APK** button (`?download=1`) |
| other | Download link |

---

## 9. SITE SETTINGS

**Route:** `/admin/settings`

`getSiteSettings` requires an admin session (redirects to login if not signed in).

### Personal Settings

| Field | Database Key | Public Display |
|-------|-------------|----------------|
| Full Name | `SiteSetting.name` | (internal reference) |
| Display Name | `SiteSetting.displayName` | (internal reference) |
| Headline | `SiteSetting.headline` | (internal reference) |
| Bio | `SiteSetting.bio` | Homepage `Identity` section, about page |
| Email | `SiteSetting.email` | Homepage `ContactSection` email link |
| Location | `SiteSetting.location` | (internal reference) |

### Social Settings

| Field | Database Key | Public Display |
|-------|-------------|----------------|
| GitHub URL | `SiteSetting.github` | Homepage footer + ContactSection |
| LinkedIn URL | `SiteSetting.linkedin` | Homepage footer + ContactSection |
| Profile Image URL | `SiteSetting.profileImage` | (internal reference) |
| Favicon URL | `SiteSetting.favicon` | Browser tab icon |

### Site / SEO Settings

| Field | Database Key | Public Display |
|-------|-------------|----------------|
| Site Title | `SiteSetting.siteTitle` | Root layout `<title>` default (via `generateMetadata`) |
| Site Description | `SiteSetting.siteDescription` | Root meta description |
| Default OG Image URL | `SiteSetting.ogImage` | OG image; fallback `/api/og?title=...` |
| SEO Keywords | `SiteSetting.seoKeywords` | Meta keywords |

Values are normalized with `settingString()` (handles string/number/JSON shapes).

---

## 10. HOMEPAGE SECTION VISIBILITY

**Location:** Settings page → "Homepage Sections" section

### Toggle Checkboxes

| Toggle | Controls | Default |
|--------|----------|---------|
| Hero | `<Hero />` section | ON |
| Identity / Bio | `<Identity />` section | ON |
| Selected Projects | `<SelectedProjects />` section | ON |
| Philosophy | `<Philosophy />` section | ON |
| Skills Preview | `<SkillsPreview />` section | ON |
| Journey Preview | `<JourneyPreview />` section | ON |
| Research Preview | `<ResearchPreview />` section | ON |
| Future | `<Future />` section | ON |
| Contact | `<ContactSection />` section | ON |
| Continuation | `<Continuation />` section | ON |

### How It Works

- Stored in `SiteSetting` table as `homepage_{section}_visible` keys
- Values: `"true"` (show) or `"false"` (hide)
- Homepage checks these values and conditionally renders each section
- All sections default to ON (shown) when no setting exists

---

## 11. PUBLIC PAGE MAP

### Homepage (`/`)

| Section | Data Source | Admin Control |
|---------|-------------|---------------|
| Hero | Hardcoded | Toggle via Settings |
| Identity | `SiteSetting.bio` | Edit bio in Settings + toggle |
| Selected Projects | `Project` (PUBLISHED, showOnHomepage) | Set `showOnHomepage` per project + toggle |
| Philosophy | Hardcoded | Toggle via Settings |
| Skills Preview | `SkillGroup` → `Skill` | Toggle via Settings; links `/skills#id` |
| Journey Preview | `JourneyEntry` | Toggle via Settings |
| Research Preview | `ResearchEntry` | Toggle via Settings |
| Future | Hardcoded | Toggle via Settings |
| Contact | `SiteSetting.email`, `linkedin`, `github` | Edit in Settings + toggle |
| Continuation | Hardcoded | Toggle via Settings |

### Projects List (`/projects`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Project name | `Project.name` | Edit in project editor |
| One-liner | `Project.oneLine` | Edit in project editor |
| Year | `Project.year` | Edit in project editor |
| Category | `Project.category` | Edit in project editor |
| Cover thumbnail | `Media` (role=COVER) via `/api/images` | Upload, role=COVER, assign project |
| Sort order | `Project.displayOrder` | Settings tab |

### Project Detail (`/projects/[slug]`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Title / subtitle / year / category / tech tags | Project fields | Project editor |
| Story sections | Project story fields | Story tab |
| Rich content sections | `ProjectSection` + `SECTION_LABELS` | Sections tab |
| Gallery | `Media` assigned + visible — image/video/PDF | Media library + assign |
| Related Skills / Research / Achievements / Projects | Relationship tables | Links tab |
| SEO metadata | `seoTitle`, `seoDescription` | SEO tab |
| OG image | `ogImage` or `/api/og` | SEO / settings |

### Skills (`/skills`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Skill groups + `#id` anchors | `SkillGroup` | Admin CRUD |
| Skills per group | `Skill` | Admin CRUD |
| Sort order | `displayOrder` | Admin |

### Research (`/research`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Entries (visible) | `ResearchEntry` | Admin CRUD |
| Links `[{label,url}]` | `ResearchEntry.links` | Admin JSON input |

### Journey (`/journey`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Timeline (visible) | `JourneyEntry` | Admin CRUD |

### Achievements (`/achievements`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Entries (visible) | `Achievement` | Admin CRUD |

### Navigation (every public page)

Hardcoded links: About, Projects, Skills, Journey, Research, **Achievements**, Contact  
**Hidden on `/admin*`.**

### Footer (every public page)

Same link set as nav (includes Achievements) + GitHub/LinkedIn from SiteSetting  
**Hidden on `/admin*`.**

---

## 12. BEHAVIOR NOTES (2026-11 fixes)

| Behavior | Detail |
|----------|--------|
| Visible checkbox | Unchecked = hidden. Server uses `isChecked` — never `!== "off"` |
| Featured / Show on Homepage | Accepts `"on"`, `"true"`, or `"1"` from the form |
| Edit project save | Merges full project + edited fields; no silent data loss |
| Manager edit | Prefills existing values for skills, journey, research, achievements |
| Errors | Red banner under page header; form stays open on failure |
| Deletes | Confirm dialog for projects, skills, journey, research, achievements, media |
| Media upload | Multi-select; non-OK responses counted and shown |
| PDF upload | Allowed (alongside images and video) |
| PDF public display | Card + Download PDF (not broken `<img>`) |
| APK upload / display | Allowed; green APK badge in admin; public card + **Download APK** |
| Image proxy | Host allowlist only (Supabase / R2); `?download=1` forces attachment |
| Draft project API | 404 without admin session |
| Login | 5 failed attempts per IP per 15 minutes → 429 |
| Admin chrome | No public nav/footer under `/admin` |
| Root SEO | Title/description/OG from SiteSettings when set |

---

## TROUBLESHOOTING

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Project not on homepage | `showOnHomepage` false or not PUBLISHED | Settings tab → check homepage + status PUBLISHED |
| Section not showing | `visible` false or empty content | Sections tab → toggle + content |
| Image not in gallery | Not assigned or not visible | Media → edit → assign project |
| PDF looks broken as image | Old code path | Current gallery renders PDF cards + download |
| APK not accepted | Old MIME list | Latest allows `application/vnd.android.package-archive` |
| Skill not on project | Not linked | Links tab → check skill |
| Homepage section missing | Toggle OFF | Settings → Homepage Sections |
| Research not on homepage | `visible` false | Edit research → Visible |
| Save seems to wipe fields | Partial FormData bug (fixed) | Ensure on latest master (`7ed863f+`); full-state merge |
| Always-visible section | Old `!== "off"` bug (fixed) | Latest code uses `isChecked` |
| Build fails `supabaseUrl is required` | Missing env at build | Set SUPABASE_* on Vercel |
| 429 on login | Rate limit | Wait 15 min or restart local dev |
| 403 on image proxy | Host not allowlisted | Use Supabase/R2 URLs only |
| Vercel CLI "no credentials" | Not logged in | `vercel login` or push to GitHub for auto-deploy |
