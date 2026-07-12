"use client";

import Image from "next/image";
import { useRef } from "react";

import { ShowroomCoreFallback } from "@/components/showroom/showroom-core-fallback";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, useGSAP } from "@/lib/animation/gsap";

const introSessionKey = "goknur-home-intro-v4";
const safetyTimeoutMs = 5_200;

export function PageIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<(restoreFocus?: boolean) => void>(() => undefined);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const hideImmediately = () => {
        root.setAttribute("aria-hidden", "true");
        root.setAttribute("data-state", "complete");
        gsap.set(root, { autoAlpha: 0, display: "none" });
      };

      const prefersReducedMotion =
        reducedMotion || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      let introSeen = false;
      try {
        introSeen = window.sessionStorage.getItem(introSessionKey) === "true";
      } catch {
        // Storage may be unavailable in privacy-restricted browsing contexts.
      }

      if (prefersReducedMotion || introSeen) {
        hideImmediately();
        finishRef.current = () => undefined;
        return;
      }

      const body = document.body;
      const header = document.querySelector<HTMLElement>('header[data-testid="site-header"]');
      const skipLink = document.querySelector<HTMLElement>(".skip-link");
      const footer = document.querySelector<HTMLElement>("footer");
      const homeContent = document.querySelector<HTMLElement>(
        "[data-home-content], .home-experience-content",
      );
      const inertSnapshots = [skipLink, header, homeContent, footer]
        .filter((element): element is HTMLElement => element !== null)
        .map((element) => ({ element, hadInert: element.hasAttribute("inert") }));
      const previousBodyOverflow = body.style.overflow;
      const previousIntroState = body.getAttribute("data-intro-open");

      let timeline: gsap.core.Timeline | null = null;
      let safetyTimeout: number | null = null;
      let finished = false;

      const restoreEnvironment = () => {
        inertSnapshots.forEach(({ element, hadInert }) => {
          if (element.hasAttribute("data-site-footer") && body.dataset.showroomActive === "true") {
            element.setAttribute("inert", "");
            return;
          }

          if (hadInert) {
            element.setAttribute("inert", "");
          } else {
            element.removeAttribute("inert");
          }
        });

        body.style.overflow = previousBodyOverflow;
        if (previousIntroState === null) {
          body.removeAttribute("data-intro-open");
        } else {
          body.setAttribute("data-intro-open", previousIntroState);
        }
      };

      const finish = (restoreFocus = false) => {
        if (finished) return;
        finished = true;

        timeline?.kill();
        if (safetyTimeout !== null) window.clearTimeout(safetyTimeout);
        document.removeEventListener("keydown", handleKeyDown);
        hideImmediately();
        restoreEnvironment();

        if (restoreFocus) {
          document.querySelector<HTMLElement>("#main-content")?.focus({ preventScroll: true });
        }
      };

      function handleKeyDown(event: KeyboardEvent) {
        if (event.key !== "Escape") return;
        event.preventDefault();
        finish(true);
      }

      finishRef.current = finish;
      inertSnapshots.forEach(({ element }) => element.setAttribute("inert", ""));
      body.style.overflow = "hidden";
      body.setAttribute("data-intro-open", "true");
      root.setAttribute("aria-hidden", "false");
      root.setAttribute("data-state", "active");
      document.addEventListener("keydown", handleKeyDown);
      root.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });

      try {
        window.sessionStorage.setItem(introSessionKey, "true");
      } catch {
        // The intro still works when session storage is unavailable.
      }

      const image = root.querySelector<HTMLElement>("[data-intro-image]");
      const horizontalLines = root.querySelectorAll<HTMLElement>("[data-intro-line-x]");
      const verticalLines = root.querySelectorAll<HTMLElement>("[data-intro-line-y]");
      const depthFrame = root.querySelector<HTMLElement>("[data-intro-depth-frame]");
      const mark = root.querySelector<HTMLElement>("[data-intro-mark]");
      const name = root.querySelector<HTMLElement>("[data-intro-name]");
      const discipline = root.querySelector<HTMLElement>("[data-intro-discipline]");
      const statement = root.querySelector<HTMLElement>("[data-intro-statement]");
      const core = root.querySelector<HTMLElement>("[data-intro-core]");
      const lockup = root.querySelector<HTMLElement>("[data-intro-lockup]");
      const leftCurtain = root.querySelector<HTMLElement>('[data-intro-curtain="left"]');
      const rightCurtain = root.querySelector<HTMLElement>('[data-intro-curtain="right"]');

      gsap.set(root, { autoAlpha: 1, display: "block" });
      gsap.set(image, { autoAlpha: 0, scale: 1.16 });
      gsap.set(horizontalLines, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(verticalLines, { scaleY: 0, transformOrigin: "center top" });
      gsap.set(depthFrame, { autoAlpha: 0, z: -120, rotateY: -8, scale: 0.88 });
      gsap.set(mark, { autoAlpha: 0, z: -160, rotateY: -12, scale: 0.72 });
      gsap.set([name, discipline], { autoAlpha: 0, y: 18 });
      gsap.set(statement, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)", y: 24 });
      gsap.set(core, { autoAlpha: 0, scale: 0.72, rotateZ: -9, z: -180 });

      timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .to(image, { autoAlpha: 0.72, scale: 1.035, duration: 3.35, ease: "power2.out" }, 0)
        .to(horizontalLines, { scaleX: 1, duration: 0.8, stagger: 0.08 }, 0.14)
        .to(verticalLines, { scaleY: 1, duration: 0.78, stagger: 0.1 }, 0.2)
        .to(depthFrame, { autoAlpha: 1, z: -20, rotateY: 0, scale: 1, duration: 0.95 }, 0.28)
        .to(core, { autoAlpha: 1, scale: 1, rotateZ: 0, z: 0, duration: 1.35 }, 0.18)
        .to(mark, { autoAlpha: 1, z: 0, rotateY: 0, scale: 1, duration: 0.85 }, 0.36)
        .to(name, { autoAlpha: 1, y: 0, duration: 0.52 }, 0.82)
        .to(discipline, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.02)
        .to(statement, { autoAlpha: 1, clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.72 }, 1.24)
        .to(lockup, { autoAlpha: 0, y: -16, z: 80, duration: 0.46 }, 2.72)
        .to(core, { autoAlpha: 0, scale: 1.32, z: 120, duration: 0.88 }, 2.74)
        .to(leftCurtain, { xPercent: -102, duration: 0.88, ease: "power3.inOut" }, 2.82)
        .to(rightCurtain, { xPercent: 102, duration: 0.88, ease: "power3.inOut" }, 2.82)
        .to(
          root,
          {
            autoAlpha: 0,
            duration: 0.38,
            ease: "power2.out",
            onComplete: () => finish(true),
          },
          3.56,
        );

      safetyTimeout = window.setTimeout(() => finish(true), safetyTimeoutMs);

      return () => {
        timeline?.kill();
        if (safetyTimeout !== null) window.clearTimeout(safetyTimeout);
        document.removeEventListener("keydown", handleKeyDown);
        restoreEnvironment();
        finishRef.current = () => undefined;
      };
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      aria-label={`${siteConfig.name} site açılışı`}
      aria-modal="true"
      className="intro-overlay fixed inset-0 z-[var(--z-intro)] overflow-hidden bg-[var(--color-night)] text-[var(--color-paper)]"
      data-state="idle"
      role="dialog"
      style={{ opacity: 1, perspective: "1200px", visibility: "visible" }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div data-intro-image className="absolute inset-[-4%]">
          <Image
            alt=""
            className="object-cover brightness-[0.55] contrast-[1.08] saturate-[0.78]"
            fill
            preload
            sizes="100vw"
            src="/images/projects/archive/bm-evi-mutfak.jpg"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,11,12,.74),rgba(8,11,12,.2)_54%,rgba(75,36,52,.42))]" />
        <div data-intro-core className="intro-showroom-core">
          <ShowroomCoreFallback />
        </div>
        <span
          data-intro-line-x
          className="absolute top-[24%] right-[7%] left-[7%] h-px bg-white/22"
        />
        <span
          data-intro-line-x
          className="absolute right-[7%] bottom-[20%] left-[7%] h-px bg-white/16"
        />
        <span
          data-intro-line-y
          className="absolute top-[8%] bottom-[8%] left-[22%] w-px bg-white/18"
        />
        <span
          data-intro-line-y
          className="absolute top-[8%] right-[18%] bottom-[8%] w-px bg-white/14"
        />
        <div
          data-intro-depth-frame
          className="absolute top-[13%] right-[12%] bottom-[13%] left-[12%] border border-white/22 bg-white/[0.025] shadow-[0_3rem_8rem_rgba(0,0,0,.28)]"
        >
          <span className="absolute top-4 left-4 text-[0.48rem] tracking-[0.2em] text-white/42 uppercase">
            Eşik / 01
          </span>
          <span className="absolute right-4 bottom-4 text-[0.48rem] tracking-[0.2em] text-white/42 uppercase">
            Ankara · Türkiye
          </span>
        </div>

        <span
          data-intro-curtain="left"
          className="absolute inset-y-0 left-0 z-10 w-1/2 bg-[rgba(8,11,12,.48)] backdrop-blur-[2px]"
        />
        <span
          data-intro-curtain="right"
          className="absolute inset-y-0 right-0 z-10 w-1/2 bg-[rgba(8,11,12,.48)] backdrop-blur-[2px]"
        />
      </div>

      <div
        data-intro-lockup
        className="absolute inset-0 z-20 grid place-items-center px-[var(--space-gutter)] text-center [transform-style:preserve-3d]"
      >
        <div>
          <span
            data-intro-mark
            className="mx-auto mb-6 grid size-20 place-items-center border border-white/38 font-serif text-[2rem] italic shadow-[0_1.5rem_4rem_rgba(0,0,0,.24)]"
          >
            GU
          </span>
          <span
            data-intro-name
            className="block text-[0.66rem] font-semibold tracking-[0.24em] uppercase"
          >
            {siteConfig.name}
          </span>
          <span
            data-intro-discipline
            className="mt-3 block text-[0.56rem] tracking-[0.2em] text-white/52 uppercase"
          >
            Yüksek Mimar · İç Mekân
          </span>
          <p
            data-intro-statement
            className="mx-auto mt-9 max-w-[18ch] font-serif text-[clamp(1.45rem,3vw,2.7rem)] leading-[1.02] tracking-[-0.035em] text-white/90"
          >
            {siteConfig.copy.hero.title}
          </p>
        </div>
      </div>

      <button
        type="button"
        className="absolute top-5 right-[var(--space-gutter)] z-30 flex min-h-11 items-center border-b border-white/40 text-[0.58rem] font-semibold tracking-[0.16em] text-white/70 uppercase transition-colors hover:text-white focus-visible:text-white motion-reduce:transition-none"
        onClick={() => finishRef.current(true)}
      >
        Girişi atla
      </button>
    </div>
  );
}
