"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MOCK_IPHONES } from "@/data/mockIphones";
import { useCompare } from "@/context/CompareContext";
import IPhoneRender from "@/components/IPhoneRender";
import IPhoneModel3D from "@/components/IPhoneModel3D";

export default function Home() {
  const [series, setSeries] = useState("All models");
  const [rate, setRate] = useState("Any refresh rate");
  const [port, setPort] = useState("Any port");
  const [appleIntelligence, setAppleIntelligence] = useState(false);
  const [finishIndex, setFinishIndex] = useState<Record<string, number>>({});
  const [compareMessage, setCompareMessage] = useState("");
  const { slugs, toggle } = useCompare();

  const phones = useMemo(
    () => MOCK_IPHONES.filter((phone) =>
      (series === "All models" || phone.series === series) &&
      (rate === "Any refresh rate" || phone.refreshRateHz === (rate === "120Hz ProMotion" ? 120 : 60)) &&
      (port === "Any port" || phone.portType === port) &&
      (!appleIntelligence || phone.chipset.supportsAppleIntelligence)
    ),
    [series, rate, port, appleIntelligence]
  );

  const addToCompare = (slug: string) => {
    if (!slugs.includes(slug) && slugs.length >= 4) {
      setCompareMessage("You can compare up to four iPhones at a time.");
      return;
    }
    setCompareMessage("");
    toggle(slug);
  };

  const resetFilters = () => {
    setSeries("All models");
    setRate("Any refresh rate");
    setPort("Any port");
    setAppleIntelligence(false);
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow"><i /> THE IPHONE CATALOG <span>SPECIFICATIONS & COMPARISONS</span></div>
          <h1>Every iPhone.<br /><em>Every detail.</em></h1>
          <p>Clear, comparable specifications for every iPhone in the lineup.</p>
          <div className="hero-meta">
            <span><b>{MOCK_IPHONES.length}</b> MODELS INDEXED</span>
            <span><i /> UPDATED NOV 2026</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-circle" />
          <div className="hero-spin-ring" />
          <div className="hero-phone hero-phone-back"><IPhoneModel3D finish={MOCK_IPHONES[1].finishes[1]} dimensions={MOCK_IPHONES[1].dimensionsMm} hasDynamicIsland spin /></div>
          <div className="hero-phone hero-phone-front"><IPhoneModel3D finish={MOCK_IPHONES[0].finishes[0]} dimensions={MOCK_IPHONES[0].dimensionsMm} hasDynamicIsland spin /></div>
          <div className="hero-note"><span>01 / 07</span><b>Hardware<br />at a glance</b></div>
        </div>
      </section>

      <section className="catalog-wrap" id="catalog">
        <div className="section-heading">
          <div><div className="eyebrow">BROWSE THE LINEUP <span>01 — CATALOG</span></div><h2>Find your iPhone.</h2></div>
          <div className="sort-label">SHOWING <b>{phones.length} DEVICES</b><span>·</span> SORT: NEWEST FIRST</div>
        </div>

        <div className="catalog-layout">
          <aside className="filters" aria-label="Filter iPhones">
            <div className="filter-top"><strong>Filters</strong><button onClick={resetFilters}>RESET</button></div>
            <label className="filter-label" htmlFor="series-filter">SERIES</label>
            <select id="series-filter" value={series} onChange={(event) => setSeries(event.target.value)}>
              {["All models", "Standard", "Plus", "Pro", "Pro Max", "SE", "mini"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="filter-label" htmlFor="refresh-filter">DISPLAY</label>
            <select id="refresh-filter" value={rate} onChange={(event) => setRate(event.target.value)}>
              {["Any refresh rate", "60Hz", "120Hz ProMotion"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="filter-label" htmlFor="port-filter">CONNECTOR</label>
            <select id="port-filter" value={port} onChange={(event) => setPort(event.target.value)}>
              {["Any port", "USB-C", "Lightning"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <label className="toggle-filter">
              <input type="checkbox" checked={appleIntelligence} onChange={(event) => setAppleIntelligence(event.target.checked)} />
              <span className="toggle-ui" /> Apple Intelligence ready
            </label>
            <div className="filter-foot"><span>DATABASE STATUS</span><b><i /> ALL SYSTEMS NORMAL</b></div>
          </aside>

          <div className="product-grid">
            {phones.map((phone, index) => {
              const selectedFinish = phone.finishes[finishIndex[phone.slug] ?? 0];
              const isSelected = slugs.includes(phone.slug);
              return (
                <article className="product-card" key={phone.slug}>
                  <div className="card-top"><span className="model-tag">{phone.series.toUpperCase()}</span><span className="model-year">{phone.releaseYear} MODEL</span></div>
                  <Link href={`/iphone/${phone.slug}`} className="card-art" aria-label={`View specifications for ${phone.name}`}>
                    <IPhoneRender finish={selectedFinish} dimensions={phone.dimensionsMm} hasDynamicIsland={phone.hasDynamicIsland} />
                    <span className="art-index">{String(index + 1).padStart(2, "0")}</span><span className="art-arrow" aria-hidden="true">↗</span>
                  </Link>
                  <div className="card-info">
                    <div className="card-title">
                      <div><h3>{phone.name}</h3><span>{phone.releaseYear} <i /> {phone.launchMsrp} launch</span></div>
                      <span className="chip-badge">{phone.chipset.name}</span>
                    </div>
                    <div className="spec-pills">
                      <div><small>DISPLAY</small><b>{phone.displaySizeIn}″ OLED</b></div>
                      <div><small>MAIN CAMERA</small><b>{phone.cameras[0].megapixels} MP</b></div>
                      <div><small>BATTERY</small><b>{phone.batteryMah.toLocaleString()} mAh</b></div>
                    </div>
                    <div className="card-bottom">
                      <div className="swatches" aria-label={`${phone.name} finishes`}>
                        {phone.finishes.map((finish, finishNumber) => (
                          <button
                            key={finish.name}
                            type="button"
                            aria-label={finish.name}
                            aria-pressed={finishNumber === (finishIndex[phone.slug] ?? 0)}
                            title={finish.name}
                            onClick={() => setFinishIndex((current) => ({ ...current, [phone.slug]: finishNumber }))}
                            style={{ background: finish.hexCode }}
                            className={finishNumber === (finishIndex[phone.slug] ?? 0) ? "active" : ""}
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
            {phones.length === 0 && <div className="empty-catalog"><strong>No iPhones match these filters.</strong><button onClick={resetFilters}>Clear filters</button></div>}
          </div>
        </div>
        <p className="compare-limit-note" role="status" aria-live="polite">{compareMessage}</p>
        <div className="catalog-end"><span>INDEX COMPLETE</span><i /><span>END OF CURRENT LINEUP</span></div>
      </section>
    </main>
  );
}
