import { PageIntro } from "@/components/animation/page-intro";
import { HomeScrollLayers } from "@/components/animation/home-scroll-layers";
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
      <FeaturedProjects />
      <HomeScrollLayers>
        <ServicesPreview />
        <PackagesPreview />
        <StudioStory />
        <ContactCta />
      </HomeScrollLayers>
    </>
  );
}
