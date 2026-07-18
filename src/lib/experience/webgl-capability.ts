export const WEBGL_MIN_VIEWPORT_WIDTH = 320;

export function isWebglHeroEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() !== "false";
}

export function isWebglViewportCapable({ viewportWidth }: { viewportWidth: number }) {
  return Number.isFinite(viewportWidth) && viewportWidth >= WEBGL_MIN_VIEWPORT_WIDTH;
}
