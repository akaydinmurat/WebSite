export const WEBGL_MIN_VIEWPORT_WIDTH = 1024;

export function isWebglHeroEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function isWebglViewportCapable({
  hasFinePointer,
  viewportWidth,
}: {
  hasFinePointer: boolean;
  viewportWidth: number;
}) {
  return (
    hasFinePointer && Number.isFinite(viewportWidth) && viewportWidth >= WEBGL_MIN_VIEWPORT_WIDTH
  );
}
