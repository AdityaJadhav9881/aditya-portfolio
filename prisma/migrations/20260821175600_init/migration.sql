-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('STORY', 'FEATURES', 'HARDWARE', 'SOFTWARE', 'TECHNICAL', 'HOW_IT_WORKS', 'TESTING', 'CHALLENGES', 'LESSONS', 'RESEARCH', 'FUTURE', 'GALLERY');

-- CreateEnum
CREATE TYPE "MediaRole" AS ENUM ('COVER', 'HERO', 'GALLERY', 'DIAGRAM', 'HARDWARE', 'TESTING', 'OTHER');

-- CreateEnum
CREATE TYPE "JourneyType" AS ENUM ('MILESTONE', 'PROJECT', 'ONGOING');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "oneLine" TEXT,
    "year" INTEGER,
    "category" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "showOnHomepage" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "problem" TEXT,
    "designed" TEXT,
    "howItWorks" TEXT,
    "engineering" TEXT,
    "result" TEXT,
    "learned" TEXT,
    "technologies" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "ogImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSection" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "skillGroupId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSkill" (
    "projectId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,

    CONSTRAINT "ProjectSkill_pkey" PRIMARY KEY ("projectId","skillId")
);

-- CreateTable
CREATE TABLE "JourneyEntry" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "JourneyType" NOT NULL DEFAULT 'MILESTONE',
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JourneyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JourneyProject" (
    "journeyId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "JourneyProject_pkey" PRIMARY KEY ("journeyId","projectId")
);

-- CreateTable
CREATE TABLE "ResearchEntry" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "links" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResearchEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResearchProject" (
    "researchId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ResearchProject_pkey" PRIMARY KEY ("researchId","projectId")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "year" INTEGER,
    "category" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "caption" TEXT,
    "role" "MediaRole" NOT NULL DEFAULT 'OTHER',
    "projectId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectRelatedProject" (
    "projectId" TEXT NOT NULL,
    "relatedProjectId" TEXT NOT NULL,

    CONSTRAINT "ProjectRelatedProject_pkey" PRIMARY KEY ("projectId","relatedProjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_year_idx" ON "Project"("year");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Project_showOnHomepage_idx" ON "Project"("showOnHomepage");

-- CreateIndex
CREATE INDEX "Project_displayOrder_idx" ON "Project"("displayOrder");

-- CreateIndex
CREATE INDEX "Project_slug_idx" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "ProjectSection_projectId_idx" ON "ProjectSection"("projectId");

-- CreateIndex
CREATE INDEX "ProjectSection_sectionType_idx" ON "ProjectSection"("sectionType");

-- CreateIndex
CREATE INDEX "ProjectSection_displayOrder_idx" ON "ProjectSection"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "SkillGroup_slug_key" ON "SkillGroup"("slug");

-- CreateIndex
CREATE INDEX "SkillGroup_displayOrder_idx" ON "SkillGroup"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_slug_key" ON "Skill"("slug");

-- CreateIndex
CREATE INDEX "Skill_skillGroupId_idx" ON "Skill"("skillGroupId");

-- CreateIndex
CREATE INDEX "Skill_displayOrder_idx" ON "Skill"("displayOrder");

-- CreateIndex
CREATE INDEX "ProjectSkill_skillId_idx" ON "ProjectSkill"("skillId");

-- CreateIndex
CREATE INDEX "JourneyEntry_year_idx" ON "JourneyEntry"("year");

-- CreateIndex
CREATE INDEX "JourneyEntry_type_idx" ON "JourneyEntry"("type");

-- CreateIndex
CREATE INDEX "JourneyEntry_displayOrder_idx" ON "JourneyEntry"("displayOrder");

-- CreateIndex
CREATE INDEX "JourneyEntry_visible_idx" ON "JourneyEntry"("visible");

-- CreateIndex
CREATE INDEX "JourneyProject_projectId_idx" ON "JourneyProject"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "ResearchEntry_slug_key" ON "ResearchEntry"("slug");

-- CreateIndex
CREATE INDEX "ResearchEntry_displayOrder_idx" ON "ResearchEntry"("displayOrder");

-- CreateIndex
CREATE INDEX "ResearchEntry_visible_idx" ON "ResearchEntry"("visible");

-- CreateIndex
CREATE INDEX "ResearchEntry_slug_idx" ON "ResearchEntry"("slug");

-- CreateIndex
CREATE INDEX "ResearchProject_projectId_idx" ON "ResearchProject"("projectId");

-- CreateIndex
CREATE INDEX "Achievement_year_idx" ON "Achievement"("year");

-- CreateIndex
CREATE INDEX "Achievement_category_idx" ON "Achievement"("category");

-- CreateIndex
CREATE INDEX "Achievement_displayOrder_idx" ON "Achievement"("displayOrder");

-- CreateIndex
CREATE INDEX "Achievement_visible_idx" ON "Achievement"("visible");

-- CreateIndex
CREATE INDEX "Media_projectId_idx" ON "Media"("projectId");

-- CreateIndex
CREATE INDEX "Media_role_idx" ON "Media"("role");

-- CreateIndex
CREATE INDEX "Media_displayOrder_idx" ON "Media"("displayOrder");

-- CreateIndex
CREATE INDEX "Media_visible_idx" ON "Media"("visible");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_key_key" ON "SiteSetting"("key");

-- CreateIndex
CREATE INDEX "ProjectRelatedProject_relatedProjectId_idx" ON "ProjectRelatedProject"("relatedProjectId");

-- AddForeignKey
ALTER TABLE "ProjectSection" ADD CONSTRAINT "ProjectSection_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_skillGroupId_fkey" FOREIGN KEY ("skillGroupId") REFERENCES "SkillGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSkill" ADD CONSTRAINT "ProjectSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyProject" ADD CONSTRAINT "JourneyProject_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "JourneyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JourneyProject" ADD CONSTRAINT "JourneyProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_researchId_fkey" FOREIGN KEY ("researchId") REFERENCES "ResearchEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchProject" ADD CONSTRAINT "ResearchProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRelatedProject" ADD CONSTRAINT "ProjectRelatedProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectRelatedProject" ADD CONSTRAINT "ProjectRelatedProject_relatedProjectId_fkey" FOREIGN KEY ("relatedProjectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
