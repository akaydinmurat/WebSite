export const TAU = Math.PI * 2;
export const FRONT_PHASE = 0;

const MIN_PROJECT_COUNT = 1;
const FOCUS_START = 0.72;
const FOCUS_END = 0.94;
const SIDE_OPACITY_END = 0.45;
const FRONT_OPACITY_START = 0.78;
const DEGREES_TO_RADIANS = Math.PI / 180;
const MAX_CARD_YAW = 8 * DEGREES_TO_RADIANS;
const MAX_CARD_PITCH = 4 * DEGREES_TO_RADIANS;
const MAX_CARD_ROLL = 2 * DEGREES_TO_RADIANS;

export type CardOrientationOffsets = Readonly<{
  yaw: number;
  pitch: number;
  roll: number;
}>;

function clamp01(value: number) {
  if (!Number.isFinite(value)) return value === Number.POSITIVE_INFINITY ? 1 : 0;
  return Math.min(1, Math.max(0, value));
}

export function damp(
  current: number,
  target: number,
  responsiveness: number,
  deltaSeconds: number,
) {
  const safeDelta = Math.max(0, deltaSeconds);
  const alpha = 1 - Math.exp(-Math.max(0, responsiveness) * safeDelta);
  return current + (target - current) * alpha;
}

export function wrapAngle(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function getOrbitPhase(angle: number, index: number, projectCount: number) {
  const safeCount = Math.max(MIN_PROJECT_COUNT, projectCount);
  return angle + index * (TAU / safeCount);
}

export function getFrontness(phase: number) {
  return (Math.cos(phase - FRONT_PHASE) + 1) * 0.5;
}

export function getFocusWeight(frontness: number) {
  return smoothstep(FOCUS_START, FOCUS_END, clamp01(frontness));
}

export function getClosestProjectIndex(angle: number, projectCount: number) {
  if (projectCount <= 0) return -1;

  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < projectCount; index += 1) {
    const phase = getOrbitPhase(angle, index, projectCount);
    const distance = Math.abs(wrapAngle(phase - FRONT_PHASE));

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  }

  return closestIndex;
}

export function getDepthScale(
  frontness: number,
  backScale: number,
  sideScale: number,
  frontScale: number,
) {
  const clampedFrontness = Math.min(1, Math.max(0, frontness));

  if (clampedFrontness <= 0.5) {
    return backScale + (sideScale - backScale) * (clampedFrontness * 2);
  }

  return sideScale + (frontScale - sideScale) * ((clampedFrontness - 0.5) * 2);
}

export function getDepthOpacity(
  frontness: number,
  backOpacity: number,
  sideOpacity: number,
  frontOpacity: number,
) {
  const clampedFrontness = clamp01(frontness);
  const clampedBackOpacity = clamp01(backOpacity);
  const clampedSideOpacity = Math.max(clampedBackOpacity, clamp01(sideOpacity));
  const clampedFrontOpacity = Math.max(clampedSideOpacity, clamp01(frontOpacity));

  if (clampedFrontness <= SIDE_OPACITY_END) {
    const sideProgress = smoothstep(0, SIDE_OPACITY_END, clampedFrontness);
    return clampedBackOpacity + (clampedSideOpacity - clampedBackOpacity) * sideProgress;
  }

  if (clampedFrontness <= FRONT_OPACITY_START) return clampedSideOpacity;

  const frontProgress = smoothstep(FRONT_OPACITY_START, 1, clampedFrontness);
  return clampedSideOpacity + (clampedFrontOpacity - clampedSideOpacity) * frontProgress;
}

export function getCardOrientationOffsets(
  phase: number,
  frontness: number,
): CardOrientationOffsets {
  const safePhase = Number.isFinite(phase) ? phase : FRONT_PHASE;
  const phaseOffset = wrapAngle(safePhase - FRONT_PHASE);
  const sideDirection = Math.sin(phaseOffset);
  const focusFlattening = 1 - getFocusWeight(frontness);

  return {
    yaw: -sideDirection * MAX_CARD_YAW * focusFlattening,
    pitch: Math.abs(sideDirection) * MAX_CARD_PITCH * focusFlattening,
    roll: -sideDirection * MAX_CARD_ROLL * focusFlattening,
  };
}

export function smoothstep(edgeStart: number, edgeEnd: number, value: number) {
  if (edgeStart === edgeEnd) return value < edgeStart ? 0 : 1;

  const progress = Math.min(1, Math.max(0, (value - edgeStart) / (edgeEnd - edgeStart)));
  return progress * progress * (3 - 2 * progress);
}
