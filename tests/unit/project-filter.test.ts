import { describe, expect, it } from "vitest";

import { fallbackProjects } from "@/content/fallback-projects";
import { filterProjects } from "@/lib/projects/filter-projects";
import type { Project } from "@/types";

describe("filterProjects", () => {
  it("returns every project in editorial order without mutating the input", () => {
    const projects = [fallbackProjects[2], fallbackProjects[0], fallbackProjects[1]];
    const originalOrder = projects.map((project) => project.slug);

    const result = filterProjects(projects, "all");

    expect(result.map((project) => project.order)).toEqual([1, 2, 3]);
    expect(projects.map((project) => project.slug)).toEqual(originalOrder);
    expect(result).not.toBe(projects);
  });

  it("keeps only the selected category and sorts the filtered projects", () => {
    const laterKitchenProject = {
      ...fallbackProjects[0],
      slug: "later-kitchen-test-fixture",
      title: "Later Kitchen Test Fixture",
      order: 12,
    } satisfies Project;
    const projects = [laterKitchenProject, fallbackProjects[1], fallbackProjects[0]];

    const result = filterProjects(projects, "kitchen");

    expect(result.map((project) => project.slug)).toEqual([
      "bm-evi-mutfak",
      "later-kitchen-test-fixture",
    ]);
    expect(projects.map((project) => project.slug)).toEqual([
      "later-kitchen-test-fixture",
      "es-evi-banyo",
      "bm-evi-mutfak",
    ]);
  });

  it("returns an empty list when the selected category has no projects", () => {
    expect(filterProjects([fallbackProjects[0]], "commercial")).toEqual([]);
  });
});
