export interface JourneyEntry {
  year: string;
  title: string;
  description: string;
  projects: string[];
  type: "milestone" | "project" | "ongoing";
}

export const journey: JourneyEntry[] = [
  {
    year: "2021",
    title: "First Experiments",
    description: "Beginning the hands-on journey into electronics and building things from scratch.",
    projects: [],
    type: "milestone",
  },
  {
    year: "2022",
    title: "Automation Projects",
    description: "Building practical systems that solve real problems — starting with automated lighting.",
    projects: ["auto-washroom-lights"],
    type: "project",
  },
  {
    year: "2023",
    title: "Power Systems Deep Dive",
    description: "Designing a complete LiFePO4 backup power system from individual cells to working product.",
    projects: ["diy-lifepo4-backup"],
    type: "project",
  },
  {
    year: "2024",
    title: "Test Equipment & Foundations",
    description: "Building the tools needed for deeper electronics work — a variable power supply.",
    projects: ["variable-power-supply"],
    type: "project",
  },
  {
    year: "2025",
    title: "Audio & Signal Systems",
    description: "Exploring the intersection of electrical engineering and acoustics through custom speaker design.",
    projects: ["audio-speaker-system"],
    type: "project",
  },
  {
    year: "2026",
    title: "Infinity Power Guard",
    description: "Bringing hardware, firmware, and software together into a complete IoT energy management system.",
    projects: ["infinity-power-guard"],
    type: "project",
  },
  {
    year: "Future",
    title: "Next Build",
    description: "More systems. More experiments. More connections between hardware and software.",
    projects: [],
    type: "ongoing",
  },
];
