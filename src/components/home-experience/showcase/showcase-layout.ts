export type ShowcasePanelTransform = Readonly<{
  position: readonly [number, number, number];
  rotation: readonly [number, number, number];
}>;

export const showcasePanelTransforms = [
  {
    position: [-2.8, 0.48, -3.7],
    rotation: [0.01, 0.52, -0.015],
  },
  {
    position: [2.8, 0.18, -7.25],
    rotation: [-0.015, -0.52, 0.012],
  },
  {
    position: [-2.8, 0.35, -10.8],
    rotation: [0.012, 0.52, -0.01],
  },
  {
    position: [2.8, 0.5, -14.35],
    rotation: [-0.012, -0.52, 0.014],
  },
  {
    position: [0, 0.28, -22.1],
    rotation: [0, 0, 0],
  },
] as const satisfies readonly ShowcasePanelTransform[];

/**
 * Shared world-space route for the corridor and its camera. The first point
 * intentionally matches the configured vision pose so the hand-off does not
 * introduce a camera jump.
 */
export const showcaseCameraPoints = [
  [0, 0.18, 9.8],
  [0.05, 0.24, 5.6],
  [-0.28, 0.3, 1.1],
  [0.48, 0.18, -3.45],
  [-0.5, 0.36, -7.1],
  [0.48, 0.2, -10.75],
  [-0.42, 0.38, -14.25],
  [0, 0.3, -18.4],
] as const satisfies readonly (readonly [number, number, number])[];

export const showcaseCorridorBounds = {
  startZ: 3.4,
  endZ: -24.2,
  halfWidth: 4.75,
  floorY: -2.6,
  springY: 0.15,
  roofHeight: 3.75,
} as const;
