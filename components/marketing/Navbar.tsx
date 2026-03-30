"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./ui/Button";
import { navLinks } from "@/lib/marketing-constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(7,11,20,0.85)"
            : "rgba(7,11,20,0.4)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid rgba(26,35,64,0.6)"
            : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo size={28} href="/landing" />

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-[#8091b3] hover:text-[#e4e9f4] transition-colors duration-200 rounded-lg hover:bg-[#0f1629]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="sm" href="/auth/signin">
              Sign In
            </Button>
            <Button variant="primary" size="sm" href="/auth/signup">
              Start Free
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#8091b3] hover:text-[#e4e9f4] hover:bg-[#0f1629] transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M3 6h14M3 10h14M3 14h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-[#0b1120] border-l border-[#1a2340] transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#1a2340]">
          <Logo size={24} href="/landing" />
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-[#8091b3] hover:text-[#e4e9f4] hover:bg-[#0f1629] transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4L4 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2.5 text-sm font-medium text-[#8091b3] hover:text-[#e4e9f4] transition-colors duration-200 rounded-lg hover:bg-[#0f1629]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#1a2340] flex flex-col gap-3">
          <Button
            variant="outline"
            size="md"
            href="/auth/signin"
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            variant="primary"
            size="md"
            href="/auth/signup"
            className="w-full"
          >
            Start Free
          </Button>
        </div>
      </div>
    </>
  );
}
