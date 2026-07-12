"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig, type ExperiencePhase } from "../experience-config";
import { getExperienceRuntime } from "../experience-store";

export type SpatialSculptureProps = Readonly<{
  position?: THREE.Vector3Tuple;
  scale?: number;
  visible?: boolean;
}>;

type CompassLegProps = Readonly<{
  darkMaterial: THREE.Material;
  material: THREE.Material;
  rotation: number;
}>;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
}

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function getPhaseScale(phase: ExperiencePhase, phaseProgress: number) {
  switch (phase) {
    case "works":
      return experienceConfig.sculpture.worksScale;
    case "vision-transition":
      return 0.62;
    case "vision":
      return 0.56;
    case "showcase-transition":
      return 0.56 * (1 - smoothstep(phaseProgress));
    case "showcase":
    case "outro":
      return 0;
    default:
      return 1;
  }
}

function createDraftingLineGeometry() {
  const positions: number[] = [];
  const addLine = (
    from: readonly [number, number, number],
    to: readonly [number, number, number],
  ) => positions.push(...from, ...to);

  addLine([-1.92, 0, 0], [1.92, 0, 0]);
  addLine([0, -1.92, 0], [0, 1.92, 0]);
  addLine([-1.36, -1.36, 0], [1.36, 1.36, 0]);

  for (const radius of [1.38, 1.72]) {
    const segmentCount = 56;
    const startAngle = Math.PI * 0.12;
    const arcLength = Math.PI * 1.42;

    for (let index = 0; index < segmentCount; index += 1) {
      const angleA = startAngle + arcLength * (index / segmentCount);
      const angleB = startAngle + arcLength * ((index + 1) / segmentCount);
      addLine(
        [Math.cos(angleA) * radius, Math.sin(angleA) * radius, 0],
        [Math.cos(angleB) * radius, Math.sin(angleB) * radius, 0],
      );
    }
  }

  for (let index = 0; index <= 12; index += 1) {
    const x = THREE.MathUtils.lerp(-1.8, 1.8, index / 12);
    const tick = index % 3 === 0 ? 0.12 : 0.065;
    addLine([x, -tick, 0], [x, tick, 0]);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createRulerTickGeometry() {
  const positions: number[] = [];
  const rulerLength = 3.15;

  for (let index = 0; index <= 28; index += 1) {
    const x = THREE.MathUtils.lerp(-rulerLength * 0.5, rulerLength * 0.5, index / 28);
    const height = index % 7 === 0 ? 0.13 : index % 2 === 0 ? 0.085 : 0.055;
    positions.push(x, 0.14, 0.075, x, 0.14 - height, 0.075);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function CompassLeg({ darkMaterial, material, rotation }: CompassLegProps) {
  return (
    <group rotation={[0, 0, rotation]}>
      <mesh castShadow material={material} position={[0, -1.05, 0]}>
        <boxGeometry args={[0.13, 2.12, 0.18]} />
      </mesh>
      <mesh castShadow material={darkMaterial} position={[0, -2.16, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.105, 0.38, 8]} />
      </mesh>
      <mesh castShadow material={darkMaterial} position={[0, -0.42, 0.12]}>
        <boxGeometry args={[0.22, 0.28, 0.08]} />
      </mesh>
    </group>
  );
}

export function SpatialSculpture({
  position = [0, 0, 0],
  scale = 1,
  visible = true,
}: SpatialSculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const pencilRef = useRef<THREE.Group>(null);
  const blueLightRef = useRef<THREE.PointLight>(null);
  const amberLightRef = useRef<THREE.PointLight>(null);
  const motionAngleRef = useRef(0);
  const { colors, sculpture } = experienceConfig;

  const geometries = useMemo(
    () => ({
      draftingLines: createDraftingLineGeometry(),
      rulerTicks: createRulerTickGeometry(),
    }),
    [],
  );

  const materials = useMemo(
    () => ({
      brushedMetal: new THREE.MeshPhysicalMaterial({
        clearcoat: 0.56,
        clearcoatRoughness: 0.2,
        color: "#a49a8b",
        metalness: 0.92,
        roughness: 0.3,
      }),
      darkMetal: new THREE.MeshPhysicalMaterial({
        clearcoat: 0.32,
        color: "#25282b",
        metalness: 0.86,
        roughness: 0.38,
      }),
      graphite: new THREE.MeshStandardMaterial({
        color: "#15171a",
        metalness: 0.28,
        roughness: 0.58,
      }),
      hinge: new THREE.MeshStandardMaterial({
        color: colors.blue,
        emissive: colors.blue,
        emissiveIntensity: 0.16,
        metalness: 0.58,
        roughness: 0.32,
      }),
      line: new THREE.LineBasicMaterial({
        color: colors.cyan,
        depthWrite: false,
        opacity: 0.34,
        transparent: true,
      }),
      pencilBody: new THREE.MeshStandardMaterial({
        color: colors.amber,
        emissive: colors.amber,
        emissiveIntensity: 0.12,
        metalness: 0.16,
        roughness: 0.42,
      }),
      pencilWood: new THREE.MeshStandardMaterial({
        color: "#d2b68f",
        metalness: 0,
        roughness: 0.72,
      }),
      ruler: new THREE.MeshPhysicalMaterial({
        clearcoat: 0.62,
        color: "#d8cfbf",
        emissive: colors.champagne,
        emissiveIntensity: 0.035,
        metalness: 0.58,
        opacity: 0.82,
        roughness: 0.3,
        transparent: true,
      }),
    }),
    [colors.amber, colors.blue, colors.champagne, colors.cyan],
  );
  const materialsRef = useRef(materials);

  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [geometries, materials]);

  useFrame(({ size }, frameDelta) => {
    const root = rootRef.current;
    const halo = haloRef.current;
    const pencil = pencilRef.current;
    const blueLight = blueLightRef.current;
    const amberLight = amberLightRef.current;
    if (!root || !halo || !pencil || !blueLight || !amberLight) return;

    const runtime = getExperienceRuntime();
    const runtimeMaterials = materialsRef.current;
    const delta = Math.min(frameDelta, 1 / 20);
    const motionEnabled = runtime.pageVisible && !runtime.reducedMotion;
    if (motionEnabled) motionAngleRef.current += delta * sculpture.rotationSpeed;

    const angle = motionAngleRef.current;
    const pointerStrength = runtime.pointer.active && !runtime.reducedMotion ? 1 : 0;
    const pointerX = runtime.pointer.x * pointerStrength;
    const pointerY = runtime.pointer.y * pointerStrength;
    const responsiveScale = size.width < 768 ? 0.68 : size.width < 1024 ? 0.84 : 1;
    const targetScale =
      scale *
      sculpture.scale *
      getPhaseScale(runtime.phase, runtime.phaseProgress) *
      responsiveScale;
    const nextScale = damp(root.scale.x, targetScale, 4.8, delta);
    root.scale.setScalar(nextScale);
    root.visible = visible && nextScale > 0.012;

    const visionOffset =
      runtime.phase === "vision"
        ? 1
        : runtime.phase === "vision-transition"
          ? runtime.phaseProgress
          : runtime.phase === "showcase-transition"
            ? 1 - runtime.phaseProgress
            : 0;

    root.rotation.x = damp(
      root.rotation.x,
      0.04 - pointerY * sculpture.pointerTilt * 0.58,
      4,
      delta,
    );
    root.rotation.y = damp(
      root.rotation.y,
      -0.12 + angle + pointerX * sculpture.pointerTilt,
      4,
      delta,
    );
    root.rotation.z = damp(
      root.rotation.z,
      -0.045 - pointerX * sculpture.pointerTilt * 0.24,
      4,
      delta,
    );
    root.position.x = damp(
      root.position.x,
      position[0] + visionOffset * (size.width < 768 ? 2.15 : 1.28),
      5.2,
      delta,
    );
    root.position.y = damp(
      root.position.y,
      position[1] + (motionEnabled ? Math.sin(angle * 2.2) * 0.045 : 0),
      4.4,
      delta,
    );
    root.position.z = damp(root.position.z, position[2], 5.2, delta);

    halo.rotation.z = damp(halo.rotation.z, -angle * 0.72, 3.2, delta);
    halo.rotation.y = damp(halo.rotation.y, pointerX * 0.045, 3.8, delta);
    pencil.rotation.y = damp(pencil.rotation.y, angle * 1.35, 3.4, delta);
    pencil.rotation.x = damp(pencil.rotation.x, pointerY * 0.045, 3.8, delta);

    const energy = runtime.pageVisible ? 1 + Math.min(runtime.pointer.speed, 2.5) * 0.12 : 0;
    runtimeMaterials.hinge.emissiveIntensity = damp(
      runtimeMaterials.hinge.emissiveIntensity,
      0.16 * energy,
      4.2,
      delta,
    );
    runtimeMaterials.pencilBody.emissiveIntensity = damp(
      runtimeMaterials.pencilBody.emissiveIntensity,
      0.12 * energy,
      4.2,
      delta,
    );
    runtimeMaterials.line.opacity = damp(
      runtimeMaterials.line.opacity,
      runtime.phase === "works" ? 0.22 : 0.34,
      3.8,
      delta,
    );
    blueLight.intensity = damp(blueLight.intensity, 0.52 * energy, 4.2, delta);
    amberLight.intensity = damp(amberLight.intensity, 0.48 * energy, 4.2, delta);
  });

  return (
    <group
      ref={rootRef}
      name="drafting-instrument-sculpture"
      position={position}
      rotation={[0.04, -0.12, -0.045]}
      scale={scale * sculpture.scale}
      visible={visible}
    >
      <group ref={haloRef} position={[0, 0, -0.22]}>
        <lineSegments
          frustumCulled={false}
          geometry={geometries.draftingLines}
          material={materials.line}
        />
      </group>

      <group name="compass" position={[0, 1.34, 0.05]}>
        <CompassLeg
          darkMaterial={materials.darkMetal}
          material={materials.brushedMetal}
          rotation={0.33}
        />
        <CompassLeg
          darkMaterial={materials.darkMetal}
          material={materials.brushedMetal}
          rotation={-0.33}
        />
        <mesh castShadow material={materials.darkMetal} position={[0, 0.22, -0.02]}>
          <cylinderGeometry args={[0.24, 0.24, 0.18, 24]} />
        </mesh>
        <mesh
          castShadow
          material={materials.hinge}
          position={[0, 0.22, 0.1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.17, 0.045, 10, 36]} />
        </mesh>
        <mesh castShadow material={materials.darkMetal} position={[0, -0.72, 0.12]}>
          <boxGeometry args={[0.9, 0.08, 0.08]} />
        </mesh>
      </group>

      <group name="ruler" position={[0, -0.13, 0.31]} rotation={[0.025, 0.08, -0.09]}>
        <mesh castShadow material={materials.ruler}>
          <boxGeometry args={[3.25, 0.3, 0.13]} />
        </mesh>
        <lineSegments geometry={geometries.rulerTicks} material={materials.line} />
        <mesh material={materials.darkMetal} position={[-1.24, 0, 0.085]}>
          <cylinderGeometry args={[0.052, 0.052, 0.035, 18]} />
        </mesh>
      </group>

      <group
        ref={pencilRef}
        name="pencil"
        position={[0.18, -0.02, 0.58]}
        rotation={[0.05, 0.12, -0.72]}
      >
        <mesh castShadow material={materials.pencilBody}>
          <cylinderGeometry args={[0.12, 0.12, 3.08, 6]} />
        </mesh>
        <mesh
          castShadow
          material={materials.pencilWood}
          position={[0, -1.72, 0]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.12, 0.42, 6]} />
        </mesh>
        <mesh
          castShadow
          material={materials.graphite}
          position={[0, -1.96, 0]}
          rotation={[0, 0, Math.PI]}
        >
          <coneGeometry args={[0.045, 0.18, 6]} />
        </mesh>
        <mesh castShadow material={materials.darkMetal} position={[0, 1.62, 0]}>
          <cylinderGeometry args={[0.125, 0.125, 0.18, 6]} />
        </mesh>
      </group>

      <pointLight
        ref={blueLightRef}
        color={colors.blue}
        decay={2}
        distance={4.8}
        intensity={0.52}
        position={[-0.78, 0.82, 1.05]}
      />
      <pointLight
        ref={amberLightRef}
        color={colors.amber}
        decay={2}
        distance={4.4}
        intensity={0.48}
        position={[0.9, -0.55, 1.1]}
      />
    </group>
  );
}
