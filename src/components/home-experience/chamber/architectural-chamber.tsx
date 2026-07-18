"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime } from "../experience-store";

const HALF_PI = Math.PI * 0.5;
const WALL_START_ANGLE = Math.PI * 0.38;
const WALL_ARC = Math.PI * 1.24;

type ChamberQuality = "low" | "high";

export type ArchitecturalChamberProps = Readonly<{
  quality?: ChamberQuality;
}>;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

export function ArchitecturalChamber({ quality = "high" }: ArchitecturalChamberProps) {
  const rootRef = useRef<THREE.Group>(null);
  const planesRef = useRef<THREE.Group>(null);
  const pointerLightRef = useRef<THREE.PointLight>(null);
  const projectLightRef = useRef<THREE.PointLight>(null);
  const { chamber, colors } = experienceConfig;
  const radialSegments = quality === "high" ? 64 : 36;
  const phaseColors = useMemo(
    () => ({
      ceilingDefault: new THREE.Color(colors.smokedNavy),
      ceilingProjects: new THREE.Color("#c89a78"),
      floorDefault: new THREE.Color(colors.warmStone),
      floorProjects: new THREE.Color("#86a39a"),
      wallDefault: new THREE.Color(colors.mineral),
      wallProjects: new THREE.Color("#d8d1c1"),
    }),
    [colors.mineral, colors.smokedNavy, colors.warmStone],
  );

  const materials = useMemo(
    () => ({
      bone: new THREE.MeshStandardMaterial({
        color: colors.ivory,
        metalness: 0.02,
        roughness: 0.88,
      }),
      ceiling: new THREE.MeshStandardMaterial({
        color: colors.smokedNavy,
        metalness: 0.04,
        roughness: 0.92,
        side: THREE.DoubleSide,
      }),
      clay: new THREE.MeshStandardMaterial({
        color: colors.amber,
        metalness: 0.03,
        roughness: 0.84,
      }),
      floor: new THREE.MeshStandardMaterial({
        color: colors.warmStone,
        metalness: 0.05,
        roughness: 0.9,
        side: THREE.DoubleSide,
      }),
      ochre: new THREE.MeshStandardMaterial({
        color: colors.champagne,
        metalness: 0.04,
        roughness: 0.82,
      }),
      olive: new THREE.MeshStandardMaterial({
        color: colors.olive,
        metalness: 0.02,
        roughness: 0.9,
      }),
      oxblood: new THREE.MeshStandardMaterial({
        color: colors.magenta,
        metalness: 0.03,
        roughness: 0.86,
      }),
      shadow: new THREE.MeshBasicMaterial({
        color: colors.night,
        depthWrite: false,
        opacity: 0.26,
        transparent: true,
      }),
      wall: new THREE.MeshStandardMaterial({
        color: colors.mineral,
        metalness: 0.03,
        opacity: 0.98,
        roughness: 0.94,
        side: THREE.BackSide,
        transparent: true,
      }),
    }),
    [
      colors.amber,
      colors.champagne,
      colors.ivory,
      colors.magenta,
      colors.mineral,
      colors.night,
      colors.olive,
      colors.smokedNavy,
      colors.warmStone,
    ],
  );

  useEffect(() => {
    return () => Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useFrame((_, frameDelta) => {
    const root = rootRef.current;
    const planes = planesRef.current;
    const pointerLight = pointerLightRef.current;
    const projectLight = projectLightRef.current;
    if (!root || !planes || !pointerLight || !projectLight) return;

    const runtime = getExperienceRuntime();
    root.visible =
      runtime.phase !== "showcase-transition" &&
      runtime.phase !== "showcase" &&
      runtime.phase !== "outro";
    if (!root.visible) return;

    const delta = Math.min(frameDelta, 1 / 20);
    const pointerStrength = runtime.pointer.active && !runtime.reducedMotion ? 1 : 0;
    const pointerX = runtime.pointer.x * pointerStrength;
    const pointerY = runtime.pointer.y * pointerStrength;
    const colorBlend = 1 - Math.exp(-4.2 * delta);
    const projectsActive = runtime.phase === "works";

    materials.wall.color.lerp(
      projectsActive ? phaseColors.wallProjects : phaseColors.wallDefault,
      colorBlend,
    );
    materials.floor.color.lerp(
      projectsActive ? phaseColors.floorProjects : phaseColors.floorDefault,
      colorBlend,
    );
    materials.ceiling.color.lerp(
      projectsActive ? phaseColors.ceilingProjects : phaseColors.ceilingDefault,
      colorBlend,
    );

    planes.visible = runtime.phase === "intro";
    planes.position.x = damp(planes.position.x, pointerX * -0.14, 4.2, delta);
    planes.position.y = damp(planes.position.y, pointerY * -0.09, 4.2, delta);
    planes.rotation.z = damp(planes.rotation.z, pointerX * 0.008, 4.2, delta);

    pointerLight.position.x = damp(pointerLight.position.x, pointerX * 3.6, 4.8, delta);
    pointerLight.position.y = damp(pointerLight.position.y, pointerY * 2.1 + 0.8, 4.8, delta);
    pointerLight.intensity = damp(
      pointerLight.intensity,
      runtime.phase === "intro" && runtime.pageVisible ? 0.34 : 0.12,
      4.2,
      delta,
    );
    projectLight.position.x = damp(projectLight.position.x, -2.4 + pointerX * 1.8, 3.8, delta);
    projectLight.position.y = damp(projectLight.position.y, 2.2 + pointerY * 0.8, 3.8, delta);
    projectLight.intensity = damp(
      projectLight.intensity,
      projectsActive && runtime.pageVisible ? 1.85 : 0,
      4.4,
      delta,
    );
  });

  return (
    <group ref={rootRef} name="architectural-chamber">
      <ambientLight color={colors.ivory} intensity={0.46} />
      <hemisphereLight args={[colors.ivory, colors.night, 0.62]} />
      <directionalLight color={colors.ivory} intensity={1.28} position={[-3.8, 6.4, 4.8]} />
      <directionalLight color={colors.champagne} intensity={0.42} position={[5.4, 1.8, 2.2]} />

      <mesh material={materials.wall}>
        <cylinderGeometry
          args={[
            chamber.radius,
            chamber.radius,
            chamber.height,
            radialSegments,
            1,
            true,
            WALL_START_ANGLE,
            WALL_ARC,
          ]}
        />
      </mesh>
      <mesh
        material={materials.floor}
        position={[0, -chamber.height * 0.5, 0]}
        rotation={[-HALF_PI, 0, 0]}
      >
        <circleGeometry args={[chamber.radius, radialSegments]} />
      </mesh>
      <mesh
        material={materials.ceiling}
        position={[0, chamber.height * 0.5, 0]}
        rotation={[HALF_PI, 0, 0]}
      >
        <circleGeometry args={[chamber.radius, radialSegments]} />
      </mesh>

      <group ref={planesRef} name="editorial-material-planes">
        <mesh
          material={materials.shadow}
          position={[4.22, 0.04, -8.06]}
          rotation={[0, -0.1, -0.07]}
        >
          <boxGeometry args={[5.2, 8.7, 0.12]} />
        </mesh>
        <mesh
          material={materials.oxblood}
          position={[4.48, 0.08, -7.88]}
          rotation={[0, -0.1, -0.07]}
        >
          <boxGeometry args={[5.1, 8.6, 0.16]} />
        </mesh>

        <mesh material={materials.shadow} position={[0.9, 2.62, -7.96]} rotation={[0, 0.03, -0.12]}>
          <boxGeometry args={[8.8, 1.42, 0.1]} />
        </mesh>
        <mesh material={materials.ochre} position={[0.76, 2.82, -7.78]} rotation={[0, 0.03, -0.12]}>
          <boxGeometry args={[8.6, 1.25, 0.13]} />
        </mesh>

        <mesh
          material={materials.shadow}
          position={[1.72, -2.48, -7.86]}
          rotation={[0, 0.05, 0.08]}
        >
          <boxGeometry args={[8.2, 3.2, 0.11]} />
        </mesh>
        <mesh material={materials.olive} position={[1.94, -2.3, -7.66]} rotation={[0, 0.05, 0.08]}>
          <boxGeometry args={[8, 3.04, 0.15]} />
        </mesh>

        <mesh material={materials.shadow} position={[0.48, -0.1, -7.66]} rotation={[0, 0.02, 0.2]}>
          <boxGeometry args={[1.24, 8.2, 0.08]} />
        </mesh>
        <mesh material={materials.bone} position={[0.31, 0.02, -7.48]} rotation={[0, 0.02, 0.2]}>
          <boxGeometry args={[1.02, 8.05, 0.1]} />
        </mesh>
        <mesh material={materials.clay} position={[2.1, 0.24, -7.38]} rotation={[0, 0.04, -0.18]}>
          <boxGeometry args={[1.05, 7.4, 0.09]} />
        </mesh>
      </group>

      <pointLight
        ref={pointerLightRef}
        color={colors.champagne}
        decay={2}
        distance={8.5}
        intensity={0.34}
        position={[0, 0.8, 1.6]}
      />
      <pointLight
        ref={projectLightRef}
        color="#fff0c7"
        decay={1.7}
        distance={15}
        intensity={0}
        position={[-2.4, 2.2, 2.8]}
      />
    </group>
  );
}
