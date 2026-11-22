"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MOCK_IPHONES, POPULAR_COMPARISONS } from "@/data/mockIphones";
import { useCompare } from "@/context/CompareContext";
import IPhoneRender from "@/components/IPhoneRender";

type SortKey =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "display-desc"
  | "battery-desc"
  | "weight-asc";

type HeroPresetKey = "pro17" | "pro16" | "flagship26";

const HERO_SHOWCASES: Record<
  HeroPresetKey,
  { label: string; frontSlug: string; backSlug: string }
> = {
  pro17: {
    label: "17 Pro + 17",
    frontSlug: "iphone-17-pro",
    backSlug: "iphone-17",
  },
  pro16: {
    label: "16 Pro + 16",
    frontSlug: "iphone-16-pro",
    backSlug: "iphone-16",
  },
  flagship26: {
    label: "18 Pro Max + Duo",
    frontSlug: "iphone-18-pro-max",
    backSlug: "iphone-duo",
  },
};

const SERIES_OPTIONS = [
  "All models",
  "Foldable",
  "Pro Max",
  "Pro",
  "Air",
  "Plus",
  "Standard",
  "e",
  "SE",
  "mini",
];

const YEAR_OPTIONS = [
  "All years",
  ...Array.from(new Set(MOCK_IPHONES.map((p) => String(p.releaseYear)))).sort(
    (a, b) => Number(b) - Number(a)
  ),
];

