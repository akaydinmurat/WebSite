"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { getExperienceRuntime } from "../experience-store";

type PortalFrameProps = Readonly<{
  color: string;
  depth: number;
  height: number;
  opacity: number;
  rotation?: number;
  width: number;
}>;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function PortalFrame({ color, depth, height, opacity, rotation = 0, width }: PortalFrameProps) {
  const rail = 0.035;

  return (
    <group position={[0, 0, depth]} rotation={[0, 0, rotation]}>
      <mesh position={[0, height * 0.5, 0]} userData={{ portalOpacity: opacity }}>
        <boxGeometry args={[width, rail, rail]} />
        <meshBasicMaterial color={color} depthWrite={false} opacity={0} transparent />
      </mesh>
      <mesh position={[0, -height * 0.5, 0]} userData={{ portalOpacity: opacity }}>
        <boxGeometry args={[width, rail, rail]} />
        <meshBasicMaterial color={color} depthWrite={false} opacity={0} transparent />
      </mesh>
      <mesh position={[-width * 0.5, 0, 0]} userData={{ portalOpacity: opacity }}>
        <boxGeometry args={[rail, height, rail]} />
        <meshBasicMaterial color={color} depthWrite={false} opacity={0} transparent />
      </mesh>
      <mesh position={[width * 0.5, 0, 0]} userData={{ portalOpacity: opacity }}>
        <boxGeometry args={[rail, height, rail]} />
        <meshBasicMaterial color={color} depthWrite={false} opacity={0} transparent />
      </mesh>
    </group>
  );
}

export function IntroPortal() {
  const rootRef = useRef<THREE.Group>(null);
  const frameGroupRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Group>(null);
  const visibilityRef = useRef(0);

  useFrame(({ clock }, frameDelta) => {
    const root = rootRef.current;
    const frames = frameGroupRef.current;
    const halo = haloRef.current;
    if (!root || !frames || !halo) return;

    const runtime = getExperienceRuntime();
    const delta = Math.min(frameDelta, 1 / 20);
    const target = runtime.phase === "intro" && runtime.pageVisible ? 1 : 0;
    const visibility = runtime.reducedMotion
      ? target
      : damp(visibilityRef.current, target, target > 0 ? 3.4 : 5.2, delta);
    const pointerX = runtime.pointer.active && !runtime.reducedMotion ? runtime.pointer.x : 0;
    const pointerY = runtime.pointer.active && !runtime.reducedMotion ? runtime.pointer.y : 0;
    const scrollProgress = runtime.introProgress;

    visibilityRef.current = visibility;
    root.visible = visibility > 0.008;
    root.position.x = damp(root.position.x, 1.7 + pointerX * 0.16, 4.5, delta);
    root.position.y = damp(root.position.y, pointerY * 0.1, 4.5, delta);
    root.position.z = -6.2 - scrollProgress * 0.9;
    root.rotation.y = damp(root.rotation.y, pointerX * 0.045, 4.2, delta);
    frames.rotation.z = Math.sin(clock.elapsedTime * 0.22) * 0.012 - pointerX * 0.008;
    frames.scale.setScalar(1 + scrollProgress * 0.12);
    halo.rotation.z = clock.elapsedTime * 0.025;

    root.traverse((child) => {
      if (!(child instanceof THREE.Mesh) || !(child.material instanceof THREE.Material)) return;
      const portalOpacity = Number(child.userData.portalOpacity ?? 0.2);
      child.material.opacity = visibility * portalOpacity * (1 - scrollProgress * 0.36);
    });
  });

  return (
    <group ref={rootRef} name="intro-light-portal" position={[1.7, 0, -6.2]} visible={false}>
      <group ref={haloRef}>
        <mesh position={[0, 0, -0.55]} userData={{ portalOpacity: 0.16 }}>
          <circleGeometry args={[2.35, 64]} />
          <meshBasicMaterial
            blending={THREE.AdditiveBlending}
            color="#f4ce63"
            depthWrite={false}
            opacity={0}
            transparent
          />
        </mesh>
        <mesh position={[0, 0, -0.48]} userData={{ portalOpacity: 0.52 }}>
          <ringGeometry args={[2.62, 2.65, 96]} />
          <meshBasicMaterial color="#fff8e8" depthWrite={false} opacity={0} transparent />
        </mesh>
        <mesh position={[0, 0, -0.5]} userData={{ portalOpacity: 0.24 }}>
          <ringGeometry args={[3.3, 3.32, 96]} />
          <meshBasicMaterial color="#e9785f" depthWrite={false} opacity={0} transparent />
        </mesh>
      </group>

      <group ref={frameGroupRef}>
        <PortalFrame color="#fff8e8" depth={0.18} height={4.45} opacity={0.74} width={5.5} />
        <PortalFrame
          color="#f4ce63"
          depth={-0.08}
          height={4.85}
          opacity={0.5}
          rotation={-0.028}
          width={5.95}
        />
        <PortalFrame
          color="#e9785f"
          depth={-0.32}
          height={5.22}
          opacity={0.34}
          rotation={0.036}
          width={6.38}
        />
      </group>

      <mesh position={[-2.55, 0, 0.3]} userData={{ portalOpacity: 0.32 }}>
        <planeGeometry args={[0.08, 5.8]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#fff8e8"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <mesh position={[2.18, -0.3, 0.28]} userData={{ portalOpacity: 0.22 }}>
        <planeGeometry args={[0.04, 4.8]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#f4ce63"
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}
