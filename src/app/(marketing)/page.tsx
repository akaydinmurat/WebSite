import { PageIntro } from "@/components/animation/page-intro";
import { SectionDivider } from "@/components/animation/section-divider";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { PackagesPreview } from "@/components/sections/packages-preview";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { ServicesPreview } from "@/components/sections/services-preview";
import { StudioStory } from "@/components/sections/studio-story";

export default function HomePage() {
  return (
    <>
      <PageIntro />
      <Hero />
      <SectionDivider index="01" label="Seçili Çalışmalar" />
      <FeaturedProjects />
      <PhilosophySection />
      <ServicesPreview />
      <PackagesPreview />
      <StudioStory />
      <ContactCta />
    </>
  );
}
