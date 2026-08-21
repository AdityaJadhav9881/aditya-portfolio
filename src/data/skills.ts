export interface SkillGroup {
  id: string;
  name: string;
  description: string;
  skills: { name: string; projects: string[] }[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "electronics",
    name: "Electronics",
    description: "Hardware design from circuit concept to functioning prototype",
    skills: [
      { name: "Embedded Systems", projects: ["infinity-power-guard", "auto-washroom-lights"] },
      { name: "Circuit Design", projects: ["diy-lifepo4-backup", "variable-power-supply", "audio-speaker-system", "auto-washroom-lights"] },
      { name: "Sensors", projects: ["infinity-power-guard", "auto-washroom-lights"] },
      { name: "Power Electronics", projects: ["infinity-power-guard", "diy-lifepo4-backup", "variable-power-supply"] },
      { name: "Analog Electronics", projects: ["variable-power-supply", "audio-speaker-system"] },
    ],
  },
  {
    id: "software",
    name: "Software",
    description: "Code that bridges physical systems with digital interfaces",
    skills: [
      { name: "C", projects: ["infinity-power-guard", "auto-washroom-lights"] },
      { name: "Python", projects: [] },
      { name: "JavaScript", projects: ["infinity-power-guard"] },
      { name: "React", projects: ["infinity-power-guard"] },
    ],
  },
  {
    id: "systems",
    name: "Systems",
    description: "Connecting hardware, software, and infrastructure into working systems",
    skills: [
      { name: "IoT", projects: ["infinity-power-guard", "auto-washroom-lights"] },
      { name: "Firebase", projects: ["infinity-power-guard"] },
      { name: "Hardware-Software Integration", projects: ["infinity-power-guard", "auto-washroom-lights"] },
      { name: "Automation", projects: ["auto-washroom-lights", "infinity-power-guard"] },
    ],
  },
  {
    id: "design",
    name: "Design",
    description: "Thinking through systems, interfaces, and user experience",
    skills: [
      { name: "UI/UX", projects: ["infinity-power-guard"] },
      { name: "System Visualization", projects: ["infinity-power-guard"] },
      { name: "Product Thinking", projects: ["infinity-power-guard", "diy-lifepo4-backup"] },
    ],
  },
];

export function getSkillGroupById(id: string): SkillGroup | undefined {
  return skillGroups.find((g) => g.id === id);
}

export function getAllSkills(): { name: string; group: string; projects: string[] }[] {
  return skillGroups.flatMap((g) =>
    g.skills.map((s) => ({ name: s.name, group: g.id, projects: s.projects }))
  );
}
