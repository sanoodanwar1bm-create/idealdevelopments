"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { HIGH } from "./quality";

// Soft studio lighting built from local light-formers (no HDR downloads).
const DAY = new THREE.Color("#fff1d8");
const GOLDEN = new THREE.Color("#ffc98a");

export default function StudioLights({ progress, quality = HIGH, motion }) {
  const key = useRef();
  const frame = useRef(0);

  useFrame(() => {
    const k = key.current;
    if (!k) return;

    // The shadow map is re-rendered on alternate frames while the house is
    // going up, and only occasionally once it has settled — the scene moves
    // slowly enough that nobody sees a frame-old shadow, and it keeps a whole
    // extra pass of draw calls off the GPU.
    if (quality.shadows) {
      const every = motion?.current.settled ? 6 : 2;
      k.shadow.autoUpdate = false;
      k.shadow.needsUpdate = frame.current % every === 0;
      frame.current++;
    }

    if (!progress) return;
    // As the house is handed over, the key light drops toward a warm late
    // afternoon: the same model reads as "finished home", not "building site".
    const p = Math.min(1, Math.max(0, progress.current ?? 0));
    const dusk = Math.max(0, (p - 0.86) / 0.14);
    k.color.copy(DAY).lerp(GOLDEN, dusk);
    k.intensity = 2.9 - dusk * 0.5;
    k.position.set(11 - dusk * 3.5, 9 - dusk * 3.4, 5 + dusk * 3);
  });

  return (
    <>
      <hemisphereLight args={["#d7e8f6", "#a8916d", 0.24]} />
      <directionalLight
        ref={key}
        position={[11, 9, 5]}
        intensity={2.9}
        color="#fff1d8"
        castShadow={quality.shadows}
        shadow-mapSize={[quality.shadowMap, quality.shadowMap]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-10}
        shadow-radius={3.5}
        shadow-blurSamples={quality.shadowMap >= 2048 ? 12 : 6}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <Environment resolution={quality.envResolution} frames={1} environmentIntensity={0.38}>
        {/* stands in for a sky + ground bounce */}
        <color attach="background" args={["#b9d5e8"]} />
        <Lightformer form="rect" intensity={2.2} color="#dceaf7" position={[0, 6, -8]} scale={[18, 6, 1]} />
        <Lightformer form="rect" intensity={2} position={[-8, 2, 2]} rotation-y={Math.PI / 2} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#cfe2f2" position={[9, 3, 6]} rotation-y={-Math.PI / 2.6} scale={[14, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#e8d3a8" position={[-9, 2, 4]} rotation-y={Math.PI / 2.4} scale={[10, 5, 1]} />
        <Lightformer form="circle" intensity={3} color="#ffffff" position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={6} />
        <Lightformer form="rect" intensity={0.8} color="#b9a179" position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} />
      </Environment>
    </>
  );
}
