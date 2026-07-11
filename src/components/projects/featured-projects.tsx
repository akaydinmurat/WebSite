import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { SectionMarker } from "@/components/animation/section-divider";
import { ProjectReelMotion } from "@/components/projects/project-reel-motion";
import { ProjectVisual } from "@/components/projects/project-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { fallbackProjects } from "@/content/fallback-projects";
import type { Project } from "@/types";

type ReelStyle = CSSProperties & {
  "--reel-index": number;
  "--reel-count": number;
};

const reelTones = ["paper", "wine", "slate"] as const;

export function FeaturedProjects() {
  const copy = siteConfig.copy.featuredProjects;
  const projects = fallbackProjects.filter((project) => project.featured).slice(0, 3);

  return (
    <section
      id="featured-projects"
      aria-labelledby="featured-projects-title"
      className="featured-projects scroll-mt-24 bg-[var(--color-canvas)]"
      data-cursor-theme="light"
    >
      <div className="site-shell section-frame pt-[var(--space-section)]">
        <SectionMarker index="01" label="Seçili Projeler" meta={`${projects.length} proje`} />
        <SectionHeading
          headingId="featured-projects-title"
          className="mt-14 md:mt-20"
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={
            <Link href="/projects" className="text-link">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          }
        />
      </div>

      <ProjectReelMotion>
        <ol className="project-reel mt-20 md:mt-28">
          {projects.map((project, index) => {
            const location = getProjectFact(project, "location");
            const year = getProjectFact(project, "year");
            const reelNumber = String(index + 1).padStart(2, "0");
            const style = {
              "--reel-index": index,
              "--reel-count": projects.length,
            } as ReelStyle;

            return (
              <li key={project.slug} className="project-reel-item" style={style}>
                <article className="project-reel-card" data-reel-card data-tone={reelTones[index]}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="project-reel-link"
                    aria-label={`${project.title} projesini incele`}
                    data-cursor-kind="project"
                    data-cursor-label="Projeyi aç"
                    data-cursor-index={reelNumber}
                  >
                    <div className="project-reel-media" data-reel-media-motion>
                      <ProjectVisual
                        visual={project.cover}
                        projectSlug={project.slug}
                        className="h-full min-h-[23rem]"
                        decorative
                        sizes="(max-width: 767px) 100vw, 68vw"
                      />
                    </div>

                    <div className="project-reel-copy">
                      <div className="project-reel-index">
                        <span>{reelNumber}</span>
                        <span>/ {String(projects.length).padStart(2, "0")}</span>
                      </div>
                      <div>
                        <p className="project-reel-kicker">Portföy / {year}</p>
                        <h3>{project.title}</h3>
                        <p className="project-reel-summary">{project.excerpt}</p>
                      </div>
                      <div className="project-reel-meta">
                        <span>{location}</span>
                        <span className="inline-flex items-center gap-2">
                          Projeyi incele <ArrowUpRight aria-hidden="true" size={16} />
                        </span>
                      </div>
                    </div>
                    <span className="project-reel-shade" data-reel-shade />
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>
      </ProjectReelMotion>
    </section>
  );
}

function getProjectFact(project: Project, id: "location" | "year") {
  return project.facts.find((fact) => fact.id === id)?.value ?? "";
}
