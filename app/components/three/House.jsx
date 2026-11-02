"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { getTextures, texturedBox } from "./textures";
import { HIGH } from "./quality";

/*
 * A modern Pakistani family home (10 Marla style) that builds itself.
 * Driven by `progress.current` (0 → 1):
 *   0.00–0.10  plot, blueprint, plinth, materials arrive
 *   0.10–0.50  columns and slabs: ground floor, first floor, mumty
 *   0.50–0.68  brickwork, plastered by 0.80
 *   0.72–0.92  windows, stone, wood, railings, pergola; scaffolding down
 *   0.86–1.00  boundary wall, gate, driveway, lawn, trees, car, lights on
 * 1 unit ≈ 2.5 m.
 */

const PL = 0.15; // plinth top
const G1 = 1.5; // ground floor ceiling
const F0 = 1.65; // first floor level
const F1 = 3.0;
const R0 = 3.15; // first-floor roof
const M1 = 4.35; // mumty ceiling
const COL = 0.22;
const WALL = 0.16;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const seg = (p, a, b) => clamp01((p - a) / (b - a));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

function presence(p, el) {
  const inV = easeOutCubic(seg(p, el.t0, el.t1));
  if (el.t2 === undefined) return inV;
  return inV * (1 - easeOutCubic(seg(p, el.t2, el.t3)));
}

