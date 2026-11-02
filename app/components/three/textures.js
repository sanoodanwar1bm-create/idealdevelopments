import * as THREE from "three";

/*
 * Procedural surface textures drawn on a canvas: no image files to download.
 * Each returns { map, bumpMap } so surfaces catch light like real materials.
 * World scale: 1 unit ≈ 2.5 m.
 */

// Texture resolution is set per device tier; every drawing routine scales its
// work with it, so a phone draws a quarter of the strokes a desktop does.
let SIZE = 512;

function canvas(draw) {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const g = c.getContext("2d");
  draw(g, SIZE);
  return c;
}

// Scale an operation count with the texture area (512 ⇒ 1, 256 ⇒ 0.25).
const n = (count) => Math.max(40, Math.round((count * SIZE * SIZE) / (512 * 512)));

function toTexture(c, repeat = 1, anisotropy = 8) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = anisotropy;
  return t;
}

// Speckle a surface with soft noise for a hand-finished look.
function speckle(g, s, count, colors, radius = 2) {
  for (let i = 0; i < count; i++) {
    g.fillStyle = colors[(Math.random() * colors.length) | 0];
    g.globalAlpha = 0.04 + Math.random() * 0.12;
    const r = radius * (0.4 + Math.random());
    g.beginPath();
    g.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
}

function plasterCanvas(base, light, dark) {
  return canvas((g, s) => {
    g.fillStyle = base;
    g.fillRect(0, 0, s, s);
    speckle(g, s, n(2600), [light, dark], 3.2);
  });
}

// Brick courses with mortar joints; one tile covers ~1 m.
function brickCanvas() {
  return canvas((g, s) => {
    const rows = 7;
    const h = s / rows;
    g.fillStyle = "#9a8f80"; // mortar
    g.fillRect(0, 0, s, s);
    const tones = ["#a8563a", "#b5623c", "#9c4f34", "#bd6f46", "#8f4a30", "#ad5c3d"];
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? -s / 8 : 0;
      for (let i = -1; i < 5; i++) {
        const w = s / 4;
        const x = i * w + offset;
        const y = r * h;
        g.fillStyle = tones[(Math.random() * tones.length) | 0];
        g.fillRect(x + 2, y + 2, w - 4, h - 4);
        // subtle shading inside each brick
        g.fillStyle = "rgba(0,0,0,0.06)";
        g.fillRect(x + 2, y + h - 6, w - 4, 4);
      }
    }
    speckle(g, s, n(1200), ["#000000", "#ffffff"], 2);
  });
}

// Sawn stone cladding: horizontal bands with fine grout lines.
function stoneCanvas() {
  return canvas((g, s) => {
    g.fillStyle = "#b3a181";
    g.fillRect(0, 0, s, s);
    const rows = 9;
    const h = s / rows;
    const tones = ["#c4ae8f", "#bca786", "#cab596", "#b49f7e", "#c7b192"];
    for (let r = 0; r < rows; r++) {
      let x = r % 2 ? -s * 0.2 : 0;
      while (x < s) {
        const w = s * (0.16 + Math.random() * 0.12);
        g.fillStyle = tones[(Math.random() * tones.length) | 0];
        g.fillRect(x + 1.5, r * h + 1.5, w - 3, h - 3);
        x += w;
      }
    }
    speckle(g, s, n(2600), ["#8d7a60", "#efe0c8"], 2);
  });
}

// Vertical wood louvers / WPC cladding.
function woodCanvas() {
  return canvas((g, s) => {
    g.fillStyle = "#8d5b2e";
    g.fillRect(0, 0, s, s);
    const slats = 8;
    const w = s / slats;
    for (let i = 0; i < slats; i++) {
      const tone = ["#9c6536", "#8a562c", "#a87040", "#7d4d27"][(Math.random() * 4) | 0];
      g.fillStyle = tone;
      g.fillRect(i * w + 1.5, 0, w - 3, s);
      // grain
      for (let k = 0; k < n(26); k++) {
        g.strokeStyle = `rgba(0,0,0,${0.03 + Math.random() * 0.06})`;
        g.lineWidth = 0.6 + Math.random();
        g.beginPath();
        const x = i * w + 3 + Math.random() * (w - 6);
        g.moveTo(x, 0);
        g.bezierCurveTo(x + 4, s / 3, x - 4, (s * 2) / 3, x + 2, s);
        g.stroke();
      }
      // shadow gap
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.fillRect(i * w, 0, 1.5, s);
    }
  });
}

