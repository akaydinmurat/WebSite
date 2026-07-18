"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime } from "../experience-store";
import { damp } from "./orbit-math";

const POINT_COUNT = 150;

export function ProjectSpatialField() {
  const rootRef = useRef<THREE.Group>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial>(null);
  const backdropGroupRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const shardGroupRef = useRef<THREE.Group>(null);
  const visibilityRef = useRef(0);
  const positions = useMemo(() => {
    const values = new Float32Array(POINT_COUNT * 3);

    for (let index = 0; index < POINT_COUNT; index += 1) {
      const offset = index * 3;
      const angle = index * 2.399963;
      const radius = 2.4 + ((index * 37) % 101) * 0.067;
      values[offset] = Math.cos(angle) * radius;
      values[offset + 1] = Math.sin(angle * 1.37) * 3.8;
      values[offset + 2] = -2.5 - ((index * 53) % 97) * 0.082;
    }

    return values;
  }, []);

  useFrame((_, frameDelta) => {
    const root = rootRef.current;
    if (!root) return;

    const runtime = getExperienceRuntime();
    const delta = Math.min(frameDelta, 1 / 20);
    const target = runtime.phase === "works" && runtime.pageVisible ? 1 : 0;
    const visibility = runtime.reducedMotion
      ? target
      : damp(visibilityRef.current, target, target > 0 ? 3.8 : 4.6, delta);

    visibilityRef.current = visibility;
    root.visible = visibility > 0.008;
    if (pointMaterialRef.current) {
      pointMaterialRef.current.opacity = visibility * 0.42;
    }
    for (const child of ringGroupRef.current?.children ?? []) {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = visibility * Number(child.userData.fieldOpacity ?? 0.34);
      }
    }
    for (const child of shardGroupRef.current?.children ?? []) {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = visibility * Number(child.userData.fieldOpacity ?? 0.24);
      }
    }
    for (const child of backdropGroupRef.current?.children ?? []) {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
        child.material.opacity = visibility * Number(child.userData.fieldOpacity ?? 0.2);
      }
    }

    if (!runtime.reducedMotion && root.visible) {
      root.rotation.z += delta * 0.006;
      root.rotation.y = Math.sin(runtime.orbit.angle * 0.24) * 0.032;
      if (backdropGroupRef.current) {
        backdropGroupRef.current.rotation.z -= delta * 0.009;
      }
    }
  });

  return (
    <group ref={rootRef} name="project-spatial-field" position={[0, 0.2, -1.8]} visible={false}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMaterialRef}
          color="#fff8e8"
          depthWrite={false}
          opacity={0}
          size={0.032}
          sizeAttenuation
          transparent
        />
      </points>

      <group ref={ringGroupRef}>
        <mesh
          position={[0.4, 0.2, -5.8]}
          rotation={[1.18, 0.22, -0.18]}
          userData={{ fieldOpacity: 0.46 }}
        >
          <torusGeometry args={[5.3, 0.012, 4, 96]} />
          <meshBasicMaterial
            color="#fff8e8"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
        <mesh
          position={[-1.8, 0.6, -7.4]}
          rotation={[1.42, -0.34, 0.5]}
          userData={{ fieldOpacity: 0.34 }}
        >
          <torusGeometry args={[3.7, 0.01, 4, 80]} />
          <meshBasicMaterial
            color="#f4ce63"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
        <mesh
          position={[2.7, -1.1, -8.7]}
          rotation={[1.1, 0.5, -0.65]}
          userData={{ fieldOpacity: 0.3 }}
        >
          <torusGeometry args={[2.25, 0.009, 4, 64]} />
          <meshBasicMaterial
            color="#e9785f"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
      </group>

      <group ref={shardGroupRef}>
        <mesh
          position={[-5.8, 1.9, -4.6]}
          rotation={[0.2, 0.48, 0.64]}
          userData={{ fieldOpacity: 0.3 }}
        >
          <circleGeometry args={[1.55, 3]} />
          <meshBasicMaterial
            color={experienceConfig.colors.projectCoral}
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
        <mesh
          position={[5.5, -1.6, -6.1]}
          rotation={[-0.3, -0.56, -0.38]}
          userData={{ fieldOpacity: 0.28 }}
        >
          <circleGeometry args={[1.9, 3]} />
          <meshBasicMaterial
            color={experienceConfig.colors.projectCoral}
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
        <mesh
          position={[3.9, 2.7, -9.2]}
          rotation={[0.48, 0.22, 0.92]}
          userData={{ fieldOpacity: 0.24 }}
        >
          <circleGeometry args={[1.2, 3]} />
          <meshBasicMaterial
            color={experienceConfig.colors.projectCoral}
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
      </group>

      <group ref={backdropGroupRef}>
        <mesh position={[-2.8, 1.2, -9.8]} userData={{ fieldOpacity: 0.34 }}>
          <circleGeometry args={[2.45, 64]} />
          <meshBasicMaterial
            color="#f4ce63"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
        <mesh position={[-2.8, 1.2, -9.72]} userData={{ fieldOpacity: 0.72 }}>
          <ringGeometry args={[2.72, 2.76, 96]} />
          <meshBasicMaterial
            color="#fff8e8"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
        <mesh position={[3.4, -0.5, -10.4]} userData={{ fieldOpacity: 0.3 }}>
          <ringGeometry args={[2.9, 3.62, 3]} />
          <meshBasicMaterial
            color="#e9785f"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
        <mesh
          position={[0, -3.32, -3.4]}
          rotation={[-Math.PI * 0.5, 0, 0]}
          userData={{ fieldOpacity: 0.5 }}
        >
          <ringGeometry args={[3.8, 3.84, 96]} />
          <meshBasicMaterial
            color="#fff8e8"
            depthWrite={false}
            opacity={0}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}
