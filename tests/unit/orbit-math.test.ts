import { describe, expect, it } from "vitest";

import {
  TAU,
  damp,
  getCardOrientationOffsets,
  getClosestProjectIndex,
  getDepthOpacity,
  getFocusWeight,
} from "@/components/home-experience/orbit/orbit-math";

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

describe("orbit math", () => {
  it("clamps the focus curve and eases through one focus window", () => {
    expect(getFocusWeight(-1)).toBe(0);
    expect(getFocusWeight(0.72)).toBe(0);
    expect(getFocusWeight(0.83)).toBeCloseTo(0.5);
    expect(getFocusWeight(0.94)).toBe(1);
    expect(getFocusWeight(2)).toBe(1);
    expect(getFocusWeight(Number.NaN)).toBe(0);
  });

  it("keeps depth opacity clamped and ordered through back, side, and front bands", () => {
    const samples = [-1, 0.2, 0.45, 0.6, 0.78, 0.9, 2].map((frontness) =>
      getDepthOpacity(frontness, 0.24, 0.66, 1),
    );

    expect(samples[0]).toBe(0.24);
    expect(samples[2]).toBeCloseTo(0.66);
    expect(samples[3]).toBeCloseTo(0.66);
    expect(samples[4]).toBeCloseTo(0.66);
    expect(samples.at(-1)).toBe(1);

    for (let index = 1; index < samples.length; index += 1) {
      expect(samples[index]).toBeGreaterThanOrEqual(samples[index - 1]);
    }

    expect(getDepthOpacity(0, -0.4, 0.6, 1.4)).toBe(0);
    expect(getDepthOpacity(1, -0.4, 0.6, 1.4)).toBe(1);
    expect(getDepthOpacity(1, 0.8, 0.5, 0.2)).toBe(0.8);
  });

  it("keeps the front card flat and side cards inside the orientation limits", () => {
    const front = getCardOrientationOffsets(0, 1);
    const right = getCardOrientationOffsets(Math.PI / 2, 0.5);
    const left = getCardOrientationOffsets(-Math.PI / 2, 0.5);

    expect(front).toEqual({ yaw: -0, pitch: 0, roll: -0 });
    expect(Math.abs(right.yaw)).toBeLessThanOrEqual(degreesToRadians(8));
    expect(Math.abs(right.pitch)).toBeLessThanOrEqual(degreesToRadians(4));
    expect(Math.abs(right.roll)).toBeLessThanOrEqual(degreesToRadians(2));
    expect(left.yaw).toBeCloseTo(-right.yaw);
    expect(left.pitch).toBeCloseTo(right.pitch);
    expect(left.roll).toBeCloseTo(-right.roll);
  });

  it("flattens orientation deterministically as a card enters the focus window", () => {
    const phase = Math.PI / 3;
    const background = getCardOrientationOffsets(phase, 0.5);
    const focused = getCardOrientationOffsets(phase, 0.94);
    const wrapped = getCardOrientationOffsets(phase + TAU, 0.5);

    expect(focused.yaw).toBeCloseTo(0);
    expect(focused.pitch).toBeCloseTo(0);
    expect(focused.roll).toBeCloseTo(0);
    expect(wrapped.yaw).toBeCloseTo(background.yaw);
    expect(wrapped.pitch).toBeCloseTo(background.pitch);
    expect(wrapped.roll).toBeCloseTo(background.roll);
  });

  it("finds the closest project across wrapped orbit angles", () => {
    expect(getClosestProjectIndex(0, 4)).toBe(0);
    expect(getClosestProjectIndex(-Math.PI / 2, 4)).toBe(1);
    expect(getClosestProjectIndex(-Math.PI, 4)).toBe(2);
    expect(getClosestProjectIndex(TAU - Math.PI / 2, 4)).toBe(1);
    expect(getClosestProjectIndex(0, 0)).toBe(-1);
  });

  it("damps without overshooting and remains frame-rate independent", () => {
    expect(damp(2, 8, 5, 0)).toBe(2);
    expect(damp(2, 8, -5, 1)).toBe(2);

    const oneStep = damp(0, 10, 5, 0.2);
    const firstHalf = damp(0, 10, 5, 0.1);
    const twoSteps = damp(firstHalf, 10, 5, 0.1);

    expect(oneStep).toBeGreaterThan(0);
    expect(oneStep).toBeLessThan(10);
    expect(twoSteps).toBeCloseTo(oneStep);
  });
});
