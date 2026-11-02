"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import StudioLights from "./StudioLights";
import { useQuality } from "./quality";
import { quietUpstreamWarnings } from "./quietUpstream";

quietUpstreamWarnings();

// The four logo bricks as polygons in logo space (584 × 427, y down).
const BRICKS = [
  { pts: [[160, 122], [277, 0], [433, 0], [433, 122]], color: "teal", from: [2.5, 3.2, 2], spin: [1.2, -0.8, 0.6], dir: [0.4, 1, 0.6] },
  { pts: [[5, 272], [128, 152], [278, 152], [278, 272]], color: "teal", from: [-4, 0.6, 1], spin: [-0.6, 1.4, -0.4], dir: [-1, 0.3, 0.4] },
  { pts: [[312, 152], [584, 152], [462, 272], [312, 272]], color: "navy", from: [4.2, -0.6, 1.5], spin: [0.8, 1, 0.9], dir: [1, -0.2, -0.3] },
  { pts: [[157, 305], [433, 305], [310, 427], [157, 427]], color: "navy", from: [-2.2, -3.4, 2], spin: [-1, -0.6, 1.1], dir: [-0.3, -1, 0.5] },
];

const SCALE = 1 / 100;
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function useBricks() {
  return useMemo(
    () =>
      BRICKS.map((b) => {
        const pts = b.pts.map(([x, y]) => new THREE.Vector2((x - 292) * SCALE, -(y - 213.5) * SCALE));
        const centroid = pts.reduce((a, p) => a.add(p), new THREE.Vector2()).multiplyScalar(1 / pts.length);
        const shape = new THREE.Shape(pts.map((p) => p.clone().sub(centroid)));
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.55,
          bevelEnabled: true,
          bevelThickness: 0.08,
          bevelSize: 0.06,
          bevelSegments: 5,
        });
        geometry.translate(0, 0, -0.275);
        const edges = new THREE.EdgesGeometry(geometry, 30);
        return { ...b, geometry, edges, home: new THREE.Vector3(centroid.x, centroid.y, 0) };
      }),
    []
  );
}

function Bricks({ pointer, explode }) {
  const bricks = useBricks();
  const group = useRef();
  const refs = useRef([]);
  const start = useRef(null);

  const mats = useMemo(
    () => ({
      teal: new THREE.MeshPhysicalMaterial({ color: "#157a6e", roughness: 0.22, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.55 }),
      navy: new THREE.MeshPhysicalMaterial({ color: "#0a284e", roughness: 0.22, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.45 }),
      gold: new THREE.LineBasicMaterial({ color: "#e2c25e" }),
      ring: new THREE.MeshStandardMaterial({ color: "#d4af37", metalness: 0.9, roughness: 0.25 }),
    }),
    []
  );
  const ring = useRef();

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (start.current === null) start.current = t;
    const since = t - start.current;
    const ex = explode.current;

    bricks.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      const k = easeOutExpo(Math.max(0, (since - 0.2 - i * 0.18) / 1.6));
      const [fx, fy, fz] = b.from;
      const float = Math.sin(t * 0.9 + i * 1.3) * 0.05;
      m.position.set(
        THREE.MathUtils.lerp(b.home.x + fx, b.home.x, k) + b.dir[0] * ex * 1.6,
        THREE.MathUtils.lerp(b.home.y + fy, b.home.y, k) + b.dir[1] * ex * 1.6 + float,
        THREE.MathUtils.lerp(fz, 0, k) + b.dir[2] * ex * 2
      );
      m.rotation.set(
        b.spin[0] * (1 - k) + ex * b.spin[1] * 0.6,
        b.spin[1] * (1 - k) + ex * b.spin[2] * 0.6,
        b.spin[2] * (1 - k)
      );
      m.scale.setScalar(Math.max(0.001, k));
    });

    const g = group.current;
    const d = Math.min(dt, 0.1);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + pointer.current.x * 0.4 + Math.sin(t * 0.3) * 0.08, 2.5, d);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 + pointer.current.y * 0.25, 2.5, d);

    ring.current.rotation.z = t * 0.15;
    ring.current.scale.setScalar(easeOutExpo(Math.max(0, (since - 0.9) / 1.5)) + ex * 0.3);
  });

  return (
    <group ref={group}>
      {bricks.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => (refs.current[i] = m)}
          geometry={b.geometry}
          material={mats[b.color]}
          castShadow
          scale={0.001}
        >
          <lineSegments geometry={b.edges} material={mats.gold} />
        </mesh>
      ))}
      <mesh ref={ring} position={[0, 0, -1.2]} material={mats.ring} scale={0.001}>
        <torusGeometry args={[3.0, 0.02, 16, 160]} />
      </mesh>
    </group>
  );
}

export default function BrandBricks({ explode, className = "" }) {
  const wrapper = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const quality = useQuality();

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (wrapper.current) io.observe(wrapper.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapper} className={`pointer-events-none ${className}`} aria-hidden>
      <Canvas
        dpr={quality.dpr}
        frameloop={visible ? "always" : "never"}
        camera={{ fov: 35, position: [0, 0, 11.5] }}
        gl={{ antialias: quality.antialias, alpha: true }}
        // No custom shaders here either, so the program log only carries
        // ANGLE's float-precision notes on Windows.
        onCreated={({ gl }) => (gl.debug.checkShaderErrors = false)}
        style={{ touchAction: "pan-y" }}
      >
        <StudioLights quality={quality} />
        <Bricks pointer={pointer} explode={explode} />
        {quality.dust > 0 && (
          <Sparkles count={quality.dust > 60 ? 40 : 20} scale={[9, 7, 4]} size={3} speed={0.3} color="#d4af37" opacity={0.8} />
        )}
      </Canvas>
    </div>
  );
}
