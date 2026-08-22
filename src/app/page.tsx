import { prisma } from '@/lib/db'
import Hero from '@/sections/Hero'

export const dynamic = "force-dynamic";
import Identity from '@/sections/Identity'
import Philosophy from '@/sections/Philosophy'
import SelectedProjects from '@/sections/SelectedProjects'
import SkillsPreview from '@/sections/SkillsPreview'
import JourneyPreview from '@/sections/JourneyPreview'
import ResearchPreview from '@/sections/ResearchPreview'
import Future from '@/sections/Future'
import ContactSection from '@/sections/ContactSection'
import Continuation from '@/sections/Continuation'

async function getHomepageData() {
  const [projects, skillGroups, journey, research, settings] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED', showOnHomepage: true },
      orderBy: { displayOrder: 'asc' },
      take: 5,
    }),
    prisma.skillGroup.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { skills: { orderBy: { displayOrder: 'asc' } } },
    }),
    prisma.journeyEntry.findMany({
      where: { visible: true },
      orderBy: { displayOrder: 'asc' },
      include: { journeyProjects: { include: { project: true } } },
    }),
    prisma.researchEntry.findMany({
      where: { visible: true },
      orderBy: { displayOrder: 'asc' },
      include: { researchProjects: { include: { project: true } } },
    }),
    prisma.siteSetting.findMany(),
  ])

  const settingsMap = Object.fromEntries(settings.map((s: any) => [s.key, s.value]))

  return { projects, skillGroups, journey, research, settingsMap }
}

export default async function Home() {
  const { projects, skillGroups, journey, research, settingsMap } = await getHomepageData()

  const serializableProjects = projects.map((p: any) => ({
    ...p,
    year: p.year ?? 0,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  const serializableJourney = journey.map((j: any) => ({
    ...j,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
    journeyProjects: j.journeyProjects.map((jp: any) => ({
      ...jp,
      project: {
        ...jp.project,
        year: jp.project.year ?? 0,
        createdAt: jp.project.createdAt.toISOString(),
        updatedAt: jp.project.updatedAt.toISOString(),
      },
    })),
  }))

  const serializableResearch = research.map((r: any) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    researchProjects: r.researchProjects.map((rp: any) => ({
      ...rp,
      project: {
        ...rp.project,
        year: rp.project.year ?? 0,
        createdAt: rp.project.createdAt.toISOString(),
        updatedAt: rp.project.updatedAt.toISOString(),
      },
    })),
  }))

  const serializableSkills = skillGroups.map((g: any) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
    skills: g.skills.map((s: any) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
  }))

  return (
    <>
      {settingsMap.homepage_hero_visible !== "false" && <Hero />}
      {settingsMap.homepage_identity_visible !== "false" && <Identity bio={String(settingsMap.bio || '')} />}
      {settingsMap.homepage_projects_visible !== "false" && <SelectedProjects projects={serializableProjects as any} />}
      {settingsMap.homepage_philosophy_visible !== "false" && <Philosophy />}
      {settingsMap.homepage_skills_visible !== "false" && <SkillsPreview skillGroups={serializableSkills as any} />}
      {settingsMap.homepage_journey_visible !== "false" && <JourneyPreview journey={serializableJourney as any} />}
      {settingsMap.homepage_research_visible !== "false" && <ResearchPreview research={serializableResearch as any} />}
      {settingsMap.homepage_future_visible !== "false" && <Future />}
      {settingsMap.homepage_contact_visible !== "false" && (
        <ContactSection
          email={String(settingsMap.email || '')}
          linkedin={String(settingsMap.linkedin || '')}
          github={String(settingsMap.github || '')}
        />
      )}
      {settingsMap.homepage_continuation_visible !== "false" && <Continuation />}
    </>
  )
}
