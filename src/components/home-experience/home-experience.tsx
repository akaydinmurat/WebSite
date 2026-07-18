"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { siteConfig } from "@/config/site";
import { processStages, type ProcessStage } from "@/content/process-stages";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import { isWebglHeroEnabled, isWebglViewportCapable } from "@/lib/experience/webgl-capability";
import type { DesignPackage, GoogleReviewsResult, Project, Service } from "@/types";

import { experienceConfig, type ExperiencePhase } from "./experience-config";
import { AboutMonograph } from "./about";
import {
  beginOrbitDrag,
  deactivateExperiencePointer,
  finishOrbitDrag,
  getExperienceRuntime,
  getExperienceServerSnapshot,
  getExperienceSnapshot,
  resetExperienceRuntime,
  setExperiencePhase,
  setPageVisibility,
  setReducedMotion,
  setShowcaseStage,
  setTrackProgress,
  subscribeExperience,
  updateExperiencePointer,
  updateOrbitDrag,
} from "./experience-store";
import { getShowcaseMotionState } from "./showcase/showcase-motion";

const ExperienceCanvas = dynamic(
  () => import("./experience-canvas").then((module) => module.ExperienceCanvas),
  { ssr: false },
);

export type ExperienceEntryScene =
  "home" | "projects" | "services" | "packages" | "reviews" | "about" | "contact";

const sceneTargets: Record<ExperienceEntryScene, string> = {
  home: "experience-intro",
  projects: "experience-projects",
  services: "experience-showcase",
  packages: "experience-packages",
  reviews: "experience-reviews",
  about: "experience-vision",
  contact: "experience-contact",
};

const validScenes = new Set<ExperienceEntryScene>(
  Object.keys(sceneTargets) as ExperienceEntryScene[],
);

const projectCategoryLabels: Record<Project["category"], string> = {
  residential: "Konut",
  "living-room": "Salon",
  kitchen: "Mutfak",
  bathroom: "Banyo",
  bedroom: "Odalar",
  commercial: "Ticari",
  visualization: "Görselleştirme",
};

const packageTones = ["sky", "clay", "sand", "sage", "blue", "linen", "coral"] as const;

type MetadataTransitionState = "idle" | "exit" | "enter";

