import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScene, type SceneState } from '../store';
import { portalPlacement } from './layout';
import { SCREEN } from '../../data/scene3d';
import { FINALE_CENTER } from '../objects/FinaleStage';

interface Shot {
  target: THREE.Vector3;
  /** Dirección desde el objetivo hacia la cámara. */
  dir: THREE.Vector3;
  /** Ancho y alto (en unidades de mundo) que deben caber en la ventana de escena. */
  subject: [number, number];
  parallax: number;
  drift: number;
}

const UP = new THREE.Vector3(0, 1, 0);

function computeShot(state: SceneState, windowAspect: number, shot: Shot) {
  shot.parallax = 0.35;
  shot.drift = 0;

  if (state.screen === 'title') {
    shot.target.set(0, 2.52, -3);
    shot.dir.set(0, 0.04, 1);
    shot.subject = [12, 8.6];
    shot.parallax = 0.6;
    shot.drift = 0.35;
    return;
  }

  if (state.screen === 'map') {
    if (state.finale.open) {
      // Recompensa final: los portales al fondo y el cofre en primer plano
      const opened = state.finale.chestOpened;
      const early = state.finale.step < 3;
      shot.target.set(0, early ? 2.0 : opened ? 2.6 : 1.2, early ? 1.0 : FINALE_CENTER[2] - (opened ? 0.9 : 0));
      shot.dir.set(0, early ? 0.16 : 0.2, 1);
      shot.subject = early ? [19, 5.6] : opened ? [8.4, 7.2] : [6.5, 4.4];
      shot.drift = 0.12;
      return;
    }
    if (state.warpDim) {
      const warp = portalPlacement(state.warpDim);
      shot.target.copy(warp.position).add(new THREE.Vector3(0, 1.75, 0));
      shot.dir.copy(warp.normal);
      shot.subject = [1.1, 1.1];
      shot.parallax = 0;
      return;
    }
    const focus = portalPlacement(state.focusDim);
    if (windowAspect > 1.45) {
      shot.target.set(focus.position.x * 0.06, 1.95, 0.7);
      shot.dir.set(0, 0.15, 1);
      shot.subject = [20.5, 4.9];
    } else {
      shot.target.copy(focus.position).add(new THREE.Vector3(0, 1.6, 0));
      shot.dir.copy(focus.normal).multiplyScalar(0.7).add(new THREE.Vector3(0, 0.14, 0.3));
      shot.subject = [4.6, 5.6];
    }
    shot.dir.applyAxisAngle(UP, state.dragYaw);
    shot.drift = 0.15;
    return;
  }

  // Dimensión activa
  if (state.dimensionMode === 'cinematic') {
    shot.target.set(SCREEN.position[0], SCREEN.position[1], SCREEN.position[2]);
    shot.dir.set(0, 0.02, 1);
    shot.subject = [SCREEN.width * 1.08, SCREEN.height * 1.1];
    shot.parallax = 0.45;
    return;
  }
  shot.target.set(0, 1.45, -0.4);
  shot.dir.set(0.42, 0.36, 1);
  shot.subject = [11.4, 6.4];
  shot.parallax = 0.3;
}

interface CameraRigProps {
  still: boolean;
}

/**
 * Director de cámara. Encadra el sujeto de cada pantalla dentro del elemento
 * HTML marcado con [data-scene-window] (o la ventana completa si no existe),
 * de modo que la escena 3D siempre aparece donde el diseño le deja espacio.
 */
