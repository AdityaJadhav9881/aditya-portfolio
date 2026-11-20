import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const PROJECT_SLUG = 'infinity-node-ai-smart-speaker-touch-os'
const DISPLAY_ORDER = 2
const RELATED_PROJECT_SLUG = 'infinity-power-guard'

const projectData = {
  name: 'Infinity Node: AI Smart Speaker & Touch OS',
  slug: PROJECT_SLUG,
  oneLine:
    'A dual-core ESP32 smart speaker featuring a custom touch UI, real-time battery telemetry, and I2S digital audio streaming.',
  year: 2026,
  category: 'IoT & Embedded Systems',
  status: 'PUBLISHED',
  featured: true,
  showOnHomepage: true,
  displayOrder: DISPLAY_ORDER,
  description:
    'The Infinity Node is a "master class" embedded systems project designed to push the absolute hardware limits of the ESP32. It is a standalone, battery-powered smart assistant featuring a 4-app touch operating system (Clock, Alarm, Stopwatch, Gallery) and a fully integrated AI voice interface.',
  problem:
    'Commercial smart speakers operate as closed black boxes, and standard microcontroller UI projects typically freeze when handling heavy network or audio tasks. I needed to engineer a system capable of streaming two-way high-fidelity audio without interrupting the fluidity of a touch-based graphical interface.',
  designed:
    'I architected a highly integrated hardware system using a shared VSPI bus for the display and touch controller, a dedicated I2C bus for 16-bit analog-to-digital battery telemetry, and a dual I2S digital audio pipeline for pristine microphone capture and speaker amplification.',
  howItWorks:
    'The system listens for voice commands via an INMP441 MEMS microphone, streams the digitized audio over Wi-Fi to a cloud AI API, and plays the response through a MAX98357A Class-D amplifier. The UI remains constantly active, displaying real-time battery calculations derived from a voltage divider routed through an ADS1115.',
  engineering:
    'The software relies on a strict FreeRTOS dual-core architecture. Core 0 handles heavy network loads, HTTP requests, and I2S Direct Memory Access (DMA) audio buffers. Core 1 is strictly dedicated to a non-blocking millis() loop that manages UI rendering, touch debounce logic, and telemetry math.',
  result:
    'A highly stable, portable AI node that balances heavy Wi-Fi radio usage and intense audio processing without dropping frames on the display or triggering hardware brownouts.',
  learned:
    'This project provided deep, hands-on experience with FreeRTOS task pinning, I2S digital audio protocols, mitigating pin multiplexing conflicts, and designing critical power-smoothing circuitry (buffer capacitors) to prevent voltage collapse during current spikes.',
  technologies: [
    'ESP32',
    'FreeRTOS',
    'Embedded C++',
    'I2S Digital Audio',
    'ST7789 TFT',
    'XPT2046 Touch',
    'ADS1115 ADC',
    'INMP441 Microphone',
    'MAX98357A Amplifier',
    'API Integration',
  ],
  seoTitle: 'Infinity Node: ESP32 AI Smart Speaker | Aditya Jadhav',
  seoDescription:
    'A custom-built ESP32 smart speaker featuring a touch-based Operating System, FreeRTOS dual-core processing, and I2S digital audio streaming.',
}

const sections = [
  {
    sectionType: 'HARDWARE',
    title: 'The Power & Audio Architecture',
    displayOrder: 1,
    content:
      'Power stability was the biggest hurdle. When the Wi-Fi radio transmits while the MAX98357A amplifier hits a bass note, the massive current draw can cause a brownout reset. I engineered a robust power delivery system using a 5V boost converter fed by a 3.7V lithium battery, stabilized by 470µF electrolytic buffer capacitors across the 5V rails. To protect the logic chips, the ADS1115 telemetry line is clamped using an SR560 Schottky diode, ensuring negative voltage never destroys the I2C bus.',
  },
  {
    sectionType: 'SOFTWARE',
    title: 'Dual-Core FreeRTOS Implementation',
    displayOrder: 2,
    content:
      'To prevent the 4-app touch OS from lagging, I abandoned standard Arduino delay() loops entirely. By pinning the network and I2S audio streaming tasks to ESP32 Core 0, and isolating the TFT graphics and XPT2046 touch interrupts on Core 1, the visual interface maintains high framerates even while the processor is actively encoding and transmitting audio buffers over Wi-Fi.',
  },
]

