"use client";

import { useRef, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";

type ServiceStageState = "active" | "after" | "before";

interface ServiceStageRecord {
  element: HTMLElement;
  scene: string;
}

function getSceneName(element: HTMLElement | undefined) {
  return element?.dataset.homeScene?.trim() ?? "";
}

function getExplicitStageScene(element: HTMLElement) {
  const value =
    element.dataset.serviceStageCard?.trim() ||
    element.dataset.serviceScene?.trim() ||
    element.dataset.scene?.trim() ||
    "";

  return value === "true" ? "" : value;
}

function isServiceScene(element: HTMLElement) {
  const scene = getSceneName(element);

  return (
    element.hasAttribute("data-service-scene") ||
    element.hasAttribute("data-service-index") ||
    element.closest("[data-service-scenes]") !== null ||
    scene.startsWith("service-")
  );
}

export function HomeExperience({
  children,
  initialScene = "hero",
}: {
  children: ReactNode;
  initialScene?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const defaultScene = initialScene.trim() || "hero";

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const sceneElements = gsap.utils.toArray<HTMLElement>("[data-home-scene]", root);
      const stageCards = gsap.utils.toArray<HTMLElement>("[data-service-stage-card]", root);
      const serviceSceneElements = sceneElements.filter(isServiceScene);
      const sceneOrder = new Map<string, number>();
      const serviceSceneByIndex = new Map<string, HTMLElement>();

      sceneElements.forEach((element, index) => {
        const scene = getSceneName(element);
        if (scene && !sceneOrder.has(scene)) sceneOrder.set(scene, index);
      });

      serviceSceneElements.forEach((element) => {
        const index = element.dataset.serviceIndex?.trim();
        if (index && !serviceSceneByIndex.has(index)) serviceSceneByIndex.set(index, element);
      });

      const serviceStageRecords: ServiceStageRecord[] = stageCards.map((element, index) => {
        const serviceIndex = element.dataset.serviceIndex?.trim();
        const indexedScene = serviceIndex ? serviceSceneByIndex.get(serviceIndex) : undefined;

        return {
          element,
          scene:
            getExplicitStageScene(element) ||
            getSceneName(indexedScene) ||
            getSceneName(serviceSceneElements[index]),
        };
      });

      const updateServiceStage = (activeScene: string) => {
        const matchedStageIndex = serviceStageRecords.findIndex(
          (record) => record.scene === activeScene,
        );
        const activeStageIndex =
          matchedStageIndex >= 0
            ? matchedStageIndex
            : activeScene === "services" && serviceStageRecords.length > 0
              ? 0
              : -1;
        const activeSceneOrder = sceneOrder.get(activeScene);

        serviceStageRecords.forEach((record, index) => {
          let state: ServiceStageState = "after";

          if (activeStageIndex >= 0) {
            state =
              index < activeStageIndex ? "before" : index === activeStageIndex ? "active" : "after";
          } else {
            const stageSceneOrder = sceneOrder.get(record.scene);
            if (activeSceneOrder !== undefined && stageSceneOrder !== undefined) {
              state = stageSceneOrder < activeSceneOrder ? "before" : "after";
            }
          }

          record.element.dataset.state = state;
          record.element.dataset.active = state === "active" ? "true" : "false";
        });
      };

      const setActiveScene = (scene: string) => {
        const nextScene = scene.trim();
        if (!nextScene) return;

        if (root.dataset.scene !== nextScene) root.dataset.scene = nextScene;
        updateServiceStage(nextScene);
      };

      const handleFocusIn = (event: FocusEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        const sceneElement = target?.closest<HTMLElement>("[data-home-scene]");

        if (sceneElement && root.contains(sceneElement)) {
          setActiveScene(getSceneName(sceneElement));
        }
      };

      setActiveScene(defaultScene);
      root.addEventListener("focusin", handleFocusIn);

      sceneElements.forEach((element) => {
        const scene = getSceneName(element);
        if (!scene) return;

        ScrollTrigger.create({
          trigger: element,
          start: "top 52%",
          end: "bottom 48%",
          onEnter: () => setActiveScene(scene),
          onEnterBack: () => setActiveScene(scene),
          onRefresh: (trigger) => {
            if (trigger.isActive) setActiveScene(scene);
          },
        });
      });

      return () => {
        root.removeEventListener("focusin", handleFocusIn);
        serviceStageRecords.forEach(({ element }) => {
          delete element.dataset.active;
          delete element.dataset.state;
        });
      };
    },
    {
      scope: rootRef,
      dependencies: [defaultScene],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={rootRef}
      className="home-experience"
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-scene={defaultScene}
    >
      <div className="home-experience-background" aria-hidden="true">
        <span className="home-experience-plane home-experience-plane-grid" />
        <span className="home-experience-plane home-experience-plane-volume" />
        <span className="home-experience-plane home-experience-plane-light" />
        <span className="home-experience-plane home-experience-plane-axis" />
      </div>
      <div className="home-experience-content" data-home-content>
        {children}
      </div>
    </div>
  );
}
