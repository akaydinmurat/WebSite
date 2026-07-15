"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime } from "../experience-store";

const vertexShader = `
  varying vec2 vUv;
  varying float vFold;

  uniform vec2 uPointer;
  uniform float uAspect;
  uniform float uDisplacement;
  uniform float uPointerActive;
  uniform float uPointerSpeed;
  uniform float uRadius;
  uniform float uSurfaceStrength;

  void main() {
    vUv = uv;

    vec2 delta = uv - uPointer;
    vec2 aspectDelta = vec2(delta.x * uAspect, delta.y);
    float radiusSquared = max(uRadius * uRadius, 0.001);
    float influence =
      exp(-dot(aspectDelta, aspectDelta) / radiusSquared * 1.1) *
      uPointerActive *
      uSurfaceStrength;
    float speedResponse = 1.0 + min(uPointerSpeed, 2.5) * 0.1;

    vec3 transformed = position;
    transformed.z += influence * uDisplacement * speedResponse;
    transformed.x += delta.x * influence * 0.12;
    transformed.y += delta.y * influence * 0.08;

    vFold = influence;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vFold;

  uniform vec3 uBaseColor;
  uniform vec3 uPalette[5];
  uniform vec3 uProjectPalette[5];
  uniform vec2 uPointer;
  uniform float uAspect;
  uniform float uIntensity;
  uniform float uPointerActive;
  uniform float uRadius;
  uniform float uRefractionStrength;
  uniform float uSurfaceOpacity;
  uniform float uSurfaceStrength;
  uniform float uProjectMix;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  vec3 materialField(vec2 uv) {
    float middlePlane = smoothstep(0.43, 0.49, uv.x + uv.y * 0.08);
    float rightPlane = smoothstep(0.69, 0.75, uv.x - uv.y * 0.1);
    float clayStart = smoothstep(0.47, 0.52, uv.x + uv.y * 0.18);
    float clayEnd = 1.0 - smoothstep(0.64, 0.69, uv.x + uv.y * 0.18);
    float clayPlane = clayStart * clayEnd;
    float floorPlane =
      (1.0 - smoothstep(0.17, 0.42, uv.y + uv.x * 0.04)) *
      smoothstep(0.32, 0.52, uv.x);

    vec3 color = mix(uBaseColor, uPalette[0], middlePlane * 0.72);
    color = mix(color, uPalette[3], clayPlane * 0.88);
    color = mix(color, uPalette[2], rightPlane * 0.96);
    color = mix(color, uPalette[1], floorPlane * 0.82);

    float grain = hash21(floor(uv * vec2(420.0, 260.0)));
    color += (grain - 0.5) * 0.018;
    return color;
  }

  vec3 projectField(vec2 uv) {
    float wave = sin((uv.y * 1.28 + uv.x * 0.34) * 3.14159265) * 0.075;
    float coralPlane = smoothstep(0.16, 0.55, uv.x + wave);
    float pomegranateStart = smoothstep(0.34, 0.46, uv.x - uv.y * 0.17 + wave * 0.34);
    float pomegranateEnd =
      1.0 - smoothstep(0.61, 0.73, uv.x - uv.y * 0.17 + wave * 0.34);
    float pomegranateRibbon = pomegranateStart * pomegranateEnd;
    float sunPlane = smoothstep(0.59, 0.72, uv.x + uv.y * 0.16 - wave * 0.42);
    float celadonCut =
      (1.0 - smoothstep(0.22, 0.48, uv.y + uv.x * 0.08)) *
      smoothstep(0.54, 0.78, uv.x);

    vec3 color = uProjectPalette[3];
    color = mix(color, uProjectPalette[1], coralPlane * 0.86);
    color = mix(color, uProjectPalette[0], pomegranateRibbon * 0.94);
    color = mix(color, uProjectPalette[2], sunPlane * 0.96);
    color = mix(color, uProjectPalette[4], celadonCut * 0.3);

    float grain = hash21(floor(uv * vec2(460.0, 280.0)));
    color += (grain - 0.5) * 0.014;
    return color;
  }

  void main() {
    vec2 delta = vUv - uPointer;
    vec2 aspectDelta = vec2(delta.x * uAspect, delta.y);
    float pointerDistance = length(aspectDelta);
    float radiusSquared = max(uRadius * uRadius, 0.001);
    vec2 direction = aspectDelta / max(pointerDistance, 0.001);
    float influence =
      exp(-pointerDistance * pointerDistance / radiusSquared * 0.92) *
      uPointerActive *
      uSurfaceStrength;
    vec2 shear =
      vec2(direction.x / max(uAspect, 0.001), direction.y) *
      influence *
      uRefractionStrength;

    vec2 refractedUv = vUv + shear;
    vec3 surface = mix(materialField(refractedUv), projectField(refractedUv), uProjectMix);
    float lightFold = smoothstep(0.12, 0.9, influence + vFold * 0.7);
    float shadowFold = smoothstep(0.2, 0.95, influence) * max(0.0, direction.x * 0.5 - direction.y * 0.3);
    vec3 foldLight = mix(uPalette[4], uProjectPalette[3], uProjectMix);
    surface = mix(surface, foldLight, lightFold * 0.2 * uIntensity);
    surface *= 1.0 - shadowFold * 0.1;

    float vignette = 1.0 - smoothstep(0.34, 0.92, distance(vUv, vec2(0.5)));
    surface *= mix(0.9, 1.02, vignette);

    gl_FragColor = vec4(surface, uSurfaceOpacity * uSurfaceStrength);
  }
`;

