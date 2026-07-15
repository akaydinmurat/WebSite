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
  const projectSummaries = fallbackProjects.map(
    ({ slug, title, category, excerpt, facts, cover, order }) => ({
      slug,
      title,
      category,
      excerpt,
      facts,
      cover,
      order,
    }),
  );

  return (
    <>
      <PageHero
        eyebrow="Proje Seçkisi"
        title="Her mekân, kendi yaşam biçiminden doğar."
        description="Sekiz proje kaydı; sabit bir görsel kesit ve doğal kaydırma içinde, yıl, konum ve mekân türüyle birlikte okunur."
        tone="sky"
        aside={
          <div className="max-w-xs border-l border-[var(--color-accent)] pl-5">
            <strong className="block font-serif text-4xl font-normal">08</strong>
            <span className="text-[0.68rem] tracking-[0.14em] text-[var(--color-muted)] uppercase">
              Portföy kaydı
            </span>
          </div>
        }
      />
      <section className="luminous-projects-page section-space-sm border-t border-[var(--color-border-strong)] pt-10 md:pt-14">
        <ProjectIndex projects={projectSummaries} categories={projectCategories} />
      </section>
    </>
  );
}
