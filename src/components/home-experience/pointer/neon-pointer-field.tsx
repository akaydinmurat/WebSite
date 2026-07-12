"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime, updateExperiencePointer } from "../experience-store";

const MAX_TRAIL_SAMPLES = 40;
const COLOR_COUNT = 5;
const trailSampleCount = THREE.MathUtils.clamp(
  experienceConfig.pointerField.sampleCount,
  24,
  MAX_TRAIL_SAMPLES,
);

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  #define MAX_TRAIL_SAMPLES 40
  #define COLOR_COUNT 5

  varying vec2 vUv;

  uniform sampler2D uTrailTexture;
  uniform vec3 uPalette[5];
  uniform int uActiveCount;
  uniform float uAspect;
  uniform float uIntensity;
  uniform float uNoiseStrength;
  uniform float uRadius;
  uniform float uRoomResponse;
  uniform float uTime;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float valueNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), local.x),
      mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  vec4 readTrail(int index) {
    float x = (float(index) + 0.5) / float(MAX_TRAIL_SAMPLES);
    return texture2D(uTrailTexture, vec2(x, 0.5));
  }

  vec3 trailColor(float colorIndex) {
    if (colorIndex < 0.5) return uPalette[0];
    if (colorIndex < 1.5) return uPalette[1];
    if (colorIndex < 2.5) return uPalette[2];
    if (colorIndex < 3.5) return uPalette[3];
    return uPalette[4];
  }

  float segmentDistance(vec2 point, vec2 from, vec2 to) {
    vec2 segment = to - from;
    float lengthSquared = max(dot(segment, segment), 0.000001);
    float progress = clamp(dot(point - from, segment) / lengthSquared, 0.0, 1.0);
    return length(point - (from + segment * progress));
  }

  void main() {
    float slowTime = uTime * 0.22;
    vec2 noisePoint = vUv * vec2(7.0, 5.0);
    vec2 distortion = vec2(
      valueNoise(noisePoint + vec2(slowTime, -slowTime * 0.7)),
      valueNoise(noisePoint + vec2(13.7 - slowTime * 0.6, 8.2 + slowTime))
    ) - 0.5;
    vec2 point = vUv + distortion * uNoiseStrength * 0.12;
    point.x *= uAspect;
    float fieldGrain = mix(
      0.86,
      1.12,
      valueNoise(vUv * vec2(96.0, 62.0) + slowTime)
    );

    vec3 accumulatedColor = vec3(0.0);
    float accumulatedEnergy = 0.0;
    vec4 previousData = vec4(0.0);

    for (int index = 0; index < MAX_TRAIL_SAMPLES; index += 1) {
      if (index >= uActiveCount) break;

      vec4 data = readTrail(index);
      vec2 samplePoint = data.rg;
      samplePoint.x *= uAspect;
      float age = data.b;
      float packedMotion = data.a * float(COLOR_COUNT);
      float colorIndex = floor(packedMotion + 0.001);
      float speed = fract(packedMotion) * 4.0;
      float persistence = pow(max(0.0, 1.0 - age), 2.15);
      float radius = uRadius * (0.84 + min(speed, 2.5) * 0.08);

      float pointDistance = length(point - samplePoint);
      float normalizedPointDistance = pointDistance / max(radius, 0.002);
      float pointFalloff = normalizedPointDistance * normalizedPointDistance;
      float glow = 1.0 / (1.0 + pointFalloff * pointFalloff * 2.4);
      float core = smoothstep(radius * 0.17, 0.0, pointDistance);
      float segmentGlow = 0.0;
      float segmentCore = 0.0;

      if (index > 0) {
        vec2 previousPoint = previousData.rg;
        previousPoint.x *= uAspect;
        float gap = length(samplePoint - previousPoint);
        float ageGap = abs(age - previousData.b);

        if (gap < 0.42 && ageGap < 0.25) {
          float distanceToSegment = segmentDistance(point, previousPoint, samplePoint);
          float continuity = smoothstep(0.42, 0.05, gap) * smoothstep(0.25, 0.0, ageGap);
          float normalizedSegmentDistance = distanceToSegment / max(radius * 0.72, 0.002);
          float segmentFalloff = normalizedSegmentDistance * normalizedSegmentDistance;
          segmentGlow = 1.0 / (1.0 + segmentFalloff * segmentFalloff * 2.1) * continuity;
          segmentCore = smoothstep(radius * 0.09, 0.0, distanceToSegment) * continuity;
        }
      }

      float grain = fieldGrain * mix(0.94, 1.06, hash21(vec2(float(index) * 0.73, 19.1)));
      float speedEnergy = 0.68 + min(speed, 3.0) * 0.16;
      float energy =
        (glow * 0.3 + core * 0.42 + segmentGlow * 0.38 + segmentCore * 0.3) *
        persistence *
        speedEnergy *
        grain;

      accumulatedColor += trailColor(colorIndex) * energy;
      accumulatedEnergy += energy;
      previousData = data;
    }

    float roomBloom = smoothstep(0.0, 1.4, accumulatedEnergy) * uRoomResponse;
    accumulatedColor += vec3(0.08, 0.075, 0.065) * roomBloom;
    accumulatedColor *= uIntensity;

    float alpha = clamp(accumulatedEnergy * 0.42 + roomBloom * 0.08, 0.0, 0.5);
    gl_FragColor = vec4(accumulatedColor, alpha);
  }
