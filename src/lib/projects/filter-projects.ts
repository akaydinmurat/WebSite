import type { Project, ProjectCategoryId } from "@/types";

export type ProjectFilter = "all" | ProjectCategoryId;

export function filterProjects(projects: readonly Project[], filter: ProjectFilter) {
  if (filter === "all") return [...projects].sort((a, b) => a.order - b.order);

  return projects
    .filter((project) => project.category === filter)
    .sort((a, b) => a.order - b.order);
}
