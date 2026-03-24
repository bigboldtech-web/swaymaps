"use client";

import React from "react";

/**
 * SwayMaps wordmark logo — /public/swaymaps-logo.png (430x110, cropped tight).
 * Only constrain width; height scales naturally to preserve aspect ratio.
 */

/* ──────────────────── Sidebar / Compact Logo ──────────────────── */
export function SwayMapsIcon({ size = 32 }: { size?: number }) {
  const w = size * 4;
  return (
    <img
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      style={{ width: w, height: "auto" }}
    />
  );
}

/* ──────────────────── Full Logo ──────────────────── */
export function SwayMapsLogo({ width = 120 }: { width?: number }) {
  return (
    <img
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      style={{ width, height: "auto" }}
    />
  );
}

/* ──────────────────── Auth Page Logo (larger) ──────────────────── */
export function SwayMapsAuthLogo({ size = "default" }: { size?: "default" | "small" }) {
  const w = size === "small" ? 150 : 200;
  return (
    <img
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      style={{ width: w, height: "auto" }}
    />
  );
}