export function HomeExperience({
  initialScene,
  packages,
  projects,
  reviews,
  services,
}: {
  initialScene: ExperienceEntryScene;
  packages: readonly DesignPackage[];
  projects: readonly Project[];
  reviews: GoogleReviewsResult;
  services: readonly Service[];
}) {
  const rootRef = useRef<HTMLElement>(null);
  const [webglReady, setWebglReady] = useState(false);
  const [webglCapable, setWebglCapable] = useState(false);
  const reducedMotion = useReducedMotion();
  const snapshot = useSyncExternalStore(
    subscribeExperience,
    getExperienceSnapshot,
    getExperienceServerSnapshot,
  );
  const shouldRenderWebgl =
    isWebglHeroEnabled(process.env.NEXT_PUBLIC_ENABLE_WEBGL_HERO) && webglCapable && !reducedMotion;

  const featuredPackages = useMemo(
    () => [...packages].sort((a, b) => a.order - b.order),
    [packages],
  );

  const setPhase = useCallback((phase: ExperiencePhase, progress: number) => {
    setExperiencePhase(phase, progress);
    document.body.dataset.experiencePhase = phase;
    const header = document.querySelector<HTMLElement>("header[data-testid='site-header']");
    if (header) {
      header.dataset.cursorTheme = "light";
    }
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const intro = root.querySelector<HTMLElement>("[data-experience-track='intro']");
      const works = root.querySelector<HTMLElement>("[data-experience-track='works']");
      const vision = root.querySelector<HTMLElement>("[data-experience-track='vision']");
      const showcase = root.querySelector<HTMLElement>("[data-experience-track='showcase']");
      const outro = root.querySelector<HTMLElement>("[data-experience-track='outro']");
      const contactTrack = root.querySelector<HTMLElement>("[data-experience-track='contact']");
      const packageTrack = root.querySelector<HTMLElement>("[data-package-track]");
      const packageWindow = root.querySelector<HTMLElement>("[data-package-window]");
      const packageStrip = root.querySelector<HTMLElement>("[data-package-strip]");

      if (!intro || !works || !vision || !showcase || !outro || !contactTrack) return;

      const createTrack = (
        element: HTMLElement,
        track: "intro" | "works" | "vision" | "showcase" | "outro",
        phase: ExperiencePhase,
      ) =>
        ScrollTrigger.create({
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          onEnter: () => setPhase(phase, 0),
          onEnterBack: () => setPhase(phase, 1),
          onUpdate: (trigger) => {
            setTrackProgress(track, trigger.progress);
            if (track === "vision") {
              root.style.setProperty("--about-name-shift", `${trigger.progress * -3}vw`);
              root.style.setProperty("--about-plane-shift", `${trigger.progress * -2}vw`);
              root.style.setProperty("--about-plane-rotate", `${-7 + trigger.progress * 3}deg`);
              root.style.setProperty("--about-folio-shift", `${(1 - trigger.progress) * -2}vw`);
            }
            if (track === "showcase") {
              setShowcaseStage(
                getShowcaseMotionState(trigger.progress, processStages.length).activeStageIndex,
              );
            }
            setPhase(phase, trigger.progress);
          },
        });

      createTrack(intro, "intro", "intro");
      createTrack(works, "works", "works");
      createTrack(showcase, "showcase", "showcase");
      createTrack(outro, "outro", "outro");
      createTrack(vision, "vision", "vision");
      createTrack(contactTrack, "outro", "outro");

      ScrollTrigger.create({
        trigger: outro,
        start: "top bottom",
        end: "top top",
        onEnter: () => setPhase("outro", 0),
        onEnterBack: () => setPhase("outro", 1),
        onLeave: () => setPhase("outro", 1),
        onLeaveBack: () => setPhase("showcase", 1),
        onUpdate: (trigger) => {
          setTrackProgress("outro", trigger.progress);
          setPhase("outro", trigger.progress);
        },
      });

      ScrollTrigger.create({
        trigger: works,
        start: "top bottom",
        end: "top top",
        onEnter: () => setPhase("works", 0),
        onEnterBack: () => setPhase("works", 0),
        onUpdate: (trigger) => {
          setTrackProgress("works", trigger.progress * 0.12);
          setPhase("works", trigger.progress * 0.12);
        },
      });

      ScrollTrigger.create({
        trigger: vision,
        start: "top bottom",
        end: "top top",
        onEnter: () => setPhase("vision-transition", 0),
        onEnterBack: () => setPhase("vision-transition", 1),
        onLeave: () => setPhase("vision", 0),
        onLeaveBack: () => setPhase("outro", 1),
        onUpdate: (trigger) => {
          if (trigger.progress >= 0.999) setPhase("vision", 0);
          else setPhase("vision-transition", trigger.progress);
        },
      });

      ScrollTrigger.create({
        trigger: showcase,
        start: "top bottom",
        end: "top top",
        onEnter: () => setPhase("showcase-transition", 0),
        onEnterBack: () => setPhase("showcase-transition", 1),
        onLeave: () => setPhase("showcase", 0),
        onLeaveBack: () => setPhase("works", 1),
        onUpdate: (trigger) => {
          if (trigger.progress >= 0.999) setPhase("showcase", 0);
          else setPhase("showcase-transition", trigger.progress);
        },
      });

      ScrollTrigger.create({
        trigger: contactTrack,
        start: "top bottom",
        end: "top top",
        onEnter: () => setPhase("outro", 0),
        onEnterBack: () => setPhase("outro", 1),
        onLeave: () => setPhase("outro", 0),
        onLeaveBack: () => setPhase("vision", 1),
        onUpdate: (trigger) => {
          setTrackProgress("outro", trigger.progress);
          setPhase("outro", trigger.progress);
        },
      });

      if (packageTrack) {
        ScrollTrigger.create({
          trigger: packageTrack,
          start: "top top",
          end: "bottom bottom",
          onEnter: () => setTrackProgress("packages", 0),
          onEnterBack: () => setTrackProgress("packages", 1),
          onUpdate: (trigger) => setTrackProgress("packages", trigger.progress),
        });
      }

      if (!reducedMotion) {
        if (
          packageTrack &&
          packageWindow &&
          packageStrip &&
          window.matchMedia("(min-width: 768px)").matches
        ) {
          const packageCards = gsap.utils.toArray<HTMLElement>("[data-package-card]", packageStrip);

          gsap.fromTo(
            packageStrip,
            { x: () => window.innerWidth * 0.04 },
            {
              x: () => -Math.max(0, packageStrip.scrollWidth - packageWindow.clientWidth),
              ease: "none",
              scrollTrigger: {
                trigger: packageTrack,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.58,
                invalidateOnRefresh: true,
              },
            },
          );

          gsap.fromTo(
            packageCards,
            { autoAlpha: 0.2, rotateY: -16, scale: 0.84, yPercent: 18 },
            {
              autoAlpha: 1,
              rotateY: 0,
              scale: 1,
              stagger: 0.12,
              yPercent: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: packageTrack,
                start: "top 82%",
                end: "55% 45%",
                scrub: 0.5,
              },
            },
          );
        }
      }

      ScrollTrigger.refresh();
    },
    { scope: rootRef, dependencies: [reducedMotion, setPhase], revertOnUpdate: true },
  );

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () =>
      setWebglCapable(
        isWebglViewportCapable({
          hasFinePointer: finePointer.matches,
          viewportWidth: window.innerWidth,
        }),
      );
    finePointer.addEventListener("change", updateCapability);
    window.addEventListener("resize", updateCapability);
    updateCapability();

    return () => {
      finePointer.removeEventListener("change", updateCapability);
      window.removeEventListener("resize", updateCapability);
    };
  }, []);

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector<HTMLElement>("header[data-testid='site-header']");
    body.dataset.homeExperience = "true";
    body.dataset.experiencePhase = "intro";
    if (header) header.dataset.cursorTheme = "light";
    setReducedMotion(reducedMotion);

    const handleVisibility = () => setPageVisibility(!document.hidden);
    const handlePointerUp = (event: PointerEvent) => finishOrbitDrag(event.pointerId);
    const handlePointerCancel = (event: PointerEvent) => finishOrbitDrag(event.pointerId);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    handleVisibility();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      delete body.dataset.homeExperience;
      delete body.dataset.experiencePhase;
      if (header) header.dataset.cursorTheme = "light";
      resetExperienceRuntime();
    };
  }, [reducedMotion]);

  const scrollToScene = useCallback(
    (scene: ExperienceEntryScene, behavior: ScrollBehavior) => {
      const target = document.getElementById(sceneTargets[scene]);
      if (!target) return false;

      target.scrollIntoView({ behavior, block: "start" });

      if (behavior === "auto" && (scene === "packages" || scene === "reviews")) {
        ScrollTrigger.update();
        const outro = rootRef.current?.querySelector<HTMLElement>(
          "[data-experience-track='outro']",
        );
        const scrollDistance = Math.max(1, (outro?.offsetHeight ?? 0) - window.innerHeight);
        const progress = outro
          ? Math.min(1, Math.max(0, (window.scrollY - outro.offsetTop) / scrollDistance))
          : 0;
        setTrackProgress("outro", progress);
        setPhase("outro", progress);
      } else if (behavior === "auto" && scene === "contact") {
        ScrollTrigger.update();
        setTrackProgress("outro", 1);
        setPhase("outro", 1);
      } else if (behavior === "auto" && scene === "about") {
        ScrollTrigger.update();
        setTrackProgress("vision", 0);
        setPhase("vision", 0);
      }

      return true;
    },
    [setPhase],
  );

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const handleSceneLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== "/") return;
      const value = url.searchParams.get("scene") ?? "home";
      if (!validScenes.has(value as ExperienceEntryScene)) return;

      const scene = value as ExperienceEntryScene;
      if (!document.getElementById(sceneTargets[scene])) return;

      event.preventDefault();
      const nextHref = `${url.pathname}${url.search}${url.hash}`;
      window.history.pushState({ scene }, "", nextHref);
      scrollToScene(scene, reducedMotion ? "auto" : "smooth");
    };

    let popStateFrame: number | null = null;
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get("scene") ?? "home";
      if (popStateFrame !== null) window.cancelAnimationFrame(popStateFrame);
      popStateFrame = window.requestAnimationFrame(() => {
        popStateFrame = window.requestAnimationFrame(() => {
          scrollToScene(
            validScenes.has(value as ExperienceEntryScene)
              ? (value as ExperienceEntryScene)
              : "home",
            "auto",
          );
          popStateFrame = null;
        });
      });
    };

    document.addEventListener("click", handleSceneLink, true);
    window.addEventListener("popstate", handlePopState);

    const initialFrame = window.requestAnimationFrame(() => {
      if (initialScene !== "home") scrollToScene(initialScene, "auto");
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (popStateFrame !== null) window.cancelAnimationFrame(popStateFrame);
      document.removeEventListener("click", handleSceneLink, true);
      window.removeEventListener("popstate", handlePopState);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, [initialScene, reducedMotion, scrollToScene]);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    updateExperiencePointer(
      event.clientX,
      event.clientY,
      window.innerWidth,
      window.innerHeight,
      true,
    );

    if (getExperienceRuntime().phase === "works") {
      updateOrbitDrag(event.pointerId, event.clientX);
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (!event.isPrimary) return;
    updateExperiencePointer(event.clientX, event.clientY, window.innerWidth, window.innerHeight);

    const target = event.target instanceof Element ? event.target : null;
    if (
      getExperienceRuntime().phase === "works" &&
      !target?.closest("a, button, input, textarea, select, [data-no-orbit-drag]")
    ) {
      beginOrbitDrag(event.pointerId, event.clientX);
    }
  }

  const activeProject = projects[snapshot.activeProjectIndex % Math.max(1, projects.length)];
  const activeStage = processStages[snapshot.showcaseStage] ?? processStages[0];

  return (
    <section
      ref={rootRef}
      className="spatial-home"
      data-cursor-theme="light"
      data-home-content
      data-phase={snapshot.phase}
      data-webgl-ready={webglReady ? "true" : "false"}
      onPointerDown={handlePointerDown}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") deactivateExperiencePointer();
      }}
      onPointerMove={handlePointerMove}
    >
      <div className="experience-fixed-scene" aria-hidden="true">
        <ExperienceFallback
          activeProjectIndex={snapshot.activeProjectIndex}
          activeStageIndex={snapshot.showcaseStage}
          phase={snapshot.phase}
          projects={projects}
        />
        {shouldRenderWebgl ? (
          <ExperienceCanvas
            className="experience-canvas"
            onReady={setWebglReady}
            packageCount={featuredPackages.length}
            projects={projects}
          />
        ) : null}
      </div>

      <section
        id="experience-intro"
        className="experience-track experience-intro"
        data-experience-track="intro"
        aria-labelledby="experience-intro-title"
      >
        <div className="experience-sticky">
          <div className="experience-intro-copy">
            <p className="experience-kicker">{experienceConfig.brand.name} · Mekânsal Deneyim</p>
            <h1 id="experience-intro-title">
              <span>Mekân,</span> <span>yaşamla anlam</span> <span>kazanır.</span>
            </h1>
          </div>
          <p className="experience-intro-description">
            Işık, malzeme ve oranı tek bir dijital galeride buluşturan iç mimari seçki.
          </p>
          <p className="experience-intro-datum" aria-hidden="true">
            <span>01 / Giriş</span>
            <span>{siteConfig.contact.location}</span>
          </p>
          <div className="experience-scroll-cue" aria-hidden="true">
            <span>Keşfet</span>
            <i />
          </div>
          <ExperienceRail active={0} />
        </div>
      </section>

      <section
        id="experience-projects"
        className="experience-track experience-works"
        data-experience-track="works"
        aria-labelledby="experience-projects-title"
      >
        <div className="experience-sticky">
          <h2 id="experience-projects-title" className="sr-only">
            Seçili projeler
          </h2>
          {activeProject ? (
            <ProjectMetadata
              count={projects.length}
              index={snapshot.activeProjectIndex}
              project={activeProject}
            />
          ) : null}
          <Link className="experience-archive-link" href="/projects" data-no-orbit-drag>
            Tüm projeler <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
          <nav className="sr-only" aria-label="3D seçkideki projeler">
            <ul>
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} tabIndex={-1}>
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="experience-orbit-instruction" aria-hidden="true">
            <span>Yönü fareyle değiştir</span>
            <span>Sürükle ve serbest bırak</span>
          </p>
          <ExperienceRail active={1} />
        </div>
      </section>

      <section
        id="experience-showcase"
        className="experience-track experience-showcase"
        data-experience-track="showcase"
        aria-labelledby="experience-showcase-title"
      >
        <div className="experience-sticky">
          <ProcessMetadata index={snapshot.showcaseStage} stage={activeStage} />
          <ol className="experience-stage-list" aria-label="Tasarım süreci">
            {processStages.map((stage, index) => (
              <li
                key={stage.label}
                aria-current={index === snapshot.showcaseStage ? "step" : undefined}
                data-active={index === snapshot.showcaseStage ? "true" : "false"}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {stage.label}
              </li>
            ))}
          </ol>
          <ExperienceRail active={2} light />
        </div>
      </section>

      <div className="experience-outro" data-experience-track="outro">
        <PackagesSection packages={featuredPackages} />
        <ReviewsSection reviews={reviews} />
      </div>

      <AboutMonograph />

      <div className="experience-outro experience-contact-outro" data-experience-track="contact">
        <ContactSection serviceCount={services.length} />
      </div>
    </section>
  );
}