function buildPlan() {
  const els = [];
  const box = (mat, [x0, x1], [y0, y1], [z0, z1], t0, t1, mode = "grow", extra = {}) =>
    els.push({
      mat,
      pos: [(x0 + x1) / 2, y0, (z0 + z1) / 2],
      size: [Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0)],
      t0,
      t1,
      mode,
      ...extra,
    });
  // Masonry walls start as brickwork and get plastered later.
  const wallX = ([x0, x1], z, ys, t0, t1, thick = WALL) =>
    box("masonry", [x0, x1], ys, [z - thick / 2, z + thick / 2], t0, t1, "grow", { tile: 0.42 });
  const wallZ = ([z0, z1], x, ys, t0, t1, thick = WALL) =>
    box("masonry", [x - thick / 2, x + thick / 2], ys, [z0, z1], t0, t1, "grow", { tile: 0.42 });

  // Window assembly on a front (+z) face: frame, glass, mullions, stone sill.
  const winZ = ([x0, x1], [y0, y1], z, t0, { sill = true } = {}) => {
    box("frame", [x0 - 0.05, x1 + 0.05], [y0 - 0.05, y1 + 0.05], [z, z + 0.05], t0, t0 + 0.05);
    box("glass", [x0, x1], [y0, y1], [z + 0.02, z + 0.05], t0 + 0.01, t0 + 0.06);
    const n = Math.max(1, Math.round((x1 - x0) / 0.75));
    for (let i = 1; i < n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      box("frame", [x - 0.02, x + 0.02], [y0, y1], [z + 0.04, z + 0.07], t0 + 0.02, t0 + 0.06, "grow", { fine: true });
    }
    if (sill)
      box("stone", [x0 - 0.1, x1 + 0.1], [y0 - 0.09, y0 - 0.04], [z - 0.02, z + 0.14], t0 + 0.02, t0 + 0.07, "grow", {
        tile: 0.5,
        fine: true,
      });
  };
  // Window assembly on a side (+x) face.
  const winX = ([z0, z1], [y0, y1], x, t0) => {
    box("frame", [x, x + 0.05], [y0 - 0.05, y1 + 0.05], [z0 - 0.05, z1 + 0.05], t0, t0 + 0.05);
    box("glass", [x + 0.02, x + 0.05], [y0, y1], [z0, z1], t0 + 0.01, t0 + 0.06);
    const n = Math.max(1, Math.round((z1 - z0) / 0.75));
    for (let i = 1; i < n; i++) {
      const z = z0 + ((z1 - z0) * i) / n;
      box("frame", [x + 0.04, x + 0.07], [y0, y1], [z - 0.02, z + 0.02], t0 + 0.02, t0 + 0.06, "grow", { fine: true });
    }
    box("stone", [x - 0.02, x + 0.14], [y0 - 0.09, y0 - 0.04], [z0 - 0.1, z1 + 0.1], t0 + 0.02, t0 + 0.07, "grow", {
      tile: 0.5,
      fine: true,
    });
  };
  // Glass railing with top rail and posts.
  const railing = ([x0, x1], y, z, t0) => {
    box("glass", [x0 + 0.06, x1 - 0.06], [y, y + 0.4], [z - 0.015, z + 0.015], t0, t0 + 0.05);
    box("frame", [x0, x1], [y + 0.4, y + 0.45], [z - 0.035, z + 0.035], t0 + 0.01, t0 + 0.06, "growX");
    const posts = Math.max(2, Math.round((x1 - x0) / 1.1));
    for (let i = 0; i <= posts; i++) {
      const x = x0 + ((x1 - x0) * i) / posts;
      box("frame", [x - 0.025, x + 0.025], [y, y + 0.45], [z - 0.03, z + 0.03], t0, t0 + 0.05, "grow", { fine: true });
    }
  };

  // --- Site & foundation ---
  box("dirt", [-5.2, 5.2], [-0.05, 0], [-4.2, 4.4], 0, 0.04, "growXZ", { tile: 2.2 });
  box("concrete", [-4.12, 4.12], [0, PL - 0.04], [-3.12, 2.9], 0.03, 0.1, "growXZ", { tile: 0.8 });
  box("stone", [-4.18, 4.18], [PL - 0.06, PL], [-3.18, 2.96], 0.05, 0.12, "growXZ", { tile: 0.35 }); // plinth band

  // Bricks on site, used up as the walls go up
  [-3.9, -3.3].forEach((x, i) =>
    box("masonry", [x, x + 0.5], [0, 0.34], [3.4, 3.85], 0.04 + i * 0.01, 0.08 + i * 0.01, "pop", {
      t2: 0.6,
      t3: 0.66,
      tile: 0.42,
      raw: true,
    })
  );
  box("masonry", [-3.65, -3.15], [0.34, 0.6], [3.45, 3.8], 0.06, 0.09, "pop", {
    t2: 0.56,
    t3: 0.6,
    tile: 0.42,
    raw: true,
  });

  // --- Structure ---
  const X = [-3.9, -1.4, 1.2, 3.9];
  const Z = [-2.9, -0.5, 1.9];
  const columns = (xs, zs, [y0, y1], s) => {
    let k = 0;
    xs.forEach((x) =>
      zs.forEach((z) => {
        const d = k++ * 0.004;
        box("concrete", [x - COL / 2, x + COL / 2], [y0, y1], [z - COL / 2, z + COL / 2], s + d, s + 0.05 + d, "grow", {
          tile: 0.5,
        });
      })
    );
  };
  const slab = (xs, zs, [y0, y1], t0, t1) => {
    box("concrete", xs, [y0, y1], zs, t0, t1, "drop", { tile: 0.9 });
    // recessed shadow line under the slab reads as real depth
    box("shadowline", [xs[0] + 0.02, xs[1] - 0.02], [y0 - 0.035, y0], [zs[0] + 0.02, zs[1] - 0.02], t0 + 0.04, t1 + 0.04, "drop", { fine: true });
  };

  columns(X, Z, [PL, G1], 0.1);
  columns([1.35, 3.9], [2.7], [0, G1], 0.13); // porch posts
  slab([-4.05, 4.05], [-3.05, 2.05], [G1, F0], 0.18, 0.25);
  slab([1.05, 4.05], [2.05, 2.85], [G1, F0], 0.2, 0.26); // porch roof / balcony

  columns(X, Z, [F0, F1], 0.26);
  slab([-4.05, 4.05], [-3.05, 2.05], [F1, R0], 0.33, 0.4);

  columns([0.6, 3.9], [-2.9, -0.6], [R0, M1], 0.4);
  slab([0.45, 4.05], [-3.05, -0.45], [M1, M1 + 0.15], 0.45, 0.5);

  // --- Brickwork ---
  const gf = [PL, G1];
  wallX([-3.9, 3.9], -2.9, gf, 0.5, 0.56);
  wallZ([-2.9, 1.9], -3.9, gf, 0.5, 0.56);
  wallX([-3.9, 1.2], 1.9, gf, 0.51, 0.57);
  wallZ([-0.5, 1.9], 1.2, gf, 0.52, 0.58);
  wallX([1.2, 3.9], -0.5, gf, 0.52, 0.58);
  wallZ([-2.9, -0.5], 3.9, gf, 0.52, 0.58);

  const ff = [F0, F1];
  wallX([-3.9, 3.9], -2.9, ff, 0.56, 0.62);
  wallZ([-2.9, 1.9], -3.9, ff, 0.56, 0.62);
  wallZ([-2.9, 1.9], 3.9, ff, 0.57, 0.63);
  wallX([-3.9, 3.9], 1.9, ff, 0.58, 0.64);

  const mf = [R0, M1];
  wallX([0.6, 3.9], -0.6, mf, 0.62, 0.68);
  wallX([0.6, 3.9], -2.9, mf, 0.62, 0.68);
  wallZ([-2.9, -0.6], 0.6, mf, 0.63, 0.68);
  wallZ([-2.9, -0.6], 3.9, mf, 0.63, 0.68);

  // --- Openings ---
  const fz = 1.9 + WALL / 2;
  winZ([-3.3, -2.0], [0.55, 1.3], fz, 0.72);
  winZ([-1.15, -0.25], [0.55, 1.3], fz, 0.73);
  // Main door: wood leaf, frame, handle and a small canopy
  box("frame", [0.28, 1.02], [PL, 1.36], [fz, fz + 0.04], 0.74, 0.79);
  box("wood", [0.33, 0.97], [PL, 1.32], [fz + 0.02, fz + 0.07], 0.75, 0.8, "grow", { tile: 0.5 });
  box("chrome", [0.62, 0.66], [0.78, 0.98], [fz + 0.06, fz + 0.12], 0.78, 0.82, "grow", { fine: true });
  box("plasterWhite", [0.1, 1.2], [1.42, 1.5], [fz - 0.02, fz + 0.4], 0.79, 0.84, "grow", { tile: 0.6 });

  winZ([-3.25, -1.15], [1.95, 2.8], fz, 0.75); // big window inside the stone frame
  winZ([0.65, 3.55], [1.72, 2.86], fz, 0.76, { sill: false }); // sliding doors to balcony
  winZ([1.7, 3.4], [3.45, 4.15], -0.6 + WALL / 2, 0.78); // mumty
  winX([-2.3, -0.9], [1.95, 2.75], 3.9 + WALL / 2, 0.77);
  winX([-2.3, -0.9], [0.55, 1.3], 3.9 + WALL / 2, 0.76);

  // --- Stone-clad frame around the left first-floor box ---
  const zf = [1.98, 2.75];
  box("stone", [-4.15, -0.05], [F1, F1 + 0.32], zf, 0.78, 0.84, "growX", { tile: 0.38 });
  box("stone", [-4.15, -0.05], [1.44, F0 + 0.04], zf, 0.79, 0.85, "growX", { tile: 0.38 });
  box("stone", [-4.15, -3.88], [1.44, F1 + 0.32], zf, 0.8, 0.85, "grow", { tile: 0.38 });
  box("stone", [-0.32, -0.05], [1.44, F1 + 0.32], zf, 0.8, 0.86, "grow", { tile: 0.38 });

  // --- Wood cladding & louvers ---
  box("wood", [1.35, 3.78], [PL, G1], [-0.42, -0.36], 0.8, 0.86, "grow", { tile: 0.6 }); // porch feature wall
  box("wood", [0.05, 0.5], [F0, F1], [fz, fz + 0.05], 0.81, 0.86, "grow", { tile: 0.6 });
  for (let n = 0; n < 11; n++) {
    const x = -1.62 + n * 0.095;
    box("wood", [x, x + 0.05], [PL + 0.02, G1 - 0.02], [fz + 0.02, fz + 0.11], 0.82 + n * 0.004, 0.87 + n * 0.004, "grow", {
      tile: 0.4,
      fine: true,
    });
  }

  // --- Balcony, pergola, fins, parapets, terrace ---
  railing([1.1, 4.0], F0, 2.79, 0.86);
  for (let n = 0; n < 9; n++) {
    const x = 0.25 + n * 0.46;
    box("frame", [x, x + 0.07], [F1 - 0.12, F1 - 0.02], [2.05, 2.95], 0.86 + n * 0.005, 0.9 + n * 0.005, "growZ", {
      fine: n % 2 === 1,
    });
  }
  box("frame", [0.1, 4.05], [F1 - 0.16, F1], [2.88, 2.98], 0.9, 0.93, "growX");
  for (let n = 0; n < 5; n++) {
    const x = 0.75 + n * 0.16;
    box("frame", [x, x + 0.055], [R0, M1], [-0.52, -0.42], 0.87 + n * 0.006, 0.91 + n * 0.006, "grow", { fine: n % 2 === 1 });
  }

  box("tile", [-3.95, 0.4], [R0, R0 + 0.03], [-2.95, 1.95], 0.88, 0.93, "growXZ", { tile: 0.35 });
  box("tile", [0.5, 4.0], [M1 + 0.15, M1 + 0.18], [-3.0, -0.5], 0.9, 0.94, "growXZ", { tile: 0.35 });

  const pt = [R0, R0 + 0.32];
  const parapet = (xs, ys, zs, t0) => {
    box("masonry", xs, ys, zs, t0, t0 + 0.05, "grow", { tile: 0.42 });
    box(
      "plasterWhite",
      [xs[0] - 0.03, xs[1] + 0.03],
      [ys[1], ys[1] + 0.05],
      [zs[0] - 0.03, zs[1] + 0.03],
      t0 + 0.02,
      t0 + 0.07,
      "grow",
      { tile: 0.5, fine: true }
    );
  };
  parapet([-4.05, 4.05], pt, [1.95, 2.05], 0.84);
  parapet([-4.05, -3.95], pt, [-3.05, 2.05], 0.84);
  parapet([-4.05, 0.45], pt, [-3.05, -2.95], 0.845);
  parapet([3.95, 4.05], pt, [-0.45, 2.05], 0.845);
  parapet([0.45, 4.05], [M1 + 0.15, M1 + 0.42], [-0.55, -0.45], 0.9);

  // AC outdoor units on the first-floor roof
  [0.9, 1.7].forEach((x, i) => {
    box("frame", [x, x + 0.55], [R0 + 0.03, R0 + 0.45], [-2.7, -2.25], 0.9 + i * 0.01, 0.94 + i * 0.01);
    box("dark", [x + 0.06, x + 0.49], [R0 + 0.1, R0 + 0.4], [-2.73, -2.7], 0.92 + i * 0.01, 0.95 + i * 0.01, "grow", { fine: true });
  });

  // --- Boundary, gate, driveway, landscaping ---
  const bwall = (xs, ys, zs, t0) => {
    box("plaster", xs, ys, zs, t0, t0 + 0.05, "grow", { tile: 0.5 });
    box(
      "plasterWhite",
      [xs[0] - 0.03, xs[1] + 0.03],
      [ys[1], ys[1] + 0.05],
      [zs[0] - 0.03, zs[1] + 0.03],
      t0 + 0.02,
      t0 + 0.06,
      "grow",
      { tile: 0.5 }
    );
  };
  bwall([-5.2, -5.0], [0, 0.85], [-4.2, 4.2], 0.86);
  bwall([5.0, 5.2], [0, 0.85], [-4.2, 4.2], 0.865);
  bwall([-5.2, 5.2], [0, 0.85], [-4.2, -4.0], 0.87);
  box("stone", [-5.2, 0.95], [0, 0.85], [4.2, 4.42], 0.87, 0.92, "growX", { tile: 0.38 });
  box("plasterWhite", [-5.2, 0.95], [0.85, 0.9], [4.17, 4.45], 0.9, 0.93, "growX", { tile: 0.5 });

  // Gate pillars with lantern caps
  [
    [0.95, 1.18],
    [4.97, 5.2],
  ].forEach(([x0, x1], i) => {
    box("stone", [x0, x1], [0, 1.2], [4.14, 4.48], 0.88, 0.92, "grow", { tile: 0.5 });
    box("plasterWhite", [x0 - 0.04, x1 + 0.04], [1.2, 1.26], [4.1, 4.52], 0.9, 0.94, "grow", { tile: 0.5 });
    box("lamp", [x0 + 0.04, x1 - 0.04], [1.26, 1.44], [4.19, 4.43], 0.92 + i * 0.01, 0.95 + i * 0.01, "grow", { fine: true });
  });
  // Slatted gate
  box("frame", [1.18, 4.97], [0.05, 1.12], [4.28, 4.32], 0.9, 0.95, "growX");
  for (let n = 0; n < 9; n++) {
    const y = 0.13 + n * 0.11;
    box("dark", [1.24, 4.91], [y, y + 0.075], [4.315, 4.35], 0.92 + n * 0.004, 0.95 + n * 0.004, "growX", { fine: true });
  }

  [-4.6, -2.6, -0.7].forEach((x, i) => {
    box("stone", [x, x + 0.26], [0, 1.02], [4.12, 4.5], 0.885 + i * 0.008, 0.925 + i * 0.008, "grow", { tile: 0.5 });
    box("plasterWhite", [x - 0.03, x + 0.29], [1.02, 1.08], [4.09, 4.53], 0.9 + i * 0.008, 0.94 + i * 0.008, "grow", { tile: 0.5 });
  });

  box("paver", [1.15, 4.95], [0, 0.06], [2.96, 4.18], 0.88, 0.93, "growZ", { tile: 0.7 }); // driveway
  box("paver", [1.3, 4.0], [PL, PL + 0.03], [-0.36, 2.82], 0.89, 0.94, "growZ", { tile: 0.5 }); // porch floor
  box("paver", [4.2, 4.95], [0, 0.06], [-4.0, 2.96], 0.89, 0.94, "growZ", { tile: 0.7 }); // side path
  box("grass", [-4.95, -4.22], [0, 0.05], [-3.95, 4.18], 0.9, 0.96, "growZ", { tile: 1.1 });
  box("grass", [-4.22, 0.12], [0, 0.05], [2.99, 4.18], 0.91, 0.96, "growX", { tile: 1.1 });
  box("grass", [-4.22, 4.15], [0, 0.05], [-3.95, -3.22], 0.92, 0.97, "growX", { tile: 1.1 });
  box("hedge", [-4.7, -0.4], [0.9, 1.18], [4.24, 4.4], 0.94, 0.97, "growX");
  box("hedge", [-3.9, -1.5], [0.04, 0.34], [2.3, 2.62], 0.95, 0.98, "growX");
  box("hedge", [-4.85, -4.5], [0.04, 0.42], [-3.6, 3.4], 0.95, 0.98, "growZ");
  box("paver", [0.16, 1.12], [0, 0.06], [2.96, 4.18], 0.92, 0.96, "growZ", { tile: 0.7 }); // path from gate to door

  // Porch downlights and a wall light by the door
  [-2.6, -0.7, 2.0, 3.2].forEach((x, i) =>
    box("lamp", [x, x + 0.16], [G1 - 0.05, G1 - 0.01], [1.2, 1.36], 0.93 + i * 0.008, 0.96 + i * 0.008, "grow", { fine: true })
  );
  box("lamp", [1.12, 1.2], [1.0, 1.24], [fz + 0.02, fz + 0.1], 0.94, 0.97, "grow", { fine: true });

  return els;
}

