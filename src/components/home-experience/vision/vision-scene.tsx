"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { getExperienceRuntime, subscribeExperience } from "../experience-store";

const ribbonVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform float uReveal;

  attribute vec3 aRibbonOffset;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;

    float expansion = mix(0.035, 1.0, smoothstep(0.08, 0.72, uReveal));
    vec3 expandedPosition = position - aRibbonOffset * (1.0 - expansion);
    float breathing = sin(uv.x * 15.0 + uTime * 0.72) * 0.025;
    float crossWave = sin(uv.y * 6.28318 - uTime * 0.42) * 0.012;
    vec3 displaced = expandedPosition + normal * (breathing + crossWave) * uMotion;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);

    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const ribbonFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform float uReveal;
  uniform float uTime;
  uniform float uMotion;

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  vec3 spectrum(float phase) {
    return 0.56 + 0.44 * cos(6.28318 * (phase + vec3(0.0, 0.32, 0.66)));
  }

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(normalize(vWorldNormal), viewDirection)), 2.25);
    float flowingPhase = vUv.x * 0.62 + vUv.y * 0.16 + uTime * 0.018 * uMotion;
    vec3 iridescence = spectrum(flowingPhase + fresnel * 0.24);
    vec3 warmBase = mix(vec3(0.91, 0.69, 0.46), vec3(0.72, 0.79, 0.92), vUv.y);
    vec3 color = mix(warmBase, iridescence, 0.58 + fresnel * 0.32);
    color += vec3(1.0, 0.86, 0.65) * fresnel * 0.22;

    float unevenEdge = vUv.x + sin(vUv.y * 11.0 + uTime * 0.25 * uMotion) * 0.026;
    float revealMask = 1.0 - smoothstep(uReveal - 0.065, uReveal + 0.065, unevenEdge);
    float taperedEnds = smoothstep(0.0, 0.045, vUv.x) * (1.0 - smoothstep(0.955, 1.0, vUv.x));
    float alpha = uOpacity * revealMask * taperedEnds * (0.72 + fresnel * 0.28);

    if (alpha < 0.003) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

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

