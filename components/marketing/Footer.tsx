import Link from "next/link";
import Logo from "./Logo";
import { footerSections } from "@/lib/marketing-constants";

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex items-center justify-center w-9 h-9 rounded-lg text-[#4a5a7a] hover:text-[#8091b3] hover:bg-[#0f1629] transition-colors duration-200"
      aria-label={label}
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1a2340]" style={{ background: "#070b14" }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 lg:pr-4">
            <Logo size={28} href="/landing" />
            <p className="mt-4 text-sm text-[#8091b3] leading-relaxed max-w-xs">
              The visual dependency intelligence platform. Map, understand, and communicate how your systems connect.
            </p>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4a5a7a] mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#8091b3] hover:text-[#e4e9f4] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#1a2340] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4a5a7a]">
            2026 SwayMaps. All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-1">
            {/* Twitter / X */}
            <SocialIcon label="Twitter">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12.6 1.5h2.2L9.9 7.1l5.8 7.4h-4.6L7.6 10l-4 4.5H1.4l5.2-5.9L1.1 1.5h4.7l3.2 4.2 3.6-4.2zm-.8 11.5h1.2L5.1 2.7H3.8l8 10.3z"
                  fill="currentColor"
                />
              </svg>
            </SocialIcon>

            {/* GitHub */}
            <SocialIcon label="GitHub">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 .5A7.5 7.5 0 0 0 5.63 15.13c.37.07.5-.16.5-.36v-1.39c-2.07.45-2.5-.87-2.5-.87-.34-.86-.83-1.09-.83-1.09-.68-.46.05-.45.05-.45.75.05 1.15.77 1.15.77.67 1.14 1.75.81 2.18.62.07-.48.26-.81.47-.99-1.65-.19-3.38-.82-3.38-3.66 0-.81.29-1.47.77-1.99-.08-.19-.33-.94.07-1.96 0 0 .63-.2 2.05.76A7.2 7.2 0 0 1 8 3.86c.63 0 1.27.09 1.87.25 1.42-.96 2.05-.76 2.05-.76.4 1.02.15 1.77.07 1.96.48.52.77 1.18.77 1.99 0 2.85-1.74 3.47-3.39 3.65.27.23.5.68.5 1.38v2.04c0 .2.13.44.51.36A7.5 7.5 0 0 0 8 .5z"
                  fill="currentColor"
                />
              </svg>
            </SocialIcon>

            {/* LinkedIn */}
            <SocialIcon label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4.3 14H1.5V5.3h2.8V14zM2.9 4.1C2 4.1 1.3 3.3 1.3 2.4 1.3 1.5 2 .8 2.9.8s1.6.7 1.6 1.6c0 .9-.7 1.7-1.6 1.7zM14.7 14h-2.8V9.8c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V14H6.1V5.3h2.7v1.2h.04c.38-.72 1.3-1.48 2.67-1.48 2.86 0 3.38 1.88 3.38 4.33V14z"
                  fill="currentColor"
                />
              </svg>
            </SocialIcon>

            {/* Discord */}
            <SocialIcon label="Discord">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13.1 3.1A12.2 12.2 0 0 0 10.1 2l-.3.6a11.3 11.3 0 0 0-3.6 0L5.9 2a12.2 12.2 0 0 0-3 1.1A12.6 12.6 0 0 0 .8 13a12.3 12.3 0 0 0 3.7 1.9l.3-.4.5-.8-.9-.4.2-.2a8.7 8.7 0 0 0 7.6 0l.2.2-.9.4.5.8.3.4A12.3 12.3 0 0 0 16 13a12.6 12.6 0 0 0-2.1-9.9zM5.7 11c-.8 0-1.4-.7-1.4-1.5S4.9 8 5.7 8s1.4.7 1.4 1.5S6.5 11 5.7 11zm5.4 0c-.8 0-1.4-.7-1.4-1.5S10.3 8 11.1 8s1.4.7 1.4 1.5S11.9 11 11.1 11z"
                  fill="currentColor"
                />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
