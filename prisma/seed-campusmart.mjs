import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
})

const PROJECT_SLUG = 'campusmart-ai'

const projectData = {
  name: 'CampusMart AI',
  slug: PROJECT_SLUG,
  oneLine:
    'An AI-powered peer-to-peer campus marketplace featuring 4-angle computer vision valuation, real-time WebRTC voice/video calling, and verified college trading across Android and Web.',
  year: 2026,
  category: 'Full-Stack AI & Mobile Systems',
  status: 'PUBLISHED',
  featured: true,
  showOnHomepage: true,
  displayOrder: 1,
  description:
    "Every semester, thousands of engineering, pharmacy, and diploma students buy textbooks, mini-drafters, calculators, lab coats, and electronics that sit unused once the semester ends. Meanwhile, incoming juniors overpay at retail stores for the exact same gear. I built CampusMart AI to turn isolated college hostels and departments into a trusted, self-sustaining circular economy—powered by multimodal AI vision that inspects items, verifies fair student pricing in Indian Rupees (₹), and connects verified campus peers in seconds.",
  problem:
    'Over 90% of student buying and selling in India happens across fragmented WhatsApp groups ("FE Mech", "Hostel Block B") or generic classified apps like OLX:\n\n' +
    "Zero Price Transparency: Juniors don't know if a used scientific calculator or textbook bundle is fairly priced, and sellers struggle to price depreciated gear accurately.\n" +
    'Unverified Strangers & Scams: Public marketplaces expose students to off-campus scammers, fake listings, and unverified screenshots.\n' +
    'Academic Noise: A 2nd-year Electronics (ENTC) student looking for microcontrollers or network theory books has to dig through hundreds of unrelated listings.\n' +
    'Unmet Urgent Demand: When a student urgently needs an engineering drafter or lab apron for a Monday morning submission, there is no structured way to broadcast that request to seniors on the same campus.',
  designed:
    'I designed a three-pillar ecosystem specifically engineered for Indian college campuses:\n\n' +
    'Native Android App (Flutter + Kotlin): Features a 4-angle AI camera inspection flow, instant offline-first device caching, real-time chat, native WebRTC two-way voice/video calling, and an OTP-verified checkout handshake (Cash on Meetup & Google Pay UPI).\n\n' +
    'Public Web Marketplace & AI Price Estimator (React + Vite): Features dedicated /product/:id showcase pages, Academic Branch (Computer/IT, ENTC, Mechanical, Civil, Pharmacy, FE Common) and Year (FE, SE, TE, BE) filters, a live Campus Wanted Board (WTB), 1-click WhatsApp group sharing, and an instant browser-based AI Valuation sandbox.\n\n' +
    'Master Control Admin Panel (React + TypeScript): A "God-Mode" administrative intelligence suite mapped to the Maharashtra State CET Cell college directory, giving moderators real-time oversight over student connections, chat threads, order handshakes, and zero-config AI API key pools.',
  howItWorks:
    'Campus-Verified Onboarding: Students sign up with OTP email verification and link their profile to their official college (e.g., AISSMS IOIT Pune · CET 6282, COEP Pune · CET 6006, GCOE Karad · CET 6004).\n\n' +
    '4-Angle AI Vision Scan: To sell an item, a student captures 4 angles (Front, Back, Side, Label). The backend multimodal AI verifies it is a genuine physical product (automatically rejecting phone screenshots or memes), identifies the exact brand and model, evaluates physical wear, tags the academic branch/year, and calculates a fair campus resale value in ₹.\n\n' +
    'Reverse-Matched "Want to Buy" (WTB) Board: Students who need an item urgently post a Wanted request (e.g., "Need Engineering Drafter under ₹300 for Monday submission"). The AI immediately cross-matches existing inventory and sends real-time push alerts to peers on the same campus.\n\n' +
    'Live WebRTC Calls & OTP Handshake: Buyers and sellers negotiate via real-time chat or place an in-app voice/video call to inspect the item live. Checkout is secured via a 6-digit Action OTP and logs an official order card directly into the chat thread.',
  engineering:
    'Zero-Config "Hydra" Multi-Key AI Engine: Built a fault-tolerant AI router (key_pool_engine.py) in FastAPI that detects provider types strictly from API key prefixes (AIza... for Gemini, gsk_... for Groq, sk-or-... for OpenRouter), dynamically queries live model directories, load-balances across 5–10 keys with automatic 429 rate-limit cooldowns, and enforces a <6s execution ceiling with zero-key cloud failover.\n\n' +
    'Android 12–16 Native Call & Background Engine: Engineered a persistent Kotlin Foreground Service (CampusMartBackgroundService.kt) with START_STICKY, CPU WakeLock, WifiLock, and fullScreenIntent call notifications so incoming student calls ring and wake the device even when the app is swiped closed. Resolved Android 12–16 (API 31–36) VoNR/VoLTE audio routing using AudioManager.setCommunicationDevice() paired with STUN/TURN WebRTC relays.\n\n' +
    'Amazon-Style Local Storage Cache: Implemented LocalCacheService on device storage so the product feed, shopping cart, profile, and chat threads render in 0ms on app launch while syncing silently with Neon PostgreSQL in the background.',
  result:
    'Production Deployment: Live across three synchronized cloud environments—FastAPI + PostgreSQL on Render/Neon, Promotional & Marketplace Web App on Vercel (https://campus-mart-ivory.vercel.app/), and a standalone release Android APK.\n\n' +
    'Sub-2.5s AI Response & Valuation: Reduced 4-photo vision inspection and conversational AI latency to <2.5 seconds with 100% uptime across key rotations.\n\n' +
    'Instant Viral Distribution: Integrated 1-click formatted WhatsApp broadcast cards with deep links (/product/:id), turning every student listing into a shareable card for hostel and department WhatsApp groups.',
  learned:
    'Android 14–16 OS Power & Audio Restrictions: Learned how modern Android aggressively freezes cached processes and resets audio routing during WebRTC peer connection state transitions, requiring native Kotlin MethodChannel bridges for AudioFocusRequest, setCommunicationDevice, and battery-optimization exemptions.\n\n' +
    'LLM Payload Conflicts in Production: Discovered that combining Google Search grounding tools (google_search) simultaneously with strict responseMimeType: "application/json" and multi-image Base64 payloads triggers HTTP 400 errors on certain Gemini endpoints—leading me to architect an automatic staged retry pipeline.\n\n' +
    "Designing for Real Campus Behavior: Learned that students won't manually fill 12 form fields to sell a ₹300 drafter; automating title, category, branch, semester, and fair pricing from 4 camera snaps is what makes listing frictionless.",
  technologies: [
    'Flutter',
    'Dart',
    'Kotlin',
    'Android Native Services',
    'WebRTC',
    'FastAPI',
    'Python',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'PostgreSQL',
    'Neon DB',
    'SQLAlchemy',
    'Google Gemini Vision API',
    'Groq LPU',
    'OpenRouter',
    'REST APIs',
    'WebSockets',
    'Brevo SMTP',
    'Vite',
    'Vercel',
    'Render',
  ],
  seoTitle: 'CampusMart AI — AI-Powered Student Marketplace',
  seoDescription:
    'Full-stack peer-to-peer college marketplace built with Flutter, FastAPI, React, WebRTC, and Google Gemini Vision AI for 4-photo inspection and verified campus trading.',
}

