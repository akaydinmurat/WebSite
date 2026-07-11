"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { useFinePointer } from "@/hooks/use-pointer-capability";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const vertexShader = `
  varying vec2 vUv;
  uniform vec2 uPointer;

  void main() {
    vUv = uv;
    vec3 displaced = position;
    float distanceToPointer = distance(uv, uPointer);
    displaced.z += smoothstep(0.5, 0.0, distanceToPointer) * 0.025;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform vec2 uPointer;

  float noise(vec2 point) {
    return fract(sin(dot(point, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float distanceToPointer = distance(vUv, uPointer);
    float reveal = smoothstep(0.42, 0.08, distanceToPointer);
    float grain = (noise(vUv * 720.0) - 0.5) * 0.035;
    vec3 muted = vec3(0.19, 0.18, 0.165);
    vec3 warm = mix(vec3(0.40, 0.31, 0.24), vec3(0.86, 0.66, 0.44), vUv.y);
    float vignette = smoothstep(0.82, 0.22, distance(vUv, vec2(0.5)));
    vec3 color = mix(muted, warm, reveal) + grain;
    color *= mix(0.72, 1.0, vignette);
    float alpha = reveal * 0.25;
    gl_FragColor = vec4(color, alpha);
  }
`;

function RevealPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useMemo(() => new THREE.Vector2(0.72, 0.42), []);
  const { invalidate } = useThree();

  useFrame(() => {
    materialRef.current?.uniforms.uPointer?.value.copy(pointer);
  });

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) invalidate();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [invalidate]);

  return (
    <mesh
      onPointerMove={(event) => {
        pointer.set(event.uv?.x ?? 0.5, event.uv?.y ?? 0.5);
        invalidate();
      }}
      scale={[2, 2, 1]}
    >
      <planeGeometry args={[1, 1, 48, 48]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uPointer: { value: pointer } }}
      />
    </mesh>
  );
}

export function WebGLHero() {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl")));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!supported || !finePointer || reducedMotion) return null;

  return (
    <div className="pointer-events-auto absolute inset-0 z-[2]" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 2], zoom: 1 }}
        dpr={[1, 1.5]}
        frameloop="demand"
        gl={{ alpha: true, antialias: false }}
      >
        <RevealPlane />
      </Canvas>
    </div>
  );
}
