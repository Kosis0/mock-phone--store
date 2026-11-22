"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { MOCK_IPHONES, POPULAR_COMPARISONS } from "@/data/mockIphones";
import { useCompare } from "@/context/CompareContext";
import IPhoneRender from "@/components/IPhoneRender";
import { comparisonRows, formatDeltaBadge } from "@/utils/compareSpecs";

function CompareContent() {
  const params = useSearchParams();
  const pathname = usePathname();
  const { slugs, hydrated, setSlugs } = useCompare();
  const [urlInitialized, setUrlInitialized] = useState(false);
  const [diffs, setDiffs] = useState(false);
  const [activeSection, setActiveSection] = useState("All");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated || urlInitialized) return;
    const fromUrl = (params.get("models") || "")
      .split(",")
      .filter((x) => MOCK_IPHONES.some((p) => p.slug === x))
      .slice(0, 4);
    if (fromUrl.length) setSlugs(fromUrl);
    setUrlInitialized(true);
  }, [hydrated, params, setSlugs, urlInitialized]);

  useEffect(() => {
    if (!urlInitialized) return;
    const nextModels = slugs.join(",");
    const currentModels =
      new URLSearchParams(window.location.search).get("models") || "";
    if (nextModels === currentModels) return;
    const query = nextModels ? `?models=${encodeURIComponent(nextModels)}` : "";
    window.history.replaceState(null, "", `${pathname}${query}`);
  }, [pathname, slugs, urlInitialized]);

  const chosen = useMemo(
    () =>
      slugs
        .map((s) => MOCK_IPHONES.find((p) => p.slug === s))
        .filter((p): p is (typeof MOCK_IPHONES)[number] => Boolean(p)),
    [slugs]
  );

  const setAt = (index: number, slug: string) => {
    const next = [...slugs];
    if (slug) next[index] = slug;
    else next.splice(index, 1);
    setSlugs([...new Set(next)].slice(0, 4));
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const unused = MOCK_IPHONES.filter((p) => !slugs.includes(p.slug));
  const columnCount = Math.min(4, Math.max(2, chosen.length + 1));

  const winners = useMemo(() => {
    if (chosen.length < 2) return null;
    const bestBattery = [...chosen].sort(
      (a, b) => b.batteryMah - a.batteryMah
    )[0];
    const lightest = [...chosen].sort((a, b) => a.weightG - b.weightG)[0];
    const bestValue = [...chosen].sort(
      (a, b) => a.launchMsrpUsd - b.launchMsrpUsd
    )[0];
    const bestZoom = [...chosen].sort(
      (a, b) => b.maxOpticalZoomX - a.maxOpticalZoomX
    )[0];
    return { bestBattery, lightest, bestValue, bestZoom };
  }, [chosen]);

  const visibleSections =
    activeSection === "All"
      ? comparisonRows
      : comparisonRows.filter((s) => s.section === activeSection);

  return (
    <main className="compare-page">
      <div className="breadcrumb">
        <Link href="/">CATALOG</Link>
        <span>/</span>COMPARISON MATRIX
        <span className="breadcrumb-index">
          UP TO 4 DEVICES · LIVE URL SYNC
        </span>
      </div>

      <div className="section-heading compare-heading">
        <div>
          <div className="eyebrow">
            HARDWARE ANALYSIS <span>02 — COMPARISON</span>
          </div>
          <h1>Compare iPhones.</h1>
          <p>
            Side-by-side verified hardware specs with automatic best-in-class
            deltas across {MOCK_IPHONES.length} iPhone models.
          </p>
        </div>

        <div className="compare-toolbar-actions">
          <label className="diff-toggle">
            <input
              type="checkbox"
              checked={diffs}
              onChange={(e) => setDiffs(e.target.checked)}
            />
            <span className="toggle-ui" /> Highlight differences
          </label>
          {chosen.length > 0 && (
            <>
              <button
                type="button"
                className="toolbar-btn"
                onClick={handleCopyLink}
              >
                {copied ? "✓ Copied URL" : "Share link"}
              </button>
              <button
                type="button"
                className="toolbar-btn toolbar-btn-muted"
                onClick={() => setSlugs([])}
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>

      <div className="compare-presets-row" aria-label="Quick comparison presets">
        <span>QUICK PRESETS</span>
        <div className="compare-preset-pills">
          {POPULAR_COMPARISONS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              className="preset-pill-btn"
              onClick={() => setSlugs(preset.slugs)}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {winners && (
        <section className="compare-verdicts" aria-label="At-a-glance leaders">
          <div className="verdict-card">
            <small>LARGEST BATTERY</small>
            <strong>{winners.bestBattery.name}</strong>
            <span>
              {winners.bestBattery.batteryMah.toLocaleString()} mAh ·{" "}
              {winners.bestBattery.videoPlaybackHours}h video
            </span>
          </div>
          <div className="verdict-card">
            <small>LIGHTEST IN HAND</small>
            <strong>{winners.lightest.name}</strong>
            <span>
              {winners.lightest.weightG} g · {winners.lightest.thicknessMm} mm
            </span>
          </div>
          <div className="verdict-card">
            <small>OPTICAL ZOOM REACH</small>
            <strong>{winners.bestZoom.name}</strong>
            <span>
              {winners.bestZoom.maxOpticalZoomX}x optical ·{" "}
              {winners.bestZoom.cameras.length} rear{" "}
              {winners.bestZoom.cameras.length === 1 ? "lens" : "lenses"}
            </span>
          </div>
          <div className="verdict-card">
            <small>LOWEST LAUNCH MSRP</small>
            <strong>{winners.bestValue.name}</strong>
            <span>
              {winners.bestValue.launchMsrp} ·{" "}
              {winners.bestValue.storageTiers[0]} base
            </span>
          </div>
        </section>
      )}

      <div className="section-jump-pills" role="tablist" aria-label="Spec category filter">
        {["All", ...comparisonRows.map((s) => s.section)].map((label) => (
          <button
            key={label}
            type="button"
            role="tab"
            aria-selected={activeSection === label}
            className={activeSection === label ? "is-active" : ""}
            onClick={() => setActiveSection(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="matrix-scroller">
        <div
          className="matrix"
          style={
            {
              "--columns": columnCount,
            } as React.CSSProperties
          }
        >
          <div className="matrix-header">
            <div className="attribute-heading">
              DEVICE PROFILE <span>{chosen.length} SELECTED</span>
            </div>
            {Array.from({ length: columnCount }).map((_, i) => {
              const p = chosen[i];
              return (
                <div className="device-column" key={p?.slug || `empty-${i}`}>
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
                            frontStyle={p.frontStyle}
                            cameraLayout={p.cameraLayout}
                          />
                        </Link>
                        <button
                          className="remove-device"
                          type="button"
                          aria-label={`Remove ${p.name} from comparison`}
                          onClick={() => setAt(i, "")}
                        >
                          ×
                        </button>
                      </div>
                      <Link href={`/iphone/${p.slug}`} className="matrix-name">
                        {p.name}
                      </Link>
                      <span className="matrix-chip">
                        {p.chipset.name} · {p.launchMsrp}
                      </span>
                      <select
                        className="column-select"
                        aria-label={`Replace device in column ${i + 1}`}
                        value={p.slug}
                        onChange={(e) => setAt(i, e.target.value)}
                      >
                        <option value={p.slug}>{p.name}</option>
                        {unused.map((u) => (
                          <option key={u.slug} value={u.slug}>
                            {u.name} ({u.releaseYear})
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
                        aria-label={`Add iPhone to column ${i + 1}`}
                        onChange={(e) => setAt(i, e.target.value)}
                      >
                        <option value="">Choose device…</option>
                        {unused.map((u) => (
                          <option key={u.slug} value={u.slug}>
                            {u.name} ({u.releaseYear})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {visibleSections.map((section) => {
            const visibleRows = section.rows.filter((row) => {
              if (!diffs) return true;
              const vals = chosen.map((p) => String(row.value(p)));
              const same = vals.length > 1 && vals.every((v) => v === vals[0]);
              return !same;
            });

            if (visibleRows.length === 0) return null;

            return (
              <section className="matrix-section" key={section.section}>
                <div className="matrix-section-label">
                  {section.section.toUpperCase()}
                </div>
                {visibleRows.map((row) => {
                  const nums = row.numericValue
                    ? chosen.map((p) => row.numericValue!(p))
                    : [];
                  const hasSpread = nums.length > 1 && new Set(nums).size > 1;
                  const best =
                    row.numericValue && hasSpread
                      ? row.better === "lower"
                        ? Math.min(...nums)
                        : Math.max(...nums)
                      : null;
                  const badgeText =
                    row.numericValue && hasSpread && row.better
                      ? formatDeltaBadge(
                          nums,
                          row.better,
                          row.unit,
                          row.decimals,
                          row.key
                        )
                      : "";

                  return (
                    <div className="matrix-row" key={row.key}>
                      <div className="matrix-label">{row.label}</div>
                      {Array.from({ length: columnCount }).map((_, i) => {
                        const p = chosen[i];
                        if (!p) {
                          return (
                            <div className="matrix-value empty-value" key={i}>
                              —
                            </div>
                          );
                        }
                        const value = row.value(p);
                        const isBest =
                          best !== null && row.numericValue!(p) === best;
                        return (
                          <div
                            className={`matrix-value${isBest ? " is-best" : ""}`}
                            key={p.slug}
                          >
                            <span>{value}</span>
                            {isBest && badgeText && (
                              <span className="delta-badge">{badgeText}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </section>
            );
          })}
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
          <div className="compare-loading">Loading comparison matrix...</div>
        </main>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