const TREES = [
  { pos: [-4.35, 0, 3.2], s: 1.05, t0: 0.93, tone: 0 },
  { pos: [-4.4, 0, -3.3], s: 0.92, t0: 0.95, tone: 1 },
  { pos: [-0.6, 0, -3.5], s: 0.78, t0: 0.96, tone: 2 },
  { pos: [6.3, 0, 3.9], s: 1.35, t0: 0.94, tone: 1 },
  { pos: [-6.5, 0, 1.2], s: 1.45, t0: 0.95, tone: 0 },
  { pos: [-6.3, 0, -2.8], s: 1.15, t0: 0.97, tone: 2 },
];

// Materials whose pieces are worth putting through the shadow pass.
const CASTS_SHADOW = new Set(["masonry", "concrete", "plaster", "plasterWhite", "stone", "wood", "tile", "dark"]);

function useMaterials(bump = true, textureSize = 512) {
  return useMemo(() => {
    const tex = getTextures(textureSize, bump);
    // `bump` is false only on the low tier, which is also where we avoid the
    // heavier physical-material shaders.
    const Glossy = bump ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
    const gloss = (o) => (bump ? o : { ...o, clearcoat: undefined, clearcoatRoughness: undefined });

    const surf = (t, o = {}) =>
      new THREE.MeshStandardMaterial({
        map: t.map,
        ...(bump ? { bumpMap: t.bumpMap, bumpScale: t.bumpScale } : {}),
        roughness: 0.82,
        envMapIntensity: 0.7,
        ...o,
      });

    const mats = {
      dirt: new THREE.MeshStandardMaterial({ color: "#a98b63", roughness: 1 }),
      concrete: surf(tex.concrete, { roughness: 0.88 }),
      plaster: surf(tex.plaster, { roughness: 0.85 }),
      plasterWhite: surf(tex.plasterWhite, { roughness: 0.8 }),
      brick: surf(tex.brick, { roughness: 0.95, bumpScale: 0.03 }),
      stone: surf(tex.stone, { roughness: 0.7 }),
      wood: surf(tex.wood, { roughness: 0.55, envMapIntensity: 0.9 }),
      tile: surf(tex.tile, { roughness: 0.6 }),
      paver: surf(tex.paver, { roughness: 0.85 }),
      grass: surf(tex.grass, { roughness: 1 }),
      asphalt: new THREE.MeshStandardMaterial({ color: "#4b4f55", roughness: 0.95 }),
      frame: new THREE.MeshStandardMaterial({ color: "#2a2f36", roughness: 0.35, metalness: 0.75, envMapIntensity: 1.1 }),
      dark: new THREE.MeshStandardMaterial({ color: "#3a4048", roughness: 0.45, metalness: 0.6 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#3f7a3c", roughness: 1 }),
      shadowline: new THREE.MeshStandardMaterial({ color: "#6d675d", roughness: 1 }),
      glass: new Glossy(gloss({
        color: "#233846",
        roughness: 0.03,
        metalness: 0.95,
        clearcoat: 1,
        clearcoatRoughness: 0.02,
        envMapIntensity: 3.4,
        emissive: new THREE.Color("#ffd9a8"),
        emissiveIntensity: 0,
      })),
      lamp: new THREE.MeshStandardMaterial({
        color: "#fff3dd",
        emissive: new THREE.Color("#ffca7a"),
        emissiveIntensity: 0,
        roughness: 0.4,
      }),
      steel: new THREE.MeshStandardMaterial({ color: "#8a939e", roughness: 0.4, metalness: 0.7 }),
      trunk: surf(tex.wood, { roughness: 0.95, color: new THREE.Color("#6a4a2e") }),
      leafA: new THREE.MeshStandardMaterial({ color: "#3e7f3a", roughness: 0.9 }),
      leafB: new THREE.MeshStandardMaterial({ color: "#2f6b4f", roughness: 0.9 }),
      leafC: new THREE.MeshStandardMaterial({ color: "#568c3f", roughness: 0.9 }),
      car: new Glossy(gloss({ color: "#1b2c44", roughness: 0.18, metalness: 0.6, clearcoat: 1 })),
      tyre: new THREE.MeshStandardMaterial({ color: "#16181a", roughness: 0.9 }),
      chrome: new THREE.MeshStandardMaterial({ color: "#c9ced4", roughness: 0.2, metalness: 0.95 }),
      mixer: new THREE.MeshStandardMaterial({ color: "#c79a2c", roughness: 0.5, metalness: 0.35 }),
      edge: new THREE.LineBasicMaterial({ color: "#1d2c3e", transparent: true, opacity: 0.35 }),
    };
    mats.masonry = mats.brick;
    return mats;
  }, [bump, textureSize]);
}

function applyElement(mesh, el, p) {
  const e = presence(p, el);
  if (e <= 0.0005) {
    mesh.visible = false;
    return;
  }
  mesh.visible = true;
  const [x, y, z] = el.pos;
  const h = el.size[1];
  let sx = 1,
    sy = 1,
    sz = 1,
    oy = 0;
  switch (el.mode) {
    case "grow":
      sy = e;
      break;
    case "growX":
      sx = e;
      break;
    case "growZ":
      sz = e;
      break;
    case "growXZ":
      sx = e;
      sz = e;
      break;
    case "drop":
      oy = (1 - e) * 2.4;
      break;
    case "pop": {
      const s = el.t2 !== undefined && p > el.t2 ? e : easeOutBack(seg(p, el.t0, el.t1));
      sx = sy = sz = s;
      break;
    }
    default:
      break;
  }
  mesh.scale.set(Math.max(sx, 1e-4), Math.max(sy, 1e-4), Math.max(sz, 1e-4));
  mesh.position.set(x, y + (h * sy) / 2 + oy, z);
}

function usePop(ref, progress, t0, dur = 0.05, t2, t3) {
  useFrame(() => {
    const p = progress.value;
    let s = easeOutBack(seg(p, t0, t0 + dur));
    if (t2 !== undefined) s *= 1 - easeOutCubic(seg(p, t2, t3));
    const g = ref.current;
    g.visible = s > 0.001;
    g.scale.setScalar(Math.max(s, 1e-4));
  });
}

/*
 * Every tree's foliage in one instanced mesh, and every trunk in another.
 * Layered blobs read far better than a single low-poly canopy, but as separate
 * meshes they were over a hundred draw calls per frame — twice that with
 * shadows. Instancing brings the whole grove down to two.
 */
function Grove({ trees, progress, mats, blobCount = 16, blueprint = false, shadows = true }) {
  const leaves = useRef();
  const trunks = useRef();

  const blobs = useMemo(() => {
    const out = [];
    trees.forEach((tree, t) => {
      const rng = (i) => Math.sin(i * 127.1 + tree.pos[0] * 13.7) * 0.5;
      for (let i = 0; i < blobCount; i++) {
        out.push({
          tree: t,
          p: [rng(i) * 0.62, 1.05 + (i % 6) * 0.14 + rng(i + 3) * 0.16, rng(i + 7) * 0.62],
          r: 0.16 + Math.abs(rng(i + 11)) * 0.16,
          tone: Math.abs(Math.round(rng(i + 5) * 6)) % 3,
        });
      }
    });
    return out;
  }, [trees, blobCount]);

  // One shared material; per-instance colour carries the tonal variation.
  const leafMaterial = useMemo(() => {
    if (blueprint) return mats.leafA;
    const m = mats.leafA.clone();
    m.color.set("#ffffff");
    return m;
  }, [mats.leafA, blueprint]);

  // instanceColor multiplies the (white) material colour, so one material
  // still gives three leaf tones.
  useEffect(() => {
    const lm = leaves.current;
    if (!lm || blueprint) return;
    const tones = [mats.leafA.color, mats.leafB?.color ?? mats.leafA.color, mats.leafC?.color ?? mats.leafA.color];
    blobs.forEach((b, i) => lm.setColorAt(i, tones[b.tone] ?? tones[0]));
    if (lm.instanceColor) lm.instanceColor.needsUpdate = true;
  }, [blobs, mats, blueprint]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = progress.value;
    // Each tree pops in on its own cue; an instance at zero scale costs nothing.
    const grow = trees.map((t) => Math.max(0, easeOutBack(seg(p, t.t0, t.t0 + 0.05))));

    const lm = leaves.current;
    const tm = trunks.current;
    if (!lm || !tm) return;

    const any = grow.some((g) => g > 0.001);
    lm.visible = any;
    tm.visible = any;
    if (!any) return;

    blobs.forEach((b, i) => {
      const tree = trees[b.tree];
      const k = grow[b.tree] * tree.s;
      dummy.position.set(tree.pos[0] + b.p[0] * k, b.p[1] * k, tree.pos[2] + b.p[2] * k);
      dummy.scale.setScalar(Math.max(b.r * k, 1e-4));
      dummy.updateMatrix();
      lm.setMatrixAt(i, dummy.matrix);
    });
    lm.instanceMatrix.needsUpdate = true;

    trees.forEach((tree, i) => {
      const k = grow[i] * tree.s;
      dummy.position.set(tree.pos[0], 0.55 * k, tree.pos[2]);
      dummy.scale.set(Math.max(k, 1e-4), Math.max(k, 1e-4), Math.max(k, 1e-4));
      dummy.updateMatrix();
      tm.setMatrixAt(i, dummy.matrix);
    });
    tm.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={leaves}
        args={[undefined, undefined, blobs.length]}
        material={leafMaterial}
        castShadow={shadows}
        visible={false}
      >
        <sphereGeometry args={[1, 10, 8]} />
      </instancedMesh>
      <instancedMesh
        ref={trunks}
        args={[undefined, undefined, trees.length]}
        material={mats.trunk}
        castShadow={shadows}
        visible={false}
      >
        <cylinderGeometry args={[0.055, 0.085, 1.1, 8]} />
      </instancedMesh>
    </>
  );
}

function Mixer({ progress, mats }) {
  const ref = useRef();
  const drum = useRef();
  usePop(ref, progress, 0.05, 0.05, 0.84, 0.9);
  useFrame((_, dt) => {
    drum.current.rotation.x += dt * 2.2;
  });
  return (
    <group ref={ref} position={[-1.9, 0, 3.6]} rotation={[0, 0.5, 0]} visible={false}>
      <mesh material={mats.dark} position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.9]} />
      </mesh>
      <mesh material={mats.dark} position={[0, 0.35, -0.2]}>
        <boxGeometry args={[0.06, 0.4, 0.06]} />
      </mesh>
      <group position={[0, 0.62, 0.05]} rotation={[0.5, 0, 0]}>
        <mesh ref={drum} material={mats.mixer} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.32, 0.7, 16]} />
        </mesh>
      </group>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} material={mats.tyre} position={[x, 0.12, 0.25]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.06, 14]} />
        </mesh>
      ))}
    </group>
  );
}

