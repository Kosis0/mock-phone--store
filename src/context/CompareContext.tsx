"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { MOCK_IPHONES } from "@/data/mockIphones";

type CompareContextValue = {
  slugs: string[];
  hydrated: boolean;
  toggle: (slug: string) => void;
  setSlugs: (slugs: string[]) => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);
const knownSlugs = new Set(MOCK_IPHONES.map((phone) => phone.slug));

function normalizeSlugs(slugs: unknown): string[] {
  if (!Array.isArray(slugs)) return [];
  return [...new Set(slugs.filter((slug): slug is string =>
    typeof slug === "string" && knownSlugs.has(slug)
  ))].slice(0, 4);
}

function equalSlugs(a: string[], b: string[]) {
  return a.length === b.length && a.every((slug, index) => slug === b[index]);
}

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSelectedSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("iphone-compare") || "[]");
      setSelectedSlugs(normalizeSlugs(saved));
    } catch {
      setSelectedSlugs([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("iphone-compare", JSON.stringify(slugs));
    } catch {
      // Keep comparison usable if browser storage is disabled or full.
    }
  }, [hydrated, slugs]);

  const setSlugs = useCallback((next: string[]) => {
    const normalized = normalizeSlugs(next);
    setSelectedSlugs((current) =>
      equalSlugs(current, normalized) ? current : normalized
    );
  }, []);

  const toggle = useCallback((slug: string) => {
    if (!knownSlugs.has(slug)) return;
    setSelectedSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      return current.length < 4 ? [...current, slug] : current;
    });
  }, []);

  return (
    <CompareContext.Provider value={{ slugs, hydrated, toggle, setSlugs }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => {
  const value = useContext(CompareContext);
  if (!value) throw new Error("useCompare must be used inside CompareProvider");
  return value;
};
