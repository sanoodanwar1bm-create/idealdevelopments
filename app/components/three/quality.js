"use client";

import { useState } from "react";

/*
 * One place to decide how much scene a device can afford.
 * Phones and low-core laptops drop shadows, texture bumps, particles and
 * foliage detail; everything else keeps the full scene. The tier is decided
 * once on mount so nothing re-mounts the Canvas mid-scroll.
 */

const HIGH = {
  name: "high",
  dpr: [1, 1.6],
  shadows: true,
  shadowMap: 1536,
  envResolution: 256,
  bump: true,
  trees: 6,
  leafBlobs: 16,
  dust: 90,
  crane: true,
  antialias: true,
  detail: true,
  textureSize: 512,
};

const MID = {
  ...HIGH,
  name: "mid",
  dpr: [1, 1.4],
  shadowMap: 1024,
  envResolution: 128,
  trees: 5,
  leafBlobs: 10,
  dust: 45,
  textureSize: 384,
};

const LOW = {
  name: "low",
  dpr: [1, 1.3],
  shadows: false,
  shadowMap: 512,
  envResolution: 64,
  bump: false,
  trees: 3,
  leafBlobs: 6,
  dust: 0,
  crane: true,
  antialias: false,
  detail: false,
  textureSize: 256,
};

function detect() {
  if (typeof window === "undefined") return MID;

  // ?quality=low|mid|high — for checking a tier on a real phone.
  const forced = new URLSearchParams(window.location.search).get("quality");
  if (forced === "low") return LOW;
  if (forced === "mid") return MID;
  if (forced === "high") return HIGH;

  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;
  const narrow = window.innerWidth < 900;
  const saveData = navigator.connection?.saveData ?? false;

  if (saveData || cores <= 4 || memory <= 4 || (coarse && narrow)) return LOW;
  if (coarse || cores <= 8 || window.innerWidth < 1280) return MID;
  return HIGH;
}

export function useQuality() {
  // Decided once: every consumer mounts client-side only, so there is no
  // hydration to match, and the Canvas never has to rebuild its render target.
  const [tier] = useState(detect);
  return tier;
}

export { HIGH, MID, LOW };
