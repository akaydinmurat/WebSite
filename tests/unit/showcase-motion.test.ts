import { describe, expect, it } from "vitest";

import {
  getShowcaseMotionState,
  SHOWCASE_MOTION_TIMING,
} from "@/components/home-experience/showcase/showcase-motion";

function progressForPanelLocalProgress(
  stageIndex: number,
  localProgress: number,
  stageCount: number,
) {
  const { focusEnd, focusStart, panelWindowInStages } = SHOWCASE_MOTION_TIMING;
  const focusCenter = (focusStart + focusEnd) * 0.5;
  const stageSpaceProgress = stageIndex + (localProgress - focusCenter) * panelWindowInStages;
  return stageSpaceProgress / (stageCount - 1);
}

describe("getShowcaseMotionState", () => {
  it("clamps progress and keeps the first and last stages focused at the endpoints", () => {
    const first = getShowcaseMotionState(-2, 5);
    const last = getShowcaseMotionState(3, 5);

    expect(first.progress).toBe(0);
    expect(first.activeStageIndex).toBe(0);
    expect(first.cameraProgress).toBe(0);
    expect(first.panels[0]).toMatchObject({ phase: "focus", visibility: 1, focusWeight: 1 });

    expect(last.progress).toBe(1);
    expect(last.activeStageIndex).toBe(4);
    expect(last.cameraProgress).toBe(1);
    expect(last.panels[4]).toMatchObject({ phase: "focus", visibility: 1, focusWeight: 1 });
    expect(getShowcaseMotionState(Number.NaN, 5).progress).toBe(0);
  });

  it("lands exactly on every stage anchor in stage space", () => {
    const stageCount = 5;

    for (let stageIndex = 0; stageIndex < stageCount; stageIndex += 1) {
      const progress = stageIndex / (stageCount - 1);
      const state = getShowcaseMotionState(progress, stageCount);

      expect(state.stageSpaceProgress).toBeCloseTo(stageIndex, 10);
      expect(state.activeStageIndex).toBe(stageIndex);
      expect(state.cameraProgress).toBeCloseTo(progress, 10);
      expect(state.panels[stageIndex]).toMatchObject({
        phase: "focus",
        visibility: 1,
        focusWeight: 1,
      });
    }
  });

  it("uses enter, focus hold, and exit phases within each panel window", () => {
    const stageCount = 5;
    const stageIndex = 2;
    const enter = getShowcaseMotionState(
      progressForPanelLocalProgress(stageIndex, 0.12, stageCount),
      stageCount,
    ).panels[stageIndex];
    const hold = getShowcaseMotionState(
      progressForPanelLocalProgress(stageIndex, 0.46, stageCount),
      stageCount,
    ).panels[stageIndex];
    const exit = getShowcaseMotionState(
      progressForPanelLocalProgress(stageIndex, 0.82, stageCount),
      stageCount,
    ).panels[stageIndex];

    expect(enter.phase).toBe("enter");
    expect(enter.localProgress).toBeCloseTo(0.12, 10);
    expect(enter.visibility).toBeGreaterThan(0);
    expect(enter.visibility).toBeLessThan(1);

    expect(hold.phase).toBe("focus");
    expect(hold.localProgress).toBeCloseTo(0.46, 10);
    expect(hold.visibility).toBe(1);
    expect(hold.focusWeight).toBe(1);

    expect(exit.phase).toBe("exit");
    expect(exit.localProgress).toBeCloseTo(0.82, 10);
    expect(exit.visibility).toBeGreaterThan(0);
    expect(exit.visibility).toBeLessThan(1);
  });

  it("briefly overlaps neighboring panels without giving both dominant focus", () => {
    const stageCount = 5;

    for (let stageIndex = 0; stageIndex < stageCount - 1; stageIndex += 1) {
      const midpoint = (stageIndex + 0.5) / (stageCount - 1);
      const state = getShowcaseMotionState(midpoint, stageCount);

      expect(state.panels[stageIndex].visibility).toBeGreaterThan(0);
      expect(state.panels[stageIndex + 1].visibility).toBeGreaterThan(0);
    }

    for (let sample = 0; sample <= 1000; sample += 1) {
      const state = getShowcaseMotionState(sample / 1000, stageCount);
      expect(state.panels.filter((panel) => panel.focusWeight > 0.8).length).toBeLessThanOrEqual(1);
      expect(Math.max(...state.panels.map((panel) => panel.visibility))).toBeGreaterThanOrEqual(
        0.75,
      );
    }
  });

  it("eases camera travel into a plateau around every stage anchor", () => {
    const nearSegmentStart = getShowcaseMotionState(0.025, 5);
    const segmentMiddle = getShowcaseMotionState(0.125, 5);
    const nearSegmentEnd = getShowcaseMotionState(0.225, 5);

    expect(nearSegmentStart.stageSegmentProgress).toBeCloseTo(0.1, 10);
    expect(nearSegmentStart.cameraProgress).toBeLessThan(nearSegmentStart.progress);
    expect(segmentMiddle.cameraProgress).toBeCloseTo(segmentMiddle.progress, 10);
    expect(nearSegmentEnd.stageSegmentProgress).toBeCloseTo(0.9, 10);
    expect(nearSegmentEnd.cameraProgress).toBeGreaterThan(nearSegmentEnd.progress);
  });

  it("returns identical state for the same progress in forward and reverse traversal", () => {
    const samples = [0, 0.037, 0.19, 0.4, 0.625, 0.88, 1];
    const forward = samples.map((progress) => getShowcaseMotionState(progress, 5));
    const reverse = [...samples]
      .reverse()
      .map((progress) => getShowcaseMotionState(progress, 5))
      .reverse();

    expect(reverse).toEqual(forward);
    expect(getShowcaseMotionState(0.4375, 5)).toEqual(getShowcaseMotionState(0.4375, 5));
  });

  it("supports a single-stage experience and rejects invalid stage counts", () => {
    const state = getShowcaseMotionState(0.73, 1);

    expect(state).toMatchObject({
      activeStageIndex: 0,
      cameraProgress: 0,
      stageSpaceProgress: 0,
      stageSegmentProgress: 0,
    });
    expect(state.panels[0]).toMatchObject({ phase: "focus", visibility: 1, focusWeight: 1 });
    expect(() => getShowcaseMotionState(0.5, 0)).toThrow(RangeError);
    expect(() => getShowcaseMotionState(0.5, 2.5)).toThrow(RangeError);
  });
});
