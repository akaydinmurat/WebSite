"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  getPointerSnapshot,
  subscribeToPointer,
  type PointerSnapshot,
} from "@/lib/animation/pointer-store";

export type ShowroomScene =
  "home" | "projects" | "services" | "packages" | "reviews" | "about" | "contact";

type SceneState = Readonly<{
  rotation: readonly [number, number, number];
  portalRotation: readonly [number, number, number];
  orbitRotation: readonly [number, number, number];
  accent: string;
  cameraZ: number;
  scale: number;
  spread: number;
}>;

const sceneStates: Record<ShowroomScene, SceneState> = {
  home: {
    rotation: [0.08, -0.32, -0.08],
    portalRotation: [0.08, 0.12, -0.03],
    orbitRotation: [1.08, -0.24, 0.14],
    accent: "#711d2b",
    cameraZ: 8.2,
    scale: 1,
    spread: 1.25,
  },
  projects: {
    rotation: [-0.12, 0.72, 0.08],
    portalRotation: [-0.08, -0.18, 0.06],
    orbitRotation: [0.72, 0.56, -0.18],
    accent: "#8d4939",
    cameraZ: 7.85,
    scale: 1.08,
    spread: 1.62,
  },
  services: {
    rotation: [0.24, -0.92, -0.16],
    portalRotation: [0.16, 0.28, -0.1],
    orbitRotation: [1.32, -0.52, 0.32],
    accent: "#7a2633",
    cameraZ: 8.45,
    scale: 0.94,
    spread: 1.88,
  },
  packages: {
    rotation: [-0.22, 1.42, 0.14],
    portalRotation: [-0.14, -0.36, 0.08],
    orbitRotation: [0.52, 0.88, -0.28],
    accent: "#9b6552",
    cameraZ: 8.05,
    scale: 1.02,
    spread: 2.06,
  },
  reviews: {
    rotation: [0.16, 2.06, -0.04],
    portalRotation: [0.12, 0.42, 0],
    orbitRotation: [1.18, 1.22, 0.2],
    accent: "#66313d",
    cameraZ: 8.7,
    scale: 0.9,
    spread: 1.46,
  },
  about: {
    rotation: [-0.28, 2.66, 0.18],
    portalRotation: [-0.2, -0.24, 0.12],
    orbitRotation: [0.76, 1.64, -0.22],
    accent: "#824133",
    cameraZ: 8.1,
    scale: 1.04,
    spread: 1.72,
  },
  contact: {
    rotation: [0.06, 3.32, -0.12],
    portalRotation: [0.04, 0.18, -0.08],
    orbitRotation: [1.28, 2.04, 0.26],
    accent: "#8c2032",
    cameraZ: 7.65,
    scale: 1.12,
    spread: 1.36,
  },
};

const foldedSegments = [
  { position: [-0.92, 0.68, 0.42], rotation: [0.18, 0.2, -0.78], scale: [1.6, 0.22, 0.42] },
  { position: [0.02, 1.03, 0.12], rotation: [-0.14, -0.32, 0.54], scale: [1.42, 0.22, 0.42] },
  { position: [0.84, 0.42, 0.4], rotation: [0.2, 0.24, -0.82], scale: [1.5, 0.22, 0.42] },
  { position: [0.72, -0.55, 0.08], rotation: [-0.2, -0.24, 0.68], scale: [1.54, 0.22, 0.42] },
  { position: [-0.14, -0.96, 0.38], rotation: [0.14, 0.3, -0.54], scale: [1.44, 0.22, 0.42] },
  { position: [-0.9, -0.38, 0.04], rotation: [-0.16, -0.26, 0.82], scale: [1.46, 0.22, 0.42] },
] as const;

const panelDetails = [
  { y: 0.72, z: -0.14, height: 0.58 },
  { y: 0, z: 0.08, height: 0.72 },
  { y: -0.78, z: -0.08, height: 0.48 },
] as const;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function dampAxis(
  target: THREE.Euler | THREE.Vector3,
  axis: "x" | "y" | "z",
  value: number,
  speed: number,
  delta: number,
) {
  const distance = Math.abs(target[axis] - value);
  target[axis] = damp(target[axis], value, speed, delta);
  return distance > 0.0005;
}

