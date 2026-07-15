import type { ExperiencePhase } from "./experience-config";

export type ExperienceTrack = "intro" | "works" | "vision" | "showcase" | "packages" | "outro";

export type ExperienceSnapshot = Readonly<{
  phase: ExperiencePhase;
  activeProjectIndex: number;
  showcaseStage: number;
}>;

type OrbitRuntime = {
  angle: number;
  velocity: number;
  dragDeltaPixels: number;
  dragVelocityPixels: number;
  dragging: boolean;
  pointerId: number | null;
  startX: number;
  lastX: number;
  lastMoveAt: number;
  totalDistance: number;
};

type ExperienceRuntime = {
  phase: ExperiencePhase;
  phaseProgress: number;
  introProgress: number;
  worksProgress: number;
  visionProgress: number;
  showcaseProgress: number;
  packagesProgress: number;
  outroProgress: number;
  pointer: {
    x: number;
    y: number;
    speed: number;
    active: boolean;
    lastUpdatedAt: number;
  };
  orbit: OrbitRuntime;
  reducedMotion: boolean;
  pageVisible: boolean;
  selectedProjectSlug: string | null;
  projectOpenStartedAt: number;
};

const listeners = new Set<() => void>();

let snapshot: ExperienceSnapshot = {
  phase: "intro",
  activeProjectIndex: 0,
  showcaseStage: 0,
};

const serverSnapshot: ExperienceSnapshot = {
  phase: "intro",
  activeProjectIndex: 0,
  showcaseStage: 0,
};

const runtime: ExperienceRuntime = {
  phase: "intro",
  phaseProgress: 0,
  introProgress: 0,
  worksProgress: 0,
  visionProgress: 0,
  showcaseProgress: 0,
  packagesProgress: 0,
  outroProgress: 0,
  pointer: {
    x: 0,
    y: 0,
    speed: 0,
    active: false,
    lastUpdatedAt: 0,
  },
  orbit: {
    angle: 0,
    velocity: 0,
    dragDeltaPixels: 0,
    dragVelocityPixels: 0,
    dragging: false,
    pointerId: null,
    startX: 0,
    lastX: 0,
    lastMoveAt: 0,
    totalDistance: 0,
  },
  reducedMotion: false,
  pageVisible: true,
  selectedProjectSlug: null,
  projectOpenStartedAt: 0,
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function emit(nextSnapshot: ExperienceSnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

export function getExperienceSnapshot() {
  return snapshot;
}

export function getExperienceServerSnapshot(): ExperienceSnapshot {
  return serverSnapshot;
}

export function subscribeExperience(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getExperienceRuntime() {
  return runtime;
}

export function setExperiencePhase(phase: ExperiencePhase, progress: number) {
  runtime.phase = phase;
  runtime.phaseProgress = clamp01(progress);

  if (snapshot.phase !== phase) {
    emit({ ...snapshot, phase });
  }
}

export function setTrackProgress(track: ExperienceTrack, progress: number) {
  runtime[`${track}Progress`] = clamp01(progress);
}

export function setActiveProjectIndex(index: number) {
  if (snapshot.activeProjectIndex === index) return;
  emit({ ...snapshot, activeProjectIndex: index });
}

export function setShowcaseStage(stage: number) {
  if (snapshot.showcaseStage === stage) return;
  emit({ ...snapshot, showcaseStage: stage });
}

export function setReducedMotion(reducedMotion: boolean) {
  runtime.reducedMotion = reducedMotion;
}

export function setPageVisibility(visible: boolean) {
  runtime.pageVisible = visible;
}

export function updateExperiencePointer(
  clientX: number,
  clientY: number,
  viewportWidth: number,
  viewportHeight: number,
  active = true,
) {
  const now = performance.now();
  const x = (clientX / Math.max(1, viewportWidth)) * 2 - 1;
  const y = 1 - (clientY / Math.max(1, viewportHeight)) * 2;
  const elapsed = Math.max(16, now - runtime.pointer.lastUpdatedAt);
  const distance = Math.hypot(x - runtime.pointer.x, y - runtime.pointer.y);
  const speed = Math.min(4, (distance / elapsed) * 1000);

  runtime.pointer = {
    x,
    y,
    speed,
    active,
    lastUpdatedAt: now,
  };
}

export function deactivateExperiencePointer() {
  runtime.pointer.active = false;
  runtime.pointer.speed = 0;
}

export function beginOrbitDrag(pointerId: number, clientX: number) {
  const now = performance.now();
  Object.assign(runtime.orbit, {
    dragging: true,
    pointerId,
    startX: clientX,
    lastX: clientX,
    lastMoveAt: now,
    totalDistance: 0,
    dragDeltaPixels: 0,
  });
}

export function updateOrbitDrag(pointerId: number, clientX: number) {
  const orbit = runtime.orbit;
  if (!orbit.dragging || orbit.pointerId !== pointerId) return;

  const now = performance.now();
  const delta = clientX - orbit.lastX;
  const elapsed = Math.max(8, now - orbit.lastMoveAt);
  orbit.dragDeltaPixels += delta;
  orbit.dragVelocityPixels = (delta / elapsed) * 1000;
  orbit.totalDistance += Math.abs(delta);
  orbit.lastX = clientX;
  orbit.lastMoveAt = now;
}

export function finishOrbitDrag(pointerId?: number) {
  const orbit = runtime.orbit;
  if (!orbit.dragging || (pointerId !== undefined && orbit.pointerId !== pointerId)) return false;

  const wasDragged = orbit.totalDistance > 8;
  orbit.dragging = false;
  orbit.pointerId = null;
  return wasDragged;
}

export function consumeOrbitDragDelta() {
  const deltaPixels = runtime.orbit.dragDeltaPixels;
  runtime.orbit.dragDeltaPixels = 0;
  return deltaPixels;
}

export function selectProjectForOpening(slug: string) {
  runtime.selectedProjectSlug = slug;
  runtime.projectOpenStartedAt = performance.now();
}

export function resetExperienceRuntime() {
  runtime.phase = "intro";
  runtime.phaseProgress = 0;
  runtime.introProgress = 0;
  runtime.worksProgress = 0;
  runtime.visionProgress = 0;
  runtime.showcaseProgress = 0;
  runtime.packagesProgress = 0;
  runtime.outroProgress = 0;
  runtime.pointer.active = false;
  runtime.orbit.dragging = false;
  runtime.orbit.pointerId = null;
  runtime.orbit.dragDeltaPixels = 0;
  runtime.selectedProjectSlug = null;
  runtime.projectOpenStartedAt = 0;
  emit({ phase: "intro", activeProjectIndex: 0, showcaseStage: 0 });
}
