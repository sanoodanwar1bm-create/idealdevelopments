"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Grid } from "@react-three/drei";
import * as THREE from "three";
import House from "./House";
import StudioLights from "./StudioLights";
import { useQuality } from "./quality";
import { quietUpstreamWarnings } from "./quietUpstream";

quietUpstreamWarnings();

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/*
 * Camera choreography. The shot starts wide and high, as if surveying an empty
 * plot, then descends and closes in as the house goes up, settling on a
 * three-quarter hero view at handover. The pointer adds a little parallax on
 * top, and a slow sine keeps the frame alive when nothing else is moving.
 */
function useRig({ pointer, baseRotation, distance, lookOffset, lookY, progress }) {
  const group = useRef();
  const lookAt = useRef(new THREE.Vector3());
  const { camera, size } = useThree();

  useFrame(({ clock }, dt) => {
    const d = Math.min(dt, 0.1);
    const t = clock.elapsedTime;
    const p = easeInOut(Math.min(1, Math.max(0, progress.current ?? 0)));

    const g = group.current;
    // The model turns gently through the build, so different elevations face
    // the camera at different stages.
    const turn = baseRotation + p * 0.34 + Math.sin(t * 0.11) * 0.05;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, turn + pointer.current.x * 0.24, 2.5, d);

    // Pull back on portrait screens so the whole site fits.
    const aspect = size.width / size.height;
    const k = aspect < 1 ? 1.55 : aspect < 1.25 ? 1.2 : 1;
    const dist = distance * k * (1.16 - 0.16 * p);

    const tx = 0.42 * dist;
    const ty = (0.52 - 0.13 * p) * dist + pointer.current.y * -0.8;
    const tz = 0.82 * dist;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 2, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 2, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tz, 2, d);

    // Shift the aim sideways so the house can sit off-centre in wide layouts.
    lookAt.current.set(size.width > 700 ? lookOffset : 0, lookY + p * 0.35, 0.4);
    camera.lookAt(lookAt.current);
  });

  return group;
}

function Site({ progress, pointer, baseRotation, distance, lookOffset, lookY, blueprint, immediate, quality, motion }) {
  const group = useRig({ pointer, baseRotation, distance, lookOffset, lookY, progress });
  return (
    <group ref={group}>
      <House progress={progress} blueprint={blueprint} immediate={immediate} quality={quality} motion={motion} />
    </group>
  );
}

/* Setting-out grid: visible while the plot is being marked, gone once the
   structure starts. */
function SetOutGrid({ progress, blueprint }) {
  const ref = useRef();
  useFrame(() => {
    const p = progress.current ?? 0;
    const on = blueprint ? 1 : 1 - Math.min(1, Math.max(0, (p - 0.04) / 0.16));
    const g = ref.current;
    if (!g) return;
    g.visible = on > 0.02;
    if (g.material) {
      g.material.transparent = true;
      g.material.opacity = on;
    }
  });

  return (
    <Grid
      ref={ref}
      position={[0, -0.055, 0]}
      infiniteGrid
      cellSize={0.5}
      cellThickness={0.6}
      cellColor={blueprint ? "#7fb0d8" : "#8fa3a0"}
      sectionSize={2.5}
      sectionThickness={1}
      sectionColor={blueprint ? "#d6ecff" : "#157a6e"}
      fadeDistance={24}
      fadeStrength={2.2}
    />
  );
}

/*
 * Compiles every shader before we show the canvas. On phones (iOS especially)
 * that compile can take a second or two; doing it behind the placeholder means
 * the first frame the visitor sees is already complete instead of stuttering.
 */
function SceneReady({ onReady }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    // Every shader here comes from three or drei — we author none. The program
    // info log is therefore only ever ANGLE's harmless float-precision notes
    // (X4122) on Windows, printed once per program. Skip the readback.
    gl.debug.checkShaderErrors = false;
    gl.compile(scene, camera);
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [gl, scene, camera, onReady]);
  return null;
}

/* Shown until the scene is ready: a drawing board, not an empty hole. */
function Placeholder({ visible }) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-blueprint opacity-70" />
      <svg viewBox="0 0 200 140" className="absolute inset-0 h-full w-full" fill="none">
        <rect
          x="34"
          y="40"
          width="132"
          height="74"
          stroke="#157a6e"
          strokeOpacity="0.5"
          strokeWidth="0.8"
          strokeDasharray="4 3"
        />
        <rect x="52" y="54" width="46" height="46" stroke="#0a284e" strokeOpacity="0.28" strokeWidth="0.6" />
        <rect x="104" y="54" width="46" height="30" stroke="#0a284e" strokeOpacity="0.28" strokeWidth="0.6" />
        <path d="M34 40 L34 30 M166 40 L166 30 M34 35 L166 35" stroke="#0a284e" strokeOpacity="0.2" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export default function ConstructionScene({
  progress,
  className = "",
  baseRotation = -0.3,
  distance = 19,
  lookOffset = 0,
  lookY = 1.5,
  blueprint = false,
  immediate = false,
  lazy = false,
}) {
  const wrapper = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  // Scenes below the fold don't create a WebGL context until you come near:
  // one less context, texture upload and shader compile during first paint.
  const [mounted, setMounted] = useState(!lazy);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const quality = useQuality();
  // Shared between the model and the lights: true once the build has caught up
  // with the scroll, so the shadow map can stop re-rendering every other frame.
  const motion = useRef({ settled: false });

  useEffect(() => {
    // Parallax only makes sense with a real pointer; skip the listener on touch.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });

    let onscreen = true;
    const sync = () => setActive(onscreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        if (entry.isIntersecting) setMounted(true);
        sync();
      },
      { rootMargin: "400px" }
    );
    if (wrapper.current) io.observe(wrapper.current);
    document.addEventListener("visibilitychange", sync);

    return () => {
      if (fine) window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapper}
      className={`pointer-events-none [mask-image:radial-gradient(ellipse_72%_72%_at_50%_50%,#000_62%,transparent_100%)] ${className}`}
      aria-hidden
    >
      <Placeholder visible={!ready} />
      {mounted && (
      <Canvas
        className={`transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        // three r186 removed PCFSoftShadowMap; percentage-closer filtering is the
        // closest thing left and avoids a console warning on every frame.
        shadows={quality.shadows ? "percentage" : false}
        dpr={quality.dpr}
        frameloop={active ? "always" : "never"}
        camera={{ fov: 30, position: [8, 6, 9], near: 0.1, far: 100 }}
        gl={{
          antialias: quality.antialias,
          alpha: true,
          powerPreference: "high-performance",
          toneMappingExposure: 0.85,
        }}
        style={{ touchAction: "pan-y" }}
      >
        <AdaptiveDpr pixelated={false} />
        <StudioLights progress={progress} quality={quality} motion={motion} />
        <Site
          progress={progress}
          pointer={pointer}
          baseRotation={baseRotation}
          distance={distance}
          lookOffset={lookOffset}
          lookY={lookY}
          blueprint={blueprint}
          immediate={immediate}
          quality={quality}
          motion={motion}
        />

        {/* Ground: shadow catcher plus the setting-out grid */}
        {quality.shadows && (
          <mesh rotation-x={-Math.PI / 2} position={[0, -0.06, 0]} receiveShadow>
            <planeGeometry args={[60, 60]} />
            <shadowMaterial transparent opacity={blueprint ? 0 : 0.28} color="#2b2a26" />
          </mesh>
        )}
        <SetOutGrid progress={progress} blueprint={blueprint} />
        <SceneReady onReady={onReady} />
      </Canvas>
      )}
    </div>
  );
}