function Car({ progress, mats }) {
  const ref = useRef();
  useFrame(() => {
    const e = easeOutCubic(seg(progress.value, 0.95, 1));
    const g = ref.current;
    g.visible = e > 0.001;
    g.position.z = 1.05 + (1 - e) * 5.5;
  });
  const wheels = [
    [-0.45, 0.18, 0.66],
    [0.45, 0.18, 0.66],
    [-0.45, 0.18, -0.62],
    [0.45, 0.18, -0.62],
  ];
  return (
    <group ref={ref} position={[2.62, 0.05, 1.05]} rotation={[0, 0.06, 0]} visible={false}>
      <mesh material={mats.car} position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.98, 0.26, 2.15]} />
      </mesh>
      <mesh material={mats.car} position={[0, 0.46, 0.1]} castShadow>
        <boxGeometry args={[0.94, 0.12, 1.85]} />
      </mesh>
      <mesh material={mats.car} position={[0, 0.62, -0.12]} castShadow>
        <boxGeometry args={[0.86, 0.24, 1.05]} />
      </mesh>
      <mesh material={mats.glass} position={[0, 0.63, -0.1]}>
        <boxGeometry args={[0.88, 0.2, 1.08]} />
      </mesh>
      <mesh material={mats.glass} position={[0, 0.55, 0.52]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.84, 0.3, 0.04]} />
      </mesh>
      <mesh material={mats.lamp} position={[-0.32, 0.32, 1.08]}>
        <boxGeometry args={[0.24, 0.08, 0.03]} />
      </mesh>
      <mesh material={mats.lamp} position={[0.32, 0.32, 1.08]}>
        <boxGeometry args={[0.24, 0.08, 0.03]} />
      </mesh>
      <mesh material={mats.chrome} position={[0, 0.24, 1.08]}>
        <boxGeometry args={[0.7, 0.05, 0.03]} />
      </mesh>
      {wheels.map((w, i) => (
        <group key={i} position={w} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={mats.tyre} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.13, 18]} />
          </mesh>
          <mesh material={mats.chrome} position={[0.07, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.02, 14]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Scaffolding: thin steel tubes with timber boards, removed before handover.
function Scaffold({ progress, mats }) {
  const group = useRef();
  const pieces = useMemo(() => {
    const out = [];
    const tube = (p, s, wood = false) => out.push({ p, s, wood });
    [-4.3, -2.15, 0, 2.15, 4.3].forEach((x) => tube([x, 2, 3.1], [0.05, 4, 0.05]));
    [-2.8, -0.5, 1.8].forEach((z) => tube([-4.5, 2, z], [0.05, 4, 0.05]));
    [1.55, 3.05, 3.95].forEach((y) => {
      tube([0, y, 3.1], [8.6, 0.05, 0.05]);
      tube([-4.5, y, -0.5], [0.05, 0.05, 4.6]);
    });
    [1.5, 3.0].forEach((y) => tube([0, y - 0.04, 3.1], [8.6, 0.04, 0.34], true));
    return out;
  }, []);

  useFrame(() => {
    const p = progress.value;
    const s = easeOutCubic(seg(p, 0.14, 0.24)) * (1 - easeOutCubic(seg(p, 0.84, 0.9)));
    const g = group.current;
    g.visible = s > 0.002;
    g.scale.set(1, Math.max(s, 1e-4), 1);
  });

  return (
    <group ref={group} visible={false}>
      {pieces.map(({ p, s, wood }, i) => (
        <mesh key={i} material={wood ? mats.wood : mats.steel} position={p} castShadow>
          <boxGeometry args={s} />
        </mesh>
      ))}
    </group>
  );
}

/*
 * Tower crane on the far side of the plot. It slews slowly, the trolley runs
 * along the jib and the hook rides up and down, so the site reads as alive
 * rather than a frozen model. Erected with the structure, dismantled before
 * the finishes go on.
 */
function Crane({ progress, mats }) {
  const group = useRef();
  const slew = useRef();
  const trolley = useRef();
  const hook = useRef();
  const cable = useRef();

  const MAST = 5.4;

  useFrame(({ clock }) => {
    const p = progress.value;
    const s = easeOutCubic(seg(p, 0.08, 0.18)) * (1 - easeOutCubic(seg(p, 0.8, 0.88)));
    const g = group.current;
    g.visible = s > 0.002;
    if (!g.visible) return;
    // Erects from the ground up; the constant keeps it in scale with the house.
    g.scale.set(0.92, 0.92 * Math.max(s, 1e-4), 0.92);

    const t = clock.elapsedTime;
    slew.current.rotation.y = Math.sin(t * 0.16) * 0.85 - 0.5;
    // Trolley runs out and back along the jib; the hook trails it.
    const reach = 2.6 + Math.sin(t * 0.34) * 2.2;
    trolley.current.position.x = reach;
    const lift = 2.4 + Math.sin(t * 0.52 + 1.1) * 1.6;
    hook.current.position.set(reach, lift, 0);
    cable.current.position.set(reach, (MAST + lift) / 2, 0);
    cable.current.scale.y = Math.max(0.05, MAST - lift);
  });

  return (
    <group ref={group} position={[-6.8, 0, -4.6]} visible={false}>
      {/* base */}
      <mesh material={mats.concrete} position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.24, 1.5]} />
      </mesh>
      {/* lattice mast: four legs plus a handful of braces reads as a tower
          without the cost of a real lattice */}
      {[
        [-0.22, -0.22],
        [0.22, -0.22],
        [-0.22, 0.22],
        [0.22, 0.22],
      ].map(([x, z], i) => (
        <mesh key={i} material={mats.mixer} position={[x, MAST / 2 + 0.2, z]} castShadow>
          <boxGeometry args={[0.07, MAST, 0.07]} />
        </mesh>
      ))}
      {Array.from({ length: 5 }, (_, i) => 1 + i * 0.95).map((y) => (
        <mesh key={y} material={mats.mixer} position={[0, y, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
        </mesh>
      ))}

      <group ref={slew} position={[0, MAST + 0.2, 0]}>
        {/* operator cab */}
        <mesh material={mats.mixer} position={[0.42, -0.02, 0]} castShadow>
          <boxGeometry args={[0.52, 0.46, 0.44]} />
        </mesh>
        <mesh material={mats.glass} position={[0.42, -0.02, 0.23]}>
          <boxGeometry args={[0.44, 0.34, 0.03]} />
        </mesh>
        {/* jib and counter-jib */}
        <mesh material={mats.mixer} position={[3.1, 0.24, 0]} castShadow>
          <boxGeometry args={[6.4, 0.16, 0.2]} />
        </mesh>
        <mesh material={mats.mixer} position={[-1.5, 0.24, 0]} castShadow>
          <boxGeometry args={[2.6, 0.16, 0.2]} />
        </mesh>
        {/* A-frame and tie bars */}
        <mesh material={mats.mixer} position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.1, 1.1, 0.1]} />
        </mesh>
        <mesh material={mats.steel} position={[1.7, 0.72, 0]} rotation={[0, 0, -0.32]} castShadow>
          <boxGeometry args={[3.6, 0.035, 0.035]} />
        </mesh>
        <mesh material={mats.steel} position={[-1.1, 0.72, 0]} rotation={[0, 0, 0.46]} castShadow>
          <boxGeometry args={[2.5, 0.035, 0.035]} />
        </mesh>
        {/* counterweight */}
        <mesh material={mats.dark} position={[-2.5, 0.06, 0]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.5]} />
        </mesh>

        <mesh ref={trolley} material={mats.dark} position={[2.6, 0.08, 0]} castShadow>
          <boxGeometry args={[0.28, 0.16, 0.24]} />
        </mesh>
        <mesh ref={cable} material={mats.steel}>
          <boxGeometry args={[0.02, 1, 0.02]} />
        </mesh>
        <mesh ref={hook} material={mats.steel} castShadow>
          <boxGeometry args={[0.16, 0.3, 0.16]} />
        </mesh>
      </group>
    </group>
  );
}

