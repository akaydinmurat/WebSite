import type { Metadata } from "next";

import { ProjectIndex } from "@/components/projects/project-index";
import { PageHero } from "@/components/ui/page-hero";
import { fallbackProjects, projectCategories } from "@/content/fallback-projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Projeler",
  description:
    "İç mimari ve 3D görselleştirme sunum biçimini gösteren kavramsal demo proje seçkisi.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Proje Seçkisi"
        title="Her mekân, kendine ait bir ritim arar."
        description="Bu seçki, gerçek içerikler eklenene kadar sitenin editoryal proje deneyimini göstermek için hazırlanmış kavramsal demo çalışmalardan oluşur."
        aside={
          <p className="max-w-xs text-sm text-[var(--color-muted)]">
            Tüm görseller ve proje bilgileri demo niteliğindedir; uygulanmış bir mekânı temsil
            etmez.
          </p>
        }
      />
      <section className="section-space-sm pt-0">
        <ProjectIndex projects={fallbackProjects} categories={projectCategories} />
      </section>
    </>
  );
}