`;

export type NeonPointerFieldProps = Readonly<{
  visible?: boolean;
  z?: number;
}>;

function damp(current: number, target: number, speed: number, delta: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

export function NeonPointerField({ visible = true, z = -4.2 }: NeonPointerFieldProps) {
  const fieldMeshRef = useRef<THREE.Mesh>(null);
  const roomLightRef = useRef<THREE.PointLight>(null);
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

  const trailTexture = useMemo(() => {
    const data = new Uint8Array(MAX_TRAIL_SAMPLES * 4);
    for (let index = 0; index < MAX_TRAIL_SAMPLES; index += 1) {
      data[index * 4 + 2] = 255;
    }

    const trailTexture = new THREE.DataTexture(
      data,
      MAX_TRAIL_SAMPLES,
      1,
      THREE.RGBAFormat,
      THREE.UnsignedByteType,
    );
    trailTexture.colorSpace = THREE.NoColorSpace;
    trailTexture.generateMipmaps = false;
    trailTexture.magFilter = THREE.NearestFilter;
    trailTexture.minFilter = THREE.NearestFilter;
    trailTexture.needsUpdate = true;
    return trailTexture;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        blending: THREE.NormalBlending,
        depthTest: true,
        depthWrite: false,
        fragmentShader,
        side: THREE.DoubleSide,
        toneMapped: false,
        transparent: true,
        uniforms: {
          uActiveCount: { value: 0 },
          uAspect: { value: 1 },
          uIntensity: { value: pointerField.intensity },
          uNoiseStrength: { value: pointerField.noiseStrength },
          uPalette: { value: palette },
          uRadius: { value: pointerField.radius },
          uRoomResponse: { value: 0 },
          uTime: { value: 0 },
          uTrailTexture: { value: trailTexture },
        },
        vertexShader,
      }),
    [
      palette,
      pointerField.intensity,
      pointerField.noiseStrength,
      pointerField.radius,
      trailTexture,
    ],
  );

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(chamber.radius * 1.94, chamber.height * 1.44),
    [chamber.height, chamber.radius],
  );
  const materialRuntimeRef = useRef(material);
  const trailTextureRuntimeRef = useRef(trailTexture);

  useEffect(() => {
    materialRuntimeRef.current = material;
    trailTextureRuntimeRef.current = trailTexture;
  }, [material, trailTexture]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      trailTexture.dispose();
    };
  }, [geometry, material, trailTexture]);

  useFrame(({ clock, size }, frameDelta) => {
    const fieldMesh = fieldMeshRef.current;
    const light = roomLightRef.current;
    if (!fieldMesh || !light || !visible) return;

    const runtime = getExperienceRuntime();
    const runtimeMaterial = materialRuntimeRef.current;
    const runtimeTrailTexture = trailTextureRuntimeRef.current;
    const delta = Math.min(frameDelta, 1 / 20);
    const now = performance.now();

    if (runtime.reducedMotion) {
      fieldMesh.visible = false;
      light.intensity = 0;
      return;
    }
    const newestStoredSample = runtime.pointerTrail.at(-1);

    if (
      runtime.pointer.active &&
      (!newestStoredSample || now - newestStoredSample.createdAt > 96)
    ) {
      updateExperiencePointer(
        (runtime.pointer.x * 0.5 + 0.5) * size.width,
        (0.5 - runtime.pointer.y * 0.5) * size.height,
        size.width,
        size.height,
      );
    }

    const persistenceMilliseconds = pointerField.persistenceSeconds * 1000;
    const trail = runtime.pointerTrail;
    let firstRecentIndex = trail.length;

    for (let index = trail.length - 1; index >= 0; index -= 1) {
      if (now - trail[index].createdAt > persistenceMilliseconds) break;
      firstRecentIndex = index;
    }

    const availableSamples = trail.length - firstRecentIndex;
    const activeCount = Math.min(trailSampleCount, availableSamples);
    const sourceStart = trail.length - activeCount;
    fieldMesh.visible = activeCount > 0 && runtime.pageVisible;
    let diversifyCappedColors = activeCount >= COLOR_COUNT;
    const firstColorIndex = activeCount > 0 ? trail[sourceStart].colorIndex % COLOR_COUNT : 0;
    for (let index = 1; index < activeCount && diversifyCappedColors; index += 1) {
      diversifyCappedColors =
        trail[sourceStart + index].colorIndex % COLOR_COUNT === firstColorIndex;
    }
    const trailData = runtimeTrailTexture.image.data as Uint8Array;
    trailData.fill(0);

    for (let index = 0; index < MAX_TRAIL_SAMPLES; index += 1) {
      trailData[index * 4 + 2] = 255;
    }

    for (let index = 0; index < activeCount; index += 1) {
      const sample = trail[sourceStart + index];
      const offset = index * 4;
      const age = THREE.MathUtils.clamp((now - sample.createdAt) / persistenceMilliseconds, 0, 1);
      const speedFraction = Math.min(sample.speed / 4, 0.96);
      const colorIndex = diversifyCappedColors
        ? index % COLOR_COUNT
        : sample.colorIndex % COLOR_COUNT;
      const packedMotion = (colorIndex + speedFraction) / COLOR_COUNT;
      trailData[offset] = Math.round((sample.x * 0.5 + 0.5) * 255);
      trailData[offset + 1] = Math.round((sample.y * 0.5 + 0.5) * 255);
      trailData[offset + 2] = Math.round(age * 255);
      trailData[offset + 3] = Math.round(packedMotion * 255);
    }

    runtimeTrailTexture.needsUpdate = true;
    runtimeMaterial.uniforms.uActiveCount.value = activeCount;
    runtimeMaterial.uniforms.uAspect.value = size.width / Math.max(1, size.height);
    runtimeMaterial.uniforms.uTime.value = clock.elapsedTime;

    const newestSample = activeCount > 0 ? trail[trail.length - 1] : null;
    const newestAge = newestSample
      ? THREE.MathUtils.clamp((now - newestSample.createdAt) / persistenceMilliseconds, 0, 1)
      : 1;
    const historyStrength = 1 - newestAge;
    const roomResponseTarget = runtime.pageVisible ? historyStrength : 0;
    runtimeMaterial.uniforms.uRoomResponse.value = damp(
      runtimeMaterial.uniforms.uRoomResponse.value,
      roomResponseTarget,
      4.2,
      delta,
    );

    const pointerX = runtime.pointer.active ? runtime.pointer.x : (newestSample?.x ?? 0);
    const pointerY = runtime.pointer.active ? runtime.pointer.y : (newestSample?.y ?? 0);
    light.position.x = damp(light.position.x, pointerX * chamber.radius * 0.45, 7.2, delta);
    light.position.y = damp(light.position.y, pointerY * chamber.height * 0.38, 7.2, delta);
    light.position.z = z + 2.1;
    light.intensity = damp(
      light.intensity,
      runtime.pageVisible
        ? historyStrength * (0.1 + Math.min(runtime.pointer.speed, 2.5) * 0.055)
        : 0,
      5.4,
      delta,
    );

    if (newestSample) {
      const newestColorIndex = diversifyCappedColors
        ? (activeCount - 1) % COLOR_COUNT
        : newestSample.colorIndex % COLOR_COUNT;
      light.color.lerp(palette[newestColorIndex], 0.12);
    }
  });

  return (
    <group name="neon-pointer-field" visible={visible}>
      <mesh
        ref={fieldMeshRef}
        frustumCulled={false}
        geometry={geometry}
        material={material}
        position={[0, 0, z]}
        renderOrder={-20}
        visible={false}
      />
      <pointLight
        ref={roomLightRef}
        color={colors.cyan}
        decay={2}
        distance={7.5}
        intensity={0}
        position={[0, 0, z + 2.1]}
      />
    </group>
  );
}
