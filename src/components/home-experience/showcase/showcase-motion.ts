export const SHOWCASE_MOTION_TIMING = {
  focusStart: 0.25,
  focusEnd: 0.68,
  panelWindowInStages: 1.6,
  cameraPlateauShare: 0.22,
  cameraPlateauTravel: 0.045,
} as const;

export type ShowcasePanelPhase = "before" | "enter" | "focus" | "exit" | "after";

export type ShowcasePanelMotionState = Readonly<{
  stageIndex: number;
  phase: ShowcasePanelPhase;
  localProgress: number;
  visibility: number;
  focusWeight: number;
}>;

export type ShowcaseMotionState = Readonly<{
  progress: number;
  stageCount: number;
  stageSpaceProgress: number;
  stageSegmentIndex: number;
  stageSegmentProgress: number;
  activeStageIndex: number;
  activeStageProgress: number;
  cameraProgress: number;
  panels: readonly ShowcasePanelMotionState[];
}>;

function clamp01(value: number) {
  if (Number.isNaN(value) || value === Number.NEGATIVE_INFINITY) return 0;
  if (value === Number.POSITIVE_INFINITY) return 1;
  return Math.min(1, Math.max(0, value));
}

function smootherstep(value: number) {
  const clamped = clamp01(value);
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

function assertStageCount(stageCount: number) {
  if (!Number.isInteger(stageCount) || stageCount < 1) {
    throw new RangeError("stageCount must be a positive integer.");
  }
}

/**
 * Eases one camera segment while reserving low-travel regions around both
 * stage anchors. The result remains monotonic and direction-independent.
 */
export function easeShowcaseCameraSegment(progress: number) {
  const clamped = clamp01(progress);
  const { cameraPlateauShare, cameraPlateauTravel } = SHOWCASE_MOTION_TIMING;

  if (clamped <= cameraPlateauShare) {
    return cameraPlateauTravel * smootherstep(clamped / cameraPlateauShare);
  }

  if (clamped >= 1 - cameraPlateauShare) {
    const remaining = (1 - clamped) / cameraPlateauShare;
    return 1 - cameraPlateauTravel * smootherstep(remaining);
  }

  const middleProgress =
    (clamped - cameraPlateauShare) / Math.max(1 - cameraPlateauShare * 2, Number.EPSILON);
  return cameraPlateauTravel + (1 - cameraPlateauTravel * 2) * smootherstep(middleProgress);
}

function getPanelMotion(stageSpaceProgress: number, stageIndex: number) {
  const { focusEnd, focusStart, panelWindowInStages } = SHOWCASE_MOTION_TIMING;
  const focusCenter = (focusStart + focusEnd) * 0.5;
  const rawLocalProgress = focusCenter + (stageSpaceProgress - stageIndex) / panelWindowInStages;
  const localProgress = clamp01(rawLocalProgress);

  let phase: ShowcasePanelPhase;
  let visibility: number;

  if (rawLocalProgress < 0) {
    phase = "before";
    visibility = 0;
  } else if (rawLocalProgress < focusStart) {
    phase = "enter";
    visibility = smootherstep(localProgress / focusStart);
  } else if (rawLocalProgress <= focusEnd) {
    phase = "focus";
    visibility = 1;
  } else if (rawLocalProgress < 1) {
    phase = "exit";
    visibility = 1 - smootherstep((localProgress - focusEnd) / (1 - focusEnd));
  } else {
    phase = "after";
    visibility = 0;
  }

  return {
    stageIndex,
    phase,
    localProgress,
    visibility,
    focusWeight: phase === "focus" ? 1 : visibility * visibility,
  } satisfies ShowcasePanelMotionState;
}

/**
 * Converts normalized scroll progress into the complete deterministic motion
 * state for the process gallery. No scroll direction or elapsed time is used,
 * so revisiting the same progress always produces the same result.
 */
export function getShowcaseMotionState(progress: number, stageCount: number): ShowcaseMotionState {
  assertStageCount(stageCount);

  const clampedProgress = clamp01(progress);

  if (stageCount === 1) {
    const panel = getPanelMotion(0, 0);
    return {
      progress: clampedProgress,
      stageCount,
      stageSpaceProgress: 0,
      stageSegmentIndex: 0,
      stageSegmentProgress: 0,
      activeStageIndex: 0,
      activeStageProgress: panel.localProgress,
      cameraProgress: 0,
      panels: [panel],
    };
  }

  const lastStageIndex = stageCount - 1;
  const stageSpaceProgress = clampedProgress * lastStageIndex;
  const stageSegmentIndex = Math.min(Math.floor(stageSpaceProgress), lastStageIndex - 1);
  const stageSegmentProgress = clamp01(stageSpaceProgress - stageSegmentIndex);
  const cameraProgress =
    (stageSegmentIndex + easeShowcaseCameraSegment(stageSegmentProgress)) / lastStageIndex;
  const panels = Array.from({ length: stageCount }, (_, stageIndex) =>
    getPanelMotion(stageSpaceProgress, stageIndex),
  );

  let activeStageIndex = 0;
  for (let stageIndex = 1; stageIndex < panels.length; stageIndex += 1) {
    const candidate = panels[stageIndex];
    const active = panels[activeStageIndex];

    if (
      candidate.focusWeight > active.focusWeight ||
      (candidate.focusWeight === active.focusWeight &&
        Math.abs(stageSpaceProgress - stageIndex) < Math.abs(stageSpaceProgress - activeStageIndex))
    ) {
      activeStageIndex = stageIndex;
    }
  }

  return {
    progress: clampedProgress,
    stageCount,
    stageSpaceProgress,
    stageSegmentIndex,
    stageSegmentProgress,
    activeStageIndex,
    activeStageProgress: panels[activeStageIndex].localProgress,
    cameraProgress,
    panels,
  };
}
