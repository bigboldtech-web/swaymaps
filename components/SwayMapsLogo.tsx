"use client";

import React from "react";
import Image from "next/image";

/**
 * SwayMaps wordmark logo — /public/swaymaps-logo.png (430x110, cropped tight).
 * Only constrain width; height scales naturally to preserve aspect ratio.
 */

/* ──────────────────── Sidebar / Compact Logo ──────────────────── */
export function SwayMapsIcon({ size = 32 }: { size?: number }) {
  // size controls the width of the logo
  const w = size * 4;
  return (
    <Image
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      width={430}
      height={110}
      style={{ width: w, height: "auto" }}
      priority
    />
  );
}

/* ──────────────────── Full Logo ──────────────────── */
export function SwayMapsLogo({ width = 120 }: { width?: number }) {
  return (
    <Image
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      width={430}
      height={110}
      style={{ width, height: "auto" }}
      priority
    />
  );
}

/* ──────────────────── Auth Page Logo (larger) ──────────────────── */
export function SwayMapsAuthLogo({ size = "default" }: { size?: "default" | "small" }) {
  const w = size === "small" ? 150 : 200;
  return (
    <Image
      src="/swaymaps-logo.png"
      alt="SwayMaps"
      width={430}
      height={110}
      style={{ width: w, height: "auto" }}
      priority
    />
  );
}
