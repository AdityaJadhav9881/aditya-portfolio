export interface Project {
  id: string;
  name: string;
  oneLine: string;
  year: string;
  category: string;
  technologies: string[];
  description: string;
  problem: string;
  designed: string;
  howItWorks: string;
  features: string[];
  engineering: string;
  result: string;
  learned: string;
  relatedSkills: string[];
  relatedProjects: string[];
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: "infinity-power-guard",
    name: "Infinity Power Guard",
    oneLine: "IoT-enabled portable energy management and backup system.",
    year: "2026",
    category: "Embedded Systems / IoT",
    technologies: ["ESP32", "React", "Firebase", "LiFePO4", "Power Electronics", "IoT"],
    description:
      "A complete portable energy management system combining custom hardware design with a real-time web dashboard for monitoring and controlling power delivery.",
    problem:
      "Existing portable power solutions lack intelligent monitoring, remote management, and transparent energy data. Most systems provide power but no visibility into how it is being used.",
    designed:
      "Designed a custom embedded system around the ESP32 microcontroller paired with a LiFePO4 battery pack, charge controller, inverter stage, and sensor array. The firmware handles real-time telemetry while a React-based dashboard provides live monitoring through Firebase as the backend.",
    howItWorks:
      "Sensors continuously measure voltage, current, temperature, and load across multiple channels. The ESP32 processes this data and transmits it to Firebase in real time. A React dashboard renders live graphs, alerts, and historical trends. The system can autonomously switch between power sources and manage load distribution.",
    features: [
      "Real-time voltage, current, and power monitoring",
      "Web-based dashboard with live telemetry",
      "Multi-channel load management",
      "Temperature monitoring and thermal protection",
      "Historical data logging and trend analysis",
      "Remote monitoring via IoT connectivity",
    ],
    engineering:
      "The hardware was designed from the ground up — from PCB layout to battery management. The firmware was written in C for the ESP32, handling ADC sampling, sensor fusion, and MQTT/Firebase communication. The frontend uses React with real-time subscriptions to Firebase.",
    result:
      "A fully functional portable energy system that provides real-time visibility into power usage, intelligent load management, and reliable backup power delivery.",
    learned:
      "End-to-end system integration across hardware, firmware, and software. Deep understanding of power electronics, battery management, real-time data pipelines, and the challenges of bridging physical systems with digital interfaces.",
    relatedSkills: ["embedded-systems", "iot", "react", "power-electronics", "firebase"],
    relatedProjects: ["diy-lifepo4-backup"],
    links: [],
  },
  {
    id: "diy-lifepo4-backup",
    name: "DIY LiFePO4 Home Backup",
    oneLine: "A custom battery-backed power system designed and built from scratch.",
    year: "2023",
    category: "Power Electronics",
    technologies: ["LiFePO4 Cells", "BMS", "Inverter", "Charge Controller", "Circuit Design"],
    description:
      "A home backup power system built from individual LiFePO4 cells with a custom battery management system, charge controller, and inverter stage.",
    problem:
      "Commercial home backup solutions are expensive and provide limited visibility into battery health and power flow. Understanding every component required building one from the ground up.",
    designed:
      "Selected and configured individual LiFePO4 cells into a battery pack, designed a BMS for cell balancing and protection, implemented a charge controller for solar and grid input, and paired it with an inverter for AC output.",
    howItWorks:
      "LiFePO4 cells are configured in series-parallel to achieve the target voltage and capacity. The BMS monitors individual cell voltages and temperatures, performing active balancing. The charge controller manages input from solar panels and grid power. The inverter converts DC to AC for household loads.",
    features: [
      "Custom cell-level battery management",
      "Active cell balancing",
      "Solar and grid charge input",
      "AC output via pure sine wave inverter",
      "Cell voltage and temperature monitoring",
      "Modular and expandable design",
    ],
    engineering:
      "Every component was selected, tested, and integrated manually. The project required deep understanding of cell chemistry, protection circuits, power conversion topologies, and thermal management.",
    result:
      "A reliable home backup power system that provides clean energy storage and delivery, with full transparency into every stage of the power path.",
    learned:
      "Battery chemistry, cell matching and balancing, power conversion efficiency, thermal management under load, and the importance of safety margins in high-current DC systems.",
    relatedSkills: ["power-electronics", "circuit-design"],
    relatedProjects: ["infinity-power-guard"],
    links: [],
  },
  {
    id: "variable-power-supply",
    name: "Variable Power Supply",
    oneLine: "A transformer-based adjustable power supply built for electronics experimentation.",
    year: "2024",
    category: "Electronics / Test Equipment",
    technologies: ["Transformer", "Voltage Regulator", "Circuit Design", "Analog Electronics"],
    description:
      "A bench power supply built from a transformer through to linear regulation, providing adjustable voltage and current limiting for electronics work.",
    problem:
      "A reliable adjustable power supply is essential for electronics experimentation. Building one from scratch provides deep insight into power supply design, regulation, and protection.",
    designed:
      "Used a step-down transformer with a bridge rectifier and filter capacitor bank, followed by a linear regulator stage with adjustable output. Added current limiting and short-circuit protection.",
    howItWorks:
      "AC mains is stepped down by the transformer, rectified to DC by the bridge rectifier, smoothed by the filter capacitors, and regulated by the adjustable linear regulator. A current sensing resistor and op-amp circuit provide foldback current limiting.",
    features: [
      "Adjustable output voltage",
      "Current limiting with foldback protection",
      "Low ripple output",
      "Over-temperature protection",
      "Clear voltage and current indication",
    ],
    engineering:
      "The design required careful thermal management for the linear regulator, proper transformer selection, and a robust protection circuit. Every stage was breadboard-tested before final assembly.",
    result:
      "A functional bench power supply that serves as a reliable tool for all electronics experimentation and prototyping work.",
    learned:
      "Linear regulation theory, thermal design for power components, transformer sizing, filter capacitor selection, and the practical challenges of building high-current analog circuits.",
    relatedSkills: ["power-electronics", "circuit-design", "analog-electronics"],
    relatedProjects: ["diy-lifepo4-backup"],
    links: [],
  },
  {
    id: "audio-speaker-system",
    name: "Audio / Speaker System",
    oneLine: "A custom-built audio system including speaker and subwoofer design.",
    year: "2025",
    category: "Audio / Electronics",
    technologies: ["Audio Amplifier", "Speaker Design", "Crossover Networks", "Enclosure Design"],
    description:
      "A complete audio system built from amplifier circuits through to speaker and subwoofer enclosure design, optimized for sound quality.",
    problem:
      "Commercial audio systems make compromises in driver selection, enclosure tuning, and amplifier pairing. Building a custom system allows control over every parameter.",
    designed:
      "Designed the amplifier stage, selected and matched drivers, calculated crossover frequencies, and built tuned enclosures for both the main speakers and subwoofer.",
    howItWorks:
      "The amplifier stage drives matched full-range drivers through a passive crossover network that splits the frequency spectrum. The subwoofer handles low frequencies through a separate powered channel with its own enclosure tuning.",
    features: [
      "Custom crossover network design",
      "Tuned enclosure for each driver",
      "Separate subwoofer channel",
      "Driver matching and selection",
      "Optimized frequency response",
    ],
    engineering:
      "Required understanding of Thiele-Small parameters, crossover filter design, enclosure volume calculations, and amplifier impedance matching. Each component was measured and tested individually.",
    result:
      "A high-fidelity audio system with tuned response, clear imaging, and controlled bass extension that rivals commercial systems at significantly higher price points.",
    learned:
      "Acoustic theory, filter design, driver characterization, enclosure resonance, and the intersection of electrical and mechanical engineering in transducer design.",
    relatedSkills: ["circuit-design", "analog-electronics"],
    relatedProjects: ["variable-power-supply"],
    links: [],
  },
  {
    id: "auto-washroom-lights",
    name: "Auto Washroom Lights",
    oneLine: "An automated lighting system with sensor-based control.",
    year: "2022",
    category: "Automation / IoT",
    technologies: ["PIR Sensor", "Microcontroller", "Relay", "Circuit Design"],
    description:
      "An automated washroom lighting system using PIR motion detection and a microcontroller-based relay driver for hands-free operation.",
    problem:
      "Manually switching lights in washrooms is inefficient. An automated system provides convenience while reducing unnecessary energy consumption.",
    designed:
      "Used a PIR motion sensor connected to a microcontroller that drives a relay to control the lighting circuit. Added a configurable timeout and debounce logic to prevent rapid switching.",
    howItWorks:
      "The PIR sensor detects motion and sends a signal to the microcontroller. The microcontroller activates the relay, turning on the lights. After the configured timeout with no detected motion, the relay deactivates and the lights turn off.",
    features: [
      "Motion-activated lighting",
      "Configurable timeout period",
      "Debounce and anti-flicker logic",
      "Low standby power consumption",
      "Simple and reliable design",
    ],
    engineering:
      "The design focused on reliability and simplicity. The PIR sensor placement was optimized for coverage, and the relay driver circuit was designed for long-term switching without contact welding.",
    result:
      "A reliable automated lighting system that has been in daily use, providing consistent hands-free operation.",
    learned:
      "Sensor interfacing, relay driving, debounce algorithms, and the practical considerations of deploying embedded systems in real-world environments.",
    relatedSkills: ["embedded-systems", "circuit-design", "automation"],
    relatedProjects: ["infinity-power-guard"],
    links: [],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getRelatedProjects(projectId: string): Project[] {
  const project = getProjectById(projectId);
  if (!project) return [];
  return project.relatedProjects
    .map((id) => getProjectById(id))
    .filter((p): p is Project => p !== undefined);
}
