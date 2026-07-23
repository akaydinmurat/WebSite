import { HomeExperience } from "@/components/home-experience/home-experience";
import { fallbackPackages } from "@/content/fallback-packages";
import { fallbackProjects } from "@/content/fallback-projects";
import { fallbackServices } from "@/content/fallback-services";
import { getGoogleReviews } from "@/lib/google-places/fetch-reviews";

export const revalidate = 3600;

export default async function HomePage() {
  const reviews = await getGoogleReviews();

  return (
    <HomeExperience
      packages={fallbackPackages}
      projects={fallbackProjects}
      reviews={reviews}
      services={fallbackServices}
    />
  );
}