/*
 * Site dust. A handful of motes catching the light, densest while the
 * brickwork and plaster are going on, gone by handover.
 */
function Dust({ progress, count = 80 }) {
  const points = useRef();
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 13;
      pos[i * 3 + 1] = Math.random() * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 11;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#f0e2c4",
        size: 0.055,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, dt) => {
    const p = progress.value;
    // Fades in with the structure, peaks through the masonry, gone at handover.
    const activity = seg(p, 0.06, 0.2) * (1 - seg(p, 0.78, 0.92));
    material.opacity = activity * 0.5;
    const g = points.current;
    g.visible = material.opacity > 0.01;
    if (!g.visible) return;

    const arr = geometry.attributes.position.array;
    const step = Math.min(dt, 0.1);
    for (let i = 1; i < arr.length; i += 3) {
      arr[i] += step * 0.14;
      if (arr[i] > 5.5) arr[i] = 0;
    }
    geometry.attributes.position.needsUpdate = true;
    g.rotation.y += step * 0.02;
  });

  return <points ref={points} geometry={geometry} material={material} visible={false} />;
}

function useBlueprint(mats, enabled) {
  return useMemo(() => {
    if (!enabled) return mats;
    const fill = new THREE.MeshBasicMaterial({ color: "#bfe3ff", transparent: true, opacity: 0.1, depthWrite: false });
    const view = Object.fromEntries(Object.keys(mats).map((k) => [k, fill]));
    view.edge = new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.85 });
    return view;
  }, [mats, enabled]);
}

