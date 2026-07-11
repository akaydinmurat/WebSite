import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/animation/fade-in";
import { ImageReveal } from "@/components/animation/image-reveal";
import { ProjectVisual } from "@/components/projects/project-visual";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { fallbackProjects } from "@/content/fallback-projects";
import { cn } from "@/lib/utils";

export function FeaturedProjects() {
  const copy = siteConfig.copy.featuredProjects;
  const projects = fallbackProjects.filter((project) => project.featured).slice(0, 3);

  return (
    <section
      id="featured-projects"
      className="section-space scroll-mt-24 bg-[var(--color-canvas)]"
      data-cursor-theme="light"
    >
      <div className="site-shell">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          action={
            <Link href="/projects" className="text-link">
              {copy.actionLabel} <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          }
        />

        <div className="mt-24 space-y-28 md:mt-36 md:space-y-44">
          {projects.map((project, index) => (
            <article key={project.slug} className="editorial-grid items-end gap-y-7">
              <ImageReveal
                className={cn(
                  "project-link col-span-12 md:col-span-8",
                  index % 2 === 1 && "md:col-start-5",
                )}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  data-cursor-label="Projeyi İncele"
                  className="block"
                >
                  <ProjectVisual
                    visual={project.cover}
                    projectSlug={project.slug}
                    className={cn(
                      "aspect-[4/3]",
                      index === 1 ? "md:aspect-[5/4]" : "md:aspect-[16/10]",
                    )}
                  />
                </Link>
              </ImageReveal>

              <FadeIn
                className={cn(
                  "col-span-12 border-t border-[var(--color-border)] pt-5 md:col-span-4",
                  index % 2 === 0 ? "md:col-start-9" : "md:col-start-1 md:row-start-1",
                )}
              >
                <div className="mb-5 flex justify-between text-[0.64rem] font-semibold tracking-[0.13em] text-[var(--color-muted)] uppercase">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>Portföy Arşivi</span>
                </div>
                <h3 className="card-title mb-5">{project.title}</h3>
                <p className="mb-7 text-[var(--color-ink-soft)]">{project.excerpt}</p>
                <Link href={`/projects/${project.slug}`} className="text-link">
                  Projeyi İncele <ArrowUpRight aria-hidden="true" size={15} />
                </Link>
              </FadeIn>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
