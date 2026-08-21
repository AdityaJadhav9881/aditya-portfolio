import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function main() {
  console.log('Seeding database...')

  // Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'adityajadhav0167@gmail.com' },
    update: {},
    create: {
      email: 'adityajadhav0167@gmail.com',
      name: 'Aditya Jadhav',
      passwordHash: hashPassword('admin123'),
    },
  })
  console.log('Admin created:', admin.email)

  // Site Settings
  const settings = [
    { key: 'name', value: 'Aditya Ramesh Jadhav' },
    { key: 'displayName', value: 'Aditya' },
    { key: 'headline', value: 'Engineer \u00b7 Builder \u00b7 Explorer' },
    { key: 'bio', value: 'I build things to understand how they work. From electronics experiments to complete hardware-software systems, my work is driven by curiosity. I don\'t want to simply use technology \u2014 I want to understand it, experiment with it, build it, and improve it.' },
    { key: 'email', value: 'adityajadhav0167@gmail.com' },
    { key: 'linkedin', value: 'https://www.linkedin.com/in/aditya-jadhav-640a03371' },
    { key: 'github', value: 'https://github.com/AdityaJadhav9881' },
    { key: 'siteTitle', value: 'Aditya Jadhav \u2014 Engineer, Builder, Explorer' },
    { key: 'siteDescription', value: 'Engineering portfolio of Aditya Ramesh Jadhav. Building ideas without boundaries.' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    })
  }
  console.log('Settings created')

  // Skill Groups
  const electronics = await prisma.skillGroup.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: { name: 'Electronics', slug: 'electronics', description: 'Hardware design from circuit concept to functioning prototype', displayOrder: 1 },
  })

  const software = await prisma.skillGroup.upsert({
    where: { slug: 'software' },
    update: {},
    create: { name: 'Software', slug: 'software', description: 'Code that bridges physical systems with digital interfaces', displayOrder: 2 },
  })

  const systems = await prisma.skillGroup.upsert({
    where: { slug: 'systems' },
    update: {},
    create: { name: 'Systems', slug: 'systems', description: 'Connecting hardware, software, and infrastructure into working systems', displayOrder: 3 },
  })

  const design = await prisma.skillGroup.upsert({
    where: { slug: 'design' },
    update: {},
    create: { name: 'Design', slug: 'design', description: 'Thinking through systems, interfaces, and user experience', displayOrder: 4 },
  })

  // Skills
  const skillData = [
    { name: 'Embedded Systems', slug: 'embedded-systems', groupId: electronics.id, order: 1 },
    { name: 'Circuit Design', slug: 'circuit-design', groupId: electronics.id, order: 2 },
    { name: 'Sensors', slug: 'sensors', groupId: electronics.id, order: 3 },
    { name: 'Power Electronics', slug: 'power-electronics', groupId: electronics.id, order: 4 },
    { name: 'Analog Electronics', slug: 'analog-electronics', groupId: electronics.id, order: 5 },
    { name: 'C', slug: 'c', groupId: software.id, order: 1 },
    { name: 'Python', slug: 'python', groupId: software.id, order: 2 },
    { name: 'JavaScript', slug: 'javascript', groupId: software.id, order: 3 },
    { name: 'React', slug: 'react', groupId: software.id, order: 4 },
    { name: 'IoT', slug: 'iot', groupId: systems.id, order: 1 },
    { name: 'Firebase', slug: 'firebase', groupId: systems.id, order: 2 },
    { name: 'Hardware-Software Integration', slug: 'hw-sw-integration', groupId: systems.id, order: 3 },
    { name: 'Automation', slug: 'automation', groupId: systems.id, order: 4 },
    { name: 'UI/UX', slug: 'ui-ux', groupId: design.id, order: 1 },
    { name: 'System Visualization', slug: 'system-visualization', groupId: design.id, order: 2 },
    { name: 'Product Thinking', slug: 'product-thinking', groupId: design.id, order: 3 },
  ]

  const skills: Record<string, string> = {}
  for (const s of skillData) {
    const skill = await prisma.skill.upsert({
      where: { slug: s.slug },
      update: {},
      create: { name: s.name, slug: s.slug, skillGroupId: s.groupId, displayOrder: s.order },
    })
    skills[s.slug] = skill.id
  }
  console.log('Skills created')

  // Projects
  const projectData = [
    {
      name: 'Infinity Power Guard',
      slug: 'infinity-power-guard',
      oneLine: 'IoT-enabled portable energy management and backup system.',
      year: 2026,
      category: 'Embedded Systems / IoT',
      status: 'PUBLISHED' as const,
      featured: true,
      showOnHomepage: true,
      displayOrder: 1,
      technologies: ['ESP32', 'React', 'Firebase', 'LiFePO4', 'Power Electronics', 'IoT'],
      description: 'A complete portable energy management system combining custom hardware design with a real-time web dashboard for monitoring and controlling power delivery.',
      problem: 'Existing portable power solutions lack intelligent monitoring, remote management, and transparent energy data. Most systems provide power but no visibility into how it is being used.',
      designed: 'Designed a custom embedded system around the ESP32 microcontroller paired with a LiFePO4 battery pack, charge controller, inverter stage, and sensor array.',
      howItWorks: 'Sensors continuously measure voltage, current, temperature, and load across multiple channels. The ESP32 processes this data and transmits it to Firebase in real time.',
      engineering: 'The hardware was designed from the ground up. Firmware written in C for the ESP32. Frontend uses React with real-time subscriptions to Firebase.',
      result: 'A fully functional portable energy system with real-time visibility, intelligent load management, and reliable backup power delivery.',
      learned: 'End-to-end system integration across hardware, firmware, and software.',
      seoTitle: 'Infinity Power Guard | Aditya Jadhav',
      seoDescription: 'IoT-enabled portable energy management and backup system built by Aditya Jadhav.',
      skillSlugs: ['embedded-systems', 'iot', 'react', 'power-electronics', 'firebase', 'hw-sw-integration'],
    },
    {
      name: 'DIY LiFePO4 Home Backup',
      slug: 'diy-lifepo4-backup',
      oneLine: 'A custom battery-backed power system designed and built from scratch.',
      year: 2023,
      category: 'Power Electronics',
      status: 'PUBLISHED' as const,
      featured: true,
      showOnHomepage: true,
      displayOrder: 2,
      technologies: ['LiFePO4 Cells', 'BMS', 'Inverter', 'Charge Controller', 'Circuit Design'],
      description: 'A home backup power system built from individual LiFePO4 cells with a custom battery management system, charge controller, and inverter stage.',
      problem: 'Commercial home backup solutions are expensive and provide limited visibility into battery health and power flow.',
      designed: 'Selected and configured individual LiFePO4 cells into a battery pack, designed a BMS for cell balancing and protection.',
      howItWorks: 'LiFePO4 cells are configured in series-parallel. The BMS monitors individual cell voltages and temperatures.',
      engineering: 'Every component was selected, tested, and integrated manually.',
      result: 'A reliable home backup power system with full transparency into every stage of the power path.',
      learned: 'Battery chemistry, cell matching and balancing, power conversion efficiency.',
      skillSlugs: ['power-electronics', 'circuit-design'],
    },
    {
      name: 'Variable Power Supply',
      slug: 'variable-power-supply',
      oneLine: 'A transformer-based adjustable power supply built for electronics experimentation.',
      year: 2024,
      category: 'Electronics / Test Equipment',
      status: 'PUBLISHED' as const,
      featured: false,
      showOnHomepage: true,
      displayOrder: 3,
      technologies: ['Transformer', 'Voltage Regulator', 'Circuit Design', 'Analog Electronics'],
      description: 'A bench power supply built from a transformer through to linear regulation, providing adjustable voltage and current limiting.',
      problem: 'A reliable adjustable power supply is essential for electronics experimentation.',
      designed: 'Used a step-down transformer with a bridge rectifier and filter capacitor bank, followed by a linear regulator stage.',
      howItWorks: 'AC mains is stepped down, rectified to DC, smoothed by filter capacitors, and regulated by the adjustable linear regulator.',
      engineering: 'Careful thermal management for the linear regulator, proper transformer selection, robust protection circuit.',
      result: 'A functional bench power supply for all electronics experimentation and prototyping.',
      learned: 'Linear regulation theory, thermal design for power components.',
      skillSlugs: ['power-electronics', 'circuit-design', 'analog-electronics'],
    },
    {
      name: 'Audio / Speaker System',
      slug: 'audio-speaker-system',
      oneLine: 'A custom-built audio system including speaker and subwoofer design.',
      year: 2025,
      category: 'Audio / Electronics',
      status: 'PUBLISHED' as const,
      featured: false,
      showOnHomepage: true,
      displayOrder: 4,
      technologies: ['Audio Amplifier', 'Speaker Design', 'Crossover Networks', 'Enclosure Design'],
      description: 'A complete audio system built from amplifier circuits through to speaker and subwoofer enclosure design.',
      problem: 'Commercial audio systems make compromises in driver selection, enclosure tuning, and amplifier pairing.',
      designed: 'Designed the amplifier stage, selected and matched drivers, calculated crossover frequencies, and built tuned enclosures.',
      howItWorks: 'The amplifier stage drives matched full-range drivers through a passive crossover network. The subwoofer handles low frequencies through a separate powered channel.',
      engineering: 'Required understanding of Thiele-Small parameters, crossover filter design, enclosure volume calculations.',
      result: 'A high-fidelity audio system with tuned response, clear imaging, and controlled bass extension.',
      learned: 'Acoustic theory, filter design, driver characterization, enclosure resonance.',
      skillSlugs: ['circuit-design', 'analog-electronics'],
    },
    {
      name: 'Auto Washroom Lights',
      slug: 'auto-washroom-lights',
      oneLine: 'An automated lighting system with sensor-based control.',
      year: 2022,
      category: 'Automation / IoT',
      status: 'PUBLISHED' as const,
      featured: false,
      showOnHomepage: false,
      displayOrder: 5,
      technologies: ['PIR Sensor', 'Microcontroller', 'Relay', 'Circuit Design'],
      description: 'An automated washroom lighting system using PIR motion detection and a microcontroller-based relay driver.',
      problem: 'Manually switching lights in washrooms is inefficient.',
      designed: 'Used a PIR motion sensor connected to a microcontroller that drives a relay to control the lighting circuit.',
      howItWorks: 'The PIR sensor detects motion and sends a signal to the microcontroller. The microcontroller activates the relay.',
      engineering: 'The design focused on reliability and simplicity.',
      result: 'A reliable automated lighting system in daily use.',
      learned: 'Sensor interfacing, relay driving, debounce algorithms.',
      skillSlugs: ['embedded-systems', 'circuit-design', 'automation', 'iot'],
    },
  ]

  const projectIds: Record<string, string> = {}
  for (const p of projectData) {
    const { skillSlugs, ...data } = p
    const project = await prisma.project.upsert({
      where: { slug: data.slug },
      update: data,
      create: data,
    })
    projectIds[data.slug] = project.id

    // Connect skills
    for (const skillSlug of skillSlugs) {
      if (skills[skillSlug]) {
        await prisma.projectSkill.upsert({
          where: { projectId_skillId: { projectId: project.id, skillId: skills[skillSlug] } },
          update: {},
          create: { projectId: project.id, skillId: skills[skillSlug] },
        })
      }
    }
  }
  console.log('Projects created')

  // Project relationships
  await prisma.projectRelatedProject.upsert({
    where: { projectId_relatedProjectId: { projectId: projectIds['infinity-power-guard'], relatedProjectId: projectIds['diy-lifepo4-backup'] } },
    update: {},
    create: { projectId: projectIds['infinity-power-guard'], relatedProjectId: projectIds['diy-lifepo4-backup'] },
  })

  // Journey
  const journeyData = [
    { year: 2021, title: 'First Experiments', description: 'Beginning the hands-on journey into electronics and building things from scratch.', type: 'MILESTONE' as const, displayOrder: 1, projectSlugs: [] },
    { year: 2022, title: 'Automation Projects', description: 'Building practical systems that solve real problems.', type: 'PROJECT' as const, displayOrder: 2, projectSlugs: ['auto-washroom-lights'] },
    { year: 2023, title: 'Power Systems Deep Dive', description: 'Designing a complete LiFePO4 backup power system.', type: 'PROJECT' as const, displayOrder: 3, projectSlugs: ['diy-lifepo4-backup'] },
    { year: 2024, title: 'Test Equipment & Foundations', description: 'Building the tools needed for deeper electronics work.', type: 'PROJECT' as const, displayOrder: 4, projectSlugs: ['variable-power-supply'] },
    { year: 2025, title: 'Audio & Signal Systems', description: 'Exploring the intersection of electrical engineering and acoustics.', type: 'PROJECT' as const, displayOrder: 5, projectSlugs: ['audio-speaker-system'] },
    { year: 2026, title: 'Infinity Power Guard', description: 'Bringing hardware, firmware, and software together into a complete IoT system.', type: 'PROJECT' as const, displayOrder: 6, projectSlugs: ['infinity-power-guard'] },
    { year: 2027, title: 'Next Build', description: 'More systems. More experiments. More connections.', type: 'ONGOING' as const, displayOrder: 7, projectSlugs: [] },
  ]

  for (const j of journeyData) {
    const { projectSlugs, ...data } = j
    const entry = await prisma.journeyEntry.create({ data })
    for (const slug of projectSlugs) {
      if (projectIds[slug]) {
        await prisma.journeyProject.create({ data: { journeyId: entry.id, projectId: projectIds[slug] } })
      }
    }
  }
  console.log('Journey created')

  // Research
  const researchEntry = await prisma.researchEntry.create({
    data: {
      title: 'An IoT-Based Portable Energy Management System',
      slug: 'ipg-iot-energy',
      description: 'Research and development of an IoT-enabled portable energy system integrating embedded sensing, real-time telemetry, and web-based monitoring.',
      displayOrder: 1,
    },
  })
  await prisma.researchProject.create({
    data: { researchId: researchEntry.id, projectId: projectIds['infinity-power-guard'] },
  })
  console.log('Research created')

  // Achievements
  await prisma.achievement.create({
    data: {
      title: 'Research Publication \u2014 Infinity Power Guard',
      description: 'Published research on IoT-based portable energy management systems.',
      year: 2026,
      category: 'Research',
      displayOrder: 1,
    },
  })

  await prisma.achievement.create({
    data: {
      title: 'Ideathon / Next Gen Competition',
      description: 'Participated in ideathon and next generation technology competition.',
      year: 2024,
      category: 'Competition',
      displayOrder: 2,
    },
  })
  console.log('Achievements created')

  console.log('Seed complete!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
