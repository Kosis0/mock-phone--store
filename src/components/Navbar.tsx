"use client";
import Link from "next/link";
import { useState } from "react";
import { MOCK_IPHONES } from "@/data/mockIphones";
export default function Navbar() {
  const [q, setQ] = useState("");
  const results = q.trim() ? MOCK_IPHONES.filter(p => `${p.name} ${p.chipset.name} ${p.variants.map(v => `${v.modelNumber} ${v.identifier}`).join(" ")}`.toLowerCase().includes(q.toLowerCase())).slice(0, 5) : [];
  return <header className="nav"><div className="nav-inner"><Link href="/" className="brand"><span className="brand-mark">◉</span> spec<span>wise</span></Link><nav><Link href="/">Devices</Link><a href="/#compare">Compare</a></nav><div className="nav-search"><span>⌕</span><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search iPhone, chip, model number…" />{q && <button onClick={() => setQ("")}>×</button>}{results.length > 0 && <div className="search-results">{results.map(p => <div className="search-result" key={p.slug}><Link href={`/iphone/${p.slug}`} onClick={() => setQ("")}>{p.name}<small>{p.chipset.name} · {p.releaseYear}</small></Link><Link className="search-compare" href={`/compare?models=${p.slug}`}>Compare ↗</Link></div>)}</div>}</div><div className="nav-status"><i /> TECHNICAL INDEX</div></div></header>;
}
