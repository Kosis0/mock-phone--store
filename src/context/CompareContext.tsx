"use client";
import { createContext, useContext, useEffect, useState } from "react";
type CompareContextValue = { slugs: string[]; toggle: (slug: string) => void; setSlugs: (slugs: string[]) => void };
const CompareContext = createContext<CompareContextValue | null>(null);
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => { try { setSlugs(JSON.parse(localStorage.getItem("iphone-compare") || "[]")); } catch { setSlugs([]); } }, []);
  useEffect(() => { localStorage.setItem("iphone-compare", JSON.stringify(slugs)); }, [slugs]);
  const toggle = (slug: string) => setSlugs(current => current.includes(slug) ? current.filter(x => x !== slug) : current.length < 4 ? [...current, slug] : current);
  return <CompareContext.Provider value={{ slugs, toggle, setSlugs }}>{children}</CompareContext.Provider>;
}
export const useCompare = () => { const value = useContext(CompareContext); if (!value) throw new Error("useCompare must be used inside CompareProvider"); return value; };
