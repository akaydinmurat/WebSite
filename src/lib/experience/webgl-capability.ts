export const WEBGL_MIN_VIEWPORT_WIDTH = 560;

export function isWebglViewportCapable({
  hasFinePointer,
  viewportWidth,
}: {
  hasFinePointer: boolean;
  viewportWidth: number;
}) {
  return hasFinePointer && viewportWidth >= WEBGL_MIN_VIEWPORT_WIDTH;
}
