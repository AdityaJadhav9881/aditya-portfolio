import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const existing = await prisma.project.findUnique({ where: { slug: "infinity-smart-switch" } });
    if (existing) {
      await prisma.projectSkill.deleteMany({ where: { projectId: existing.id } });
      await prisma.projectRelatedProject.deleteMany({ where: { projectId: existing.id } });
      await prisma.projectSection.deleteMany({ where: { projectId: existing.id } });
      await prisma.project.delete({ where: { id: existing.id } });
    }

    const project = await prisma.project.create({
      data: {
        name: "Infinity Smart Switch",
        slug: "infinity-smart-switch",
        oneLine: "A compact multi-channel smart switching system designed to fit inside conventional electrical switchboards.",
        year: 2026,
        category: "Embedded Systems / IoT",
        status: "PUBLISHED",
        featured: false,
        showOnHomepage: true,
        displayOrder: 6,
        description: "This started as a small experimental project to explore how much functionality could be packed into a very small smart-switching system.\n\nThe initial prototype was intentionally built quickly as a small timepass engineering project, but it developed into a more practical design challenge: creating a compact controller capable of managing multiple AC loads while fitting inside the limited space available in a conventional electrical switchboard.",
        problem: "Most smart-switching prototypes are relatively easy to demonstrate when size is not a major constraint. The real challenge begins when the complete controller, switching hardware and connectivity have to fit into the limited space behind a traditional switchboard.\n\nFor a practical multi-channel system, the switching hardware also needs to be compact, reliable and suitable for controlling AC loads.",
        designed: "I designed and assembled an initial prototype for wireless AC load control and experimented with compact switching approaches using relays and Solid-State Relays (SSRs).\n\nThe main direction of the project is now to reduce the physical size of the controller and switching circuitry so that a multi-channel version can be integrated into a conventional switchboard.",
        howItWorks: "The controller receives commands wirelessly and operates the switching stage connected to the AC load.\n\nThe first prototype successfully demonstrated AC control using a Solid-State Relay.\n\nThe system is being developed toward a multi-channel architecture where multiple switches can be controlled from a compact controller through wireless connectivity.",
        engineering: "The main engineering challenge is not simply controlling an AC load, but achieving multi-channel control while keeping the electronics small enough for practical installation.\n\nTwo switching approaches are being explored:\n- Mechanical relays\n- Solid-State Relays (SSRs)\n\nThe current development focus is on designing a custom PCB that integrates the controller and switching circuitry into a significantly smaller footprint.",
        result: "The first small prototype successfully controlled an AC load using a Solid-State Relay.\n\nThe prototype demonstrated that the basic wireless control and AC switching concept works.\n\nThe next development stage is focused on converting the prototype into a compact custom-PCB-based multi-channel system.",
        learned: "This project highlighted the difference between making a working prototype and designing something that can realistically fit into a practical product.\n\nThe main lessons were:\n- Compact hardware design is a major engineering constraint.\n- Relay and SSR switching have different trade-offs.\n- Physical PCB size matters significantly in embedded product design.\n- A successful prototype is only the first step toward a practical product.\n- Mechanical constraints should be considered alongside electrical design from the beginning.",
        technologies: ["Embedded Systems", "IoT", "AC Switching", "Solid-State Relay", "Mechanical Relay", "Wi-Fi", "Bluetooth", "Custom PCB Design", "Wireless Control", "Web Dashboard"],
        seoTitle: "Infinity Smart Switch | Aditya Jadhav",
        seoDescription: "A compact IoT smart switching system exploring wireless AC control, relay and SSR switching, and custom PCB design for multi-channel switchboard integration.",
        sections: {
          create: [
            { sectionType: "STORY", title: "From Small Prototype to Compact Smart Switch", content: "Infinity Smart Switch began as a small experimental prototype for controlling AC loads wirelessly.\n\nThe first version was intentionally simple and focused on proving the core concept. After successfully demonstrating AC control, the project evolved into a more serious engineering challenge: reducing the size of the controller and switching circuitry while increasing the number of controllable channels.", visible: true, displayOrder: 0 },
            { sectionType: "FEATURES", title: "Key Features", content: "- Wireless AC load control\n- Wi-Fi connectivity\n- Bluetooth connectivity\n- Solid-State Relay based AC switching prototype\n- Exploration of mechanical relay switching\n- Compact-controller design approach\n- Multi-channel architecture planned\n- Web-based control interface\n- Focus on conventional switchboard integration", visible: true, displayOrder: 1 },
            { sectionType: "HARDWARE", title: "Hardware", content: "The prototype consists of:\n\n- Embedded controller\n- Solid-State Relay switching stage\n- AC load interface\n- Power/control circuitry\n- Wireless connectivity hardware\n- Prototype wiring and supporting components\n\nThe next version is being designed around a custom PCB to reduce wiring, size and overall footprint.", visible: true, displayOrder: 2 },
            { sectionType: "SOFTWARE", title: "Software & Control Interface", content: "The project includes a web-based control dashboard for interacting with the smart switching system.\n\nThe interface provides a control layer for switching connected loads and is being developed alongside the hardware so that the complete system can eventually operate as a compact connected device.", visible: true, displayOrder: 3 },
            { sectionType: "TECHNICAL", title: "Design Target", content: "The primary design target is a compact multi-channel controller capable of controlling at least 10 switches while fitting inside the limited space of a conventional electrical switchboard.\n\nTwo switching technologies are being evaluated:\n1. Mechanical relays\n2. Solid-State Relays (SSRs)\n\nThe current development direction is a custom PCB that combines the controller and switching architecture into a much smaller footprint.\n\nIMPORTANT: The 10-channel target is a DEVELOPMENT GOAL, not a completed specification of the current prototype.", visible: true, displayOrder: 4 },
            { sectionType: "HOW_IT_WORKS", title: "How It Works", content: "Wireless command \u2192 Embedded Controller \u2192 Switching Control \u2192 Relay / SSR \u2192 AC Load\n\nThe controller receives a wireless command and activates the appropriate switching channel.\n\nThe initial prototype successfully demonstrated this concept using a Solid-State Relay to control an AC load.", visible: true, displayOrder: 5 },
            { sectionType: "TESTING", title: "Prototype Testing", content: "The first prototype was tested for wireless control of an AC load using a Solid-State Relay.\n\nResult:\n- AC switching: Successfully demonstrated\n- SSR-based switching: Successfully demonstrated\n- Wireless control concept: Demonstrated\n- Compact multi-channel PCB: Under development\n- 10-channel implementation: Future development target", visible: true, displayOrder: 6 },
            { sectionType: "CHALLENGES", title: "Challenges", content: "The biggest challenge is physical space.\n\nA conventional switchboard provides very limited room behind the front panel. A system that works on a table can become impractical when the controller, switching components, power circuitry and wiring all have to fit into this restricted space.\n\nAnother challenge is selecting the appropriate switching technology for a compact multi-channel design.", visible: true, displayOrder: 7 },
            { sectionType: "LESSONS", title: "Engineering Lessons", content: "This project taught me that miniaturization is not simply about making a PCB smaller.\n\nComponent selection, switching technology, wiring, thermal considerations, PCB layout and physical installation constraints all influence the final design.\n\nThe project also reinforced the importance of building a working prototype first and then using the prototype to identify what needs to change in the next hardware revision.", visible: true, displayOrder: 8 },
            { sectionType: "FUTURE", title: "Next Version", content: "The next version will focus on a custom PCB with a significantly smaller footprint.\n\nThe primary goals are:\n- Reduce controller size\n- Reduce wiring\n- Increase the number of switching channels\n- Target at least 10-channel control\n- Evaluate relay vs SSR architecture\n- Integrate wireless connectivity\n- Make the complete unit suitable for installation inside a conventional switchboard\n- Improve the overall hardware integration and reliability", visible: true, displayOrder: 9 },
            { sectionType: "GALLERY", title: "Prototype & Development", content: "Prototype hardware, AC switching setup, Controller hardware, Web dashboard, Custom PCB development.", visible: true, displayOrder: 10 },
          ],
        },
      },
    });

    // Link skills
    const skills = await prisma.skill.findMany({
      where: { name: { in: ["Embedded Systems", "IoT", "PCB Design", "Wireless Communication", "AC Switching", "Hardware Prototyping", "Electronics Design", "Web Development"] } },
    });
    for (const skill of skills) {
      await prisma.projectSkill.create({ data: { projectId: project.id, skillId: skill.id } });
    }

    // Link related projects
    const relatedProjects = await prisma.project.findMany({
      where: { slug: { in: ["infinity-power-guard", "variable-power-supply"] } },
    });
    for (const rp of relatedProjects) {
      await prisma.projectRelatedProject.create({ data: { projectId: project.id, relatedProjectId: rp.id } });
    }

    return NextResponse.json({ success: true, id: project.id, slug: project.slug });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
