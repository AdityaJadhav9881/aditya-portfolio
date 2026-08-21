export interface ResearchEntry {
  id: string;
  title: string;
  project: string;
  description: string;
  links: { label: string; url: string }[];
}

export const research: ResearchEntry[] = [
  {
    id: "ipg-iot-energy",
    title: "An IoT-Based Portable Energy Management System",
    project: "infinity-power-guard",
    description:
      "Research and development of an IoT-enabled portable energy system integrating embedded sensing, real-time telemetry, and web-based monitoring for portable power applications.",
    links: [],
  },
];
