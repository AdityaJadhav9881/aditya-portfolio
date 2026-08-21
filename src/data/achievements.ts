export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
}

export const achievements: Achievement[] = [
  {
    id: "ipg-publication",
    title: "Research Publication — Infinity Power Guard",
    description:
      "Published research on IoT-based portable energy management systems, documenting the design and implementation of the Infinity Power Guard.",
    year: "2026",
    category: "Research",
  },
  {
    id: "ideathon-participation",
    title: "Ideathon / Next Gen Competition",
    description:
      "Participated in ideathon and next generation technology competition, presenting innovative engineering solutions.",
    year: "2024",
    category: "Competition",
  },
];