// Driveway pavers.
function paverCanvas() {
  return canvas((g, s) => {
    g.fillStyle = "#7d8288";
    g.fillRect(0, 0, s, s);
    const rows = 6;
    const h = s / rows;
    const tones = ["#8f959b", "#9aa0a5", "#868c92", "#a2a7ab"];
    for (let r = 0; r < rows; r++) {
      const offset = r % 2 ? -h : 0;
      for (let i = -1; i < rows + 1; i++) {
        g.fillStyle = tones[(Math.random() * tones.length) | 0];
        g.fillRect(i * (h * 2) + offset + 2, r * h + 2, h * 2 - 4, h - 4);
      }
    }
    speckle(g, s, n(1500), ["#000000", "#ffffff"], 2);
  });
}

// Lawn.
function grassCanvas() {
  return canvas((g, s) => {
    g.fillStyle = "#4e7d3a";
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < n(3500); i++) {
      g.strokeStyle = ["#5d9145", "#426b31", "#6aa04d", "#375c29"][(Math.random() * 4) | 0];
      g.lineWidth = 1;
      const x = Math.random() * s;
      const y = Math.random() * s;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + (Math.random() - 0.5) * 3, y - 3 - Math.random() * 4);
      g.stroke();
    }
  });
}

// Roof / terrace tiles.
function tileCanvas() {
  return canvas((g, s) => {
    g.fillStyle = "#b9b2a4";
    g.fillRect(0, 0, s, s);
    const cells = 4;
    const t = s / cells;
    for (let i = 0; i < cells; i++) {
      for (let j = 0; j < cells; j++) {
        g.fillStyle = ["#c3bcae", "#b5ada0", "#cac3b5", "#aea699"][(Math.random() * 4) | 0];
        g.fillRect(i * t + 2, j * t + 2, t - 4, t - 4);
      }
    }
    speckle(g, s, n(900), ["#000000", "#ffffff"], 2);
  });
}

function concreteCanvas() {
  return plasterCanvas("#a7adb3", "#b8bdc2", "#8d939a");
}

let cache = null;
let cacheKey = "";

export function getTextures(size = 512, bump = true) {
  const key = `${size}:${bump}`;
  if (cache && cacheKey === key) return cache;
  SIZE = size;
  cacheKey = key;

  // The same texture serves as colour map and bump map (bump reads the red
  // channel), so each material costs one upload instead of two.
  const make = (c, repeat, bumpScale) => {
    const map = toTexture(c, repeat);
    return { map, bumpMap: bump ? map : null, bumpScale };
  };

  cache = {
    plaster: make(plasterCanvas("#b5ad9d", "#c5bdad", "#9b9382"), 1, 0.016),
    plasterWhite: make(plasterCanvas("#cac3b5", "#d8d2c7", "#aea798"), 1, 0.012),
    brick: make(brickCanvas(), 1, 0.02),
    stone: make(stoneCanvas(), 1, 0.014),
    wood: make(woodCanvas(), 1, 0.01),
    paver: make(paverCanvas(), 1, 0.012),
    grass: make(grassCanvas(), 1, 0.01),
    tile: make(tileCanvas(), 1, 0.008),
    concrete: make(concreteCanvas(), 1, 0.008),
  };
  return cache;
}

/*
 * A box whose UVs are scaled by its real size, so a shared texture keeps a
 * constant physical scale on every surface (no stretching on big walls).
 * `tile` is the world size covered by one texture repeat.
 */
export function texturedBox(w, h, d, tile = 1) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const uv = geo.attributes.uv;
  // BoxGeometry face order: +x, -x, +y, -y, +z, -z (4 verts each)
  const spans = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ];
  for (let f = 0; f < 6; f++) {
    const [su, sv] = spans[f];
    for (let i = 0; i < 4; i++) {
      const idx = f * 4 + i;
      uv.setXY(idx, (uv.getX(idx) * su) / tile, (uv.getY(idx) * sv) / tile);
    }
  }
  uv.needsUpdate = true;
  return geo;
}
