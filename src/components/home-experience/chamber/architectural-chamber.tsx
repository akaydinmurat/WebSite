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

type WallPanelDescriptor = Readonly<{
  angle: number;
  width: number;
  height: number;
  y: number;
  accent: string;
}>;

const wallPanels: readonly WallPanelDescriptor[] = [
  { angle: Math.PI * 0.57, width: 2.2, height: 2.75, y: 0.35, accent: "#607787" },
  { angle: Math.PI * 0.76, width: 1.35, height: 1.85, y: -0.58, accent: "#a98a62" },
  { angle: Math.PI * 1.24, width: 1.35, height: 1.85, y: -0.58, accent: "#79596a" },
  { angle: Math.PI * 1.43, width: 2.2, height: 2.75, y: 0.35, accent: "#6d8082" },
] as const;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function createPerspectiveGridGeometry(depth: number, radius: number) {
  const positions: number[] = [];
  const floorY = -experienceConfig.chamber.height * 0.5 + 0.018;
  const nearZ = depth * 0.49;
  const farZ = -Math.min(radius * 0.91, depth * 0.62);
  const nearHalfWidth = radius * 0.82;
  const vanishingHalfWidth = 0.34;

  for (let index = -10; index <= 10; index += 1) {
    const ratio = index / 10;
    positions.push(ratio * nearHalfWidth, floorY, nearZ, ratio * vanishingHalfWidth, floorY, farZ);
  }

  for (let index = 0; index <= 17; index += 1) {
    const linearProgress = index / 17;
    const perspectiveProgress = Math.pow(linearProgress, 1.72);
    const z = THREE.MathUtils.lerp(nearZ, farZ, perspectiveProgress);
    const halfWidth = THREE.MathUtils.lerp(nearHalfWidth, vanishingHalfWidth, perspectiveProgress);
    positions.push(-halfWidth, floorY, z, halfWidth, floorY, z);
  }

  for (const row of [3, 6, 9, 12, 15]) {
    const linearProgress = row / 17;
    const perspectiveProgress = Math.pow(linearProgress, 1.72);
    const z = THREE.MathUtils.lerp(nearZ, farZ, perspectiveProgress);
    const halfWidth = THREE.MathUtils.lerp(nearHalfWidth, vanishingHalfWidth, perspectiveProgress);
    const tickSize = THREE.MathUtils.lerp(0.12, 0.045, perspectiveProgress);

    for (const column of [-6, -3, 0, 3, 6]) {
      const x = (column / 10) * halfWidth;
      positions.push(x - tickSize, floorY, z, x + tickSize, floorY, z);
      positions.push(x, floorY, z - tickSize, x, floorY, z + tickSize);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function createCurvedWallGridGeometry(radius: number, height: number, detail: number) {
  const positions: number[] = [];
  const innerRadius = radius - 0.035;
  const verticalSegments = Math.max(16, Math.floor(detail * 0.62));

  for (let row = 1; row < 8; row += 1) {
    const y = THREE.MathUtils.lerp(-height * 0.5, height * 0.5, row / 8);
    for (let segment = 0; segment < detail; segment += 1) {
      const angleA = WALL_START_ANGLE + WALL_ARC * (segment / detail);
      const angleB = WALL_START_ANGLE + WALL_ARC * ((segment + 1) / detail);
      positions.push(
        Math.sin(angleA) * innerRadius,
        y,
        Math.cos(angleA) * innerRadius,
        Math.sin(angleB) * innerRadius,
        y,
        Math.cos(angleB) * innerRadius,
      );
    }
  }

  for (let column = 0; column <= 14; column += 1) {
    const angle = WALL_START_ANGLE + WALL_ARC * (column / 14);
    const x = Math.sin(angle) * innerRadius;
    const z = Math.cos(angle) * innerRadius;
    for (let segment = 0; segment < verticalSegments; segment += 1) {
      const yA = -height * 0.5 + height * (segment / verticalSegments);
      const yB = -height * 0.5 + height * ((segment + 1) / verticalSegments);
      positions.push(x, yA, z, x, yB, z);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function addLine(
  positions: number[],
  from: readonly [number, number, number],
  to: readonly [number, number, number],
) {
  positions.push(...from, ...to);
}

function createMeasurementGeometry(radius: number, height: number) {
  const positions: number[] = [];
  const backZ = -radius + 0.08;
  const bottom = -height * 0.5 + 0.22;
  const top = height * 0.5 - 0.22;
  const verticalX = -5.35;

  addLine(positions, [verticalX, bottom, backZ + 1.65], [verticalX, top, backZ + 1.65]);
  for (let index = 0; index <= 12; index += 1) {
    const y = THREE.MathUtils.lerp(bottom, top, index / 12);
    const tick = index % 3 === 0 ? 0.28 : 0.14;
    addLine(positions, [verticalX - tick, y, backZ + 1.65], [verticalX + tick, y, backZ + 1.65]);
  }

  const horizontalY = height * 0.5 - 0.62;
  addLine(positions, [-4.1, horizontalY, backZ + 0.45], [4.1, horizontalY, backZ + 0.45]);
  for (let index = 0; index <= 16; index += 1) {
    const x = THREE.MathUtils.lerp(-4.1, 4.1, index / 16);
    const tick = index % 4 === 0 ? 0.24 : 0.11;
    addLine(
      positions,
      [x, horizontalY - tick, backZ + 0.45],
      [x, horizontalY + tick, backZ + 0.45],
    );
  }

  const floorY = -height * 0.5 + 0.035;
  addLine(positions, [-4.75, floorY, -5.25], [-2.25, floorY, -7.75]);
  addLine(positions, [-4.96, floorY, -5.46], [-4.54, floorY, -5.04]);
  addLine(positions, [-2.46, floorY, -7.96], [-2.04, floorY, -7.54]);
  addLine(positions, [2.35, floorY, -7.85], [5.1, floorY, -5.1]);
  addLine(positions, [2.14, floorY, -7.64], [2.56, floorY, -8.06]);
  addLine(positions, [4.89, floorY, -4.89], [5.31, floorY, -5.31]);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function CurvedWallPanel({ angle, width, height, y, accent }: WallPanelDescriptor) {
  const radius = experienceConfig.chamber.radius - 0.19;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  const rotationY = angle - Math.PI;

  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <mesh>
        <boxGeometry args={[width, height, 0.105]} />
        <meshPhysicalMaterial
          color="#393a3a"
          metalness={0.58}
          opacity={experienceConfig.chamber.panelOpacity + 0.28}
          roughness={0.48}
          transparent
        />
      </mesh>
      <mesh position={[0, 0, 0.061]}>
        <planeGeometry args={[width * 0.88, height * 0.86]} />
        <meshPhysicalMaterial
          color={accent}
          depthWrite={false}
          emissive={accent}
          emissiveIntensity={0.035}
          metalness={0.42}
          opacity={0.055}
          roughness={0.5}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh position={[0, height * 0.33, 0.069]}>
        <boxGeometry args={[width * 0.48, 0.012, 0.018]} />
        <meshBasicMaterial color={accent} opacity={0.42} transparent />
      </mesh>
      {[-0.31, 0, 0.31].map((ratio) => (
        <mesh key={ratio} position={[width * ratio, -height * 0.38, 0.074]}>
          <boxGeometry args={[0.018, height * 0.12, 0.018]} />
          <meshBasicMaterial color="#aaa398" opacity={0.42} transparent />
        </mesh>
      ))}
    </group>
  );
}

export function ArchitecturalChamber({ quality = "high" }: ArchitecturalChamberProps) {
  const rootRef = useRef<THREE.Group>(null);
  const pointerLightRef = useRef<THREE.PointLight>(null);
  const phaseLightRef = useRef<THREE.PointLight>(null);
  const { chamber, colors } = experienceConfig;
  const radialSegments = quality === "high" ? 72 : 40;

  const geometries = useMemo(
    () => ({
      curvedGrid: createCurvedWallGridGeometry(chamber.radius, chamber.height, radialSegments),
      measurement: createMeasurementGeometry(chamber.radius, chamber.height),
      perspectiveGrid: createPerspectiveGridGeometry(chamber.depth, chamber.radius),
    }),
    [chamber.depth, chamber.height, chamber.radius, radialSegments],
  );

  const materials = useMemo(
    () => ({
      ceiling: new THREE.MeshStandardMaterial({
        color: "#27251f",
        metalness: 0.18,
        roughness: 0.86,
        side: THREE.DoubleSide,
      }),
      floor: new THREE.MeshStandardMaterial({
        color: colors.warmStone,
        metalness: 0.2,
        roughness: 0.68,
        side: THREE.DoubleSide,
      }),
      grid: new THREE.LineBasicMaterial({
        color: "#66717b",
        opacity: chamber.gridOpacity,
        transparent: true,
      }),
      measurement: new THREE.LineBasicMaterial({
        color: colors.champagne,
        opacity: 0.16,
        transparent: true,
      }),
      portal: new THREE.MeshStandardMaterial({
        color: "#4d4b47",
        metalness: 0.72,
        roughness: 0.34,
      }),
      portalInset: new THREE.MeshStandardMaterial({
        color: "#343b43",
        metalness: 0.18,
        roughness: 0.72,
      }),
      wall: new THREE.MeshStandardMaterial({
        color: colors.mineral,
        metalness: 0.16,
        opacity: 0.96,
        roughness: 0.84,
        side: THREE.BackSide,
        transparent: true,
      }),
      wallGrid: new THREE.LineBasicMaterial({
        color: "#66707a",
        opacity: chamber.gridOpacity * 0.45,
        transparent: true,
      }),
    }),
    [chamber.gridOpacity, colors.champagne, colors.mineral, colors.warmStone],
  );

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose());
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [geometries, materials]);

  useFrame((_, frameDelta) => {
    const root = rootRef.current;
    const pointerLight = pointerLightRef.current;
    const phaseLight = phaseLightRef.current;
    if (!root || !pointerLight || !phaseLight) return;

    const runtime = getExperienceRuntime();
    root.visible =
      runtime.phase !== "showcase-transition" &&
      runtime.phase !== "showcase" &&
      runtime.phase !== "outro";
    if (!root.visible) return;

    const delta = Math.min(frameDelta, 1 / 20);
    const pointerStrength = runtime.pointer.active && !runtime.reducedMotion ? 1 : 0;
    const pointerX = runtime.pointer.x * chamber.radius * 0.36 * pointerStrength;
    const pointerY = runtime.pointer.y * chamber.height * 0.28 * pointerStrength + 0.5;
    pointerLight.position.x = damp(pointerLight.position.x, pointerX, 5.2, delta);
    pointerLight.position.y = damp(pointerLight.position.y, pointerY, 5.2, delta);
    pointerLight.intensity = damp(
      pointerLight.intensity,
      runtime.pageVisible ? 0.2 + Math.min(runtime.pointer.speed, 2) * 0.09 : 0,
      4.4,
      delta,
    );

    const isVision = runtime.phase === "vision" || runtime.phase === "vision-transition";
    phaseLight.intensity = damp(
      phaseLight.intensity,
      runtime.pageVisible ? (isVision ? 1.35 : 0.82) : 0,
      3.6,
      delta,
    );
  });

  return (
    <group ref={rootRef} name="architectural-chamber">
      <ambientLight color="#c5b9a7" intensity={0.46} />
      <hemisphereLight args={["#b7c0c5", "#3a3028", 0.78]} />
      <directionalLight color="#f0e2cb" intensity={2.05} position={[4.8, 6.2, 5.5]} />
      <directionalLight color="#7d8c98" intensity={0.68} position={[-5.2, 2.8, 2.8]} />

      <mesh material={materials.wall} position={[0, 0, 0]}>
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

      <lineSegments geometry={geometries.perspectiveGrid} material={materials.grid} />
      <lineSegments geometry={geometries.curvedGrid} material={materials.wallGrid} />
      <lineSegments geometry={geometries.measurement} material={materials.measurement} />

      <group name="rear-portal" position={[0, -0.12, -9.72]}>
        <mesh material={materials.portalInset} position={[0, 0, -0.18]}>
          <planeGeometry args={[4.45, 4.4]} />
        </mesh>
        <mesh material={materials.portal} position={[-2.33, 0, 0]}>
          <boxGeometry args={[0.18, 4.8, 0.28]} />
        </mesh>
        <mesh material={materials.portal} position={[2.33, 0, 0]}>
          <boxGeometry args={[0.18, 4.8, 0.28]} />
        </mesh>
        <mesh material={materials.portal} position={[0, 2.31, 0]}>
          <boxGeometry args={[4.84, 0.18, 0.28]} />
        </mesh>
        <mesh position={[0, -2.18, 0.04]}>
          <boxGeometry args={[4.55, 0.035, 0.055]} />
          <meshBasicMaterial color={colors.champagne} opacity={0.32} transparent />
        </mesh>
        <pointLight
          color="#d9c7ad"
          decay={2}
          distance={7}
          intensity={1.05}
          position={[0, 0.3, 0.55]}
        />
      </group>

      {wallPanels.map((panel) => (
        <CurvedWallPanel key={`${panel.angle}-${panel.accent}`} {...panel} />
      ))}

      <pointLight
        ref={pointerLightRef}
        color={colors.blue}
        decay={2}
        distance={8}
        intensity={0.2}
        position={[0, 0.5, 1.8]}
      />
      <pointLight
        ref={phaseLightRef}
        color={colors.champagne}
        decay={2}
        distance={11}
        intensity={0.82}
        position={[-4.5, 1.8, -6.3]}
      />
    </group>
  );
}