const sections = [
  {
    sectionType: 'FEATURES',
    title: 'Core Platform Capabilities',
    displayOrder: 1,
    content:
      '• 4-Angle Multimodal AI Vision Scanner: Captures Front, Back, Side, and Label photos to automatically detect brand/model, grade physical wear (New, Like New, Good, Fair), reject non-product screenshots, and estimate fair campus resale prices in ₹.\n' +
      '• Academic Branch & Year Filtering: Instant pill filters for FE, SE, TE, and BE students across Computer/IT, Electrical/ENTC, Mechanical, Civil, Pharmacy, and First-Year Common subjects.\n' +
      '• "Want to Buy" (WTB) Campus Request Board: Allows students to broadcast urgent item requests with a budget cap; the AI reverse-matches active inventory and alerts same-college peers automatically.\n' +
      '• Real-Time WebRTC Voice & Video Calling: Built-in peer-to-peer voice and video calls with full-screen incoming call overlays, native Android ringtone/vibration, and camera toggle so buyers can inspect items live before meeting up.\n' +
      '• WhatsApp Viral Loop: 1-click pre-formatted WhatsApp broadcast generator with deep links (/product/:id) tailored for hostel and batch WhatsApp groups.\n' +
      '• OTP-Verified Checkout & Order Handshake: Supports Cash on Meetup and Google Pay (UPI) with 6-digit email OTP verification and automated in-chat order cards.',
  },
  {
    sectionType: 'SOFTWARE',
    title: 'Three-Tier System Architecture',
    displayOrder: 2,
    content:
      '1. Mobile Client (Flutter + Native Kotlin Bridge):\n' +
      '   - State-persisted feed, cart, and chat engine backed by LocalCacheService for 0ms offline-first startup.\n' +
      "   - Custom Kotlin MethodChannel ('campusmart.ai/notifications') managing runtime hardware permissions (Camera, Microphone, Notifications, Media Storage), native Android share intents, and Android 12–16 communication audio routing.\n" +
      '   - Persistent Foreground Service (CampusMartBackgroundService) with WakeLock, WifiLock, and AlarmManager restart hooks for closed-app call and message reception.\n\n' +
      '2. Backend Core & AI Orchestrator (FastAPI + Neon PostgreSQL):\n' +
      '   - Asynchronous REST + WebSocket signaling architecture hosted on Render with connection pooling on Neon Serverless PostgreSQL.\n' +
      '   - Auto-migrating schema engine (schema_upgrade.py) managing Users, Products, Transactions, CartItems, ChatMessages, CallSessions, WantedRequests, Notifications, and SystemConfig.\n' +
      '   - Zero-Config Multi-Key Pool Engine supporting instant failover across Google Gemini, Groq, OpenRouter, and zero-key fallback endpoints.\n\n' +
      '3. Web Marketplace & Master Admin Control Center (React + TypeScript + Tailwind CSS):\n' +
      '   - Consumer Web App: Responsive product showcase (/product/:id), interactive AI Price Estimator (/sandbox), and live Campus Wanted Board.\n' +
      '   - Admin Master Control Panel: Full God-Mode CRUD override for student profiles, CET Cell college reassignments, listing moderation, live buyer-seller network intelligence, and 1-click AI key testing.',
  },
  {
    sectionType: 'CHALLENGES',
    title: 'Key Engineering Challenges & Solutions',
    displayOrder: 3,
    content:
      'Challenge 1: Two-Way Call Audio Silence & Background Termination on Android 12–16\n' +
      '• Problem: Standard WebRTC speakerphone calls worked on Android 11, but Android 12–16 (API 31–36) silenced voice streams across 5G (VoNR) to 4G (VoLTE) connections and froze background polling within 30 seconds of swiping the app closed.\n' +
      '• Solution: Implemented Android 12+ native AudioDeviceInfo routing via audioManager.setCommunicationDevice() inside MainActivity.kt, added OpenRelay TURN servers alongside Google STUN servers for symmetric NAT traversal, and configured a persistent specialUse|dataSync Foreground Service with stopWithTask="false" and full-screen call intents.\n\n' +
      'Challenge 2: Eliminating AI Rate Limits (HTTP 429) & Screenshot Spoofing\n' +
      '• Problem: High traffic during exam weeks exhausted single free-tier Gemini API keys, and users tested the estimator by uploading phone screenshots that heuristic calculators mispriced.\n' +
      '• Solution: Built a Multi-Key Hydra Pool that rotates across up to 10 API keys with per-key health tracking and auto-discovery, paired with a strict Gemini Vision gate that detects UI status bars and screenshots and rejects them before pricing.\n\n' +
      'Challenge 3: Scroll-Lock & Layout Truncation on Compact Mobile Viewports\n' +
      '• Problem: Dynamic collapsible headers caused scroll-extent oscillation when fewer than 4 products were listed, and 80-character Maharashtra CET Cell college names overflowed mobile cards and admin tables.\n' +
      '• Solution: Unified the Discover feed into a single CustomScrollView with AlwaysScrollableScrollPhysics, replaced popup modals with dedicated /product/:id routes, and built a deterministic college alias formatter (e.g., converting long trust names into crisp badges like "AISSMS IOIT · Pune · CET 6282").',
  },
  {
    sectionType: 'TESTING',
    title: 'Testing & Production Verification',
    displayOrder: 4,
    content:
      '• Cross-Device Physical Testing: Tested two-phone WebRTC voice/video calls, instant hang-up synchronization, and closed-app incoming call ringtones between Android 11 (4G VoLTE) and Android 16 (5G VoNR) devices.\n' +
      '• Automated API & Schema Suite: Validated checkout payment normalization, multi-key AI configuration updates, and sub-3-second AI chat/vision endpoints via pytest and flutter analyze (0 issues).\n' +
      '• Live Cloud Deployment: Verified end-to-end production flow across Vercel (Web + Admin) and Render + Neon PostgreSQL (API + Database).',
  },
  {
    sectionType: 'FUTURE',
    title: 'Future Roadmap',
    displayOrder: 5,
    content:
      "• 1-Click Semester Kit Bundles: Allow graduating seniors to bundle an entire semester's textbooks, drafter, and lab apron into a single discounted package for incoming juniors.\n" +
      '• On-Campus Safe Exchange Zones: QR-code scan handshakes at designated campus library or canteen meetup spots.\n' +
      '• Multilingual Voice Search: Support Hindi and Marathi voice queries inside the Ask AI assistant for regional diploma and engineering campuses.',
  },
]

