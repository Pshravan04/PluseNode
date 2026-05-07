"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const IconHome = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? 0 : 2} className="w-5 h-5">
    <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9 21 9 15 12 15C15 15 15 21 15 21M9 21H15" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSearch = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="11" cy="11" r="8" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} />
    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeLinecap="round" />
    {active && <circle cx="11" cy="11" r="4" fill="white" />}
  </svg>
);

const IconLibrary = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M3 18V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12" strokeLinecap="round"/>
    <path d="M3 18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" strokeLinecap="round"/>
    <path d="M9 10h6M9 14h4" strokeLinecap="round"/>
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/", label: "Home", Icon: IconHome },
    { href: "/search", label: "Search", Icon: IconSearch },
    { href: "/library", label: "Library", Icon: IconLibrary },
  ];

  return (
    <nav className="fixed bottom-[88px] left-1/2 -translate-x-1/2 z-40 flex gap-8 px-8 py-2 glass-pill">
      {tabs.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              active ? "text-purple-300" : "text-white/40 hover:text-white/70"
            }`}
          >
            <Icon active={active} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
