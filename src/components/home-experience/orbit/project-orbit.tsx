"use client";

import { Suspense, useCallback, useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import * as THREE from "three";

import type { Project } from "@/types";

import { experienceConfig } from "../experience-config";
import {
  consumeOrbitDragDelta,
  getExperienceRuntime,
  selectProjectForOpening,
  setActiveProjectIndex,
} from "../experience-store";
import { getClosestProjectIndex, damp, wrapAngle } from "./orbit-math";
import { ProjectCardFallback, TexturedProjectCard } from "./project-card";

const MAX_FRAME_DELTA = 1 / 20;
const MAX_DRAG_VELOCITY = 1.8;
const REDUCED_MOTION_ROUTE_DELAY = 80;

export function ProjectOrbit({ projects }: { projects: readonly Project[] }) {
  const router = useRouter();
  const orbitRigRef = useRef<THREE.Group>(null);
  const activeProjectIndexRef = useRef(-1);
  const routeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasDraggingRef = useRef(false);

  useEffect(() => {
    activeProjectIndexRef.current = -1;
  }, [projects.length]);

  useEffect(
    () => () => {
      if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
    },
    [],
  );

  useFrame((_, frameDelta) => {
    const runtime = getExperienceRuntime();
    const orbit = runtime.orbit;
    const delta = Math.min(frameDelta, MAX_FRAME_DELTA);
    const dragDeltaPixels = consumeOrbitDragDelta();

    if (!runtime.pageVisible) {
      orbit.velocity = 0;
      return;
    }

    if (dragDeltaPixels !== 0 && !runtime.selectedProjectSlug) {
      const sensitivity =
        experienceConfig.orbit.dragSensitivity * (runtime.reducedMotion ? 0.72 : 1);
      const angularDelta = dragDeltaPixels * sensitivity;
      const measuredVelocity = THREE.MathUtils.clamp(
        orbit.dragVelocityPixels * sensitivity,
        -MAX_DRAG_VELOCITY,
        MAX_DRAG_VELOCITY,
      );

      orbit.angle = wrapAngle(orbit.angle + angularDelta);
      orbit.velocity = damp(
        orbit.velocity,
        measuredVelocity,
        experienceConfig.orbit.velocityResponsiveness * 2,
        delta,
      );
    }

    if (runtime.selectedProjectSlug) {
      orbit.velocity = 0;
      wasDraggingRef.current = false;
    } else if (orbit.dragging) {
      wasDraggingRef.current = true;
    } else {
      const pointerInfluence =
        runtime.pointer.active && !runtime.reducedMotion
          ? runtime.pointer.x * experienceConfig.orbit.pointerVelocityStrength
          : 0;
      const targetVelocity = experienceConfig.orbit.autoRotationSpeed + pointerInfluence;
      const responsiveness = wasDraggingRef.current
        ? experienceConfig.orbit.velocityDamping
        : experienceConfig.orbit.velocityResponsiveness;

      if (runtime.reducedMotion) {
        orbit.velocity = 0;
      } else {
        orbit.velocity = damp(orbit.velocity, targetVelocity, responsiveness, delta);
      }

      orbit.angle = wrapAngle(orbit.angle + orbit.velocity * delta);

      if (wasDraggingRef.current && Math.abs(orbit.velocity - targetVelocity) < 0.035) {
        wasDraggingRef.current = false;
      }
    }

    const closestProjectIndex = getClosestProjectIndex(orbit.angle, projects.length);
    if (closestProjectIndex >= 0 && closestProjectIndex !== activeProjectIndexRef.current) {
      activeProjectIndexRef.current = closestProjectIndex;
      setActiveProjectIndex(closestProjectIndex);
    }
  });

  const openProject = useCallback(
    (project: Project) => {
      const runtime = getExperienceRuntime();
      if (runtime.selectedProjectSlug || routeTimeoutRef.current) return;

      selectProjectForOpening(project.slug);
      const routeDelay = runtime.reducedMotion
        ? REDUCED_MOTION_ROUTE_DELAY
        : experienceConfig.transitions.projectOpenDuration * 1000;

      routeTimeoutRef.current = setTimeout(() => {
        routeTimeoutRef.current = null;
        router.push(`/projects/${encodeURIComponent(project.slug)}`);
      }, routeDelay);
    },
    [router],
  );

  const prefetchProject = useCallback(
    (slug: string) => {
      router.prefetch(`/projects/${encodeURIComponent(slug)}`);
    },
    [router],
  );

  const inclination = THREE.MathUtils.degToRad(experienceConfig.orbit.inclinationDegrees);

  return (
    <group
      ref={orbitRigRef}
      name="OrbitRig"
      position={[experienceConfig.orbit.centerX, experienceConfig.orbit.centerY, 0]}
      rotation={[inclination, 0, 0]}
    >
      {projects.map((project, index) => {
        const sharedProps = {
          project,
          index,
          projectCount: projects.length,
          orbitRigRef,
          onOpen: openProject,
          onPrefetch: prefetchProject,
        };

        if (project.cover.kind !== "image" || !project.cover.src) {
          return <ProjectCardFallback key={project.slug} {...sharedProps} />;
        }

        return (
          <Suspense key={project.slug} fallback={<ProjectCardFallback {...sharedProps} />}>
            <TexturedProjectCard {...sharedProps} />
          </Suspense>
        );
      })}
    </group>
  );
}
