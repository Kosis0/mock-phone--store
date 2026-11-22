"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_IPHONES } from "@/data/mockIphones";
import { useCompare } from "@/context/CompareContext";
import IPhoneRender from "@/components/IPhoneRender";
import { comparisonRows } from "@/utils/compareSpecs";

function CompareContent() {
  const params = useSearchParams();
  const { slugs, setSlugs } = useCompare();
  const [ready, setReady] = useState(false);
  const [diffs, setDiffs] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;
    const fromUrl = (params.get("models") || "")
      .split(",")
      .filter((x) => MOCK_IPHONES.some((p) => p.slug === x))
      .slice(0, 4);
    if (fromUrl.length) setSlugs(fromUrl);
    else if (slugs.length)
      window.history.replaceState(null, "", `/compare?models=${slugs.join(",")}`);
  }, [ready, params, setSlugs, slugs]);

  const chosen = useMemo(
    () =>
      slugs
        .map((s) => MOCK_IPHONES.find((p) => p.slug === s))
        .filter((p): p is (typeof MOCK_IPHONES)[number] => !!p),
    [slugs]
  );

  const setAt = (index: number, slug: string) => {
    const next = [...slugs];
    if (slug) next[index] = slug;
    else next.splice(index, 1);
    setSlugs([...new Set(next)].slice(0, 4));
  };

  const unused = MOCK_IPHONES.filter((p) => !slugs.includes(p.slug));

  return (
    <main className="compare-page">
      <div className="breadcrumb">
        <Link href="/">CATALOG</Link>
        <span>/</span>COMPARISON MATRIX
      </div>
      <div className="section-heading compare-heading">
        <div>
          <div className="eyebrow">
            HARDWARE ANALYSIS <span>02 — COMPARISON</span>
          </div>
          <h1>Compare iPhones.</h1>
          <p>Side-by-side specs. Every detail in context.</p>
        </div>
        <label className="diff-toggle">
          <input
            type="checkbox"
            checked={diffs}
            onChange={(e) => setDiffs(e.target.checked)}
          />
          <span className="toggle-ui" /> Highlight differences
        </label>
      </div>

      <div className="matrix-scroller">
        <div
          className="matrix"
          style={
            {
              "--columns": Math.max(
                2,
                chosen.length + Math.max(0, 4 - chosen.length)
              ),
            } as React.CSSProperties
          }
        >
          <div className="matrix-header">
            <div className="attribute-heading">
              DEVICE PROFILE <span>{chosen.length} SELECTED</span>
            </div>
            {Array.from({ length: Math.max(2, chosen.length) }).map((_, i) => {
              const p = chosen[i];
              return (
                <div
                  className="device-column"
                  key={p?.slug || `empty-${i}`}
                >
                  {p ? (
                    <>
                      <div className="device-sticky-top">
                        <Link
                          href={`/iphone/${p.slug}`}
                          className="matrix-phone"
                        >
                          <IPhoneRender
                            finish={p.finishes[0]}
                            dimensions={p.dimensionsMm}
                            hasDynamicIsland={p.hasDynamicIsland}
                          />
                        </Link>
                        <button
                          className="remove-device"
                          onClick={() => setAt(i, "")}
                        >
                          ×
                        </button>
                      </div>
                      <Link
                        href={`/iphone/${p.slug}`}
                        className="matrix-name"
                      >
                        {p.name}
                      </Link>
                      <span className="matrix-chip">{p.chipset.name}</span>
                      <select
                        className="column-select"
                        value={p.slug}
                        onChange={(e) => setAt(i, e.target.value)}
                      >
                        <option value={p.slug}>{p.name}</option>
                        {unused.map((u) => (
                          <option key={u.slug} value={u.slug}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <div className="empty-device">
                      <span>＋</span>
                      <b>Add iPhone</b>
                      <select
                        value=""
                        onChange={(e) => setAt(i, e.target.value)}
                      >
                        <option value="">Choose device…</option>
                        {unused.map((u) => (
                          <option key={u.slug} value={u.slug}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {comparisonRows.map((section) => (
            <section className="matrix-section" key={section.section}>
              <div className="matrix-section-label">{section.section}</div>
              {section.rows.map((row) => {
                const vals = chosen.map((p) => String(row.value(p)));
                const same = vals.length > 1 && vals.every((v) => v === vals[0]);
                if (diffs && same) return null;
                const nums = row.numeric
                  ? chosen.map((p) => Number(p[row.numeric!]))
                  : [];
                const best =
                  row.numeric && nums.length > 1
                    ? row.better === "lower"
                      ? Math.min(...nums)
                      : Math.max(...nums)
                    : null;
                return (
                  <div
                    className={`matrix-row ${diffs && same ? "dim" : ""}`}
                    key={row.key}
                  >
                    <div className="matrix-label">{row.label}</div>
                    {Array.from({ length: Math.max(2, chosen.length) }).map(
                      (_, i) => {
                        const p = chosen[i];
                        if (!p)
                          return (
                            <div className="matrix-value empty-value" key={i}>
                              —
                            </div>
                          );
                        const value = row.value(p);
                        const isBest =
                          best !== null && Number(p[row.numeric!]) === best;
                        return (
                          <div className="matrix-value" key={p.slug}>
                            {value}
                            {row.numeric &&
                              nums.length > 1 &&
                              new Set(nums).size > 1 &&
                              isBest && (
                                <span className="delta-badge">
                                  {row.better === "lower"
                                    ? `−${Math.max(...nums) - Math.min(...nums)}${row.unit}`
                                    : `+${Math.max(...nums) - Math.min(...nums)}${row.unit}`}
                                </span>
                              )}
                          </div>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      <div className="matrix-foot">
        <span>
          SPECWISE COMPARISON ENGINE <i /> LIVE URL STATE
        </span>
        <Link href="/">＋ Add another device from catalog</Link>
      </div>
    </main>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <main className="compare-page">
          <div
            className="loading"
            style={{ padding: "40px 0", textAlign: "center", color: "#8a93a1" }}
          >
            Loading comparison matrix...
          </div>
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
