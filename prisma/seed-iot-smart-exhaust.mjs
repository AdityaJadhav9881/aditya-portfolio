import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const PROJECT_SLUG = 'iot-smart-exhaust-system'
const DISPLAY_ORDER = 3

const projectData = {
  name: 'Infinity Air Guard (Smart Exhaust)',
  slug: PROJECT_SLUG,
  oneLine:
    'Autonomous three-tier cyber-physical ventilation controller — ESP32 sensor node, Firebase RTDB cloud bridge, and Flutter companion app — that monitors indoor air quality and regulates exhaust fans without manual intervention.',
  year: 2026,
  category: 'Embedded Systems / IoT',
  status: 'PUBLISHED',
  featured: true,
  showOnHomepage: true,
  displayOrder: DISPLAY_ORDER,
  description:
    'Infinity Air Guard (Smart Exhaust) is an autonomous, three-tier cyber-physical ventilation controller built to monitor indoor air quality and regulate room exhaust fans without manual intervention. The system combines an ESP32-based sensor and motor-control node, a Google Firebase Realtime Database (RTDB) cloud bridge, and a cross-platform Flutter companion app to evacuate combustible gases, cooking fumes, and excessive humidity while cutting wasted electrical energy. Built as a Second Year EIMS Semester-End Mini Project (Academic Year 2026–27) at AISSMS IOIT, Pune, by Aditya Jadhav, Shravan Khedkar, and Pranav Joshi under the guidance of Ms. Vaishnavi P. Kulkarni.',
  problem:
    'Conventional exhaust fans rely on manual wall switches or simple mechanical timers, leaving spaces vulnerable to unnoticed LPG leaks and mold-inducing humidity while wasting electricity when fans are left running. Meanwhile, commercial smart fans calibrated for Western climates (typically 26°C–28°C and 55%–60% RH) run continuously in Indian summers (32°C–42°C) and monsoons (75%–85% RH), causing motor wear and acoustic nuisance.',
  designed:
    'I designed a three-tier architecture: a hardware layer (ESP32-DevKitC, DHT22, MQ-5, DRV8871 H-Bridge, piezo buzzer, LM2596 buck stage), a 1,304-line non-blocking cooperative firmware state machine in C++/Arduino Core 2.0.17, and a cloud/mobile layer (Firebase RTDB + Flutter 3/Dart with Riverpod, GoRouter, Hive, and fl_chart). The tiers communicate over serverless HTTPS REST/WebSocket synchronization.',
  howItWorks:
    'The ESP32 polls DHT22 (temperature/humidity on GPIO 4) and MQ-5 (combustible gas on 12-bit ADC GPIO 34) using millis() timers — no blocking delays. Sensor readings sync to Firebase RTDB, where the Flutter app renders live telemetry, historical graphs (1H/6H/24H/7D), mode toggles, and Indian-climate-calibrated presets. The DRV8871 drives a 12V DC exhaust fan on GPIO 27 with deadband hysteresis to eliminate relay chatter; a piezo buzzer on GPIO 26 (LEDC hardware PWM) sounds the gas alarm. Settings persist to NVS flash with 30-second wear-leveled writes; an AP captive portal (AirGuard-Setup) provisions Wi-Fi, and a local HTTP API over mDNS (airguard.local) keeps the system controllable offline.',
  engineering:
    'Priority-1 Combustible Gas Safety Latch: Overrides all user modes (Auto, Manual, Exhaust) during gas leaks, forcing the fan to 100% exhaust and activating an alternating 2000 Hz / 3000 Hz dual-tone piezo alarm. Indian Climate-Calibrated Presets & Live Sliders: Custom environmental profiles tuned for high-ambient Indian conditions (up to 42.0°C and 85% RH) alongside a real-time Custom preset synced bi-directionally to the ESP32. Asynchronous Switch Confirmation Engine: Optimistic mobile UI toggle with an in-thumb loading indicator and an 8-second safety timeout to prevent switch-snapping lag over cellular networks. Hardware Debugging & Resilience: Resolved NVS reboot relay override bugs, LEDC buzzer pin conflicts (ledcDetachPin()), and HTTPS certificate handling (WiFiClientSecure) during physical board testing.',
  result:
    'Air evacuation time of 25 s – 62 s across 5 room profiles (45 s for 950 ppm gas clearance; 62 s for 86% → 58% RH steam clearance), with clearance efficiency of 92.8% – 98.0%. Up to 64% power saved vs. unmanaged continuous ventilation. 4.2 s automatic Firebase reconnection after router reboot during 72-hour burn-in testing. Firmware runs at 76% Flash and 15% RAM on the ESP32. Artifacts include the research paper "Smart Exhaust: An IoT-Based Intelligent Environmental Ventilation and Indoor Air Quality Controller", the Second Year EIMS Mini Project Report, and complete hardware, firmware (v2.1.0), cloud schema, and Flutter app documentation.',
  learned:
    'Deepened expertise in non-blocking cooperative embedded state machines, NVS flash wear-leveling and persistence design, deadband hysteresis for actuator control, LEDC PWM peripheral conflicts, HTTPS/TLS handling on resource-constrained MCUs, and optimistic UI patterns with safety timeouts over high-latency cellular links. Learned to calibrate environmental thresholds for Indian climate extremes rather than Western test-lab conditions, and to design a safety latch that cannot be overridden by any user mode.',
  technologies: [
    'ESP32',
    'Embedded C++',
    'KiCad',
    'DRV8871',
    'DHT22',
    'MQ-5',
    'Firebase RTDB',
    'Flutter',
    'Dart',
    'Riverpod',
    'Hive',
    'fl_chart',
    'IoT',
    'NVS Flash',
    'mDNS',
  ],
  seoTitle: 'Infinity Air Guard (Smart Exhaust) | Aditya Jadhav',
  seoDescription:
    'IoT intelligent environmental ventilation and indoor air quality controller: ESP32 + Firebase + Flutter three-tier system with gas-safety latch, Indian climate presets, and 64% energy savings.',
}

