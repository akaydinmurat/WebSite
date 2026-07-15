"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Edges, useTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import type { Project } from "@/types";

import { experienceConfig } from "../experience-config";
import { finishOrbitDrag, getExperienceRuntime, getExperienceSnapshot } from "../experience-store";
import {
  damp,
  getCardOrientationOffsets,
  getDepthOpacity,
  getFocusWeight,
  getFrontness,
  getOrbitPhase,
  smoothstep,
} from "./orbit-math";

const POINTER_CLICK_THRESHOLD = 8;
const MIN_INTERACTIVE_FRONTNESS = 0.48;
const MAX_OPEN_TRAVEL = 0.68;

const orbitAccentColors = [
  experienceConfig.colors.blue,
  experienceConfig.colors.magenta,
  experienceConfig.colors.amber,
  experienceConfig.colors.cyan,
  experienceConfig.colors.violet,
] as const;

type PointerPress = {
  pointerId: number;
  lastX: number;
  lastY: number;
  totalDistance: number;
};

type PointerCaptureControls = {
  setPointerCapture: (pointerId: number) => void;
  hasPointerCapture: (pointerId: number) => boolean;
  releasePointerCapture: (pointerId: number) => void;
};

function hasPointerCaptureControls(target: unknown): target is PointerCaptureControls {
  return (
    target !== null &&
    typeof target === "object" &&
    "setPointerCapture" in target &&
    typeof target.setPointerCapture === "function" &&
    "hasPointerCapture" in target &&
    typeof target.hasPointerCapture === "function" &&
    "releasePointerCapture" in target &&
    typeof target.releasePointerCapture === "function"
  );
}

type SharedProjectCardProps = {
  project: Project;
  index: number;
  projectCount: number;
  orbitRigRef: RefObject<THREE.Group | null>;
  onOpen: (project: Project) => void;
  onPrefetch: (slug: string) => void;
};

type ProjectCardProps = SharedProjectCardProps & {
  texture: THREE.Texture | null;
};

function createCardTexture(sourceTexture: THREE.Texture) {
  const texture = sourceTexture.clone();
  const image = texture.image as { width?: number; height?: number } | undefined;
  const imageWidth = image?.width ?? 1;
  const imageHeight = image?.height ?? 1;
  const imageAspect = imageWidth / Math.max(1, imageHeight);
  const frameAspect = experienceConfig.cards.worldWidth / experienceConfig.cards.worldHeight;

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(1, 1);
  texture.offset.set(0, 0);

  if (imageAspect > frameAspect) {
    texture.repeat.x = frameAspect / imageAspect;
    texture.offset.x = (1 - texture.repeat.x) * 0.5;
  } else if (imageAspect < frameAspect) {
    texture.repeat.y = imageAspect / frameAspect;
    texture.offset.y = (1 - texture.repeat.y) * 0.5;
  }

  texture.needsUpdate = true;
  return texture;
}

function getSceneVisibilityTarget() {
  const runtime = getExperienceRuntime();

  if (runtime.phase === "works") return 1;
  if (runtime.phase === "showcase-transition") {
    return 1 - smoothstep(0.04, 0.82, runtime.phaseProgress);
  }

  return 0;
}

function easeOutCubic(value: number) {
  const inverse = 1 - Math.min(1, Math.max(0, value));
  return 1 - inverse * inverse * inverse;
}

