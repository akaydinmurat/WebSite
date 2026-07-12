import { PageIntro } from "@/components/animation/page-intro";
import { ImmersiveShowroom } from "@/components/showroom/immersive-showroom";
import type { ShowroomScene } from "@/components/showroom/showroom-canvas";
import { fallbackPackages } from "@/content/fallback-packages";
import { fallbackProjects } from "@/content/fallback-projects";
import { fallbackServices } from "@/content/fallback-services";
import { getGoogleReviews } from "@/lib/google-places/fetch-reviews";

export const dynamic = "force-dynamic";

const validScenes = new Set<ShowroomScene>([
  "home",
  "projects",
  "services",
  "packages",
  "reviews",
  "about",
  "contact",
]);

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedScene = Array.isArray(params.scene) ? params.scene[0] : params.scene;
  const initialScene =
    requestedScene && validScenes.has(requestedScene as ShowroomScene)
      ? (requestedScene as ShowroomScene)
      : "home";
  const reviews = await getGoogleReviews();

  return (
    <>
      <PageIntro />
      <ImmersiveShowroom
        initialScene={initialScene}
        packages={fallbackPackages}
        projects={fallbackProjects}
        reviews={reviews}
        services={fallbackServices}
      />
    </>
  );
}