export default function Home() {
  const [catalogQuery, setCatalogQuery] = useState("");
  const [lineupOnly, setLineupOnly] = useState(false);
  const [series, setSeries] = useState("All models");
  const [year, setYear] = useState("All years");
  const [rate, setRate] = useState("Any refresh rate");
  const [port, setPort] = useState("Any port");
  const [appleIntelligence, setAppleIntelligence] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [heroShowcase, setHeroShowcase] = useState<HeroPresetKey>("pro17");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [finishIndex, setFinishIndex] = useState<Record<string, number>>({});
  const [compareMessage, setCompareMessage] = useState("");
  const { slugs, toggle } = useCompare();

  const activeLineupCount = useMemo(
    () => MOCK_IPHONES.filter((p) => p.currentLineup).length,
    []
  );

  const activeFilterCount =
    (catalogQuery.trim() ? 1 : 0) +
    (lineupOnly ? 1 : 0) +
    (series !== "All models" ? 1 : 0) +
    (year !== "All years" ? 1 : 0) +
    (rate !== "Any refresh rate" ? 1 : 0) +
    (port !== "Any port" ? 1 : 0) +
    (appleIntelligence ? 1 : 0);

  const phones = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    const filtered = MOCK_IPHONES.filter((phone) => {
      if (lineupOnly && !phone.currentLineup) return false;
      if (series !== "All models" && phone.series !== series) return false;
      if (year !== "All years" && String(phone.releaseYear) !== year)
        return false;
      if (
        rate !== "Any refresh rate" &&
        phone.refreshRateHz !== (rate === "120Hz ProMotion" ? 120 : 60)
      )
        return false;
      if (port !== "Any port" && phone.portType !== port) return false;
      if (appleIntelligence && !phone.chipset.supportsAppleIntelligence)
        return false;
      if (q) {
        const text =
          `${phone.name} ${phone.series} ${phone.chipset.name} ${phone.frameMaterial} ${phone.tagline} ${phone.variants.map((v) => v.modelNumber).join(" ")}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "newest") return filtered;
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.launchMsrpUsd - b.launchMsrpUsd);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.launchMsrpUsd - a.launchMsrpUsd);
        break;
      case "display-desc":
        sorted.sort((a, b) => b.displaySizeIn - a.displaySizeIn);
        break;
      case "battery-desc":
        sorted.sort((a, b) => b.batteryMah - a.batteryMah);
        break;
      case "weight-asc":
        sorted.sort((a, b) => a.weightG - b.weightG);
        break;
    }
    return sorted;
  }, [
    catalogQuery,
    lineupOnly,
    series,
    year,
    rate,
    port,
    appleIntelligence,
    sortBy,
  ]);

  const addToCompare = (slug: string) => {
    if (!slugs.includes(slug) && slugs.length >= 4) {
      setCompareMessage("You can compare up to four iPhones at a time.");
      return;
    }
    setCompareMessage("");
    toggle(slug);
  };

  const resetFilters = () => {
    setCatalogQuery("");
    setLineupOnly(false);
    setSeries("All models");
    setYear("All years");
    setRate("Any refresh rate");
    setPort("Any port");
    setAppleIntelligence(false);
    setSortBy("newest");
  };

  const activePreset = HERO_SHOWCASES[heroShowcase];
  const heroFrontPhone =
    MOCK_IPHONES.find((p) => p.slug === activePreset.frontSlug) ??
    MOCK_IPHONES[0];
  const heroBackPhone =
    MOCK_IPHONES.find((p) => p.slug === activePreset.backSlug) ??
    MOCK_IPHONES[1];

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">
            <i /> THE IPHONE TECHNICAL INDEX{" "}
            <span>2019–2026 · iOS 27 VERIFIED</span>
          </div>
          <h1>
            Every iPhone.
            <br />
            <em>Every detail.</em>
          </h1>
          <p>
            Precision hardware specifications, regional model identifiers,
            silicon architecture, and side-by-side matrices for every modern
            iPhone — from iPhone 11 through iPhone 18 Pro Max and iPhone Duo.
          </p>

          <div className="hero-actions">
            <a href="#catalog" className="button button-primary hero-cta">
              Explore {MOCK_IPHONES.length} Models ↓
            </a>
            <Link href="/compare" className="button button-ghost hero-cta">
              Compare Matrix ↗
            </Link>
            <Link href="/timeline" className="button button-ghost hero-cta">
              8-Year Timeline
            </Link>
          </div>

          <div className="hero-meta">
            <span>
              <b>{MOCK_IPHONES.length}</b> MODELS INDEXED
            </span>
            <span>
              <b>{activeLineupCount}</b> ACTIVE 2026 LINEUP
            </span>
            <span>UPDATED NOV 2026</span>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="hero-stage-card">
            <div className="hero-stage-backdrop" aria-hidden="true" />

            <div className="hero-stage-phones">
              <Link
                href={`/iphone/${heroBackPhone.slug}`}
                className="hero-device hero-device-secondary"
                aria-label={`View ${heroBackPhone.name}`}
              >
                <IPhoneRender
                  finish={heroBackPhone.finishes[0]}
                  dimensions={heroBackPhone.dimensionsMm}
                  hasDynamicIsland={heroBackPhone.hasDynamicIsland}
                  frontStyle={heroBackPhone.frontStyle}
                  cameraLayout={heroBackPhone.cameraLayout}
                  priority
                />
              </Link>

              <Link
                href={`/iphone/${heroFrontPhone.slug}`}
                className="hero-device hero-device-primary"
                aria-label={`View ${heroFrontPhone.name}`}
              >
                <IPhoneRender
                  finish={heroFrontPhone.finishes[0]}
                  dimensions={heroFrontPhone.dimensionsMm}
                  hasDynamicIsland={heroFrontPhone.hasDynamicIsland}
                  frontStyle={heroFrontPhone.frontStyle}
                  cameraLayout={heroFrontPhone.cameraLayout}
                  priority
                />
              </Link>
            </div>

            <div className="hero-stage-footer">
              <div
                className="hero-stage-switcher"
                role="tablist"
                aria-label="Featured device pairing"
              >
                {(Object.keys(HERO_SHOWCASES) as HeroPresetKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={heroShowcase === key}
                    className={heroShowcase === key ? "is-active" : ""}
                    onClick={() => setHeroShowcase(key)}
                  >
                    {HERO_SHOWCASES[key].label}
                  </button>
                ))}
              </div>

              <Link
                href={`/iphone/${heroFrontPhone.slug}`}
                className="hero-stage-caption"
              >
                <span>
                  {heroFrontPhone.releaseYear} · {heroFrontPhone.chipset.name}
                </span>
                <b>{heroFrontPhone.name} ↗</b>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="presets-strip" aria-label="Featured comparisons">
        <div className="presets-header">
          <div className="eyebrow">
            QUICK MATCHUPS <span>POPULAR SIDE-BY-SIDE PRESETS</span>
          </div>
          <Link href="/compare" className="presets-all-link">
            Custom comparison →
          </Link>
        </div>
        <div className="presets-grid">
          {POPULAR_COMPARISONS.map((preset) => (
            <Link
              key={preset.title}
              href={`/compare?models=${preset.slugs.join(",")}`}
              className="preset-card"
            >
              <div className="preset-card-top">
                <strong>{preset.title}</strong>
                <span aria-hidden="true">↗</span>
              </div>
              <p>{preset.subtitle}</p>
              <span className="preset-count">{preset.slugs.length} devices</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="catalog-wrap" id="catalog">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              BROWSE THE LINEUP <span>01 — CATALOG</span>
            </div>
            <h2>Find your iPhone.</h2>
          </div>

          <div className="catalog-controls-bar">
            <div
              className="lineup-segmented"
              role="group"
              aria-label="Catalog scope"
            >
              <button
                type="button"
                className={!lineupOnly ? "is-active" : ""}
                onClick={() => setLineupOnly(false)}
              >
                All Models ({MOCK_IPHONES.length})
              </button>
              <button
                type="button"
                className={lineupOnly ? "is-active" : ""}
                onClick={() => setLineupOnly(true)}
              >
                2026 Active ({activeLineupCount})
              </button>
            </div>

            <div className="sort-control">
              <label htmlFor="sort-select" className="sort-label">
                SHOWING <b>{phones.length} DEVICES</b>
                <span>·</span> SORT:
              </label>
              <select
                id="sort-select"
                aria-label="Sort iPhones"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SortKey)}
              >
                <option value="newest">Newest first</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="display-desc">Largest display</option>
                <option value="battery-desc">Biggest battery</option>
                <option value="weight-asc">Lightest weight</option>
              </select>
            </div>

            <button
              type="button"
              className="mobile-filter-toggle"
              aria-expanded={mobileFiltersOpen}
              onClick={() => setMobileFiltersOpen((current) => !current)}
            >
              {mobileFiltersOpen ? "Hide Filters" : "Filters"}
              {activeFilterCount > 0 && (
                <span className="filter-badge">{activeFilterCount}</span>
              )}
            </button>
          </div>
        </div>

        <div className="catalog-layout">
          <aside
            className={`filters${mobileFiltersOpen ? " is-mobile-open" : ""}`}
            aria-label="Filter iPhones"
          >
            <div className="filter-top">
              <strong>
                Filters
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </strong>
              <button type="button" onClick={resetFilters}>
                RESET
              </button>
            </div>

            <label className="filter-label" htmlFor="catalog-search">
              KEYWORD
            </label>
            <input
              id="catalog-search"
              type="search"
              className="filter-input"
              value={catalogQuery}
              onChange={(event) => setCatalogQuery(event.target.value)}
              placeholder="A20 Pro, Titanium, Duo…"
            />

            <label className="filter-label" htmlFor="series-filter">
              SERIES
            </label>
            <select
              id="series-filter"
              value={series}
              onChange={(event) => setSeries(event.target.value)}
            >
              {SERIES_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="filter-label" htmlFor="year-filter">
              RELEASE YEAR
            </label>
            <select
              id="year-filter"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              {YEAR_OPTIONS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="filter-label" htmlFor="refresh-filter">
              DISPLAY
            </label>
            <select
              id="refresh-filter"
              value={rate}
              onChange={(event) => setRate(event.target.value)}
            >
              {["Any refresh rate", "120Hz ProMotion", "60Hz"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="filter-label" htmlFor="port-filter">
              CONNECTOR
            </label>
            <select
              id="port-filter"
              value={port}
              onChange={(event) => setPort(event.target.value)}
            >
              {["Any port", "USB-C", "Lightning"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="toggle-filter">
              <input
                type="checkbox"
                checked={appleIntelligence}
                onChange={(event) =>
                  setAppleIntelligence(event.target.checked)
                }
              />
              <span className="toggle-ui" /> Apple Intelligence ready
            </label>

            <div className="filter-foot">
              <span>DATABASE INDEX</span>
              <b>{MOCK_IPHONES.length} VERIFIED PROFILES</b>
            </div>
          </aside>

          <div className="product-grid">
            {phones.map((phone, index) => {
              const selectedFinish =
                phone.finishes[finishIndex[phone.slug] ?? 0] ??
                phone.finishes[0];
              const isSelected = slugs.includes(phone.slug);

              return (
                <article className="product-card" key={phone.slug}>
                  <div className="card-top">
                    <div className="card-tags">
                      <span className="model-tag">
                        {phone.series.toUpperCase()}
                      </span>
                      {phone.currentLineup && (
                        <span className="lineup-pill">ACTIVE</span>
                      )}
                    </div>
                    <span className="model-year">
                      {phone.releaseYear} MODEL
                    </span>
                  </div>

                  <Link
                    href={`/iphone/${phone.slug}`}
                    className="card-art"
                    aria-label={`View specifications for ${phone.name}`}
                  >
                    <IPhoneRender
                      finish={selectedFinish}
                      dimensions={phone.dimensionsMm}
                      hasDynamicIsland={phone.hasDynamicIsland}
                      frontStyle={phone.frontStyle}
                      cameraLayout={phone.cameraLayout}
                    />
                    <span className="art-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="art-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </Link>

                  <div className="card-info">
                    <div className="card-title">
                      <div>
                        <h3>
                          <Link href={`/iphone/${phone.slug}`}>
                            {phone.name}
                          </Link>
                        </h3>
                        <span>
                          {phone.releaseYear} <i /> {phone.launchMsrp} launch
                        </span>
                      </div>
                      <span className="chip-badge">{phone.chipset.name}</span>
                    </div>

                    <div className="spec-pills">
                      <div>
                        <small>DISPLAY</small>
                        <b>
                          {phone.displaySizeIn}″{" "}
                          {phone.refreshRateHz === 120 ? "120Hz" : "OLED"}
                        </b>
                      </div>
                      <div>
                        <small>MAIN CAMERA</small>
                        <b>
                          {phone.cameras[0].megapixels} MP ·{" "}
                          {phone.cameras.length}×
                        </b>
                      </div>
                      <div>
                        <small>BATTERY</small>
                        <b>{phone.batteryMah.toLocaleString()} mAh</b>
                      </div>
                    </div>

                    <div className="card-bottom">
                      <div
                        className="swatches"
                        aria-label={`${phone.name} finishes`}
                      >
                        {phone.finishes.map((finish, finishNumber) => (
                          <button
                            key={finish.name}
                            type="button"
                            aria-label={finish.name}
                            aria-pressed={
                              finishNumber === (finishIndex[phone.slug] ?? 0)
                            }
                            title={finish.name}
                            onClick={() =>
                              setFinishIndex((current) => ({
                                ...current,
                                [phone.slug]: finishNumber,
                              }))
                            }
                            style={{ background: finish.hexCode }}
                            className={
                              finishNumber === (finishIndex[phone.slug] ?? 0)
                                ? "active"
                                : ""
                            }
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => addToCompare(phone.slug)}
                        className={`compare-button ${isSelected ? "selected" : ""}`}
                      >
                        {isSelected ? "✓ Added" : "+ Compare"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {phones.length === 0 && (
              <div className="empty-catalog">
                <strong>No iPhones match these filters.</strong>
                <p>
                  Try broadening your series, year, or connector filters to view
                  more hardware profiles.
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={resetFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="compare-limit-note" role="status" aria-live="polite">
          {compareMessage}
        </p>
        <div className="catalog-end">
          <span>INDEX COMPLETE · {MOCK_IPHONES.length} PROFILES</span>
          <i />
          <span>2019–2026 IPHONE HARDWARE ARCHIVE</span>
        </div>
      </section>
    </main>
  );
}