const skillGroups = [
  {
    name: 'Mobile & Cross-Platform',
    slug: 'mobile-cross-platform',
    description: 'Native and cross-platform mobile development',
    displayOrder: 5,
    skills: [
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Dart', slug: 'dart' },
      { name: 'Android Native (Kotlin)', slug: 'android-native-kotlin' },
      { name: 'WebRTC', slug: 'webrtc' },
    ],
  },
  {
    name: 'Backend & Database',
    slug: 'backend-database',
    description: 'APIs, persistence, and real-time backend systems',
    displayOrder: 6,
    skills: [
      { name: 'FastAPI', slug: 'fastapi' },
      { name: 'Python', slug: 'python' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'SQLAlchemy', slug: 'sqlalchemy' },
      { name: 'REST & WebSocket APIs', slug: 'rest-websocket-apis' },
    ],
  },
  {
    name: 'AI & Computer Vision',
    slug: 'ai-computer-vision',
    description: 'Multimodal AI, computer vision, and LLM orchestration',
    displayOrder: 7,
    skills: [
      { name: 'Google Gemini Vision API', slug: 'google-gemini-vision-api' },
      { name: 'Multimodal LLM Orchestration', slug: 'multimodal-llm-orchestration' },
      { name: 'Prompt Engineering', slug: 'prompt-engineering' },
    ],
  },
  {
    name: 'Frontend & Cloud',
    slug: 'frontend-cloud',
    description: 'Web interfaces and production cloud deployment',
    displayOrder: 8,
    skills: [
      { name: 'React', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Tailwind CSS', slug: 'tailwind-css' },
      { name: 'Vercel & Render Deployment', slug: 'vercel-render-deployment' },
    ],
  },
]

const researchData = {
  title:
    'Fault-Tolerant Multimodal LLM Orchestration & Real-Time WebRTC Signaling on Mobile Networks',
  slug: 'multimodal-llm-orchestration-and-mobile-webrtc',
  description:
    'Investigated dynamic API key-pool rotation across heterogeneous LLM providers (Gemini, Groq, OpenRouter) to eliminate HTTP 429 rate bottlenecks during 4-angle product image valuation, alongside low-latency WebRTC audio routing across Android 12–16 (API 31–36) 5G VoNR/4G VoLTE carrier NATs.',
  links: [
    { label: 'Live Web Marketplace', url: 'https://campus-mart-ivory.vercel.app/' },
  ],
  displayOrder: 2,
  visible: true,
}

const journeyData = {
  year: 2026,
  title: 'Architected & Launched CampusMart AI',
  description:
    'Built and deployed a full-stack AI-powered peer-to-peer student marketplace across Android (Flutter/Kotlin), Web (React), and Cloud (FastAPI/Neon PostgreSQL) with 4-photo computer vision pricing and live WebRTC calling.',
  type: 'PROJECT',
  displayOrder: 7,
  visible: true,
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const existingProject = await prisma.project.findUnique({ where: { slug: PROJECT_SLUG } })

  if (!existingProject) {
    await prisma.project.updateMany({
      where: { displayOrder: { gte: 1 } },
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
  for (const group of skillGroups) {
    const { skills, ...groupData } = group
    const skillGroup = await prisma.skillGroup.upsert({
      where: { slug: groupData.slug },
      update: { name: groupData.name, description: groupData.description, displayOrder: groupData.displayOrder },
      create: groupData,
    })

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]
      const existing = await prisma.skill.findUnique({ where: { slug: skill.slug } })
      const saved = existing
        ? await prisma.skill.update({ where: { slug: skill.slug }, data: { name: skill.name } })
        : await prisma.skill.create({
            data: {
              name: skill.name,
              slug: skill.slug,
              skillGroupId: skillGroup.id,
              displayOrder: i + 1,
            },
          })
      linkedSkillIds.push(saved.id)
    }
  }

  await prisma.projectSkill.deleteMany({ where: { projectId: project.id } })
  await prisma.projectSkill.createMany({
    data: linkedSkillIds.map((skillId) => ({ projectId: project.id, skillId })),
  })

  const research = await prisma.researchEntry.upsert({
    where: { slug: researchData.slug },
    update: researchData,
    create: researchData,
  })
  await prisma.researchProject.deleteMany({ where: { projectId: project.id } })
  await prisma.researchProject.create({
    data: { researchId: research.id, projectId: project.id },
  })

  const nextBuild = await prisma.journeyEntry.findFirst({
    where: { year: 2027, title: 'Next Build' },
  })
  if (nextBuild && nextBuild.displayOrder <= journeyData.displayOrder) {
    await prisma.journeyEntry.update({
      where: { id: nextBuild.id },
      data: { displayOrder: journeyData.displayOrder + 1 },
    })
  }

  let journey = await prisma.journeyEntry.findFirst({
    where: { year: journeyData.year, title: journeyData.title },
  })
  if (journey) {
    journey = await prisma.journeyEntry.update({ where: { id: journey.id }, data: journeyData })
  } else {
    journey = await prisma.journeyEntry.create({ data: journeyData })
  }
  await prisma.journeyProject.upsert({
    where: { journeyId_projectId: { journeyId: journey.id, projectId: project.id } },
    update: {},
    create: { journeyId: journey.id, projectId: project.id },
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

  console.log('CampusMart AI seed complete')
  console.log(`  Project: ${project.slug} (${project.status})`)
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
