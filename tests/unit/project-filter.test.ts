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
    const laterLivingRoomProject = {
      ...fallbackProjects[0],
      slug: "later-living-room-test-fixture",
      title: "Later Living Room Test Fixture",
      order: 6,
    } satisfies Project;
    const projects = [laterLivingRoomProject, fallbackProjects[1], fallbackProjects[0]];

    const result = filterProjects(projects, "living-room");

    expect(result.map((project) => project.slug)).toEqual([
      "sessiz-esik",
      "later-living-room-test-fixture",
    ]);
    expect(projects.map((project) => project.slug)).toEqual([
      "later-living-room-test-fixture",
      "katmanli-isik",
      "sessiz-esik",
    ]);
  });

  it("returns an empty list when the selected category has no projects", () => {
    expect(filterProjects([fallbackProjects[0]], "bedroom")).toEqual([]);
  });
});
