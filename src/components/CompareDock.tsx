"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/context/CompareContext";
import { MOCK_IPHONES } from "@/data/mockIphones";

export default function CompareDock() {
  const pathname = usePathname();
  const { slugs, toggle, setSlugs } = useCompare();
  const phones = slugs
    .map((slug) => MOCK_IPHONES.find((phone) => phone.slug === slug))
    .filter((phone): phone is (typeof MOCK_IPHONES)[number] => Boolean(phone));

  if (!phones.length || pathname.startsWith("/compare")) return null;

  return (
    <div className="compare-dock" role="region" aria-label="Comparison tray">
      <div className="dock-summary">
        <strong>Compare devices</strong>
        <span>{phones.length} of 4 selected</span>
      </div>

      <div className="dock-devices">
        {phones.map((phone) => (
          <button
            type="button"
            key={phone.slug}
            aria-label={`Remove ${phone.name} from comparison`}
            onClick={() => toggle(phone.slug)}
          >
            <span
              className="dock-swatch"
              style={{ background: phone.finishes[0]?.hexCode }}
              aria-hidden="true"
            />
            {phone.name} <b aria-hidden="true">×</b>
          </button>
        ))}
      </div>

      <div className="dock-actions">
        <button
          type="button"
          className="dock-clear"
          onClick={() => setSlugs([])}
        >
          Clear
        </button>
        <Link
          className="button button-primary"
          href={`/compare?models=${slugs.join(",")}`}
        >
          Compare now <span>({phones.length})</span> ↗
        </Link>
      </div>
    </div>
  );
}
