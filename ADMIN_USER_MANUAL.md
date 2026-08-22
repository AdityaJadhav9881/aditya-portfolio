# INFINITY DESIGN — ADMIN USER MANUAL

> Complete guide to every admin feature, what it controls, and where it appears on the public website.

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
| **Delete** | Permanently removes project | Project page returns 404 |
| **Edit** | Opens project editor | N/A (admin only) |

---

## 3. PROJECT EDITOR

**Route:** `/admin/projects/[id]` (edit) or `/admin/projects/new` (create)

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
| TECHNICAL | Technical Details |
| HOW_IT_WORKS | How It Works |
| TESTING | Testing |
| CHALLENGES | Challenges |
| LESSONS | Lessons |
| RESEARCH | Research |
| FUTURE | Future Improvements |
| GALLERY | Gallery |

**Per Section Fields:**

| Field | Database Field | Notes |
|-------|---------------|-------|
| Section Type | `ProjectSection.sectionType` | Dropdown of 12 types |
| Title | `ProjectSection.title` | Custom heading (optional, type default used if empty) |
| Content | `ProjectSection.content` | Main text content |
| Display Order | `ProjectSection.displayOrder` | Controls sort order |
| Visible | `ProjectSection.visible` | Toggle on/off |

**Note:** Only sections with `visible = true` AND non-empty content render on the public page.

### Tab 5: MEDIA

Shows all media files assigned to this project. To upload/assign media, go to `/admin/media`.

### Tab 6: LINKS (Relationships)

Four relationship panels:

| Relationship | Database Table | Public Display |
|-------------|---------------|----------------|
| **Skills** | `ProjectSkill` | "Related Skills" section on project detail page |
| **Research** | `ResearchProject` | "Related Research" section on project detail page |
| **Achievements** | `AchievementProject` | Shows in achievement's related projects |
| **Related Projects** | `ProjectRelatedProject` | "Related Projects" links on project detail page |

### Tab 7: SETTINGS

| Field | Database Field | Public Effect |
|-------|---------------|---------------|
| Status | `Project.status` | DRAFT = hidden from public, PUBLISHED = visible, ARCHIVED = hidden from listings |
| Display Order | `Project.displayOrder` | Controls sort order in project list and homepage |
| Featured | `Project.featured` | Featured projects highlighted (homepage featured section) |
| Show on Homepage | `Project.showOnHomepage` | If checked, appears in homepage "Selected Projects" (max 5) |

### Tab 8: SEO

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| SEO Title | `Project.seoTitle` | `<title>` tag, OG title, Twitter title |
| SEO Description | `Project.seoDescription` | Meta description, OG description, Twitter description |

**Auto-generated if empty:**
- Title: `{Project.name} | Aditya Jadhav`
- Description: `{Project.oneLine}`
- OG Image: `{siteUrl}/api/og?title={project.name}`
- Canonical URL: `{siteUrl}/projects/{slug}`

---

## 4. SKILLS

**Route:** `/admin/skills`

### What You Manage

Two levels: **Skill Groups** (categories) and **Skills** (individual items).

### Skill Groups

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Name | `SkillGroup.name` | Group heading on `/skills` page |
| Slug | `SkillGroup.slug` | Anchor ID: `/skills#{slug}` |
| Description | `SkillGroup.description` | Group description text |
| Display Order | `SkillGroup.displayOrder` | Sort order on `/skills` page |

### Skills

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Name | `Skill.name` | Skill name tag in group, also appears in project "Related Skills" |
| Slug | `Skill.slug` | Internal identifier |
| Skill Group | `Skill.skillGroupId` | Determines which group the skill belongs to |
| Display Order | `Skill.displayOrder` | Sort order within group |

**Public Pages:**
- `/skills` — Shows all skill groups with their skills
- `/skills/[skillId]` — Individual skill page showing related projects
- Homepage `SkillsPreview` — Shows first 3 skills per group + overflow count

---

## 5. RESEARCH

**Route:** `/admin/research`

### Fields

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Title | `ResearchEntry.title` | Entry heading on `/research` page |
| Slug | `ResearchEntry.slug` | Anchor ID: `/research#{slug}` |
| Description | `ResearchEntry.description` | Entry description text |
| Links | `ResearchEntry.links` (JSON) | Array of `{label, url}` — rendered as clickable links |
| Display Order | `ResearchEntry.displayOrder` | Sort order on `/research` page |
| Visible | `ResearchEntry.visible` | Hidden entries don't appear on `/research` or homepage |

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

**Public Page:** `/achievements` — Lists all visible achievements

---

## 7. JOURNEY

**Route:** `/admin/journey`

### Fields

| Field | Database Field | Public Display |
|-------|---------------|----------------|
| Year | `JourneyEntry.year` | Timeline year label |
| Title | `JourneyEntry.title` | Entry heading |
| Description | `JourneyEntry.description` | Entry text |
| Type | `JourneyEntry.type` | MILESTONE = default dot, PROJECT = project dot, ONGOING = accent-colored dot |
| Display Order | `JourneyEntry.displayOrder` | Sort order on `/journey` page |
| Visible | `JourneyEntry.visible` | Hidden entries don't appear publicly |

**Public Pages:**
- `/journey` — Full timeline of all visible entries
- Homepage `JourneyPreview` — Shows last 4 visible entries as mini timeline

---

## 8. MEDIA LIBRARY

**Route:** `/admin/media`

### Features