const sections = [
  {
    sectionType: 'FEATURES',
    title: 'Key Engineering Highlights',
    displayOrder: 1,
    content:
      '• Priority-1 Combustible Gas Safety Latch — Overrides all user modes (Auto, Manual, Exhaust) during gas leaks, forcing the fan to 100% exhaust with an alternating 2000 Hz / 3000 Hz dual-tone piezo alarm.\n' +
      '• Indian Climate-Calibrated Presets & Live Sliders — Custom environmental profiles tuned for high-ambient Indian conditions (up to 42.0°C and 85% RH), with a real-time Custom preset synced bi-directionally to the ESP32.\n' +
      '• Asynchronous Switch Confirmation Engine — Optimistic mobile UI toggle with in-thumb loading indicator and an 8-second safety timeout to prevent switch-snapping lag over cellular networks.\n' +
      '• Hardware Debugging & Resilience — Resolved NVS reboot relay override bugs, LEDC buzzer pin conflicts (ledcDetachPin()), and HTTPS certificate handling (WiFiClientSecure) during physical board testing.',
  },
  {
    sectionType: 'HARDWARE',
    title: 'Hardware Layer',
    displayOrder: 2,
    content:
      'Espressif ESP32-DevKitC (240 MHz dual-core) hosts the node. A DHT22 digital temperature/humidity sensor sits on GPIO 4 (±0.5°C, ±2% RH); an MQ-5 combustible gas sensor reads into the 12-bit ADC on GPIO 34 at 11 dB attenuation. A Texas Instruments DRV8871 H-Bridge driver (up to 3.6 A peak) drives a 12V DC exhaust fan on GPIO 27 — solid-state, no relay sparking near the gas sensor. A passive piezo buzzer runs via LEDC hardware PWM on GPIO 26, and an LM2596 buck stage steps 12V down to 5V/3.3V logic rails. Designed in KiCad.',
  },
  {
    sectionType: 'SOFTWARE',
    title: 'Embedded Firmware',
    displayOrder: 3,
    content:
      'C++ / Arduino Core 2.0.17: a 1,304-line non-blocking cooperative state machine driven by millis() timers, utilizing 76% Flash and 15% RAM. Includes NVS flash wear-leveling (30-second persistence intervals), NTP midnight runtime rollover, deadband hysteresis to eliminate relay chatter, an AP Wi-Fi provisioning captive portal (AirGuard-Setup), and a local HTTP API over mDNS (airguard.local) so core safety logic keeps running even if the internet drops.',
  },
  {
    sectionType: 'TECHNICAL',
    title: 'Cloud & Mobile Layer',
    displayOrder: 4,
    content:
      'Google Firebase Realtime Database (RTDB) acts as the cloud bridge with serverless HTTPS REST/WebSocket synchronization. The Flutter 3 / Dart companion app spans 37 Dart files powered by Riverpod state management, GoRouter navigation, Hive local caching, and fl_chart historical graphs with 1H, 6H, 24H, and 7D ranges. Modes (Auto / Manual / Exhaust), presets, and live sliders sync bidirectionally between phone and ESP32.',
  },
  {
    sectionType: 'TESTING',
    title: 'Measured Performance',
    displayOrder: 5,
    content:
      'Air Evacuation Time: 25 s – 62 s across 5 room profiles (45 s for 950 ppm gas clearance; 62 s for 86% → 58% RH steam clearance).\n' +
      'Clearance Efficiency: 92.8% – 98.0%.\n' +
      'Energy Conservation: Up to 64% power saved vs. unmanaged continuous ventilation.\n' +
      'Network Recovery: 4.2 s automatic Firebase reconnection after router reboot during 72-hour burn-in testing.\n' +
      'Resource Footprint: 76% Flash, 15% RAM on ESP32.',
  },
  {
    sectionType: 'RESEARCH',
    title: 'Project Documents & Artifacts',
    displayOrder: 6,
    content:
      'Research Paper: "Smart Exhaust: An IoT-Based Intelligent Environmental Ventilation and Indoor Air Quality Controller".\n' +
      'Project Report: Second Year EIMS Mini Project Report (Smart Exhaust Fan / Infinity Air Guard).\n' +
      'Technical Documentation: Complete hardware, firmware (v2.1.0), cloud schema, and Flutter app documentation.\n\n' +
      'Team: Aditya Jadhav, Shravan Khedkar, Pranav Joshi | Guide: Ms. Vaishnavi P. Kulkarni\n' +
      'Timeline: Academic Year 2026–27 (Second Year EIMS Semester-End Mini Project, AISSMS IOIT, Pune).',
  },
]