const skillLinks = [
  { name: 'Embedded Systems', slug: 'embedded-systems' },
  { name: 'C++', slug: 'cpp' },
  { name: 'Hardware Design', slug: 'hardware-design' },
  { name: 'IoT', slug: 'iot' },
  { name: 'FreeRTOS', slug: 'freertos', groupSlug: 'software', groupName: 'Software', groupOrder: 2 },
]

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const existingProject = await prisma.project.findUnique({ where: { slug: PROJECT_SLUG } })

  if (!existingProject) {
    await prisma.project.updateMany({
      where: { displayOrder: { gte: DISPLAY_ORDER } },
      data: { displayOrder: { increment: 1 } },
    })
  }

  const project = await prisma.project.upsert({
    where: { slug: PROJECT_SLUG },
    update: projectData,
    create: projectData,
  })

  await prisma.projectSection.deleteMany({ where: { projectId: project.id } })
  await prisma.projectSection.createMany({
    data: sections.map((section) => ({ ...section, projectId: project.id, visible: true })),
  })

  const linkedSkillIds = []
  for (let i = 0; i < skillLinks.length; i++) {
    const link = skillLinks[i]
    const existingSkill = await prisma.skill.findUnique({ where: { slug: link.slug } })

    let skill
    if (existingSkill) {
      skill = await prisma.skill.update({ where: { slug: link.slug }, data: { name: link.name } })
    } else {
      if (!link.groupSlug) {
        throw new Error(`Skill "${link.name}" does not exist and no group was specified`)
      }
      let group = await prisma.skillGroup.findUnique({ where: { slug: link.groupSlug } })
      if (!group) {
        group = await prisma.skillGroup.create({
          data: {
            name: link.groupName,
            slug: link.groupSlug,
            displayOrder: link.groupOrder,
          },
        })
      }
      skill = await prisma.skill.create({
        data: {
          name: link.name,
          slug: link.slug,
          skillGroupId: group.id,
          displayOrder: i + 1,
        },
      })
    }
    linkedSkillIds.push(skill.id)
  }

  await prisma.projectSkill.deleteMany({ where: { projectId: project.id } })
  await prisma.projectSkill.createMany({
    data: linkedSkillIds.map((skillId) => ({ projectId: project.id, skillId })),
  })

  const related = await prisma.project.findUnique({ where: { slug: RELATED_PROJECT_SLUG } })
  if (related) {
    await prisma.projectRelatedProject.upsert({
      where: {
        projectId_relatedProjectId: {
          projectId: project.id,
          relatedProjectId: related.id,
        },
      },
      update: {},
      create: { projectId: project.id, relatedProjectId: related.id },
    })
  }

  const counts = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      _count: {
        select: {
          sections: true,
          projectSkills: true,
          relatedProjects: true,
          researchProjects: true,
          journeyProjects: true,
          media: true,
        },
      },
    },
  })

  console.log('Infinity Node seed complete')
  console.log(`  Project: ${project.slug} (${project.status})`)
  console.log(`  Display order: ${project.displayOrder}`)
  console.log(`  Sections: ${counts._count.sections}`)
  console.log(`  Skills linked: ${counts._count.projectSkills}`)
  console.log(`  Related projects: ${counts._count.relatedProjects}${related ? '' : ' (Infinity Power Guard not found)'}`)
  console.log(`  Research links: ${counts._count.researchProjects}`)
  console.log(`  Journey links: ${counts._count.journeyProjects}`)
  console.log(`  Media: ${counts._count.media} (upload manually in /admin/media)`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
