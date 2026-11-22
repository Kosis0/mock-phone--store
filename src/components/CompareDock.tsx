"use client";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import { MOCK_IPHONES } from "@/data/mockIphones";
export default function CompareDock() { const { slugs, toggle } = useCompare(); const phones = slugs.map(s => MOCK_IPHONES.find(p => p.slug === s)).filter(Boolean); if (!phones.length) return null;
  return <div className="compare-dock"><div><strong>Compare devices</strong><span>{phones.length} of 4 selected</span></div><div className="dock-devices">{phones.map(p => p && <button key={p.slug} onClick={() => toggle(p.slug)}>{p.name} <b>×</b></button>)}</div><Link className="button button-primary" href={`/compare?models=${slugs.join(",")}`}>Compare now <span>({phones.length})</span> ↗</Link></div>;
}