function ExperienceFallback({
  activeProjectIndex,
  activeStageIndex,
  phase,
  projects,
}: {
  activeProjectIndex: number;
  activeStageIndex: number;
  phase: ExperiencePhase;
  projects: readonly Project[];
}) {
  const visibleProjectIndexes = [-1, 0, 1].map(
    (offset) => (activeProjectIndex + offset + projects.length) % Math.max(1, projects.length),
  );
  const processStage = processStages[activeStageIndex % processStages.length] ?? processStages[0];

  return (
    <div className="experience-fallback" data-fallback-phase={phase} aria-hidden="true">
      <span className="experience-fallback-material-field">
        <i />
        <i />
        <i />
      </span>
      <span className="experience-fallback-grid" />
      <span className="experience-fallback-wall experience-fallback-wall-left" />
      <span className="experience-fallback-wall experience-fallback-wall-right" />
      <span className="experience-fallback-light-field" />
      <div className="experience-fallback-projects">
        {visibleProjectIndexes.map((projectIndex, slotIndex) => {
          const project = projects[projectIndex];
          if (!project) return null;

          return (
            <FallbackProjectVisual
              key={`${project.slug}-${slotIndex}`}
              className={`experience-fallback-project experience-fallback-project-${slotIndex}`}
              project={project}
            />
          );
        })}
      </div>
      <div className="experience-fallback-process">
        <span className="experience-fallback-process-rail" />
        <span className="experience-fallback-process-frame" />
        <span
          className="experience-fallback-process-visual"
          style={{ backgroundImage: `url(${processStage.visualSrc})` }}
        />
      </div>
    </div>
  );
}

