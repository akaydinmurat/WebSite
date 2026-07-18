"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

import { ExperienceCamera } from "./camera/experience-camera";
import { ArchitecturalChamber } from "./chamber/architectural-chamber";
import { IntroPortal } from "./chamber/intro-portal";
import { experienceConfig } from "./experience-config";
import { getExperienceRuntime } from "./experience-store";
import { ProjectOrbit } from "./orbit/project-orbit";
import { ProjectSpatialField } from "./orbit/project-spatial-field";
import { PackageVault } from "./packages";
import { MaterialLightSurface } from "./pointer/material-light-surface";
import { ShowcaseCorridor } from "./showcase/showcase-corridor";
import type { Project } from "@/types";

type ExperienceCanvasProps = Readonly<{
  packageCount: number;
  projects: readonly Project[];
  className?: string;
  onReady?: (ready: boolean) => void;
}>;

class SceneErrorBoundary extends Component<
  Readonly<{ children: ReactNode }>,
  Readonly<{ hasError: boolean }>
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function SceneReadiness({ onChange }: Readonly<{ onChange: (ready: boolean) => void }>) {
  useEffect(() => {
    onChange(true);
    return () => onChange(false);
  }, [onChange]);

  return null;
}

function SceneAtmosphere() {
  const fogRef = useRef<THREE.Fog>(null);
  const targetColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, frameDelta) => {
    const fog = fogRef.current;
    if (!fog) return;

    const runtime = getExperienceRuntime();
    const color =
      runtime.phase === "vision" || runtime.phase === "vision-transition"
        ? experienceConfig.colors.vision
        : runtime.phase === "showcase" || runtime.phase === "showcase-transition"
          ? experienceConfig.colors.showcase
          : runtime.phase === "outro"
            ? experienceConfig.colors.packages
            : runtime.phase === "works"
              ? experienceConfig.colors.projects
              : experienceConfig.colors.night;
    const blend = 1 - Math.exp(-Math.min(frameDelta, 0.05) * 3.5);
    targetColor.set(color);
    fog.color.lerp(targetColor, blend);
  });

  return <fog ref={fogRef} attach="fog" args={[experienceConfig.colors.night, 7.5, 24]} />;
}

export function ExperienceCanvas({
  packageCount,
  projects,
  className,
  onReady,
}: ExperienceCanvasProps) {
  const onReadyRef = useRef(onReady);
  const sceneReadyRef = useRef(false);
  const contextCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    onReadyRef.current?.(false);

    return () => {
      contextCleanupRef.current?.();
      onReadyRef.current?.(false);
    };
  }, []);

  const handleSceneReadiness = useCallback((ready: boolean) => {
    sceneReadyRef.current = ready;
    onReadyRef.current?.(ready);
  }, []);

  const handleCreated = useCallback(
    (state: Parameters<NonNullable<React.ComponentProps<typeof Canvas>["onCreated"]>>[0]) => {
      state.gl.outputColorSpace = THREE.SRGBColorSpace;
      state.gl.toneMapping = THREE.ACESFilmicToneMapping;
      state.gl.toneMappingExposure = 0.94;

      const canvas = state.gl.domElement;
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        onReadyRef.current?.(false);
      };
      const handleContextRestored = () => {
        if (sceneReadyRef.current) onReadyRef.current?.(true);
      };

      canvas.addEventListener("webglcontextlost", handleContextLost);
      canvas.addEventListener("webglcontextrestored", handleContextRestored);
      contextCleanupRef.current = () => {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      };
    },
    [],
  );

  return (
    <Canvas
      aria-hidden="true"
      camera={{ far: 42, fov: 35, near: 0.08, position: experienceConfig.camera.intro }}
      className={className}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      onCreated={handleCreated}
      performance={{ min: 0.55 }}
      resize={{ debounce: { resize: 80, scroll: 120 }, scroll: false }}
      shadows="basic"
    >
      <SceneErrorBoundary>
        <Suspense fallback={null}>
          <SceneAtmosphere />
          <ArchitecturalChamber />
          <IntroPortal />
          <MaterialLightSurface />
          <ProjectSpatialField />
          <ProjectOrbit projects={projects} />
          <ShowcaseCorridor />
          <PackageVault count={packageCount} />
          <ExperienceCamera />
          <SceneReadiness onChange={handleSceneReadiness} />
        </Suspense>
      </SceneErrorBoundary>
    </Canvas>
  );
}

export default ExperienceCanvas;
