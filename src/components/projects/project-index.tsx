"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectVisual } from "@/components/projects/project-visual";
import { filterProjects, type ProjectFilter } from "@/lib/projects/filter-projects";
import type { Project, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectIndex({
  projects,
  categories,
}: {
  projects: readonly Project[];
  categories: readonly ProjectCategory[];
}) {
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const visibleProjects = useMemo(() => filterProjects(projects, filter), [filter, projects]);

  return (
    <div>
      <div
        className="site-shell mb-16 flex flex-wrap gap-2"
        role="toolbar"
        aria-label="Proje kategorileri"
      >
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
          Tümü
        </FilterButton>
        {categories.map((category) => (
          <FilterButton
            key={category.id}
            active={filter === category.id}
            onClick={() => setFilter(category.id)}
          >
            {category.label}
          </FilterButton>
        ))}
      </div>

      <div className="site-shell space-y-28" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <article key={project.slug} className="editorial-grid items-end gap-y-8">
            <Link
              href={`/projects/${project.slug}`}
              className={cn(
                "project-link group relative col-span-12 block md:col-span-8",
                index % 2 === 1 && "md:col-start-5",
              )}
              data-cursor-label="Projeyi İncele"
            >
              <ProjectVisual
                visual={project.cover}
                projectSlug={project.slug}
                className="aspect-[4/3] md:aspect-[16/10]"
              />
            </Link>

            <div
              className={cn(
                "col-span-12 border-t border-[var(--color-border)] pt-5 md:col-span-4",
                index % 2 === 0 ? "md:col-start-9" : "md:col-start-1 md:row-start-1",
              )}
            >
              <div className="mb-5 flex justify-between text-[0.64rem] font-semibold tracking-[0.14em] text-[var(--color-muted)] uppercase">
                <span>{String(project.order).padStart(2, "0")}</span>
                <span>Kavramsal Demo</span>
              </div>
              <h2 className="card-title mb-5">{project.title}</h2>
              <p className="mb-7 text-[var(--color-ink-soft)]">{project.excerpt}</p>
              <Link
                href={`/projects/${project.slug}`}
                className="text-link"
                aria-label={`${project.title} projesini incele`}
              >
                Projeyi İncele <ArrowUpRight aria-hidden="true" size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "min-h-11 rounded-full border px-4 text-[0.68rem] font-semibold tracking-[0.11em] uppercase transition-colors",
        active
          ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
          : "border-[var(--color-border)] hover:border-[var(--color-ink)]",
      )}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