function createRibbonGeometry() {
  const lengthSegments = 96;
  const widthSegments = 8;
  const width = 1.25;
  const positions: number[] = [];
  const ribbonOffsets: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let segment = 0; segment <= lengthSegments; segment += 1) {
    const progress = segment / lengthSegments;
    const x = (progress - 0.5) * 8.6;
    const centerY = Math.sin((progress - 0.08) * Math.PI * 1.64) * 0.48 + 0.18;
    const centerZ = Math.cos(progress * Math.PI * 2.05) * 0.38 - 0.2;
    const twist = progress * Math.PI * 1.36 - 0.44;
    const localWidth = width * (0.82 + Math.sin(progress * Math.PI) * 0.18);

    for (let row = 0; row <= widthSegments; row += 1) {
      const across = row / widthSegments;
      const offset = (across - 0.5) * localWidth;
      const offsetY = Math.cos(twist) * offset;
      const offsetZ = Math.sin(twist) * offset;
      positions.push(x, centerY + offsetY, centerZ + offsetZ);
      ribbonOffsets.push(0, offsetY, offsetZ);
      uvs.push(progress, across);
    }
  }

  const rowSize = widthSegments + 1;
  for (let segment = 0; segment < lengthSegments; segment += 1) {
    for (let row = 0; row < widthSegments; row += 1) {
      const topLeft = segment * rowSize + row;
      const bottomLeft = (segment + 1) * rowSize + row;
      indices.push(topLeft, bottomLeft, topLeft + 1, bottomLeft, bottomLeft + 1, topLeft + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aRibbonOffset", new THREE.Float32BufferAttribute(ribbonOffsets, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createUnitEdgesGeometry() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(box, 30);
  box.dispose();
  return edges;
}

function createFloorGridGeometry() {
  const positions: number[] = [];
  const width = 12;
  const depthStart = 2.4;
  const depthEnd = -6.8;
  const divisions = 14;

  for (let line = 0; line <= divisions; line += 1) {
    const progress = line / divisions;
    const x = THREE.MathUtils.lerp(-width * 0.5, width * 0.5, progress);
    const z = THREE.MathUtils.lerp(depthStart, depthEnd, progress);
    positions.push(x, -2.18, depthStart, x, -2.18, depthEnd);
    positions.push(-width * 0.5, -2.18, z, width * 0.5, -2.18, z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function getVisionTargets() {
  const runtime = getExperienceRuntime();
  const trackReveal = smoothstep(runtime.visionProgress);

  switch (runtime.phase) {
    case "vision-transition": {
      const transition = smoothstep(runtime.phaseProgress);
      return {
        opacity: transition,
        reveal: Math.max(transition, trackReveal),
      };
    }
    case "vision":
      return { opacity: 1, reveal: Math.max(0.72, trackReveal) };
    case "showcase-transition":
      return {
        opacity: 1 - smoothstep(runtime.phaseProgress),
        reveal: 1,
      };
    default:
      return { opacity: 0, reveal: trackReveal };
  }
}

export function VisionScene() {
  const rootRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(0);
  const revealRef = useRef(0);
  const elapsedRef = useRef(0);
  const { invalidate } = useThree();

  const ribbonGeometry = useMemo(() => createRibbonGeometry(), []);
  const unitEdgesGeometry = useMemo(() => createUnitEdgesGeometry(), []);
  const floorGridGeometry = useMemo(() => createFloorGridGeometry(), []);

  const warmLineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#e6b879",
        depthWrite: false,
        opacity: 0,
        transparent: true,
      }),
    [],
  );
  const lightLineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#fff8e8",
        depthWrite: false,
        opacity: 0,
        transparent: true,
      }),
    [],
  );
  const gridMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#b69f7e",
        depthWrite: false,
        opacity: 0,
        transparent: true,
      }),
    [],
  );
  const surfaceMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#fff8e8",
        depthWrite: false,
        opacity: 0,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [],
  );
  const ribbonMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        fragmentShader: ribbonFragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: {
          uMotion: { value: 1 },
          uOpacity: { value: 0 },
          uReveal: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: ribbonVertexShader,
      }),
    [],
  );
  const materialsRef = useRef({
    grid: gridMaterial,
    lightLine: lightLineMaterial,
    ribbon: ribbonMaterial,
    surface: surfaceMaterial,
    warmLine: warmLineMaterial,
  });

  useEffect(() => {
    const unsubscribe = subscribeExperience(invalidate);
    return () => {
      unsubscribe();
    };
  }, [invalidate]);

  useEffect(() => {
    return () => {
      ribbonGeometry.dispose();
      unitEdgesGeometry.dispose();
      floorGridGeometry.dispose();
      warmLineMaterial.dispose();
      lightLineMaterial.dispose();
      gridMaterial.dispose();
      surfaceMaterial.dispose();
      ribbonMaterial.dispose();
    };
  }, [
    floorGridGeometry,
    gridMaterial,
    lightLineMaterial,
    ribbonGeometry,
    ribbonMaterial,
    surfaceMaterial,
    unitEdgesGeometry,
    warmLineMaterial,
  ]);

  useFrame((_, frameDelta) => {
    const runtime = getExperienceRuntime();
    const root = rootRef.current;
    if (!root || !runtime.pageVisible) return;

    const delta = Math.min(Math.max(frameDelta, 1 / 120), 1 / 20);
    const targets = getVisionTargets();
    const previousOpacity = opacityRef.current;
    const previousReveal = revealRef.current;

    opacityRef.current = runtime.reducedMotion
      ? targets.opacity
      : damp(previousOpacity, targets.opacity, 7, delta);
    revealRef.current = runtime.reducedMotion
      ? targets.reveal
      : damp(previousReveal, targets.reveal, 5.8, delta);

    const opacity = opacityRef.current;
    const reveal = revealRef.current;
    root.visible = opacity > 0.002;
    root.position.z = runtime.reducedMotion
      ? -0.28
      : damp(root.position.z, THREE.MathUtils.lerp(0.16, -0.28, reveal), 5.2, delta);

    const materials = materialsRef.current;
    materials.warmLine.opacity = opacity * (0.33 + reveal * 0.3);
    materials.lightLine.opacity = opacity * (0.46 + reveal * 0.36);
    materials.grid.opacity = opacity * 0.24;
    materials.surface.opacity = opacity * 0.052;

    if (!runtime.reducedMotion && opacity > 0.002) elapsedRef.current += delta;
    materials.ribbon.uniforms.uTime.value = elapsedRef.current;
    materials.ribbon.uniforms.uMotion.value = runtime.reducedMotion ? 0 : 1;
    materials.ribbon.uniforms.uOpacity.value = opacity * 0.94;
    materials.ribbon.uniforms.uReveal.value = reveal * 1.08;

    const moving =
      Math.abs(previousOpacity - targets.opacity) > 0.001 ||
      Math.abs(previousReveal - targets.reveal) > 0.001;
    if (moving || (!runtime.reducedMotion && opacity > 0.002)) invalidate();
  });

  return (
    <group ref={rootRef} visible={false}>
      <mesh material={surfaceMaterial} position={[0, 0.15, -3.25]}>
        <planeGeometry args={[11.5, 6.7]} />
      </mesh>

      <lineSegments
        geometry={unitEdgesGeometry}
        material={warmLineMaterial}
        position={[0, 0.12, -2.95]}
        scale={[9.6, 5.35, 0.14]}
      />
      <lineSegments
        geometry={unitEdgesGeometry}
        material={lightLineMaterial}
        position={[0, 0.08, -1.75]}
        scale={[7.25, 4.55, 0.1]}
      />
      <lineSegments
        geometry={unitEdgesGeometry}
        material={warmLineMaterial}
        position={[-3.84, -0.4, -0.7]}
        rotation={[0, 0.14, 0]}
        scale={[1.35, 3.55, 1.1]}
      />
      <lineSegments
        geometry={unitEdgesGeometry}
        material={warmLineMaterial}
        position={[3.84, -0.18, -1.12]}
        rotation={[0, -0.14, 0]}
        scale={[1.35, 3.95, 1.1]}
      />
      <lineSegments
        geometry={unitEdgesGeometry}
        material={lightLineMaterial}
        position={[0, 2.28, -1.15]}
        rotation={[0.04, 0, 0]}
        scale={[6.3, 0.11, 2.05]}
      />
      <lineSegments geometry={floorGridGeometry} material={gridMaterial} />

      <mesh geometry={ribbonGeometry} material={ribbonMaterial} position={[0, 0.05, -0.18]} />
    </group>
  );
}