export default function House({
  progress,
  blueprint = false,
  immediate = false,
  quality = HIGH,
  motion,
  ...props
}) {
  // Weak devices skip the fine trim (mullions, sills, slats, lamps): roughly a
  // third of the meshes, for detail you cannot see on a phone anyway.
  const plan = useMemo(
    () => (quality.detail === false ? buildPlan().filter((el) => !el.fine) : buildPlan()),
    [quality.detail]
  );
  const mats = useMaterials(quality.bump, quality.textureSize);
  const view = useBlueprint(mats, blueprint);
  const meshes = useRef([]);
  const outline = useRef();
  const state = useRef({ value: immediate ? progress.current ?? 0 : 0, started: false, applied: NaN });

  // One geometry per element, with UVs scaled to its real size so a shared
  // texture keeps a constant physical scale on every surface.
  const geometries = useMemo(
    () => plan.map((el) => texturedBox(el.size[0], el.size[1], el.size[2], el.tile ?? 0.6)),
    [plan]
  );
  const edges = useMemo(
    () => (blueprint ? geometries.map((g) => new THREE.EdgesGeometry(g, 25)) : null),
    [blueprint, geometries]
  );

  useFrame((_, dt) => {
    const s = state.current;
    const target = progress.current ?? 0;
    // Pages that show a finished house shouldn't animate on arrival.
    if (immediate && !s.started) {
      s.started = true;
      s.value = target;
    }
    // Snappy: the model should reach the scroll position almost at once,
    // just smoothed enough to hide per-frame jitter.
    s.value = THREE.MathUtils.damp(s.value, target, 9, Math.min(dt, 0.1));
    if (Math.abs(s.value - target) < 0.0005) s.value = target;
    const p = s.value;

    // Once the model has caught up with the scroll there is nothing to
    // recompute: skip several hundred matrix updates every frame and let the
    // lights freeze the shadow map too.
    const settled = p === s.applied;
    if (motion) motion.current.settled = settled;
    if (settled) return;
    s.applied = p;

    for (let i = 0; i < plan.length; i++) {
      const m = meshes.current[i];
      if (!m) continue;
      applyElement(m, plan[i], p);
      // Brickwork gets plastered between 0.70 and 0.80
      if (!blueprint && plan[i].mat === "masonry" && !plan[i].raw) {
        m.material = p < 0.75 ? mats.brick : mats.plaster;
      }
    }

    const lit = seg(p, 0.96, 1);
    mats.glass.emissiveIntensity = lit * 0.06;
    mats.lamp.emissiveIntensity = lit * 1.6;

    if (outline.current) {
      const o = seg(p, 0, 0.04) * (1 - seg(p, 0.5, 0.7));
      outline.current.material.opacity = o;
      outline.current.visible = o > 0.01;
    }
  });

  return (
    <group {...props}>
      <Line
        ref={outline}
        points={[
          [-4.3, 0.02, -3.3],
          [4.3, 0.02, -3.3],
          [4.3, 0.02, 3.0],
          [-4.3, 0.02, 3.0],
          [-4.3, 0.02, -3.3],
        ]}
        color={blueprint ? "#ffd166" : "#ffffff"}
        lineWidth={2}
        dashed
        dashSize={0.25}
        gapSize={0.15}
        transparent
        opacity={0}
      />

      {plan.map((el, i) => (
        <mesh
          key={i}
          ref={(m) => (meshes.current[i] = m)}
          geometry={geometries[i]}
          material={view[el.mat] ?? view.plaster}
          // Only pieces big enough to throw a readable shadow join the shadow
          // pass; trim and mullions would just double the draw calls.
          castShadow={quality.shadows && !blueprint && CASTS_SHADOW.has(el.mat) && Math.max(...el.size) > 0.45}
          receiveShadow={quality.shadows}
          visible={false}
        >
          {blueprint && edges && <lineSegments geometry={edges[i]} material={view.edge} />}
        </mesh>
      ))}

      <Grove
        trees={TREES.slice(0, quality.trees)}
        progress={state.current}
        mats={view}
        blobCount={quality.leafBlobs}
        blueprint={blueprint}
        shadows={quality.shadows}
      />
      <Scaffold progress={state.current} mats={view} />
      {quality.crane && !blueprint && <Crane progress={state.current} mats={view} />}
      {quality.dust > 0 && !blueprint && <Dust progress={state.current} count={quality.dust} />}
      <Mixer progress={state.current} mats={view} />
      <Car progress={state.current} mats={view} />
    </group>
  );
}
