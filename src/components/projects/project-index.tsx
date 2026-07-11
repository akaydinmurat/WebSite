"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectVisual } from "@/components/projects/project-visual";
import { filterProjects, type ProjectFilter } from "@/lib/projects/filter-projects";
import type { ProjectCategory, ProjectSummary } from "@/types";
import { cn } from "@/lib/utils";

export function ProjectIndex({
  projects,
  categories,
}: {
  projects: readonly ProjectSummary[];
  categories: readonly ProjectCategory[];
}) {
  const archiveRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const visibleProjects = useMemo(() => filterProjects(projects, filter), [filter, projects]);
  const [activeSlug, setActiveSlug] = useState(visibleProjects[0]?.slug ?? "");

  useEffect(() => {
    const root = archiveRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;

    const records = Array.from(root.querySelectorAll<HTMLElement>("[data-project-record]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const slug = (current?.target as HTMLElement | undefined)?.dataset.projectRecord;
        if (slug) setActiveSlug(slug);
      },
      { rootMargin: "-34% 0px -34%", threshold: [0.2, 0.45, 0.7] },
    );

    records.forEach((record) => observer.observe(record));
    return () => observer.disconnect();
  }, [visibleProjects]);

  const categoryCounts = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          projects.filter((project) => project.category === category.id).length,
        ]),
      ),
    [categories, projects],
  );

  const changeFilter = (nextFilter: ProjectFilter) => {
    setFilter(nextFilter);
    setActiveSlug(filterProjects(projects, nextFilter)[0]?.slug ?? "");
  };

  return (
    <div ref={archiveRef} data-active-slug={activeSlug}>
      <div className="site-shell project-filter-frame">
        <div className="project-filter-heading">
          <span>Arşiv filtresi</span>
          <span>{String(visibleProjects.length).padStart(2, "0")} kayıt</span>
        </div>
        <div className="project-filter-list" role="group" aria-label="Proje kategorileri">
          <FilterButton
            active={filter === "all"}
            count={projects.length}
            onClick={() => changeFilter("all")}
          >
            Tümü
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.id}
              active={filter === category.id}
              count={categoryCounts.get(category.id) ?? 0}
              onClick={() => changeFilter(category.id)}
            >
              {category.label}
            </FilterButton>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {visibleProjects.length} proje gösteriliyor.
        </p>
      </div>

      {visibleProjects.length ? (
        <div className="site-shell project-archive">
          <div className="project-archive-stage" aria-hidden="true">
            <div className="project-archive-stage-grid" />
            {visibleProjects.map((project, index) => (
              <div
                key={project.slug}
                className="project-archive-layer"
                data-active={activeSlug === project.slug ? "true" : "false"}
              >
                <ProjectVisual
                  visual={project.cover}
                  projectSlug={project.slug}
                  className="h-full w-full"
                  decorative
                  showArchiveLabel={false}
                  sizes="58vw"
                />
                <div className="project-archive-stage-caption">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{project.title}</span>
                </div>
              </div>
            ))}
            <span className="project-archive-datum">Aktif kesit</span>
          </div>

          <div className="project-archive-records">
            {visibleProjects.map((project, index) => {
              const year = getProjectFact(project, "year");
              const location = getProjectFact(project, "location");
              const category = categories.find((item) => item.id === project.category)?.label;
              const isActive = activeSlug === project.slug;

              return (
                <article
                  key={project.slug}
                  className="project-archive-record"
                  data-project-record={project.slug}
                  data-active={isActive ? "true" : "false"}
                >
                  <Link
                    href={`/projects/${project.slug}`}
                    className="project-archive-record-link"
                    aria-label={`${project.title} projesini incele`}
                    onFocus={() => setActiveSlug(project.slug)}
                    onMouseEnter={() => setActiveSlug(project.slug)}
                    data-cursor-kind="project"
                    data-cursor-label="Projeyi aç"
                    data-cursor-index={String(index + 1).padStart(2, "0")}
                  >
                    <div className="project-archive-record-head">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{category}</span>
                    </div>
                    <h2>{project.title}</h2>
                    <p>{project.excerpt}</p>
                    <div className="project-archive-record-meta">
                      <span>{year}</span>
                      <span>{location}</span>
                      <ArrowUpRight aria-hidden="true" size={18} />
                    </div>
                    <ProjectVisual
                      visual={project.cover}
                      projectSlug={project.slug}
                      className="project-archive-mobile-visual"
                      decorative
                      showArchiveLabel={false}
                      sizes="100vw"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="site-shell py-24 text-center text-[var(--color-muted)]">
          Bu kategoride yayımlanmış proje bulunmuyor.
        </p>
      )}
    </div>
  );
}

function getProjectFact(project: ProjectSummary, id: "location" | "year") {
  return project.facts.find((fact) => fact.id === id)?.value ?? "";
}

function FilterButton({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn("project-filter-button", active && "is-active")}
      aria-pressed={active}
      onClick={onClick}
    >
      <span>{children}</span>
      <span aria-hidden="true">{String(count).padStart(2, "0")}</span>
    </button>
  );
}
