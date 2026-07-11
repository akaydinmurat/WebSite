import { HomeExperience } from "@/components/animation/home-experience";
import { PageIntro } from "@/components/animation/page-intro";
import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ContactCta } from "@/components/sections/contact-cta";
import { GoogleReviews } from "@/components/sections/google-reviews";
import { Hero } from "@/components/sections/hero";
import { PackagesPreview } from "@/components/sections/packages-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { StudioStory } from "@/components/sections/studio-story";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      <PageIntro />
      <HomeExperience>
        <Hero />
        <FeaturedProjects />
        <ServicesPreview />
        <PackagesPreview />
        <GoogleReviews />
        <StudioStory />
        <ContactCta />
      </HomeExperience>
    </>
  );
}
