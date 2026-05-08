"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-sm font-medium transition ${isActive ? "text-brand-primary" : "text-[#5f5244] hover:text-brand-primary"}`}
    >
      {children}
    </Link>
  );
}

const NAV_LINKS = [
  { href: "/customers", label: "Customers" },
  { href: "/vendors",   label: "Vendors" },
  { href: "/about",     label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[#e2d8ca] bg-[#fdfaf4]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src="/cabbage.png" alt="" className="h-10 w-auto" />
          <span className="font-amatic text-2xl font-bold leading-none">
            County Farm Collective
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href}>{label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://cfc.localline.ca"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-[#f7f4ed] shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-primary-dark"
          >
            <span className="md:hidden">Shop</span>
            <span className="hidden md:inline">Shop Weekly</span>
          </a>

          {/* Hamburger — mobile only */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5f5244] transition hover:bg-[#f0e8dc] md:hidden"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="2" x2="16" y2="16" />
                <line x1="16" y1="2" x2="2" y2="16" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="2" y1="4"  x2="16" y2="4"  />
                <line x1="2" y1="9"  x2="16" y2="9"  />
                <line x1="2" y1="14" x2="16" y2="14" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-[#e2d8ca] bg-[#fdfaf4] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <NavLink href={href} onClick={() => setOpen(false)}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
