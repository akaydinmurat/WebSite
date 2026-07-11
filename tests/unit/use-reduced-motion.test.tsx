import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function installMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<EventListenerOrEventListenerObject>();
  const addEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type === "change" && listener !== null) {
        listeners.add(listener);
      }
    },
  );
  const removeEventListener = vi.fn(
    (type: string, listener: EventListenerOrEventListenerObject | null) => {
      if (type === "change" && listener !== null) {
        listeners.delete(listener);
      }
    },
  );
  const mediaQueryList = {
    get matches() {
      return matches;
    },
    media: reducedMotionQuery,
    onchange: null,
    addEventListener,
    removeEventListener,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent(event: Event) {
      for (const listener of listeners) {
        if (typeof listener === "function") {
          listener(event);
        } else {
          listener.handleEvent(event);
        }
      }

      return true;
    },
  } satisfies MediaQueryList;
  const matchMedia = vi.fn((query: string) => {
    expect(query).toBe(reducedMotionQuery);
    return mediaQueryList;
  });

  vi.stubGlobal("matchMedia", matchMedia);

  return {
    addEventListener,
    mediaQueryList,
    removeEventListener,
    setMatches(nextMatches: boolean) {
      matches = nextMatches;
      mediaQueryList.dispatchEvent(new Event("change"));
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useReducedMotion", () => {
  it.each([
    [false, "does not reduce motion when the preference is disabled"],
    [true, "reduces motion when the preference is enabled"],
  ])("%s: %s", (initialMatches) => {
    installMatchMedia(initialMatches);

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(initialMatches);
  });

  it("updates when the media query changes and removes its listener on unmount", () => {
    const controller = installMatchMedia(false);
    const { result, unmount } = renderHook(() => useReducedMotion());

    expect(controller.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));

    act(() => {
      controller.setMatches(true);
    });

    expect(result.current).toBe(true);

    const subscribedListener = controller.addEventListener.mock.calls[0]?.[1];
    unmount();

    expect(controller.removeEventListener).toHaveBeenCalledWith("change", subscribedListener);
  });
});