const skillLinks = [
  { name: 'C++', slug: 'cpp', groupSlug: 'software', groupName: 'Software', groupOrder: 2 },
  { name: 'IoT', slug: 'iot', groupSlug: 'systems', groupName: 'Systems', groupOrder: 3 },
  { name: 'Embedded Systems', slug: 'embedded-systems', groupSlug: 'electronics', groupName: 'Electronics', groupOrder: 1 },
  { name: 'Sensors', slug: 'sensors', groupSlug: 'electronics', groupName: 'Electronics', groupOrder: 1 },
  { name: 'Hardware Design', slug: 'hardware-design', groupSlug: 'electronics', groupName: 'Electronics', groupOrder: 1 },
  { name: 'Flutter', slug: 'flutter', groupSlug: 'mobile-cross-platform', groupName: 'Mobile / Cross-Platform', groupOrder: 4 },
  { name: 'Dart', slug: 'dart', groupSlug: 'mobile-cross-platform', groupName: 'Mobile / Cross-Platform', groupOrder: 4 },
  { name: 'Firebase', slug: 'firebase', groupSlug: 'systems', groupName: 'Systems', groupOrder: 3 },
  { name: 'Hardware-Software Integration', slug: 'hw-sw-integration', groupSlug: 'systems', groupName: 'Systems', groupOrder: 3 },
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

    const existingSkill = await prisma.skill.findUnique({ where: { slug: link.slug } })
    const skill = existingSkill
      ? await prisma.skill.update({ where: { slug: link.slug }, data: { name: link.name } })
      : await prisma.skill.create({
          data: {
            name: link.name,
            slug: link.slug,
            skillGroupId: group.id,
            displayOrder: i + 1,
          },
        })
    linkedSkillIds.push(skill.id)
  }

  await prisma.projectSkill.deleteMany({ where: { projectId: project.id } })
  await prisma.projectSkill.createMany({
    data: linkedSkillIds.map((skillId) => ({ projectId: project.id, skillId })),
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

  console.log('Infinity Air Guard (Smart Exhaust) seed complete')
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