function StructuralFrame({
  width,
  height,
  depth,
  bar,
  material,
}: {
  width: number;
  height: number;
  depth: number;
  bar: number;
  material: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, height / 2 - bar / 2, 0]} material={material}>
        <boxGeometry args={[width, bar, depth]} />
      </mesh>
      <mesh position={[0, -height / 2 + bar / 2, 0]} material={material}>
        <boxGeometry args={[width, bar, depth]} />
      </mesh>
      <mesh position={[-width / 2 + bar / 2, 0, 0]} material={material}>
        <boxGeometry args={[bar, height - bar * 2, depth]} />
      </mesh>
      <mesh position={[width / 2 - bar / 2, 0, 0]} material={material}>
        <boxGeometry args={[bar, height - bar * 2, depth]} />
      </mesh>
    </group>
  );
}

function ArchitecturalCore({ scene }: { scene: ShowroomScene }) {
  const rootRef = useRef<THREE.Group>(null);
  const portalRef = useRef<THREE.Group>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const accentLightRef = useRef<THREE.PointLight>(null);
  const pointerRef = useRef<PointerSnapshot>(getPointerSnapshot());
  const visibleRef = useRef(true);
  const { invalidate } = useThree();
  const state = sceneStates[scene];

  const materials = useMemo(() => {
    const graphite = new THREE.MeshPhysicalMaterial({
      color: "#17191c",
      metalness: 0.72,
      roughness: 0.26,
      clearcoat: 0.5,
      clearcoatRoughness: 0.24,
    });
    const silver = new THREE.MeshPhysicalMaterial({
      color: "#b7b9b6",
      metalness: 0.84,
      roughness: 0.2,
      clearcoat: 0.62,
      clearcoatRoughness: 0.14,
    });
    const accent = new THREE.MeshPhysicalMaterial({
      color: sceneStates.home.accent,
      emissive: sceneStates.home.accent,
      emissiveIntensity: 0.1,
      metalness: 0.58,
      roughness: 0.24,
      clearcoat: 0.72,
      clearcoatRoughness: 0.12,
    });
    const smokedGlass = new THREE.MeshPhysicalMaterial({
      color: "#3c3537",
      metalness: 0.12,
      roughness: 0.16,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    return { accent, graphite, silver, smokedGlass };
  }, []);

  const accentTarget = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((material) => material.dispose());
    };
  }, [materials]);

  useEffect(() => {
    invalidate();
  }, [invalidate, scene]);

  useEffect(() => {
    return subscribeToPointer((snapshot) => {
      pointerRef.current = snapshot;
      if (visibleRef.current) invalidate();
    });
  }, [invalidate]);

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
      if (visibleRef.current) invalidate();
    };

    handleVisibility();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [invalidate]);

  useFrame(({ camera }, frameDelta) => {
    if (!visibleRef.current) return;

    const root = rootRef.current;
    const portal = portalRef.current;
    const orbit = orbitRef.current;
    const leftWing = leftWingRef.current;
    const rightWing = rightWingRef.current;
    const accentLight = accentLightRef.current;
    if (!root || !portal || !orbit || !leftWing || !rightWing || !accentLight) return;

    const delta = Math.min(Math.max(frameDelta, 1 / 120), 1 / 20);
    const pointer = pointerRef.current;
    const pointerX = pointer.active ? pointer.normalizedX : 0;
    const pointerY = pointer.active ? pointer.normalizedY : 0;
    let moving = false;

    moving =
      dampAxis(root.rotation, "x", state.rotation[0] + pointerY * 0.32, 6.8, delta) || moving;
    moving =
      dampAxis(root.rotation, "y", state.rotation[1] + pointerX * 0.52, 6.8, delta) || moving;
    moving =
      dampAxis(root.rotation, "z", state.rotation[2] - pointerX * 0.12, 6.8, delta) || moving;
    moving = dampAxis(root.position, "x", -pointerX * 0.34, 7.4, delta) || moving;
    moving = dampAxis(root.position, "y", pointerY * 0.2, 7.4, delta) || moving;

    const nextScale = damp(root.scale.x, state.scale, 5.8, delta);
    if (Math.abs(root.scale.x - state.scale) > 0.0005) moving = true;
    root.scale.setScalar(nextScale);

    moving =
      dampAxis(portal.rotation, "x", state.portalRotation[0] - pointerY * 0.2, 7.2, delta) ||
      moving;
    moving =
      dampAxis(portal.rotation, "y", state.portalRotation[1] + pointerX * 0.28, 7.2, delta) ||
      moving;
    moving = dampAxis(portal.rotation, "z", state.portalRotation[2], 7.2, delta) || moving;

    moving =
      dampAxis(orbit.rotation, "x", state.orbitRotation[0] + pointerY * 0.16, 5.4, delta) || moving;
    moving =
      dampAxis(orbit.rotation, "y", state.orbitRotation[1] - pointerX * 0.34, 5.4, delta) || moving;
    moving = dampAxis(orbit.rotation, "z", state.orbitRotation[2], 5.4, delta) || moving;

    moving =
      dampAxis(leftWing.position, "x", -state.spread - pointerX * 0.18, 5.6, delta) || moving;
    moving =
      dampAxis(rightWing.position, "x", state.spread - pointerX * 0.18, 5.6, delta) || moving;

    moving = dampAxis(camera.position, "x", pointerX * 1.05, 7.8, delta) || moving;
    moving = dampAxis(camera.position, "y", -pointerY * 0.68, 7.8, delta) || moving;
    moving = dampAxis(camera.position, "z", state.cameraZ, 5.4, delta) || moving;
    camera.lookAt(0, 0, 0);

    moving = dampAxis(accentLight.position, "x", pointerX * 3.4, 8.2, delta) || moving;
    moving = dampAxis(accentLight.position, "y", -pointerY * 2.2 + 1.4, 8.2, delta) || moving;

    accentTarget.set(state.accent);
    const accentDistance =
      Math.abs(materials.accent.color.r - accentTarget.r) +
      Math.abs(materials.accent.color.g - accentTarget.g) +
      Math.abs(materials.accent.color.b - accentTarget.b);
    if (accentDistance > 0.000001) moving = true;
    materials.accent.color.lerp(accentTarget, 1 - Math.exp(-4.8 * delta));
    materials.accent.emissive.copy(materials.accent.color);
    accentLight.color.copy(materials.accent.color);

    if (moving) invalidate();
  });

  return (
    <>
      <ambientLight intensity={0.72} />
      <hemisphereLight args={["#eee8dd", "#16090c", 1.18]} />
      <directionalLight color="#fff8ed" intensity={3.4} position={[4.5, 5.5, 6]} />
      <directionalLight color="#9aa8b5" intensity={1.8} position={[-4, -1.5, 3]} />
      <pointLight
        ref={accentLightRef}
        color={state.accent}
        distance={9}
        intensity={26}
        position={[0, 1.4, 3.2]}
      />

      <group ref={rootRef}>
        <group position={[0, 0, -0.42]}>
          <StructuralFrame
            width={3.25}
            height={3.25}
            depth={0.5}
            bar={0.23}
            material={materials.graphite}
          />
        </group>

        <group ref={portalRef} position={[0, 0, 0.24]}>
          <StructuralFrame
            width={2.28}
            height={2.78}
            depth={0.38}
            bar={0.12}
            material={materials.silver}
          />
          <mesh material={materials.smokedGlass} position={[0, 0, -0.21]}>
            <planeGeometry args={[2.02, 2.52]} />
          </mesh>
          <group>
            {foldedSegments.map((segment, index) => (
              <mesh
                key={index}
                material={index % 2 === 0 ? materials.accent : materials.silver}
                position={segment.position}
                rotation={segment.rotation}
                scale={segment.scale}
              >
                <boxGeometry args={[1, 1, 1]} />
              </mesh>
            ))}
          </group>
        </group>

        <group
          ref={leftWingRef}
          position={[-sceneStates.home.spread, 0, -0.15]}
          rotation={[0.08, 0.34, -0.06]}
        >
          {panelDetails.map((panel, index) => (
            <mesh
              key={index}
              material={index === 1 ? materials.accent : materials.graphite}
              position={[0, panel.y, panel.z]}
            >
              <boxGeometry args={[0.66, panel.height, 0.16]} />
            </mesh>
          ))}
        </group>

        <group
          ref={rightWingRef}
          position={[sceneStates.home.spread, 0, -0.15]}
          rotation={[-0.08, -0.34, 0.06]}
        >
          {panelDetails.map((panel, index) => (
            <mesh
              key={index}
              material={index === 1 ? materials.accent : materials.graphite}
              position={[0, panel.y, panel.z]}
            >
              <boxGeometry args={[0.66, panel.height, 0.16]} />
            </mesh>
          ))}
        </group>

        <mesh material={materials.graphite} position={[0, -1.78, -0.18]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[3.9, 0.18, 1.46]} />
        </mesh>
        <mesh material={materials.silver} position={[0, 1.78, -0.28]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[3.45, 0.08, 1.1]} />
        </mesh>

        <group ref={orbitRef}>
          <mesh material={materials.silver} rotation={[0, 0, 0.34]}>
            <torusGeometry args={[2.24, 0.025, 8, 96, Math.PI * 1.5]} />
          </mesh>
          <mesh material={materials.accent} rotation={[0.7, 0.34, -0.2]}>
            <torusGeometry args={[2.58, 0.018, 8, 96, Math.PI * 1.18]} />
          </mesh>
          <mesh material={materials.silver} position={[2.18, 0.3, 0.14]}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
          <mesh material={materials.accent} position={[-1.96, -0.92, 0.2]}>
            <sphereGeometry args={[0.11, 16, 16]} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export type ShowroomCanvasProps = Readonly<{
  scene: ShowroomScene;
  className?: string;
  onReady?: (ready: boolean) => void;
}>;

export function ShowroomCanvas({ scene, className, onReady }: ShowroomCanvasProps) {
  const onReadyRef = useRef(onReady);
  const contextCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    return () => {
      contextCleanupRef.current?.();
      contextCleanupRef.current = null;
      onReadyRef.current?.(false);
    };
  }, []);

  const handleCreated = useCallback(
    (state: Parameters<NonNullable<React.ComponentProps<typeof Canvas>["onCreated"]>>[0]) => {
      contextCleanupRef.current?.();

      state.gl.outputColorSpace = THREE.SRGBColorSpace;
      state.gl.toneMapping = THREE.ACESFilmicToneMapping;
      state.gl.toneMappingExposure = 0.96;

      const canvas = state.gl.domElement;
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        onReadyRef.current?.(false);
      };
      const handleContextRestored = () => {
        onReadyRef.current?.(true);
        state.invalidate();
      };

      canvas.addEventListener("webglcontextlost", handleContextLost);
      canvas.addEventListener("webglcontextrestored", handleContextRestored);
      contextCleanupRef.current = () => {
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      };

      onReadyRef.current?.(true);
      state.invalidate();
    },
    [],
  );

  return (
    <Canvas
      aria-hidden="true"
      camera={{ far: 30, fov: 32, near: 0.1, position: [0, 0, 8.2] }}
      className={className}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
        stencil: false,
      }}
      onCreated={handleCreated}
      resize={{ debounce: { resize: 0, scroll: 80 }, scroll: false }}
      style={{ pointerEvents: "none" }}
    >
      <ArchitecturalCore scene={scene} />
    </Canvas>
  );
}

export default ShowroomCanvas;
