import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const existing = await prisma.project.findUnique({ where: { slug: "custom-30w-bluetooth-speaker" } });
    if (existing) {
      await prisma.projectSkill.deleteMany({ where: { projectId: existing.id } });
      await prisma.projectRelatedProject.deleteMany({ where: { projectId: existing.id } });
      await prisma.projectSection.deleteMany({ where: { projectId: existing.id } });
      await prisma.project.delete({ where: { id: existing.id } });
    }

    const project = await prisma.project.create({
      data: {
        name: "Custom 30W Bluetooth Speaker System",
        slug: "custom-30w-bluetooth-speaker",
        oneLine: "A custom-built 30W Bluetooth speaker system created by reusing speakers from a damaged Redmi TV and integrating them with a Class-D amplifier and Bluetooth audio module.",
        year: 2025,
        category: "Audio Electronics / Hardware",
        status: "PUBLISHED",
        featured: false,
        showOnHomepage: true,
        displayOrder: 7,
        description: "My old Redmi TV was damaged, but the speakers were still in usable condition. Instead of leaving them unused, I decided to reuse them and build a dedicated Bluetooth speaker for personal use.\n\nThe project also gave me an opportunity to practically explore audio electronics, Class-D amplification, Bluetooth audio, DC-DC power conversion, and enclosure design.",
        problem: "The main purpose was to give a second life to the working speakers from a damaged television by converting them into a useful personal audio system.\n\nThe project was also built as a hands-on experiment to understand how different audio and power-electronic modules can be integrated into one working product.",
        designed: "I personally handled the complete development and integration of the system.\n\nMy work included:\n- Selecting and reusing the 30W TV speaker\n- Designing the overall system architecture\n- Selecting the amplifier and Bluetooth modules\n- Integrating the Bluetooth audio module\n- Designing the power arrangement\n- Integrating the DC-DC step-down converter\n- Designing and assembling the physical enclosure\n- Completing the internal wiring\n- Mounting and integrating the electronics\n- Testing the complete speaker system\n- Troubleshooting the system during assembly",
        howItWorks: "Basic working flow:\n\nSmartphone / Bluetooth Device \u2192 KCX BT002 Bluetooth Module \u2192 CV-3030 / CV-3030A Class-D Amplifier \u2192 30W Speaker \u2192 Audio Output\n\nPower System:\n\n12V / 3.5A Adapter \u2192 Power Distribution \u2192 Class-D Amplifier\n12V / 3.5A Adapter \u2192 DC-DC Step-Down \u2192 5V / 1A \u2192 KCX BT002 Bluetooth Module\n\nThe Bluetooth module receives the wireless audio signal and provides the audio signal to the amplifier. The Class-D amplifier increases the audio power sufficiently to drive the speaker.",
        engineering: "The main challenge was integrating several independent modules into a single compact speaker system.\n\nKey challenges included:\n- Matching the speaker with the amplifier\n- Providing the correct voltage to the Bluetooth module\n- Managing power distribution between the amplifier and Bluetooth circuit\n- Keeping the internal wiring organized\n- Fitting the electronics inside the enclosure\n- Creating a physically stable assembly\n- Avoiding unnecessary electrical and mechanical clutter\n\nThe system was divided into separate functional sections:\n\nAudio: Bluetooth Module \u2192 Amplifier \u2192 Speaker\n\nPower: 12V Adapter \u2192 Amplifier, 12V Adapter \u2192 Step-Down Converter \u2192 5V Bluetooth Module\n\nUsing the DC-DC step-down converter provided the required lower-voltage supply for the Bluetooth module. The electronics were then physically arranged inside the enclosure to keep the system compact and functional.",
        result: "The project was successfully completed and works as a functional Bluetooth speaker system.\n\nThe original TV speaker was successfully integrated with a Class-D amplifier, Bluetooth module, and dedicated power-conversion stage.\n\nThe final system provides wireless audio playback from a Bluetooth-enabled device and is suitable for personal use.",
        learned: "Technical:\n- Practical operation of Class-D audio amplifiers\n- Bluetooth audio module integration\n- Speaker and amplifier power matching\n- DC-DC voltage conversion\n- Power distribution between multiple electronic modules\n- Audio signal integration\n- Practical wiring and connector management\n- Electronics enclosure design\n- Hardware troubleshooting\n- System-level electronics integration\n\nEngineering:\n- Individual modules may work correctly but still require careful integration to create a reliable system.\n- Power requirements need to be considered at the system level.\n- Mechanical design is an important part of electronics product development.\n- Reusing functional components can be a practical way to develop new systems.\n- A prototype does not need to be perfect initially; it can be improved through successive versions.",
        technologies: ["Bluetooth Audio", "Class-D Amplification", "DC-DC Power Conversion", "Audio Electronics", "Power Electronics", "Enclosure Design", "Analog Audio", "Hardware Integration"],
        seoTitle: "Custom 30W Bluetooth Speaker System | Aditya Jadhav",
        seoDescription: "A custom-built 30W Bluetooth speaker system reusing Redmi TV speakers with Class-D amplification and KCX BT002 Bluetooth module.",
        sections: {
          create: [
            { sectionType: "STORY", title: "From Damaged TV to Bluetooth Speaker", content: "My old Redmi TV was damaged, but the speakers were still in usable condition. Instead of leaving them unused, I decided to reuse them and build a dedicated Bluetooth speaker for personal use.\n\nThe project gave me an opportunity to practically explore audio electronics, Class-D amplification, Bluetooth audio, DC-DC power conversion, and enclosure design.", visible: true, displayOrder: 0 },
            { sectionType: "FEATURES", title: "Key Features", content: "- 30W audio speaker\n- Bluetooth wireless connectivity\n- Class-D amplification\n- CV-3030 / CV-3030A amplifier\n- KCX BT002 Bluetooth module\n- Dedicated 5V supply for Bluetooth module\n- 12V / 3.5A power input\n- Custom-built enclosure\n- Compact integrated electronics\n- Practical reuse of a TV speaker", visible: true, displayOrder: 1 },
            { sectionType: "HARDWARE", title: "Hardware", content: "- 30W Redmi TV speaker\n- CV-3030 / CV-3030A Class-D amplifier\n- KCX BT002 Bluetooth audio module\n- DC-DC step-down converter\n- 12V / 3.5A power adapter\n- Custom speaker enclosure\n- Internal wiring\n- Connectors and mounting hardware", visible: true, displayOrder: 2 },
            { sectionType: "SOFTWARE", title: "Technologies Used", content: "- Bluetooth audio\n- Class-D audio amplification\n- DC-DC power conversion\n- Analog audio signal integration\n- Power electronics\n- Audio electronics\n- Custom enclosure design\n\nNo custom firmware was required for this project.", visible: true, displayOrder: 3 },
            { sectionType: "TECHNICAL", title: "Technical Details", content: "Speaker:\n- Source: Redmi TV\n- Power rating: 30W\n\nAmplifier:\n- Model: CV-3030 / CV-3030A\n- Rated configuration: 30W + 30W\n- Amplifier type: Class-D\n\nBluetooth Module:\n- Model: KCX BT002\n- Supply requirement: 5V / 1A\n\nPower Supply:\n- Input: 12V DC\n- Maximum adapter current: 3.5A\n- Available adapter power: approximately 42W\n\nSystem Type:\n- Wired power\n- Wireless Bluetooth audio", visible: true, displayOrder: 4 },
            { sectionType: "HOW_IT_WORKS", title: "How It Works", content: "Basic working flow:\n\nSmartphone / Bluetooth Device \u2192 KCX BT002 Bluetooth Module \u2192 CV-3030 / CV-3030A Class-D Amplifier \u2192 30W Speaker \u2192 Audio Output\n\nPower System:\n\n12V / 3.5A Adapter \u2192 Power Distribution\n\u251C\u2500\u2500 Class-D Amplifier\n\u2514\u2500\u2500 DC-DC Step-Down \u2192 5V / 1A \u2192 KCX BT002 Bluetooth Module\n\nThe Bluetooth module receives the wireless audio signal and provides the audio signal to the amplifier. The Class-D amplifier increases the audio power sufficiently to drive the speaker.", visible: true, displayOrder: 5 },
            { sectionType: "TESTING", title: "Testing", content: "The completed system was tested for:\n\n- Bluetooth pairing\n- Wireless audio playback\n- Audio output from the speaker\n- Amplifier operation\n- Bluetooth module power supply\n- DC-DC converter operation\n- Power delivery from the 12V adapter\n- Continuous operation during normal use\n- Physical stability of the assembled system\n\nThe complete system successfully operated as intended.", visible: true, displayOrder: 6 },
            { sectionType: "CHALLENGES", title: "Challenges", content: "The main challenge was integrating several independent modules into a single compact speaker system.\n\nKey challenges included:\n- Matching the speaker with the amplifier\n- Providing the correct voltage to the Bluetooth module\n- Managing power distribution between the amplifier and Bluetooth circuit\n- Keeping the internal wiring organized\n- Fitting the electronics inside the enclosure\n- Creating a physically stable assembly\n- Avoiding unnecessary electrical and mechanical clutter", visible: true, displayOrder: 7 },
            { sectionType: "LESSONS", title: "Engineering Lessons", content: "Technical:\n- Practical operation of Class-D audio amplifiers\n- Bluetooth audio module integration\n- Speaker and amplifier power matching\n- DC-DC voltage conversion\n- Power distribution between multiple electronic modules\n- Audio signal integration\n- Practical wiring and connector management\n- Electronics enclosure design\n- Hardware troubleshooting\n- System-level electronics integration\n\nEngineering:\n- Individual modules may work correctly but still require careful integration to create a reliable system.\n- Power requirements need to be considered at the system level.\n- Mechanical design is an important part of electronics product development.\n- Reusing functional components can be a practical way to develop new systems.\n- A prototype does not need to be perfect initially; it can be improved through successive versions.", visible: true, displayOrder: 8 },
            { sectionType: "FUTURE", title: "Improvements / Next Version", content: "For a future version, I would focus on making the system closer to a professionally designed consumer product.\n\nPossible improvements:\n- Design a custom PCB integrating the amplifier and supporting electronics\n- Reduce the internal wiring\n- Improve PCB and component placement\n- Make the enclosure more refined and durable\n- Add dedicated volume controls\n- Add power and status indicators\n- Improve thermal management\n- Improve acoustic enclosure design\n- Make the overall system smaller and cleaner\n- Add a rechargeable battery option\n- Improve protection for the electronics\n\nThe main V2 goal would be:\n\"From a working DIY assembly \u2192 to a compact, professionally integrated audio product.\"", visible: true, displayOrder: 9 },
            { sectionType: "GALLERY", title: "Build Gallery", content: "Completed custom speaker enclosure, Internal electronics and wiring, Class-D amplifier and Bluetooth module, Final assembled speaker.", visible: true, displayOrder: 10 },
          ],
        },
      },
    });

    const skills = await prisma.skill.findMany({
      where: { name: { in: ["Electronics Design", "Hardware Prototyping", "Embedded Systems", "Audio Electronics"] } },
    });
    for (const skill of skills) {
      await prisma.projectSkill.create({ data: { projectId: project.id, skillId: skill.id } });
    }

    const relatedProjects = await prisma.project.findMany({
      where: { slug: { in: ["infinity-smart-switch", "variable-power-supply"] } },
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