export function CameraRig({ still }: CameraRigProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const shot = useMemo<Shot>(
    () => ({ target: new THREE.Vector3(), dir: new THREE.Vector3(0, 0, 1), subject: [10, 6], parallax: 0, drift: 0 }),
    []
  );
  const rig = useRef({
    key: '',
    target: new THREE.Vector3(),
    position: new THREE.Vector3(0, 2, 14),
    offsetX: 0,
    offsetY: 0,
    pointerX: 0,
    pointerY: 0,
    shake: 0,
    push: 0,
    frame: 0,
    windowEl: null as Element | null
  });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      rig.current.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      rig.current.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    // Reacción de cámara al validar una respuesta
    const unsubscribe = useScene.subscribe((state, previous) => {
      if (state.feedback === previous.feedback) return;
      if (state.feedback === 'failure') rig.current.shake = 0.16;
      if (state.feedback === 'success') rig.current.push = 1;
    });
    return () => {
      window.removeEventListener('pointermove', onMove);
      unsubscribe();
      camera.clearViewOffset();
    };
  }, [camera]);

  useFrame(({ clock, size }, delta) => {
    const r = rig.current;
    const state = useScene.getState();
    const dt = Math.min(delta, 0.12);

    // Ventana de escena definida por el diseño HTML
    if (r.frame++ % 12 === 0 || (r.windowEl && !r.windowEl.isConnected)) {
      // Si hay varias (por ejemplo un modal sobre el mapa), manda la última del documento
      const windows = document.querySelectorAll('[data-scene-window]');
      r.windowEl = windows.length ? windows[windows.length - 1] : null;
    }
    let rectW = size.width;
    let rectH = size.height;
    let centerX = 0.5;
    let centerY = 0.5;
    if (r.windowEl) {
      const rect = r.windowEl.getBoundingClientRect();
      if (rect.width > 40 && rect.height > 40) {
        rectW = rect.width;
        rectH = rect.height;
        centerX = (rect.left + rect.width / 2) / size.width;
        centerY = (rect.top + rect.height / 2) / size.height;
      }
    }

    computeShot(state, rectW / rectH, shot);
    shot.dir.normalize();

    const k = 1 / (2 * Math.tan((camera.fov * Math.PI) / 360));
    let distance = Math.max(
      shot.subject[1] * k * (size.height / rectH),
      shot.subject[0] * k * (size.height / rectW)
    );
    distance = THREE.MathUtils.clamp(distance, 1.6, 70);
    distance *= 1 - r.push * 0.04;

    const desired = shot.target.clone().addScaledVector(shot.dir, distance);
    if (!still) {
      const right = new THREE.Vector3().crossVectors(UP, shot.dir).normalize();
      const scale = distance * 0.05;
      desired.addScaledVector(right, r.pointerX * shot.parallax * scale);
      desired.y -= r.pointerY * shot.parallax * scale * 0.5;
      if (shot.drift) {
        const t = clock.elapsedTime;
        desired.addScaledVector(right, Math.sin(t * 0.21) * shot.drift);
        desired.y += Math.sin(t * 0.33) * shot.drift * 0.5;
      }
    }

    const key = `${state.screen}:${state.dimensionId}`;
    const offsetX = (0.5 - centerX) * size.width;
    const offsetY = (0.5 - centerY) * size.height;

    if (key !== r.key || still) {
      // Cambio de escena: entrada con un leve empuje hacia delante
      const firstFrame = key !== r.key;
      r.key = key;
      r.target.copy(shot.target);
      r.position.copy(desired);
      if (firstFrame && !still) r.position.addScaledVector(shot.dir, distance * 0.22);
      r.offsetX = offsetX;
      r.offsetY = offsetY;
    } else {
      const speed = state.warpDim ? 5 : 3.2;
      r.target.x = THREE.MathUtils.damp(r.target.x, shot.target.x, speed, dt);
      r.target.y = THREE.MathUtils.damp(r.target.y, shot.target.y, speed, dt);
      r.target.z = THREE.MathUtils.damp(r.target.z, shot.target.z, speed, dt);
      r.position.x = THREE.MathUtils.damp(r.position.x, desired.x, speed, dt);
      r.position.y = THREE.MathUtils.damp(r.position.y, desired.y, speed, dt);
      r.position.z = THREE.MathUtils.damp(r.position.z, desired.z, speed, dt);
      r.offsetX = THREE.MathUtils.damp(r.offsetX, offsetX, 6, dt);
      r.offsetY = THREE.MathUtils.damp(r.offsetY, offsetY, 6, dt);
    }

    camera.position.copy(r.position);
    if (r.shake > 0.002 && !still) {
      camera.position.x += (Math.random() - 0.5) * r.shake;
      camera.position.y += (Math.random() - 0.5) * r.shake;
    }
    r.shake = THREE.MathUtils.damp(r.shake, 0, 7, dt);
    r.push = THREE.MathUtils.damp(r.push, 0, 2.2, dt);
    camera.lookAt(r.target);
    camera.setViewOffset(size.width, size.height, r.offsetX, r.offsetY, size.width, size.height);
  });

  return null;
}