export type MaterialLightSurfaceProps = Readonly<{
  visible?: boolean;
  z?: number;
}>;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

export function MaterialLightSurface({ visible = true, z = -8.55 }: MaterialLightSurfaceProps) {
  const fieldMeshRef = useRef<THREE.Mesh>(null);
  const pointerTargetRef = useRef(new THREE.Vector2(0.5, 0.5));
  const pointerNdcRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const { chamber, colors, pointerField } = experienceConfig;

  const palette = useMemo(
    () => [
      new THREE.Color(colors.violet),
      new THREE.Color(colors.blue),
      new THREE.Color(colors.magenta),
      new THREE.Color(colors.amber),
      new THREE.Color(colors.cyan),
    ],
    [colors.amber, colors.blue, colors.cyan, colors.magenta, colors.violet],
  );

  const projectPalette = useMemo(
    () => [
      new THREE.Color(colors.projectPomegranate),
      new THREE.Color(colors.projectCoral),
      new THREE.Color(colors.projectSun),
      new THREE.Color(colors.projectCream),
      new THREE.Color(colors.projectCeladon),
    ],
    [
      colors.projectCeladon,
      colors.projectCoral,
      colors.projectCream,
      colors.projectPomegranate,
      colors.projectSun,
    ],
  );

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthTest: true,
        depthWrite: false,
        fragmentShader,
        side: THREE.DoubleSide,
        toneMapped: true,
        transparent: true,
        uniforms: {
          uAspect: { value: 1 },
          uBaseColor: { value: new THREE.Color(colors.ivory) },
          uDisplacement: { value: pointerField.displacement },
          uIntensity: { value: pointerField.intensity },
          uPalette: { value: palette },
          uProjectPalette: { value: projectPalette },
          uProjectMix: { value: 0 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) },
          uPointerActive: { value: 0 },
          uPointerSpeed: { value: 0 },
          uRadius: { value: pointerField.radius },
          uRefractionStrength: { value: pointerField.refractionStrength },
          uSurfaceOpacity: { value: pointerField.surfaceOpacity },
          uSurfaceStrength: { value: 0 },
        },
        vertexShader,
      }),
    [
      colors.ivory,
      palette,
      projectPalette,
      pointerField.displacement,
      pointerField.intensity,
      pointerField.radius,
      pointerField.refractionStrength,
      pointerField.surfaceOpacity,
    ],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(chamber.radius * 1.94, chamber.height * 1.44, 48, 28),
    [chamber.height, chamber.radius],
  );
  const materialRuntimeRef = useRef(material);

  useEffect(() => {
    materialRuntimeRef.current = material;
  }, [material]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(({ camera, size }, frameDelta) => {
    const fieldMesh = fieldMeshRef.current;
    if (!fieldMesh || !visible) return;

    const runtime = getExperienceRuntime();
    const runtimeMaterial = materialRuntimeRef.current;
    const delta = Math.min(frameDelta, 1 / 20);

    if (runtime.reducedMotion) {
      fieldMesh.visible = false;
      return;
    }

    const projectSurfaceActive = runtime.phase === "works";
    const targetSurfaceStrength =
      (runtime.phase === "intro" || projectSurfaceActive) && runtime.pageVisible ? 1 : 0;
    runtimeMaterial.uniforms.uSurfaceStrength.value = damp(
      runtimeMaterial.uniforms.uSurfaceStrength.value,
      targetSurfaceStrength,
      targetSurfaceStrength > 0 ? 4.2 : 3.2,
      delta,
    );
    fieldMesh.visible =
      runtime.pageVisible &&
      (targetSurfaceStrength > 0 || runtimeMaterial.uniforms.uSurfaceStrength.value > 0.012);
    runtimeMaterial.uniforms.uAspect.value = size.width / Math.max(1, size.height);

    runtimeMaterial.uniforms.uProjectMix.value = damp(
      runtimeMaterial.uniforms.uProjectMix.value,
      projectSurfaceActive ? 1 : 0,
      5.4,
      delta,
    );
    runtimeMaterial.uniforms.uDisplacement.value = damp(
      runtimeMaterial.uniforms.uDisplacement.value,
      projectSurfaceActive ? pointerField.projectDisplacement : pointerField.displacement,
      5.2,
      delta,
    );
    runtimeMaterial.uniforms.uIntensity.value = damp(
      runtimeMaterial.uniforms.uIntensity.value,
      projectSurfaceActive ? pointerField.projectIntensity : pointerField.intensity,
      5.2,
      delta,
    );
    runtimeMaterial.uniforms.uRadius.value = damp(
      runtimeMaterial.uniforms.uRadius.value,
      projectSurfaceActive ? pointerField.projectRadius : pointerField.radius,
      5.2,
      delta,
    );
    runtimeMaterial.uniforms.uRefractionStrength.value = damp(
      runtimeMaterial.uniforms.uRefractionStrength.value,
      projectSurfaceActive
        ? pointerField.projectRefractionStrength
        : pointerField.refractionStrength,
      5.2,
      delta,
    );

    pointerNdcRef.current.set(runtime.pointer.x, runtime.pointer.y);
    raycasterRef.current.setFromCamera(pointerNdcRef.current, camera);
    const surfaceHit = raycasterRef.current.intersectObject(fieldMesh, false)[0];
    if (surfaceHit?.uv) {
      pointerTargetRef.current.copy(surfaceHit.uv);
    } else {
      pointerTargetRef.current.set(runtime.pointer.x * 0.5 + 0.5, runtime.pointer.y * 0.5 + 0.5);
    }
    runtimeMaterial.uniforms.uPointer.value.copy(pointerTargetRef.current);
    runtimeMaterial.uniforms.uPointerActive.value = damp(
      runtimeMaterial.uniforms.uPointerActive.value,
      runtime.pointer.active && runtime.pageVisible ? 1 : 0,
      4.8,
      delta,
    );
    runtimeMaterial.uniforms.uPointerSpeed.value = damp(
      runtimeMaterial.uniforms.uPointerSpeed.value,
      runtime.pointer.speed,
      5.4,
      delta,
    );
  });

  return (
    <group name="architectural-material-light-surface" visible={visible}>
      <mesh
        ref={fieldMeshRef}
        frustumCulled={false}
        geometry={geometry}
        material={material}
        position={[0, 0, z]}
        renderOrder={-20}
        visible={false}
      />
    </group>
  );
}
