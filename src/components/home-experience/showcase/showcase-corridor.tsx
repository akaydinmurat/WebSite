"use client";

import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { processStages } from "@/content/process-stages";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime, subscribeExperience } from "../experience-store";
import { showcaseCorridorBounds, showcasePanelTransforms } from "./showcase-layout";
import { getShowcaseMotionState, SHOWCASE_MOTION_TIMING } from "./showcase-motion";

const PANEL_COUNT = processStages.length;
const PANEL_WIDTH = 3.62;
const PANEL_HEIGHT = 2.26;
const GALLERY_FRAME_DEPTHS = [1.4, -4.2, -9.8, -15.4, -21] as const;
const CEILING_LIGHT_DEPTHS = [-1.4, -6.9, -12.4, -17.9] as const;

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

function createBentPanelGeometry() {
  const geometry = new THREE.PlaneGeometry(PANEL_WIDTH, PANEL_HEIGHT, 36, 8);
  const positions = geometry.getAttribute("position");

  for (let index = 0; index < positions.count; index += 1) {
    const normalizedX = positions.getX(index) / (PANEL_WIDTH * 0.5);
    const edgeCurve = normalizedX * normalizedX;
    positions.setZ(index, -edgeCurve * 0.16);
  }

  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function getArchPoint(normalized: number) {
  const { floorY, halfWidth, roofHeight, springY } = showcaseCorridorBounds;
  const sideShare = 0.18;

  if (normalized < sideShare) {
    const progress = normalized / sideShare;
    return new THREE.Vector2(-halfWidth, THREE.MathUtils.lerp(floorY, springY, progress));
  }

  if (normalized > 1 - sideShare) {
    const progress = (normalized - (1 - sideShare)) / sideShare;
    return new THREE.Vector2(halfWidth, THREE.MathUtils.lerp(springY, floorY, progress));
  }

  const archProgress = (normalized - sideShare) / (1 - sideShare * 2);
  const angle = Math.PI - archProgress * Math.PI;
  return new THREE.Vector2(Math.cos(angle) * halfWidth, springY + Math.sin(angle) * roofHeight);
}

function createCorridorGridGeometry() {
  const { endZ, floorY, halfWidth, startZ } = showcaseCorridorBounds;
  const positions: number[] = [];
  const ribCount = 14;
  const archSegments = 28;

  const pushSegment = (from: THREE.Vector3, to: THREE.Vector3) => {
    positions.push(from.x, from.y, from.z, to.x, to.y, to.z);
  };

  for (let rib = 0; rib < ribCount; rib += 1) {
    const z = THREE.MathUtils.lerp(startZ, endZ, rib / (ribCount - 1));

    for (let segment = 0; segment < archSegments; segment += 1) {
      const from = getArchPoint(segment / archSegments);
      const to = getArchPoint((segment + 1) / archSegments);
      pushSegment(new THREE.Vector3(from.x, from.y, z), new THREE.Vector3(to.x, to.y, z));
    }

    pushSegment(new THREE.Vector3(-halfWidth, floorY, z), new THREE.Vector3(halfWidth, floorY, z));
  }

  const longitudinalSamples = 15;
  for (let sample = 0; sample < longitudinalSamples; sample += 1) {
    const point = getArchPoint(sample / (longitudinalSamples - 1));
    pushSegment(
      new THREE.Vector3(point.x, point.y, startZ),
      new THREE.Vector3(point.x, point.y, endZ),
    );
  }

  for (let line = 1; line < 8; line += 1) {
    const x = THREE.MathUtils.lerp(-halfWidth, halfWidth, line / 8);
    pushSegment(
      new THREE.Vector3(x, floorY + 0.006, startZ),
      new THREE.Vector3(x, floorY + 0.006, endZ),
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function createCorridorShellGeometry() {
  const { endZ, startZ } = showcaseCorridorBounds;
  const archSegments = 36;
  const depthSegments = 12;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let depth = 0; depth <= depthSegments; depth += 1) {
    const depthProgress = depth / depthSegments;
    const z = THREE.MathUtils.lerp(startZ, endZ, depthProgress);

    for (let arch = 0; arch <= archSegments; arch += 1) {
      const archProgress = arch / archSegments;
      const point = getArchPoint(archProgress);
      positions.push(point.x, point.y, z);
      uvs.push(archProgress, depthProgress);
    }
  }

  const rowSize = archSegments + 1;
  for (let depth = 0; depth < depthSegments; depth += 1) {
    for (let arch = 0; arch < archSegments; arch += 1) {
      const topLeft = depth * rowSize + arch;
      const bottomLeft = (depth + 1) * rowSize + arch;
      indices.push(topLeft, bottomLeft, topLeft + 1, bottomLeft, bottomLeft + 1, topLeft + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function getCorridorOpacityTarget() {
  const runtime = getExperienceRuntime();

  switch (runtime.phase) {
    case "showcase-transition":
      return smoothstep(runtime.phaseProgress);
    case "showcase":
      return 1;
    case "outro":
      return 0;
    default:
      return 0;
  }
}

export function ShowcaseCorridor() {
  const rootRef = useRef<THREE.Group>(null);
  const stageLightRef = useRef<THREE.PointLight>(null);
  const panelRefs = useRef<Array<THREE.Group | null>>([]);
  const opacityRef = useRef(0);
  const revealRefs = useRef<number[]>(Array(PANEL_COUNT).fill(0));
  const focusRefs = useRef<number[]>(Array(PANEL_COUNT).fill(0));
  const { gl, invalidate } = useThree();

  const imageUrls = useMemo(() => processStages.map((stage) => stage.visualSrc), []);
  const sourceTextures = useLoader(THREE.TextureLoader, imageUrls);
  const textures = useMemo(
    () => sourceTextures.map((texture) => texture.clone()),
    [sourceTextures],
  );

  const bentPanelGeometry = useMemo(() => createBentPanelGeometry(), []);
  const corridorGridGeometry = useMemo(() => createCorridorGridGeometry(), []);
  const corridorShellGeometry = useMemo(() => createCorridorShellGeometry(), []);

  const corridorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: experienceConfig.colors.processWall,
        metalness: 0.02,
        opacity: 0,
        roughness: 0.88,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    [],
  );
  const floorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: experienceConfig.colors.processFloor,
        depthWrite: true,
        metalness: 0.06,
        opacity: 0,
        roughness: 0.74,
        transparent: true,
      }),
    [],
  );
  const gridMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: experienceConfig.colors.river,
        depthWrite: false,
        opacity: 0,
        transparent: true,
      }),
    [],
  );
  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: experienceConfig.colors.river,
        depthWrite: true,
        metalness: 0.72,
        opacity: 0,
        roughness: 0.36,
        transparent: true,
      }),
    [],
  );
  const backingMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        clearcoat: 0.22,
        color: experienceConfig.colors.sunset,
        depthWrite: true,
        metalness: 0.3,
        opacity: 0,
        roughness: 0.42,
        transparent: true,
      }),
    [],
  );
  const lightRailMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: experienceConfig.colors.wind,
        emissive: experienceConfig.colors.fennelSoft,
        emissiveIntensity: 0.34,
        opacity: 0,
        roughness: 0.38,
        transparent: true,
      }),
    [],
  );
  const bayMaterials = useMemo(
    () =>
      [
        experienceConfig.colors.wind,
        experienceConfig.colors.sunset,
        experienceConfig.colors.fennelSoft,
        experienceConfig.colors.river,
        experienceConfig.colors.sandWhite,
      ].map(
        (color) =>
          new THREE.MeshPhysicalMaterial({
            clearcoat: 0.12,
            color,
            depthWrite: false,
            metalness: 0.04,
            opacity: 0,
            roughness: 0.78,
            side: THREE.DoubleSide,
            transparent: true,
          }),
      ),
    [],
  );
  const imageMaterials = useMemo(
    () =>
      textures.map(
        (texture) =>
          new THREE.MeshBasicMaterial({
            color: "#ffffff",
            depthTest: false,
            depthWrite: false,
            map: texture,
            opacity: 0,
            side: THREE.DoubleSide,
            toneMapped: false,
            transparent: true,
          }),
      ),
    [textures],
  );
  const materialsRef = useRef({
    backing: backingMaterial,
    corridor: corridorMaterial,
    floor: floorMaterial,
    frame: frameMaterial,
    grid: gridMaterial,
    images: imageMaterials,
    lightRail: lightRailMaterial,
    bays: bayMaterials,
  });

  useEffect(() => {
    materialsRef.current = {
      backing: backingMaterial,
      corridor: corridorMaterial,
      floor: floorMaterial,
      frame: frameMaterial,
      grid: gridMaterial,
      images: imageMaterials,
      lightRail: lightRailMaterial,
      bays: bayMaterials,
    };
  }, [
    backingMaterial,
    bayMaterials,
    corridorMaterial,
    floorMaterial,
    frameMaterial,
    gridMaterial,
    imageMaterials,
    lightRailMaterial,
  ]);

  useEffect(() => {
    const anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = anisotropy;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);

      const image = texture.image as { width?: number; height?: number } | undefined;
      const imageAspect = (image?.width ?? 1) / Math.max(1, image?.height ?? 1);
      const panelAspect = PANEL_WIDTH / PANEL_HEIGHT;
      if (imageAspect > panelAspect) {
        texture.repeat.x = panelAspect / imageAspect;
        texture.offset.x = (1 - texture.repeat.x) * 0.5;
      } else if (imageAspect < panelAspect) {
        texture.repeat.y = imageAspect / panelAspect;
        texture.offset.y = (1 - texture.repeat.y) * 0.5;
      }
      texture.needsUpdate = true;
    });

    invalidate();
  }, [gl, invalidate, textures]);

  useEffect(() => {
    const unsubscribe = subscribeExperience(invalidate);
    return () => {
      unsubscribe();
    };
  }, [invalidate]);

  useEffect(() => {
    return () => {
      bentPanelGeometry.dispose();
      corridorGridGeometry.dispose();
      corridorShellGeometry.dispose();
      backingMaterial.dispose();
      corridorMaterial.dispose();
      floorMaterial.dispose();
      gridMaterial.dispose();
      frameMaterial.dispose();
      lightRailMaterial.dispose();
      bayMaterials.forEach((material) => material.dispose());
      imageMaterials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
    };
  }, [
    backingMaterial,
    bayMaterials,
    bentPanelGeometry,
    corridorGridGeometry,
    corridorMaterial,
    corridorShellGeometry,
    floorMaterial,
    frameMaterial,
    gridMaterial,
    imageMaterials,
    lightRailMaterial,
    textures,
  ]);

  const motionScratch = useMemo(
    () => ({
      anchorDirection: new THREE.Vector3(),
      anchorPoint: new THREE.Vector3(),
      baseEuler: new THREE.Euler(),
      basePosition: new THREE.Vector3(),
      baseQuaternion: new THREE.Quaternion(),
      focusPosition: new THREE.Vector3(),
      focusQuaternion: new THREE.Quaternion(),
      targetPosition: new THREE.Vector3(),
      targetQuaternion: new THREE.Quaternion(),
    }),
    [],
  );
  const stageAccentColors = useMemo(
    () =>
      [
        experienceConfig.colors.sunset,
        experienceConfig.colors.river,
        experienceConfig.colors.fennelDeep,
        experienceConfig.colors.wind,
        experienceConfig.colors.sunset,
      ].map((color) => new THREE.Color(color)),
    [],
  );

  useFrame(({ camera, size }, frameDelta) => {
    const runtime = getExperienceRuntime();
    const root = rootRef.current;
    const stageLight = stageLightRef.current;
    if (!root || !stageLight || !runtime.pageVisible) return;

    const delta = Math.min(Math.max(frameDelta, 1 / 120), 1 / 20);
    const opacityTarget = getCorridorOpacityTarget();
    const previousOpacity = opacityRef.current;
    opacityRef.current = runtime.reducedMotion
      ? opacityTarget
      : damp(previousOpacity, opacityTarget, 6.5, delta);

    const opacity = opacityRef.current;
    root.visible = opacity > 0.002;
    const materials = materialsRef.current;
    materials.corridor.opacity = opacity * 0.96;
    materials.floor.opacity = opacity * 0.98;
    materials.grid.opacity = opacity * 0.22;
    materials.frame.opacity = opacity * 0.88;
    materials.backing.opacity = opacity * 0.34;
    materials.lightRail.opacity = opacity * 0.86;

    let moving = Math.abs(previousOpacity - opacityTarget) > 0.001;
    const motion = getShowcaseMotionState(runtime.showcaseProgress, PANEL_COUNT);
    const scratch = motionScratch;
    const screenX = size.width < 768 ? 0.5 : size.width < 1024 ? 0.61 : 0.68;
    const screenY = size.width < 768 ? 0.41 : 0.52;
    const focusDistance = size.width < 768 ? 4.1 : size.width < 1024 ? 5.2 : 5.75;
    scratch.anchorPoint.set(screenX * 2 - 1, 1 - screenY * 2, 0.18).unproject(camera);
    scratch.anchorDirection.copy(scratch.anchorPoint).sub(camera.position).normalize();
    scratch.focusPosition
      .copy(camera.position)
      .addScaledVector(scratch.anchorDirection, focusDistance);

    const activePanelMotion = motion.panels[motion.activeStageIndex];
    const activeFocus = activePanelMotion?.focusWeight ?? 0;
    stageLight.position.copy(scratch.focusPosition);
    stageLight.position.y += 0.75;
    stageLight.position.z += 0.65;
    stageLight.color.lerp(
      stageAccentColors[motion.activeStageIndex] ?? stageAccentColors[0]!,
      0.08,
    );
    stageLight.intensity = damp(
      stageLight.intensity,
      opacity * (0.34 + activeFocus * 0.46),
      4.8,
      delta,
    );
    materials.bays.forEach((material, index) => {
      material.opacity = opacity * (index === motion.activeStageIndex ? 0.82 : 0.42);
    });

    materials.images.forEach((material, index) => {
      const panel = panelRefs.current[index];
      if (!panel) return;

      const panelMotion = motion.panels[index];
      if (!panelMotion) return;

      const revealTarget = panelMotion.visibility;
      const previousReveal = revealRefs.current[index] ?? 0;
      const reveal = runtime.reducedMotion
        ? revealTarget
        : damp(previousReveal, revealTarget, 7.4, delta);
      revealRefs.current[index] = reveal;
      const isActive = index === motion.activeStageIndex;
      const rawFocusTarget = isActive
        ? Math.max(0.78, panelMotion.focusWeight)
        : Math.min(0.16, panelMotion.focusWeight * 0.16);
      const previousFocus = focusRefs.current[index] ?? 0;
      const focus = runtime.reducedMotion
        ? rawFocusTarget
        : damp(previousFocus, rawFocusTarget, 7.8, delta);
      focusRefs.current[index] = focus;

      const transform = showcasePanelTransforms[index];
      if (!transform) return;

      const horizontalScale = size.width < 768 ? 0.58 : size.width < 1024 ? 0.82 : 1;
      const enterOffset =
        panelMotion.phase === "before" || panelMotion.phase === "enter"
          ? 1 - smoothstep(panelMotion.localProgress / SHOWCASE_MOTION_TIMING.focusStart)
          : 0;
      const exitOffset =
        panelMotion.phase === "exit" || panelMotion.phase === "after"
          ? smoothstep(
              (panelMotion.localProgress - SHOWCASE_MOTION_TIMING.focusEnd) /
                (1 - SHOWCASE_MOTION_TIMING.focusEnd),
            )
          : 0;
      const sideDirection = transform.position[0] >= 0 ? 1 : -1;
      scratch.basePosition.set(
        transform.position[0] * horizontalScale +
          sideDirection * enterOffset * 0.52 -
          exitOffset * 0.38,
        transform.position[1] + enterOffset * 0.24 - exitOffset * 0.16,
        transform.position[2] - (enterOffset + exitOffset) * 0.72,
      );
      scratch.targetPosition.copy(scratch.basePosition).lerp(scratch.focusPosition, focus);

      scratch.baseEuler.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
      scratch.baseQuaternion.setFromEuler(scratch.baseEuler);
      scratch.focusQuaternion.copy(camera.quaternion);
      scratch.targetQuaternion.copy(scratch.baseQuaternion).slerp(scratch.focusQuaternion, focus);

      const transformAlpha = runtime.reducedMotion ? 1 : 1 - Math.exp(-7.2 * delta);
      panel.position.lerp(scratch.targetPosition, transformAlpha);
      panel.quaternion.slerp(scratch.targetQuaternion, transformAlpha);

      const responsiveScale = size.width < 768 ? 0.72 : size.width < 1024 ? 0.86 : 1;
      const targetScale =
        (0.62 + reveal * 0.2 + focus * 0.18) * responsiveScale * (isActive ? 1.15 : 0.9);
      const nextScale = damp(panel.scale.x, targetScale, 7.4, delta);
      panel.scale.setScalar(nextScale);

      const stageDistance = Math.abs(motion.stageSpaceProgress - index);
      const ambientVisibility = THREE.MathUtils.clamp(0.2 - stageDistance * 0.035, 0.08, 0.2);
      const hierarchyVisibility = isActive
        ? Math.max(0.74, reveal)
        : Math.max(ambientVisibility, reveal * 0.68);
      material.opacity = opacity * hierarchyVisibility;
      material.color.setScalar(0.9 + reveal * 0.04 + focus * 0.06);
      panel.visible = isActive || (reveal > 0.72 && stageDistance < 0.7);
      moving =
        moving ||
        Math.abs(previousReveal - revealTarget) > 0.001 ||
        Math.abs(previousFocus - rawFocusTarget) > 0.001;
    });

    if (moving) invalidate();
  });

  const { endZ, floorY, halfWidth, startZ } = showcaseCorridorBounds;
  const corridorDepth = startZ - endZ;

  return (
    <group ref={rootRef} visible={false}>
      <ambientLight color={experienceConfig.colors.sandWhite} intensity={0.9} />
      <hemisphereLight
        args={[experienceConfig.colors.wind, experienceConfig.colors.fennelDeep, 1.24]}
      />
      <directionalLight
        castShadow
        color={experienceConfig.colors.sandWhite}
        intensity={1.92}
        position={[3.8, 6.2, 4.8]}
        shadow-bias={-0.00015}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <directionalLight
        color={experienceConfig.colors.sunset}
        intensity={0.48}
        position={[-4.5, 2.4, -8]}
      />
      <pointLight
        ref={stageLightRef}
        color={experienceConfig.colors.sunset}
        decay={2}
        distance={7.5}
        intensity={0}
      />

      <mesh receiveShadow geometry={corridorShellGeometry} material={corridorMaterial} />
      <mesh
        receiveShadow
        material={floorMaterial}
        position={[0, floorY, (startZ + endZ) * 0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[halfWidth * 2, corridorDepth]} />
      </mesh>
      <lineSegments geometry={corridorGridGeometry} material={gridMaterial} />

      <mesh receiveShadow material={corridorMaterial} position={[0, 0.2, endZ - 0.08]}>
        <planeGeometry args={[halfWidth * 2, 7.5]} />
      </mesh>

      {GALLERY_FRAME_DEPTHS.map((z, index) => (
        <group key={`color-bay-${z}`} name="chromatic-material-bay">
          <mesh
            material={bayMaterials[index]!}
            position={[-halfWidth + 0.035, 0.45, z - 2.4]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[4.65, 5.65]} />
          </mesh>
          <mesh
            material={bayMaterials[(index + 2) % bayMaterials.length]!}
            position={[halfWidth - 0.035, 0.45, z - 2.4]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[4.65, 5.65]} />
          </mesh>
        </group>
      ))}

      {GALLERY_FRAME_DEPTHS.map((z) => (
        <group key={z} name="gallery-architectural-frame">
          <mesh castShadow material={frameMaterial} position={[-halfWidth + 0.12, 0.5, z]}>
            <boxGeometry args={[0.075, 6.15, 0.12]} />
          </mesh>
          <mesh castShadow material={frameMaterial} position={[halfWidth - 0.12, 0.5, z]}>
            <boxGeometry args={[0.075, 6.15, 0.12]} />
          </mesh>
          <mesh castShadow material={frameMaterial} position={[0, 3.54, z]}>
            <boxGeometry args={[halfWidth * 1.94, 0.075, 0.12]} />
          </mesh>
        </group>
      ))}

      {CEILING_LIGHT_DEPTHS.map((z) => (
        <mesh key={z} material={lightRailMaterial} position={[0, 3.38, z]}>
          <boxGeometry args={[4.8, 0.035, 1.2]} />
        </mesh>
      ))}

      {processStages.map((stage, index) => {
        const transform = showcasePanelTransforms[index];
        const material = imageMaterials[index];
        if (!transform || !material) return null;

        return (
          <group
            key={stage.label}
            ref={(node) => {
              panelRefs.current[index] = node;
            }}
            position={transform.position}
            rotation={transform.rotation}
          >
            <mesh castShadow receiveShadow material={backingMaterial} position={[0, 0, -0.09]}>
              <boxGeometry args={[PANEL_WIDTH + 0.16, PANEL_HEIGHT + 0.16, 0.12]} />
            </mesh>
            <mesh castShadow geometry={bentPanelGeometry} material={material} renderOrder={2} />
            <mesh
              castShadow
              material={frameMaterial}
              position={[0, PANEL_HEIGHT * 0.5 + 0.028, 0.035]}
            >
              <boxGeometry args={[PANEL_WIDTH + 0.1, 0.055, 0.09]} />
            </mesh>
            <mesh
              castShadow
              material={frameMaterial}
              position={[0, -PANEL_HEIGHT * 0.5 - 0.028, 0.035]}
            >
              <boxGeometry args={[PANEL_WIDTH + 0.1, 0.055, 0.09]} />
            </mesh>
            <mesh
              castShadow
              material={frameMaterial}
              position={[-PANEL_WIDTH * 0.5 - 0.028, 0, 0.035]}
            >
              <boxGeometry args={[0.055, PANEL_HEIGHT, 0.09]} />
            </mesh>
            <mesh
              castShadow
              material={frameMaterial}
              position={[PANEL_WIDTH * 0.5 + 0.028, 0, 0.035]}
            >
              <boxGeometry args={[0.055, PANEL_HEIGHT, 0.09]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
