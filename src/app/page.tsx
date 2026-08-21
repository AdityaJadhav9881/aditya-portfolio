import Hero from "@/sections/Hero";
import Identity from "@/sections/Identity";
import Philosophy from "@/sections/Philosophy";
import SelectedProjects from "@/sections/SelectedProjects";
import SkillsPreview from "@/sections/SkillsPreview";
import JourneyPreview from "@/sections/JourneyPreview";
import ResearchPreview from "@/sections/ResearchPreview";
import Future from "@/sections/Future";
import ContactSection from "@/sections/ContactSection";
import Continuation from "@/sections/Continuation";

export default function Home() {
  return (
    <>
      <Hero />
      <Identity />
      <SelectedProjects />
      <Philosophy />
      <SkillsPreview />
      <JourneyPreview />
      <ResearchPreview />
      <Future />
      <ContactSection />
      <Continuation />
    </>
  );
}
