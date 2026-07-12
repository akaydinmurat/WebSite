"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime } from "../experience-store";

type PackageVaultProps = Readonly<{
  count: number;
}>;

type FrameProps = Readonly<{
  depth: number;
  height: number;
  material: THREE.Material;
  thickness: number;
  width: number;
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

function RectangularFrame({ width, height, depth, thickness, material }: FrameProps) {
  return (
    <group>
      <mesh castShadow material={material} position={[0, height * 0.5, 0]}>
        <boxGeometry args={[width + thickness, thickness, depth]} />
      </mesh>
      <mesh castShadow material={material} position={[0, -height * 0.5, 0]}>
        <boxGeometry args={[width + thickness, thickness, depth]} />
      </mesh>
      <mesh castShadow material={material} position={[-width * 0.5, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
      </mesh>
      <mesh castShadow material={material} position={[width * 0.5, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
      </mesh>
    </group>
  );
}

export function PackageVault({ count }: PackageVaultProps) {
  const rootRef = useRef<THREE.Group>(null);
  const frameRefs = useRef<Array<THREE.Group | null>>([]);
  const keyLightRef = useRef<THREE.PointLight>(null);
  const opacityRef = useRef(0);
  const frameCount = Math.min(5, Math.max(1, count));

  const materials = useMemo(
    () => ({
      accent: new THREE.MeshStandardMaterial({
        color: experienceConfig.colors.blue,
        emissive: experienceConfig.colors.blue,
        emissiveIntensity: 0.18,
        metalness: 0.62,
        opacity: 0,
        roughness: 0.32,
        transparent: true,
      }),
      dossier: new THREE.MeshPhysicalMaterial({
        clearcoat: 0.36,
        color: "#30343e",
        depthWrite: false,
        metalness: 0.22,
        opacity: 0,
        roughness: 0.44,
        side: THREE.DoubleSide,
        transparent: true,
      }),
      frame: new THREE.MeshPhysicalMaterial({
        clearcoat: 0.62,
        clearcoatRoughness: 0.18,
        color: experienceConfig.colors.champagne,
        metalness: 0.92,
        opacity: 0,
        roughness: 0.28,
        transparent: true,
      }),
      glow: new THREE.MeshBasicMaterial({
        color: experienceConfig.colors.amber,
        depthWrite: false,
        opacity: 0,
        transparent: true,
      }),
      inner: new THREE.MeshStandardMaterial({
        color: "#7c756d",
        metalness: 0.76,
        opacity: 0,
        roughness: 0.4,
        transparent: true,
      }),
    }),
    [],
  );
  const materialsRef = useRef(materials);

  useEffect(() => {
    materialsRef.current = materials;
  }, [materials]);

  useEffect(() => {
    return () => Object.values(materials).forEach((material) => material.dispose());
  }, [materials]);

  useFrame((_, frameDelta) => {
    const root = rootRef.current;
    const keyLight = keyLightRef.current;
    if (!root || !keyLight) return;

    const runtime = getExperienceRuntime();
    const delta = Math.min(frameDelta, 1 / 20);
    const progress = runtime.outroProgress;
    const runtimeMaterials = materialsRef.current;
    const exit = smoothstep((progress - 0.58) / 0.2);
    const opacityTarget = runtime.phase === "outro" ? 1 - exit : 0;
    opacityRef.current = runtime.reducedMotion
      ? opacityTarget
      : damp(opacityRef.current, opacityTarget, 6.2, delta);
    const opacity = opacityRef.current;

    root.visible = opacity > 0.008;
    root.position.z = damp(root.position.z, -23.7 + smoothstep(progress / 0.18) * 1.15, 4.8, delta);
    root.rotation.y = damp(root.rotation.y, (progress - 0.22) * -0.08, 4.4, delta);
    root.rotation.z = damp(root.rotation.z, (0.18 - progress) * 0.018, 4.4, delta);

    runtimeMaterials.frame.opacity = opacity * 0.9;
    runtimeMaterials.inner.opacity = opacity * 0.58;
    runtimeMaterials.dossier.opacity = opacity * 0.38;
    runtimeMaterials.accent.opacity = opacity * 0.82;
    runtimeMaterials.glow.opacity = opacity * 0.32;
    keyLight.intensity = damp(keyLight.intensity, opacity * 1.1, 4.6, delta);

    const stageProgress = clamp01(progress / 0.56) * Math.max(1, frameCount - 1);
    const activeIndex = Math.min(frameCount - 1, Math.round(stageProgress));
    frameRefs.current.forEach((frame, index) => {
      if (!frame) return;
      const distance = index - activeIndex;
      const targetX = distance * 1.18;
      const targetY = Math.abs(distance) * -0.08;
      const targetZ = -Math.abs(distance) * 0.72 - index * 0.08;
      const positionSpeed = runtime.reducedMotion ? 100 : 6.8;
      frame.position.x = damp(frame.position.x, targetX, positionSpeed, delta);
      frame.position.y = damp(frame.position.y, targetY, positionSpeed, delta);
      frame.position.z = damp(frame.position.z, targetZ, positionSpeed, delta);
      frame.rotation.y = damp(frame.rotation.y, distance * -0.16, 6.4, delta);
      frame.rotation.z = damp(frame.rotation.z, distance * 0.018, 6.4, delta);
      const focusScale = index === activeIndex ? 1.08 : 0.84;
      const nextScale = damp(frame.scale.x, focusScale, 6.4, delta);
      frame.scale.setScalar(nextScale);
    });
  });

  return (
    <group ref={rootRef} name="package-vault" position={[0.6, 0.15, -23.7]} visible={false}>
      <ambientLight color="#8793a2" intensity={0.24} />
      <pointLight
        ref={keyLightRef}
        color={experienceConfig.colors.champagne}
        decay={2}
        distance={9}
        intensity={0}
        position={[0, 2.4, 2.6]}
      />

      <group name="vault-portal" position={[0, 0, -1.5]}>
        <RectangularFrame
          depth={0.16}
          height={5.25}
          material={materials.frame}
          thickness={0.08}
          width={7.2}
        />
        <group position={[0, 0, 0.08]}>
          <RectangularFrame
            depth={0.08}
            height={4.74}
            material={materials.inner}
            thickness={0.045}
            width={6.64}
          />
        </group>
        <mesh material={materials.glow} position={[0, -2.66, 0.02]}>
          <boxGeometry args={[5.8, 0.025, 0.045]} />
        </mesh>
      </group>

      {Array.from({ length: frameCount }, (_, index) => (
        <group
          key={index}
          ref={(node) => {
            frameRefs.current[index] = node;
          }}
          position={[index * 0.1, 0, index * -0.16]}
        >
          <mesh material={materials.dossier} position={[0, 0, -0.08]}>
            <planeGeometry args={[2.85, 3.7]} />
          </mesh>
          <RectangularFrame
            depth={0.14}
            height={3.72}
            material={materials.frame}
            thickness={0.065}
            width={2.86}
          />
          <group position={[0, 0, 0.11]}>
            <RectangularFrame
              depth={0.045}
              height={3.3}
              material={materials.inner}
              thickness={0.025}
              width={2.48}
            />
          </group>
          <mesh material={materials.accent} position={[-0.84, 1.22, 0.15]}>
            <boxGeometry args={[0.56, 0.055, 0.055]} />
          </mesh>
          <mesh material={materials.glow} position={[0.52, -1.24, 0.15]}>
            <boxGeometry args={[1.14, 0.035, 0.035]} />
          </mesh>
          {[-0.72, -0.24, 0.24, 0.72].map((x, lineIndex) => (
            <mesh key={x} material={materials.inner} position={[x, 0.08, 0.13]}>
              <boxGeometry args={[0.018, 1.55 - lineIndex * 0.17, 0.025]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
