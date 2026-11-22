"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MOCK_IPHONES } from "@/data/mockIphones";
import { useCompare } from "@/context/CompareContext";
import { useTheme } from "@/context/ThemeContext";

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { slugs } = useCompare();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? MOCK_IPHONES.filter((phone) => {
        const searchable = [
          phone.name,
          phone.series,
          String(phone.releaseYear),
          phone.chipset.name,
          phone.frameMaterial,
          phone.portType,
          ...phone.variants.map((v) => `${v.modelNumber} ${v.identifier}`),
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(trimmed);
      }).slice(0, 6)
    : [];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "SELECT"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      } else if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    const onClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const navLinks = (
    <>
      <Link href="/" className={pathname === "/" ? "is-active" : ""}>
        Devices
      </Link>
      <Link
        href="/compare"
        className={pathname.startsWith("/compare") ? "is-active" : ""}
      >
        Compare
        {slugs.length > 0 && (
          <span className="nav-count" aria-label={`${slugs.length} selected`}>
            {slugs.length}
          </span>
        )}
      </Link>
      <Link
        href="/timeline"
        className={pathname.startsWith("/timeline") ? "is-active" : ""}
      >
        Timeline
      </Link>
    </>
  );

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">◉</span> spec<span>wise</span>
        </Link>

        <nav className="nav-desktop-links" aria-label="Primary navigation">
          {navLinks}
        </nav>

        <div className="nav-search" ref={searchRef}>
          <span aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            aria-label="Search iPhone specifications"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            placeholder="Search iPhone, chip, model number…"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
            >
              ×
            </button>
          ) : (
            <kbd className="nav-kbd" aria-hidden="true">
              /
            </kbd>
          )}

          {open && trimmed.length > 0 && (
            <div className="search-results" role="listbox">
              {results.length > 0 ? (
                results.map((phone) => (
                  <div className="search-result" key={phone.slug}>
                    <Link
                      href={`/iphone/${phone.slug}`}
                      className="search-result-main"
                      onClick={() => {
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      <span
                        className="search-swatch"
                        style={{ background: phone.finishes[0]?.hexCode }}
                        aria-hidden="true"
                      />
                      <span>
                        <strong>{phone.name}</strong>
                        <small>
                          {phone.chipset.name} · {phone.releaseYear} ·{" "}
                          {phone.launchMsrp}
                        </small>
                      </span>
                    </Link>
                    <Link
                      className="search-compare"
                      href={`/compare?models=${phone.slug}`}
                      onClick={() => {
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      Compare ↗
                    </Link>
                  </div>
                ))
              ) : (
                <div className="search-empty">
                  No iPhone matches &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={theme === "dark"}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <span className="theme-toggle-icon">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </span>
          <span className="theme-toggle-label">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </button>
      </div>

      <nav className="nav-mobile-bar" aria-label="Mobile navigation">
        {navLinks}
      </nav>
    </header>
  );
}
