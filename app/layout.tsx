import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Decode Map",
  description: "Visualize people, features, processes, systems, and issues."
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-decode"
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} bg-slate-50 text-slate-900 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