function FallbackProjectVisual({ className, project }: { className: string; project: Project }) {
  return (
    <span
      className={className}
      style={
        project.cover.kind === "image" && project.cover.src
          ? { backgroundImage: `url(${project.cover.src})` }
          : { background: project.cover.background }
      }
    />
  );
}

function ExperienceRail({ active, light = false }: { active: number; light?: boolean }) {
  return (
    <ol className="experience-rail" data-light={light ? "true" : "false"} aria-hidden="true">
      {["Giriş", "Projeler", "Süreç"].map((label, index) => (
        <li key={label} data-active={active === index ? "true" : "false"}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <i />
          <b>{label}</b>
        </li>
      ))}
    </ol>
  );
}

function useTransitionedValue<T>(value: T, valueKey: string) {
  const reducedMotion = useReducedMotion();
  const renderedKeyRef = useRef(valueKey);
  const [renderedValue, setRenderedValue] = useState(value);
  const [transitionState, setTransitionState] = useState<MetadataTransitionState>("idle");

  useEffect(() => {
    if (renderedKeyRef.current === valueKey) return;
    if (reducedMotion) return;

    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const exitTimer = setTimeout(() => setTransitionState("exit"), 0);
    const swapTimer = setTimeout(() => {
      renderedKeyRef.current = valueKey;
      setRenderedValue(value);
      setTransitionState("enter");
      settleTimer = setTimeout(() => setTransitionState("idle"), 560);
    }, 170);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(swapTimer);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [reducedMotion, value, valueKey]);

  return {
    renderedValue: reducedMotion ? value : renderedValue,
    transitionState: reducedMotion ? "idle" : transitionState,
  };
}

function ProjectMetadata({
  project,
  index,
  count,
}: {
  project: Project;
  index: number;
  count: number;
}) {
  const transitionValue = useMemo(() => ({ project, index }), [index, project]);
  const { renderedValue, transitionState } = useTransitionedValue(transitionValue, project.slug);
  const displayedProject = renderedValue.project;
  const displayedIndex = renderedValue.index;
  const year = getProjectFact(displayedProject, "year");
  const type = getProjectFact(displayedProject, "type");
  const location = getProjectFact(displayedProject, "location");

  return (
    <div className="experience-project-meta" data-transition={transitionState} aria-live="polite">
      <p className="experience-project-meta-counter">
        <span>{year}</span>
        <span>
          {String(displayedIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </p>
      <h3 className="experience-project-meta-title">{displayedProject.title}</h3>
      <p className="experience-project-meta-fact">{type}</p>
      <p className="experience-project-meta-fact">{location}</p>
      <div className="experience-project-meta-tags">
        <span>{projectCategoryLabels[displayedProject.category]}</span>
        <span>İç Mimari</span>
      </div>
      <Link
        className="experience-project-open-link"
        href={`/projects/${displayedProject.slug}`}
        data-cursor-kind="project"
        data-cursor-label="Projeyi aç"
        data-no-orbit-drag
      >
        Aktif projeyi incele <ArrowUpRight aria-hidden="true" size={13} />
      </Link>
    </div>
  );
}

function ProcessMetadata({ stage, index }: { stage: ProcessStage; index: number }) {
  const transitionValue = useMemo(() => ({ stage, index }), [index, stage]);
  const { renderedValue, transitionState } = useTransitionedValue(transitionValue, stage.label);

  return (
    <div className="experience-showcase-copy" data-transition={transitionState} aria-live="polite">
      <p className="experience-kicker experience-process-number">
        03 · Süreç / {String(renderedValue.index + 1).padStart(2, "0")}
      </p>
      <h2 id="experience-showcase-title">{renderedValue.stage.title}</h2>
      <p className="experience-process-description">{renderedValue.stage.description}</p>
    </div>
  );
}

function PackagesSection({ packages }: { packages: readonly DesignPackage[] }) {
  return (
    <section
      id="experience-packages"
      className="experience-content-section experience-packages"
      aria-labelledby="experience-packages-title"
      data-package-track
    >
      <div className="experience-packages-stage">
        <div className="experience-package-vault-lines" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <header className="experience-content-heading">
          <p className="experience-kicker">04 · Size ne katacak?</p>
          <h2 id="experience-packages-title">Fikri, yaşayacağınız mekâna dönüştüren kapsamlar.</h2>
          <p>İhtiyacınızı seçin; kazanımı, kapsamı ve fiyatlandırma yöntemini tek bakışta görün.</p>
          <Link href="/packages">
            Tüm kapsamlar <ArrowUpRight aria-hidden="true" size={14} />
          </Link>
        </header>
        <div className="experience-package-window" data-package-window>
          <ol className="experience-package-grid" data-package-strip>
            {packages.map((item, index) => (
              <li key={item.slug}>
                <article
                  className="experience-package-card"
                  data-package-card
                  data-package-index={String(index + 1).padStart(2, "0")}
                  data-package-tone={packageTones[index % packageTones.length]}
                >
                  <span className="experience-package-card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="experience-package-visual">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1199px) 60vw, 42vw"
                    />
                    <span>{item.presentationFormats?.join(" + ") ?? "Özel kapsam"}</span>
                  </div>
                  <p className="experience-package-scope">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.scopeLabel}</span>
                  </p>
                  <div className="experience-package-copy">
                    <p className="experience-package-benefit-label">Size ne katar?</p>
                    <p className="experience-package-benefit">{item.benefit}</p>
                    <h3>{item.title}</h3>
                    <p className="experience-package-summary">{item.summary}</p>
                  </div>
                  <ul aria-label={`${item.title} kapsamında öne çıkanlar`}>
                    {item.scopeItems.slice(0, 3).map((scope) => (
                      <li key={scope}>{scope}</li>
                    ))}
                  </ul>
                  <footer>
                    <span className="experience-package-pricing">
                      <small>Fiyatlandırma</small>
                      <strong>{item.pricingLabel}</strong>
                      <em>{item.pricingNote}</em>
                    </span>
                    <Link
                      href={item.inquiry.href}
                      data-cursor-kind="action"
                      data-cursor-label="Görüşelim"
                    >
                      Teklif alın <ArrowUpRight aria-hidden="true" size={13} />
                    </Link>
                  </footer>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ reviews }: { reviews: GoogleReviewsResult }) {
  const readyReviews = reviews.status === "ready" ? reviews.reviews.slice(0, 3) : [];
  const fallbackUrl = reviews.status === "unavailable" ? reviews.fallbackUrl : undefined;
  const principles = [
    {
      title: "Doğrulanmış kaynak",
      text: "Yorumlar yalnızca resmî Google Maps kaynağı etkin olduğunda gösterilir.",
    },
    {
      title: "Yazarıyla birlikte",
      text: "Yazar, tarih, puan ve zorunlu kaynak bağlantısı yorumla birlikte korunur.",
    },
    {
      title: "Şeffaf yayın",
      text: "Bağlantı kurulmadığında müşteri adı, şirket veya deneyim metni üretilmez.",
    },
  ] as const;

  return (
    <section
      id="experience-reviews"
      className="experience-content-section experience-reviews"
      aria-labelledby="experience-reviews-title"
    >
      <header>
        <p className="experience-kicker">05 · Deneyimler</p>
        <h2 id="experience-reviews-title">
          {readyReviews.length
            ? "Mekânın ardından kalan sözler."
            : "Yorumlarda doğrulanmış kaynak ilkesi."}
        </h2>
      </header>
      <div className="experience-review-row">
        {readyReviews.length
          ? readyReviews.map((review) => (
              <article key={review.resourceName} className="experience-review-card">
                <p className="experience-review-rating" aria-label={`5 üzerinden ${review.rating}`}>
                  <Star aria-hidden="true" fill="currentColor" size={13} />{" "}
                  {review.rating.toFixed(1)}
                </p>
                <blockquote>{review.text}</blockquote>
                <footer>
                  <a href={review.author.profileUrl} target="_blank" rel="noopener noreferrer">
                    {review.author.displayName}
                  </a>
                  <a href={review.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Google Maps <ArrowUpRight aria-hidden="true" size={12} />
                  </a>
                </footer>
              </article>
            ))
          : principles.map((principle, index) => (
              <article key={principle.title} className="experience-review-card" data-demo="true">
                <p className="experience-review-index">Kaynak ilkesi / 0{index + 1}</p>
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </article>
            ))}
      </div>
      {readyReviews.length ? (
        <div className="experience-review-source-note">
          <p>
            Yorumlar ilgililiğe göre sıralanır; ilk {readyReviews.length} kayıt gösterilir. Kaynak:{" "}
            <span translate="no">Google Maps</span>.
          </p>
          {reviews.status === "ready" && reviews.providerAttributions.length ? (
            <ul aria-label="Yorum sağlayıcı atıfları">
              {reviews.providerAttributions.map((attribution) => (
                <li key={attribution.providerUrl}>
                  <a href={attribution.providerUrl} target="_blank" rel="noopener noreferrer">
                    {attribution.provider}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : fallbackUrl ? (
        <a
          className="experience-google-review-link"
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <small>Doğrulanmış kaynak</small>
            <strong>Google’daki yorumları inceleyin</strong>
          </span>
          <ArrowUpRight aria-hidden="true" size={19} />
        </a>
      ) : null}
    </section>
  );
}

function ContactSection({ serviceCount }: { serviceCount: number }) {
  return (
    <section
      id="experience-contact"
      className="experience-content-section experience-contact"
      aria-labelledby="experience-contact-title"
    >
      <p className="experience-kicker">07 · İlk Eskiz · Yeni Proje</p>
      <h2 id="experience-contact-title">Hayalinizdeki mekânın ilk çizgisini birlikte atalım.</h2>
      <p>{siteConfig.copy.contact.description}</p>
      <div>
        <Link
          href="/contact"
          className="experience-contact-action experience-dream-portal"
          data-cursor-kind="action"
          data-cursor-label="İlk çizgiyi atalım"
        >
          <span className="experience-dream-portal-mark" aria-hidden="true">
            <Sparkles size={19} strokeWidth={1.7} />
          </span>
          <span className="experience-dream-portal-copy">
            <small>Hayalden mekâna</small>
            <strong>{siteConfig.copy.contact.actionLabel}</strong>
          </span>
          <ArrowUpRight aria-hidden="true" size={18} />
        </Link>
        <span>
          {serviceCount} çalışma alanı · {siteConfig.contact.location}
        </span>
      </div>
    </section>
  );
}

function getProjectFact(project: Project, id: "type" | "location" | "year") {
  return project.facts.find((fact) => fact.id === id)?.value ?? "";
}
