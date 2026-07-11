import type { ProjectCategoryId, ProjectSummary } from "@/types";

export type ProjectFilter = "all" | ProjectCategoryId;

export function filterProjects<T extends ProjectSummary>(
  projects: readonly T[],
  filter: ProjectFilter,
) {
  if (filter === "all") return [...projects].sort((a, b) => a.order - b.order);

  return projects
    .filter((project) => project.category === filter)
    .sort((a, b) => a.order - b.order);
}
