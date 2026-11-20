import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const PROJECT_SLUG = 'esp32-battery-health-capacity-tester'
const DISPLAY_ORDER = 2

const projectData = {
  name: 'ESP32 Battery Health & Capacity Tester',
  slug: PROJECT_SLUG,
  oneLine:
    'A low-power, fanless diagnostic tool that uses a constant-current DC load to accurately measure the true capacity and health of lithium-ion batteries.',
  year: 2026,
  category: 'Hardware / Embedded Systems',
  status: 'PUBLISHED',
  featured: true,
  showOnHomepage: true,
  displayOrder: DISPLAY_ORDER,
  description:
    'A custom-built, professional-grade diagnostic device designed to test the true capacity (mAh/Wh) of 3.7V lithium-ion cells. It provides a real-time OLED interface and a single-button control system to transition seamlessly between charging and discharging phases.',
  problem:
    "Relying on voltage alone is a poor indicator of true battery health, and many commercial capacity testers are either inaccurate, overly complex, or require noisy active cooling. I needed a reliable, low-cost way to verify the actual capacity of 18650 cells without relying on cooling fans, tailored specifically for non-technical users.",
  designed:
    'I designed a fanless, constant-current DC dummy load circuit using an ESP32 microcontroller, an INA219 power monitor, and an LM358 Op-Amp driving an IRLZ44N MOSFET. The system integrates a TP4056 charging module with a custom hardware tap for auto-detecting a 100% charge state.',
  howItWorks:
    'The device operates in two main modes controlled by a single tactile button. In "Direct Test," it discharges the battery at a constant ~200mA, actively integrating current over time to calculate true capacity until hitting a safe 3.0V cutoff. In "Charge & Test," it monitors the TP4056 charging module via a logic-level tap, alerts the user when the battery hits 100%, and automatically begins the discharge test once the charger is removed.',
  engineering:
    'The core engineering challenge was creating a stable constant-current load without overheating. By utilizing a 10Ω dummy load and a 1Ω shunt resistor, and driving the LM358 via a PWM-filtered RC circuit from the ESP32, the system safely dissipates power entirely through natural ventilation. The firmware features a non-blocking state machine and a highly accurate 22-point Li-ion SOC (State of Charge) curve mapping for precise time-remaining estimations.',
  result:
    'A fully functional, highly accurate battery tester that successfully logs true mAh and Wh. The device is thermally stable, requires no cooling fans, and features an intuitive single-button UI with PWM audio feedback.',
  learned:
    'I deepened my understanding of analog control loops (translating PWM to analog via RC filters to drive an Op-Amp), non-blocking C++ state machine architecture, I2C bus management, and the discharge characteristics of lithium-ion chemistry.',
  technologies: [
    'ESP32',
    'C++',
    'I2C',
    'INA219',
    'LM358 Op-Amp',
    'MOSFET (IRLZ44N)',
    'PWM Control',
    'TP4056',
    'OLED SSD1306',
    'Hardware Design',
    'Embedded Systems',
  ],
  seoTitle: 'ESP32 Battery Health & Capacity Tester | Aditya Jadhav',
  seoDescription:
    'A custom-built, fanless ESP32 battery capacity tester utilizing an INA219, LM358 Op-Amp, and constant-current DC load to measure true Li-ion health.',
}

const sections = [
  {
    sectionType: 'FEATURES',
    title: 'Key Features',
    displayOrder: 1,
    content:
      '• Constant-Current Discharge: Maintains a steady ~200mA draw for highly accurate capacity integration.\n' +
      '• Charge & Test Auto-Transition: Custom hardware hack on the TP4056 IC to automatically detect a 100% charge state using low-side switching logic.\n' +
      '• Real-Time OLED Dashboard: Displays live Voltage, Current, accumulated mAh, true SOC percentage, and ETA using an Exponential Moving Average (EMA) filter to prevent jitter.\n' +
      '• Fanless Design: Thermally balanced 10Ω dummy load and 1Ω shunt resistor configuration allows for completely passive cooling.\n' +
      '• Smart Safety Cutoff: Automatically halts discharge exactly at 3.0V to prevent cell damage and locks the final capacity on the screen.',
  },
  {
    sectionType: 'HARDWARE',
    title: 'Circuit Architecture',
    displayOrder: 2,
    content:
      'The system uses an ESP32 as the central controller. Because the ESP32 outputs digital PWM rather than true analog, an RC filter (10kΩ + 100nF) converts the PWM signal into a flat analog reference voltage. The LM358 Dual Op-Amp continuously compares this reference voltage against the actual current drop across a 1Ω shunt resistor. The Op-Amp dynamically drives the gate of an IRLZ44N logic-level MOSFET, forcing it to act as a variable resistor. This closed-loop system maintains a perfect constant current across the 10Ω load regardless of the battery\'s dropping voltage.',
  },
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

  const counts = await prisma.project.findUnique({
    where: { id: project.id },
    include: {
      _count: {
        select: {
          sections: true,
          projectSkills: true,
          researchProjects: true,
          journeyProjects: true,
          media: true,
        },
      },
    },
  })

  console.log('ESP32 Battery Health & Capacity Tester seed complete')
  console.log(`  Project: ${project.slug} (${project.status})`)
  console.log(`  Display order: ${project.displayOrder}`)
  console.log(`  Sections: ${counts._count.sections}`)
  console.log(`  Skills linked: ${counts._count.projectSkills}`)
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
