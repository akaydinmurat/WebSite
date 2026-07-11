import { PageIntro } from "@/components/animation/page-intro";
import { SectionDivider } from "@/components/animation/section-divider";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { PackagesPreview } from "@/components/sections/packages-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { StudioStory } from "@/components/sections/studio-story";

export default function HomePage() {
  return (
    <>
      <PageIntro />
      <Hero />
      <SectionDivider index="01" label="Seçili Projeler" />
      <FeaturedProjects />
      <SectionDivider index="02" label="Çalışma Alanları" />
      <ServicesPreview />
      <SectionDivider index="03" label="Tasarım Paketleri" />
      <PackagesPreview />
      <SectionDivider index="04" label="Göknur Uygur Akaydın" />
      <StudioStory />
      <ContactCta />
    </>
  );
}