function ProjectCard({
  project,
  index,
  projectCount,
  orbitRigRef,
  texture,
  onOpen,
  onPrefetch,
}: ProjectCardProps) {
  const cardRef = useRef<THREE.Group>(null);
  const imageMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const frameMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const accentMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const overlayMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pressRef = useRef<PointerPress | null>(null);
  const frontnessRef = useRef(0);
  const visibilityRef = useRef(0);
  const hoveredRef = useRef(false);
  const scratchRef = useRef({
    basePosition: new THREE.Vector3(),
    localCameraPosition: new THREE.Vector3(),
    cameraDirection: new THREE.Vector3(),
    cardUp: new THREE.Vector3(),
    cardRight: new THREE.Vector3(),
    worldPosition: new THREE.Vector3(),
    openTarget: new THREE.Vector3(),
    cameraQuaternion: new THREE.Quaternion(),
    inverseParentQuaternion: new THREE.Quaternion(),
    offsetEuler: new THREE.Euler(0, 0, 0, "YXZ"),
    offsetQuaternion: new THREE.Quaternion(),
    orientationMatrix: new THREE.Matrix4(),
    parentQuaternion: new THREE.Quaternion(),
    targetQuaternion: new THREE.Quaternion(),
    baseImageColor: new THREE.Color(texture ? "#ffffff" : "#9bcbe3"),
  });

  const accentColor = orbitAccentColors[index % orbitAccentColors.length];

  useEffect(
    () => () => {
      const pointerId = pressRef.current?.pointerId;
      pressRef.current = null;
      if (pointerId !== undefined) finishOrbitDrag(pointerId);
    },
    [],
  );

  useFrame(({ camera, size, viewport }, frameDelta) => {
    const scratch = scratchRef.current;
    const card = cardRef.current;
    const orbitRig = orbitRigRef.current;
    const imageMaterial = imageMaterialRef.current;
    const frameMaterial = frameMaterialRef.current;
    const accentMaterial = accentMaterialRef.current;
    const shadowMaterial = shadowMaterialRef.current;
    const overlayMaterial = overlayMaterialRef.current;

    if (
      !card ||
      !orbitRig ||
      !imageMaterial ||
      !frameMaterial ||
      !accentMaterial ||
      !shadowMaterial ||
      !overlayMaterial
    ) {
      return;
    }

    const runtime = getExperienceRuntime();
    const delta = Math.min(frameDelta, 1 / 20);
    const phase = getOrbitPhase(runtime.orbit.angle, index, projectCount);
    const frontness = getFrontness(phase);
    const isActive = getExperienceSnapshot().activeProjectIndex === index;
    const focusWeight = isActive ? getFocusWeight(frontness) : 0;
    const sideWeight = smoothstep(0.12, 0.68, frontness);
    const visibilityTarget = getSceneVisibilityTarget();
    const sceneVisibility = runtime.reducedMotion
      ? visibilityTarget
      : damp(visibilityRef.current, visibilityTarget, 5.2, delta);
    const openingSlug = runtime.selectedProjectSlug;
    const isOpening = openingSlug === project.slug;
    const openingDuration = experienceConfig.transitions.projectOpenDuration * 1000;
    const transitionElapsed = openingSlug ? performance.now() - runtime.projectOpenStartedAt : 0;
    const transitionProgress = openingSlug
      ? runtime.reducedMotion
        ? 1
        : easeOutCubic(transitionElapsed / Math.max(1, openingDuration))
      : 0;
    const selectionProgress = isOpening ? transitionProgress : 0;
    const openingProgress = isOpening && !runtime.reducedMotion ? transitionProgress : 0;
    const otherCardOpacity = openingSlug && !isOpening ? 1 - transitionProgress * 0.76 : 1;

    frontnessRef.current = frontness;
    visibilityRef.current = sceneVisibility;

    scratch.basePosition.set(
      Math.sin(phase) * experienceConfig.orbit.radiusX,
      0,
      Math.cos(phase) * experienceConfig.orbit.radiusZ,
    );
    card.position.copy(scratch.basePosition);

    orbitRig.updateWorldMatrix(true, false);
    scratch.localCameraPosition.copy(camera.position);
    orbitRig.worldToLocal(scratch.localCameraPosition);

    if (isOpening && openingProgress > 0) {
      scratch.openTarget
        .copy(scratch.localCameraPosition)
        .sub(scratch.basePosition)
        .normalize()
        .multiplyScalar(MAX_OPEN_TRAVEL * openingProgress)
        .add(scratch.basePosition);
      card.position.copy(scratch.openTarget);
    }

    card.updateWorldMatrix(true, false);
    card.getWorldPosition(scratch.worldPosition);
    scratch.cameraDirection.copy(camera.position).sub(scratch.worldPosition);
    scratch.cameraDirection.y = 0;
    scratch.cameraDirection.normalize();
    scratch.cardRight.set(0, 1, 0).cross(scratch.cameraDirection).normalize();
    scratch.cardUp.copy(scratch.cameraDirection).cross(scratch.cardRight).normalize();
    scratch.orientationMatrix.makeBasis(scratch.cardRight, scratch.cardUp, scratch.cameraDirection);
    scratch.cameraQuaternion.setFromRotationMatrix(scratch.orientationMatrix);

    const orientation = getCardOrientationOffsets(phase, frontness);
    scratch.offsetEuler.set(orientation.pitch, orientation.yaw, orientation.roll, "YXZ");
    scratch.offsetQuaternion.setFromEuler(scratch.offsetEuler);
    scratch.cameraQuaternion.multiply(scratch.offsetQuaternion);
    orbitRig.getWorldQuaternion(scratch.parentQuaternion);
    scratch.inverseParentQuaternion.copy(scratch.parentQuaternion).invert();
    scratch.targetQuaternion
      .copy(scratch.inverseParentQuaternion)
      .multiply(scratch.cameraQuaternion);
    card.quaternion.slerp(
      scratch.targetQuaternion,
      1 - Math.exp(-(runtime.reducedMotion ? 24 : 9) * delta),
    );

    const depthScale =
      experienceConfig.orbit.backScale +
      (experienceConfig.orbit.sideScale - experienceConfig.orbit.backScale) * sideWeight +
      (experienceConfig.orbit.frontScale - experienceConfig.orbit.sideScale) * focusWeight;
    const revealScale = runtime.reducedMotion ? 1 : 0.88 + sceneVisibility * 0.12;
    const hoverScale = hoveredRef.current && !openingSlug ? 1.018 : 1;
    const openingScale = 1 + openingProgress * 0.11;
    card.updateWorldMatrix(true, false);
    card.getWorldPosition(scratch.worldPosition);
    const currentViewport = viewport.getCurrentViewport(camera, scratch.worldPosition);
    const maxWidthPixels =
      size.width < 768
        ? experienceConfig.cards.mobileMaxWidth
        : size.width < 1024
          ? experienceConfig.cards.tabletMaxWidth
          : experienceConfig.cards.desktopMaxWidth;
    const maxHeightRatio = size.width < 768 ? 0.38 : size.width < 1024 ? 0.42 : 0.46;
    const widthLimit =
      (currentViewport.width * (maxWidthPixels / Math.max(1, size.width))) /
      experienceConfig.cards.worldWidth;
    const heightLimit =
      (currentViewport.height * maxHeightRatio) / experienceConfig.cards.worldHeight;
    const responsiveLimit = Math.min(1, widthLimit, heightLimit);
    const targetScale = depthScale * revealScale * hoverScale * openingScale * responsiveLimit;
    const currentScale = damp(card.scale.x, targetScale, runtime.reducedMotion ? 22 : 10, delta);
    card.scale.setScalar(currentScale);

    const baseOpacity = getDepthOpacity(
      frontness,
      experienceConfig.orbit.backOpacity,
      experienceConfig.orbit.sideOpacity,
      isActive ? experienceConfig.orbit.frontOpacity : 0.76,
    );
    const imageOpacity = baseOpacity * sceneVisibility * otherCardOpacity;
    const brightness = 0.67 + sideWeight * 0.15 + focusWeight * 0.18 + selectionProgress * 0.05;

    imageMaterial.opacity = imageOpacity;
    imageMaterial.color.copy(scratch.baseImageColor).multiplyScalar(brightness);
    frameMaterial.opacity =
      sceneVisibility * otherCardOpacity * (0.48 + sideWeight * 0.18 + focusWeight * 0.32);
    accentMaterial.opacity =
      sceneVisibility *
      otherCardOpacity *
      (0.08 +
        sideWeight * 0.1 +
        focusWeight * 0.38 +
        (hoveredRef.current ? 0.14 : 0) +
        selectionProgress * 0.18);
    shadowMaterial.opacity =
      sceneVisibility * otherCardOpacity * (0.035 + sideWeight * 0.04 + focusWeight * 0.12);
    overlayMaterial.opacity =
      sceneVisibility * otherCardOpacity * Math.max(0, 0.16 - focusWeight * 0.15);

    card.visible = imageOpacity > 0.008;
  });

  function canInteract() {
    const runtime = getExperienceRuntime();
    return (
      visibilityRef.current > 0.08 &&
      frontnessRef.current > MIN_INTERACTIVE_FRONTNESS &&
      !runtime.selectedProjectSlug
    );
  }

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (!canInteract()) return;

    event.stopPropagation();
    pressRef.current = {
      pointerId: event.pointerId,
      lastX: event.clientX,
      lastY: event.clientY,
      totalDistance: 0,
    };
    const pointerTarget = event.target;
    if (hasPointerCaptureControls(pointerTarget)) {
      pointerTarget.setPointerCapture(event.pointerId);
    }
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    const press = pressRef.current;
    if (!press || press.pointerId !== event.pointerId) return;

    event.stopPropagation();
    press.totalDistance += Math.hypot(event.clientX - press.lastX, event.clientY - press.lastY);
    press.lastX = event.clientX;
    press.lastY = event.clientY;
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    const press = pressRef.current;
    if (!press || press.pointerId !== event.pointerId) return;

    event.stopPropagation();
    const localDragDistance = Math.max(press.totalDistance, event.delta);
    const runtimeWasDragged = finishOrbitDrag(event.pointerId);
    const wasDragged = localDragDistance > POINTER_CLICK_THRESHOLD || runtimeWasDragged;

    pressRef.current = null;
    const pointerTarget = event.target;
    if (
      hasPointerCaptureControls(pointerTarget) &&
      pointerTarget.hasPointerCapture(event.pointerId)
    ) {
      pointerTarget.releasePointerCapture(event.pointerId);
    }

    if (!wasDragged && canInteract()) {
      onOpen(project);
    }
  }

  function cancelPointer(event: ThreeEvent<PointerEvent>) {
    if (pressRef.current?.pointerId !== event.pointerId) return;

    pressRef.current = null;
    finishOrbitDrag(event.pointerId);
  }

  function handlePointerOver(event: ThreeEvent<PointerEvent>) {
    if (!canInteract()) return;

    event.stopPropagation();
    hoveredRef.current = true;
    onPrefetch(project.slug);
  }

  function handlePointerOut() {
    hoveredRef.current = false;
  }

  return (
    <group
      ref={cardRef}
      name={`ProjectCard:${project.slug}`}
      userData={{ projectSlug: project.slug, projectTitle: project.title }}
      visible={false}
    >
      <mesh position={[0, -0.035, -0.055]}>
        <planeGeometry
          args={[
            experienceConfig.cards.worldWidth + 0.18,
            experienceConfig.cards.worldHeight + 0.16,
          ]}
        />
        <meshBasicMaterial
          ref={shadowMaterialRef}
          color="#20292d"
          transparent
          opacity={0}
          depthTest
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.025]}>
        <boxGeometry
          args={[
            experienceConfig.cards.worldWidth + 0.16,
            experienceConfig.cards.worldHeight + 0.16,
            0.035,
          ]}
        />
        <meshStandardMaterial
          ref={frameMaterialRef}
          color={experienceConfig.colors.river}
          metalness={0.58}
          roughness={0.34}
          transparent
          opacity={0}
          depthTest
          depthWrite
        />
        <Edges color={accentColor} scale={1.004} threshold={24} />
      </mesh>

      <mesh
        position={[
          -experienceConfig.cards.worldWidth * 0.5 + 0.3,
          -experienceConfig.cards.worldHeight * 0.5 - 0.019,
          0.012,
        ]}
      >
        <boxGeometry args={[0.72, 0.028, 0.028]} />
        <meshBasicMaterial
          ref={accentMaterialRef}
          color={accentColor}
          opacity={0}
          toneMapped={false}
          transparent
        />
      </mesh>

      <mesh
        position={[0, 0, 0.002]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelPointer}
        onLostPointerCapture={cancelPointer}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry
          args={[experienceConfig.cards.worldWidth, experienceConfig.cards.worldHeight]}
        />
        <meshBasicMaterial
          ref={imageMaterialRef}
          map={texture}
          color={texture ? "#ffffff" : "#9bcbe3"}
          transparent
          opacity={0}
          depthTest
          depthWrite
          side={THREE.FrontSide}
          toneMapped={texture === null}
        />
      </mesh>

      <mesh position={[0, 0, 0.006]}>
        <planeGeometry
          args={[experienceConfig.cards.worldWidth, experienceConfig.cards.worldHeight]}
        />
        <meshBasicMaterial
          ref={overlayMaterialRef}
          color="#20292d"
          depthTest
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
    </group>
  );
}

export function TexturedProjectCard({ project, ...props }: SharedProjectCardProps) {
  const sourceTexture = useTexture(project.cover.src ?? "");
  const texture = useMemo(() => createCardTexture(sourceTexture), [sourceTexture]);

  useEffect(() => () => texture.dispose(), [texture]);

  return <ProjectCard {...props} project={project} texture={texture} />;
}

export function ProjectCardFallback(props: SharedProjectCardProps) {
  return <ProjectCard {...props} texture={null} />;
}
