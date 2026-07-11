import type { Metadata } from "next";

import { ProjectIndex } from "@/components/projects/project-index";
import { PageHero } from "@/components/ui/page-hero";
import { fallbackProjects, projectCategories } from "@/content/fallback-projects";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Projeler",
  description: "Göknur Uygur Akaydın'ın konut ve ticari mekân proje arşivi.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Proje Seçkisi"
        title="Her mekân, kendi yaşam biçiminden doğar."
        description="Bu seçki mevcut sitede yayımlanan gerçek proje adlarını, yıllarını ve konumlarını yeni portföy yapısında bir araya getirir."
        aside={
          <p className="max-w-xs text-sm text-[var(--color-muted)]">
            Yüksek çözünürlüklü gerçek proje görselleri henüz aktarılmadığı için soyut yer tutucular
            kullanılmaktadır.
          </p>
        }
      />
      <section className="section-space-sm pt-0">
        <ProjectIndex projects={fallbackProjects} categories={projectCategories} />
      </section>
    </>
  );
}
