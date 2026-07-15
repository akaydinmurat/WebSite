"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import { experienceConfig } from "../experience-config";
import { getExperienceRuntime, subscribeExperience } from "../experience-store";
import { showcaseCameraPoints, showcasePanelTransforms } from "../showcase/showcase-layout";
import { getShowcaseMotionState } from "../showcase/showcase-motion";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const clamped = clamp01(value);
  return clamped * clamped * (3 - 2 * clamped);
}

export function ExperienceCamera() {
  const { camera, invalidate } = useThree();
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        showcaseCameraPoints.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        "centripetal",
        0.45,
      ),
    [],
  );
  const working = useMemo(
    () => ({
      desiredPosition: new THREE.Vector3(),
      desiredQuaternion: new THREE.Quaternion(),
      corridorAnchorPosition: new THREE.Vector3(),
      corridorAnchorTarget: new THREE.Vector3(),
      introPosition: new THREE.Vector3(...experienceConfig.camera.intro),
      lookMatrix: new THREE.Matrix4(),
      lookTarget: new THREE.Vector3(),
      panelTarget: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      visionPosition: new THREE.Vector3(...experienceConfig.camera.vision),
      visionTarget: new THREE.Vector3(0, 0.08, -0.4),
      worksPosition: new THREE.Vector3(...experienceConfig.camera.works),
      worksTarget: new THREE.Vector3(0.12, 0.12, -0.15),
    }),
    [],
  );

  useEffect(() => {
    const unsubscribe = subscribeExperience(invalidate);
    return () => {
      unsubscribe();
    };
  }, [invalidate]);

  useFrame((_, frameDelta) => {
    const runtime = getExperienceRuntime();
    if (!runtime.pageVisible) return;

    const {
      desiredPosition,
      desiredQuaternion,
      corridorAnchorPosition,
      corridorAnchorTarget,
      introPosition,
      lookMatrix,
      lookTarget,
      panelTarget,
      tangent,
      visionPosition,
      visionTarget,
      worksPosition,
      worksTarget,
    } = working;

    switch (runtime.phase) {
      case "intro":
        desiredPosition.copy(introPosition);
        lookTarget.set(0, 0.08, 0);
        break;
      case "works":
        desiredPosition.copy(worksPosition);
        lookTarget.copy(worksTarget);
        break;
      case "vision-transition": {
        const progress = smoothstep(runtime.phaseProgress);
        curve.getPointAt(1, corridorAnchorPosition);
        curve.getTangentAt(1, tangent).normalize();
        corridorAnchorTarget.copy(corridorAnchorPosition).addScaledVector(tangent, 4.2);
        desiredPosition.lerpVectors(corridorAnchorPosition, visionPosition, progress);
        lookTarget.lerpVectors(corridorAnchorTarget, visionTarget, progress);
        break;
      }
      case "vision": {
        const progress = smoothstep(runtime.visionProgress);
        desiredPosition.set(
          visionPosition.x + THREE.MathUtils.lerp(-0.34, 0.44, progress),
          visionPosition.y + THREE.MathUtils.lerp(0.08, -0.06, progress),
          visionPosition.z + THREE.MathUtils.lerp(0.22, -0.34, progress),
        );
        lookTarget.set(THREE.MathUtils.lerp(-0.28, 0.42, progress), visionTarget.y, visionTarget.z);
        break;
      }
      case "showcase-transition": {
        const progress = smoothstep(runtime.phaseProgress);
        curve.getPointAt(0, corridorAnchorPosition);
        curve.getTangentAt(0, tangent).normalize();
        corridorAnchorTarget.copy(corridorAnchorPosition).addScaledVector(tangent, 4.2);
        desiredPosition.lerpVectors(worksPosition, corridorAnchorPosition, progress);
        lookTarget.lerpVectors(worksTarget, corridorAnchorTarget, progress);
        break;
      }
      case "showcase":
      case "outro": {
        const progress =
          runtime.phase === "outro"
            ? Math.max(runtime.showcaseProgress, 1 - runtime.outroProgress * 0.015)
            : runtime.showcaseProgress;
        const motion = getShowcaseMotionState(progress, showcasePanelTransforms.length);
        const curvedProgress = motion.cameraProgress;
        curve.getPointAt(curvedProgress, desiredPosition);
        curve.getTangentAt(curvedProgress, tangent).normalize();
        lookTarget.copy(desiredPosition).addScaledVector(tangent, 4.2);

        const activePanel = showcasePanelTransforms[motion.activeStageIndex];
        const activePanelMotion = motion.panels[motion.activeStageIndex];
        if (activePanel && activePanelMotion) {
          panelTarget.set(
            activePanel.position[0],
            activePanel.position[1],
            activePanel.position[2],
          );
          lookTarget.lerp(panelTarget, activePanelMotion.focusWeight * 0.62);
        }
        break;
      }
    }

    lookMatrix.lookAt(desiredPosition, lookTarget, camera.up);
    desiredQuaternion.setFromRotationMatrix(lookMatrix);

    const delta = Math.min(Math.max(frameDelta, 1 / 120), 1 / 20);
    const positionDistance = camera.position.distanceTo(desiredPosition);
    const rotationDistance = 1 - Math.abs(camera.quaternion.dot(desiredQuaternion));
    const positionAlpha = runtime.reducedMotion ? 1 : 1 - Math.exp(-5.8 * delta);
    const rotationAlpha = runtime.reducedMotion ? 1 : 1 - Math.exp(-7.2 * delta);

    camera.position.lerp(desiredPosition, positionAlpha);
    camera.quaternion.slerp(desiredQuaternion, rotationAlpha);
    camera.updateMatrixWorld();

    if (!runtime.reducedMotion && (positionDistance > 0.0008 || rotationDistance > 0.000001)) {
      invalidate();
    }
  });

  return null;
}