| Feature | How | What It Does |
|---------|-----|-------------|
| **Upload** | Click "Upload Media" button, select file | Uploads to Supabase Storage (or R2/local fallback) |
| **Search** | Type in search box | Filters by filename or alt text |
| **Role Filter** | Dropdown (All/Cover/Hero/Gallery/Diagram/Hardware/Testing/Other) | Filters by media role |
| **Type Filter** | Buttons (All/Images/Videos/PDFs) | Filters by MIME type |
| **Edit** | Click edit icon on any media item | Opens inline edit modal |
| **Delete** | Click delete icon | Removes from storage + database |

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

- **Accepted types:** JPEG, PNG, GIF, WebP, SVG, MP4, WebM, PDF
- **Max size:** 20MB
- **Storage:** Supabase Storage (primary) → Cloudflare R2 → Local filesystem

---

## 9. SITE SETTINGS

**Route:** `/admin/settings`

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
| Site Title | `SiteSetting.siteTitle` | `<title>` tag template |
| Site Description | `SiteSetting.siteDescription` | Meta description |
| Default OG Image URL | `SiteSetting.ogImage` | Open Graph image fallback |
| SEO Keywords | `SiteSetting.seoKeywords` | Meta keywords |

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
| Selected Projects | `Project` (top 5, PUBLISHED, showOnHomepage) | Set `showOnHomepage` per project + toggle |
| Philosophy | Hardcoded | Toggle via Settings |
| Skills Preview | `SkillGroup` → `Skill` | Toggle via Settings |
| Journey Preview | `JourneyEntry` (last 4) | Toggle via Settings |
| Research Preview | `ResearchEntry` | Toggle via Settings |
| Future | Hardcoded | Toggle via Settings |
| Contact | `SiteSetting.email`, `SiteSetting.linkedin`, `SiteSetting.github` | Edit in Settings + toggle |
| Continuation | Hardcoded | Toggle via Settings |

### Projects List (`/projects`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Project name | `Project.name` | Edit in project editor |
| One-liner | `Project.oneLine` | Edit in project editor |
| Year | `Project.year` | Edit in project editor |
| Category | `Project.category` | Edit in project editor |
| Cover thumbnail | `Media` (role=COVER, assigned to project) | Upload media, set role=COVER, assign to project |
| Sort order | `Project.displayOrder` | Edit in project editor → Settings tab |

### Project Detail (`/projects/[slug]`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Title | `Project.name` | Edit in project editor |
| Subtitle | `Project.oneLine` | Edit in project editor |
| Year + Category | `Project.year`, `Project.category` | Edit in project editor |
| Technology tags | `Project.technologies[]` | Edit in project editor → Technical tab |
| Story sections | `Project.description/problem/designed/howItWorks/engineering/result/learned` | Edit in project editor → Story tab |
| Rich content sections | `ProjectSection` records | Add/edit in Sections tab |
| Gallery images | `Media` (assigned to project, visible=true) | Upload media, assign to project |
| Related Skills | `ProjectSkill` → `Skill` | Toggle in Links tab |
| Related Research | `ResearchProject` → `ResearchEntry` | Toggle in Links tab |
| Related Projects | `ProjectRelatedProject` → `Project` | Toggle in Links tab |
| SEO metadata | `Project.seoTitle`, `Project.seoDescription` | Edit in SEO tab |

### Skills (`/skills`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Skill groups | `SkillGroup` | Create/edit/delete in admin |
| Skills per group | `Skill` | Create/edit/delete in admin |
| Sort order | `displayOrder` fields | Edit in admin |

### Research (`/research`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Research entries | `ResearchEntry` (visible=true) | Create/edit/delete in admin |
| Links | `ResearchEntry.links` (JSON) | Edit in admin |
| Sort order | `ResearchEntry.displayOrder` | Edit in admin |

### Journey (`/journey`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Timeline entries | `JourneyEntry` (visible=true) | Create/edit/delete in admin |
| Entry types | `JourneyEntry.type` | Edit in admin (MILESTONE/PROJECT/ONGOING) |
| Sort order | `JourneyEntry.displayOrder` | Edit in admin |

### Achievements (`/achievements`)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| Achievement entries | `Achievement` (visible=true) | Create/edit/delete in admin |
| Year, category | `Achievement.year`, `Achievement.category` | Edit in admin |
| Sort order | `Achievement.displayOrder` | Edit in admin |

### Footer (Every Page)

| Element | Data Source | Admin Control |
|---------|-------------|---------------|
| GitHub link | `SiteSetting.github` | Edit in Settings |
| LinkedIn link | `SiteSetting.linkedin` | Edit in Settings |
| Copyright year | `new Date().getFullYear()` | Automatic |

### Navigation (Every Page)

All links are hardcoded — not database-driven:
- About, Projects, Skills, Journey, Research, Contact

---

## TROUBLESHOOTING

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| Project not on homepage | `showOnHomepage` is false or status is not PUBLISHED | Edit project → Settings tab → check "Show on Homepage", set status to PUBLISHED |
| Section not showing on project page | `visible` is false or content is empty | Edit project → Sections tab → toggle visibility, ensure content exists |
| Image not in gallery | Media not assigned to project or `visible` is false | Go to Media → edit media → assign to project, ensure visible |
| Skill not on project | Skill not linked | Edit project → Links tab → check the skill |
| Homepage section missing | Section toggle is OFF | Settings → Homepage Sections → enable the section |
| Research not on homepage | `visible` is false | Edit research entry → check "Visible" |
| Build fails with `supabaseUrl is required` | Env vars missing during build | Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in Vercel |
