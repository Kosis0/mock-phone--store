"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import {
  getPhoneBySlug,
  getRelatedPhones,
  MOCK_IPHONES,
} from "@/data/mockIphones";
import PhoneViewer from "@/components/PhoneViewer";
import IPhoneRender from "@/components/IPhoneRender";
import { useCompare } from "@/context/CompareContext";

function SpecTable({
  id,
  title,
  rows,
}: {
  id: string;
  title: string;
  rows: [string, string][];
}) {
  return (
    <section className="spec-section" id={id}>
      <div className="spec-section-title">
        <span>{title}</span>
        <i />
      </div>
      <div className="spec-table">
        {rows.map(([k, v]) => (
          <div className="spec-row" key={k}>
            <div>{k}</div>
            <b>{v}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

const INDEX_MAX = {
  brightness: Math.max(...MOCK_IPHONES.map((x) => x.peakBrightnessNits)),
  battery: Math.max(...MOCK_IPHONES.map((x) => x.batteryMah)),
  playback: Math.max(...MOCK_IPHONES.map((x) => x.videoPlaybackHours)),
  ram: Math.max(...MOCK_IPHONES.map((x) => x.ramGb)),
};

export default function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const p = getPhoneBySlug(slug);
  const [activeFinish, setActiveFinish] = useState(0);
  const [activeTier, setActiveTier] = useState(0);
  const [copied, setCopied] = useState(false);
  const { toggle, slugs } = useCompare();

  const related = useMemo(() => (p ? getRelatedPhones(p, 4) : []), [p]);

  if (!p) {
    return (
      <main className="not-found">
        <div className="not-found-card">
          <div className="eyebrow">404 · HARDWARE NOT INDEXED</div>
          <h1>Device not found</h1>
          <p>
            The requested iPhone slug does not match any verified hardware
            profile in the Specwise database.
          </p>
          <Link href="/" className="button button-primary">
            Back to catalog →
          </Link>
        </div>
      </main>
    );
  }

  const finish = p.finishes[activeFinish] ?? p.finishes[0];
  const selectedStorage = p.storagePricing[activeTier] ?? p.storagePricing[0];
  const launchPricingSummary = p.storagePricing
    .map((tier) => `${tier.capacity} · $${tier.priceUsd.toLocaleString()}`)
    .join(" / ");
  const isCompared = slugs.includes(p.slug);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const telemetryBars = [
    {
      label: "PEAK BRIGHTNESS",
      value: `${p.peakBrightnessNits.toLocaleString()} nits`,
      pct: Math.round((p.peakBrightnessNits / INDEX_MAX.brightness) * 100),
      maxLabel: `${INDEX_MAX.brightness.toLocaleString()} max`,
    },
    {
      label: "BATTERY CAPACITY",
      value: `${p.batteryMah.toLocaleString()} mAh`,
      pct: Math.round((p.batteryMah / INDEX_MAX.battery) * 100),
      maxLabel: `${INDEX_MAX.battery.toLocaleString()} max`,
    },
    {
      label: "VIDEO PLAYBACK",
      value: `${p.videoPlaybackHours} hrs`,
      pct: Math.round((p.videoPlaybackHours / INDEX_MAX.playback) * 100),
      maxLabel: `${INDEX_MAX.playback}h max`,
    },
    {
      label: "UNIFIED MEMORY",
      value: `${p.ramGb} GB RAM`,
      pct: Math.round((p.ramGb / INDEX_MAX.ram) * 100),
      maxLabel: `${INDEX_MAX.ram} GB max`,
    },
  ];

  const bodyRows: [string, string][] = [
    ["Dimensions", `${p.dimensionsMm} mm`],
    ...(p.foldedDimensionsMm
      ? ([["Folded dimensions", `${p.foldedDimensionsMm} mm`]] as [
          string,
          string,
        ][])
      : []),
    ["Weight", `${p.weightG} g`],
    ["Frame material", p.frameMaterial],
    ["Biometrics", p.biometrics],
    ["Ingress protection", p.ipRating],
  ];

  const displayRows: [string, string][] = [
    ["Main display", `${p.displaySizeIn} inches`],
    ...(p.outerDisplaySizeIn
      ? ([["Cover display", `${p.outerDisplaySizeIn} inches OLED`]] as [
          string,
          string,
        ][])
      : []),
    ["Panel type", p.panelType],
    ["Resolution", p.resolution],
    ["Pixel density", `${p.ppi} ppi`],
    [
      "Refresh rate",
      `${p.refreshRateHz} Hz${p.refreshRateHz === 120 ? " ProMotion" : ""}`,
    ],
    ["Peak brightness", `${p.peakBrightnessNits.toLocaleString()} nits`],
    ["Dynamic Island", p.hasDynamicIsland ? "Yes" : "No"],
    ["Always-On display", p.alwaysOn ? "Yes" : "No"],
  ];

  const platformRows: [string, string][] = [
    ["Chipset", p.chipset.name],
    ["Process node", `${p.chipset.processNm} nm`],
    [
      "CPU / GPU cores",
      `${p.chipset.cpuCores}-core CPU / ${p.chipset.gpuCores}-core GPU`,
    ],
    ["Neural Engine", `${p.chipset.neuralEngineCores} cores`],
    ["Memory", `${p.ramGb} GB RAM`],
    ["Thermal system", p.cooling ?? "Graphite thermal architecture"],
    ...(p.modem ? ([["Cellular modem", p.modem]] as [string, string][]) : []),
    [
      "Apple Intelligence",
      p.chipset.supportsAppleIntelligence ? "Supported" : "Not supported",
    ],
  ];

  return (
    <main className="detail-page">
      <div className="breadcrumb">
        <Link href="/">CATALOG</Link>
        <span>/</span>
        <Link href="/timeline">{p.releaseYear}</Link>
        <span>/</span>
        <span className="breadcrumb-current">{p.name.toUpperCase()}</span>
        <span className="breadcrumb-index">
          HARDWARE PROFILE · {p.currentLineup ? "ACTIVE 2026" : "ARCHIVE"}
        </span>
      </div>

      <section className="detail-hero">
        <div className="detail-art">
          <PhoneViewer
            finish={finish}
            dimensions={p.dimensionsMm}
            hasDynamicIsland={p.hasDynamicIsland}
            frontStyle={p.frontStyle}
            cameraLayout={p.cameraLayout}
            deviceName={p.name}
          />
          <div className="detail-art-footer">
            <div className="detail-colors" aria-label={`${p.name} finishes`}>
              {p.finishes.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setActiveFinish(i)}
                  style={{ background: c.hexCode }}
                  className={activeFinish === i ? "active" : ""}
                  aria-label={c.name}
                  aria-pressed={activeFinish === i}
                  title={c.name}
                />
              ))}
            </div>
            <span className="color-name">
              FINISH / <b>{finish.name.toUpperCase()}</b>
            </span>
          </div>
        </div>

        <div className="detail-intro">
          <div className="eyebrow">
            {p.series.toUpperCase()} SERIES{" "}
            <span>
              {p.releaseDate.toUpperCase()} · {p.maxIos}
            </span>
          </div>
          <h1>{p.name}</h1>
          <p className="detail-summary">{p.tagline}</p>

          <div className="highlight-chips">
            {p.highlights.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="tier-picker" aria-label="Storage pricing tiers">
            <div className="tier-picker-head">
              <small>STORAGE CONFIGURATION</small>
              <strong>
                ${selectedStorage.priceUsd.toLocaleString()}{" "}
                <span>LAUNCH MSRP</span>
              </strong>
            </div>
            <div className="tier-buttons">
              {p.storagePricing.map((tier, idx) => (
                <button
                  key={tier.capacity}
                  type="button"
                  className={idx === activeTier ? "is-active" : ""}
                  aria-pressed={idx === activeTier}
                  onClick={() => setActiveTier(idx)}
                >
                  <b>{tier.capacity}</b>
                  <span>${tier.priceUsd.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detail-quick">
            <div>
              <small>DISPLAY</small>
              <b>
                {p.displaySizeIn}″{" "}
                {p.refreshRateHz === 120 ? "120Hz OLED" : "OLED"}
              </b>
            </div>
            <div>
              <small>CHIPSET</small>
              <b>
                {p.chipset.name} ({p.chipset.processNm} nm)
              </b>
            </div>
            <div>
              <small>MAIN CAMERA</small>
              <b>
                {p.cameras[0]?.megapixels} MP · {p.cameras[0]?.aperture}
              </b>
            </div>
            <div>
              <small>BATTERY / PORT</small>
              <b>
                {p.batteryMah.toLocaleString()} mAh · {p.portType}
              </b>
            </div>
          </div>

          <div className="detail-cta-row">
            <button
              type="button"
              className="button button-primary detail-compare"
              aria-pressed={isCompared}
              onClick={() => toggle(p.slug)}
            >
              {isCompared
                ? "✓ Added to comparison"
                : "＋ Compare this iPhone"}
            </button>
            <button
              type="button"
              className="button button-ghost detail-share"
              onClick={handleShare}
            >
              {copied ? "✓ Link copied" : "Copy spec link"}
            </button>
          </div>

          <span className="detail-ref">
            MODEL REF. {p.variants[0]?.modelNumber} <i />{" "}
            {p.variants[0]?.identifier} <i /> {p.frameMaterial}
          </span>
        </div>
      </section>

      <section
        className="telemetry-strip"
        aria-label="Index relative benchmarks"
      >
        <div className="telemetry-head">
          <div className="eyebrow">
            INDEX POSITIONING <span>VS ALL {MOCK_IPHONES.length} IPHONES</span>
          </div>
        </div>
        <div className="telemetry-grid">
          {telemetryBars.map((bar) => (
            <div className="telemetry-card" key={bar.label}>
              <div className="telemetry-card-top">
                <small>{bar.label}</small>
                <span>{bar.maxLabel}</span>
              </div>
              <b>{bar.value}</b>
              <div className="telemetry-track" aria-hidden="true">
                <div
                  className="telemetry-fill"
                  style={{ width: `${Math.max(8, bar.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="detail-specs">
        <aside className="specs-intro" aria-label="Specification sections">
          <span>TECHNICAL DATA</span>
          <p>Full specifications</p>
          <small>LAST UPDATED · NOV 2026</small>
          <nav className="specs-jump-nav">
            <a href="#sec-launch">01 / Launch & lifecycle</a>
            <a href="#sec-body">02 / Body & build</a>
            <a href="#sec-display">03 / Display</a>
            <a href="#sec-platform">04 / Platform & performance</a>
            <a href="#sec-camera">05 / Camera system</a>
            <a href="#sec-battery">06 / Battery & connectivity</a>
            <a href="#sec-variants">07 / Regional models</a>
          </nav>
        </aside>

        <div className="specs-groups">
          <SpecTable
            id="sec-launch"
            title="01 / Launch & lifecycle"
            rows={[
              ["Release date", p.releaseDate],
              [
                "Lineup status",
                p.currentLineup
                  ? "Active 2026 Apple Store lineup"
                  : "Archive / Refurbished",
              ],
              ["Initial operating system", p.initialIos],
              ["Maximum supported iOS", p.maxIos],
              ["Storage & launch MSRP", launchPricingSummary],
            ]}
          />

          <SpecTable id="sec-body" title="02 / Body & build" rows={bodyRows} />

          <SpecTable id="sec-display" title="03 / Display" rows={displayRows} />

          <SpecTable
            id="sec-platform"
            title="04 / Platform & performance"
            rows={platformRows}
          />

          <section className="spec-section" id="sec-camera">
            <div className="spec-section-title">
              <span>05 / Camera system</span>
              <i />
            </div>
            {p.cameras.map((c) => (
              <div className="camera-card" key={c.position}>
                <div className="camera-position">{c.position}</div>
                <div className="camera-grid">
                  {[
                    ["RESOLUTION", `${c.megapixels} MP`],
                    ["APERTURE", c.aperture],
                    ["FOCAL LENGTH", c.focalLength],
                    ["OPTICAL ZOOM", c.opticalZoom],
                  ].map(([a, b]) => (
                    <div key={a}>
                      <small>{a}</small>
                      <b>{b}</b>
                    </div>
                  ))}
                </div>
                <p>{c.sensorNotes}</p>
              </div>
            ))}
            <div className="spec-table camera-meta-table">
              <div className="spec-row">
                <div>Front camera</div>
                <b>{p.frontCamera}</b>
              </div>
              <div className="spec-row">
                <div>Video recording</div>
                <b>{p.videoCapabilities}</b>
              </div>
              <div className="spec-row">
                <div>Maximum optical zoom</div>
                <b>{p.maxOpticalZoomX}x</b>
              </div>
            </div>
          </section>

          <SpecTable
            id="sec-battery"
            title="06 / Battery & connectivity"
            rows={[
              ["Battery capacity", `${p.batteryMah.toLocaleString()} mAh`],
              ["Video playback", `${p.videoPlaybackHours} hours`],
              ["Wired fast charging", p.fastChargeNote],
              ["Connector", p.portType],
              [
                "MagSafe wireless charging",
                p.magsafeWatts > 0
                  ? `${p.magsafeWatts} W`
                  : "Not supported (Qi 7.5 W)",
              ],
              ["Wireless standards", p.wireless.join(" · ")],
            ]}
          />

          <section className="spec-section" id="sec-variants">
            <div className="spec-section-title">
              <span>07 / Regional models & identifiers</span>
              <i />
            </div>
            <div className="variant-table-wrap">
              <div className="variant-table">
                <div className="variant-head">
                  <span>MODEL NUMBER</span>
                  <span>IDENTIFIER</span>
                  <span>REGION</span>
                  <span>SIM CONFIGURATION</span>
                </div>
                {p.variants.map((v) => (
                  <div className="variant-row" key={v.modelNumber}>
                    <b>{v.modelNumber}</b>
                    <b>{v.identifier}</b>
                    <span>{v.region}</span>
                    <span>{v.simConfiguration}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section
        className="related-section"
        aria-label="Compare with similar iPhones"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              NEXT STEP <span>COMPARE SIDE BY SIDE</span>
            </div>
            <h2>Related iPhones.</h2>
          </div>
          <Link href="/compare" className="presets-all-link">
            Open full matrix →
          </Link>
        </div>

        <div className="related-grid">
          {related.map((other) => (
            <div className="related-card" key={other.slug}>
              <Link href={`/iphone/${other.slug}`} className="related-art">
                <IPhoneRender
                  finish={other.finishes[0]}
                  dimensions={other.dimensionsMm}
                  hasDynamicIsland={other.hasDynamicIsland}
                  frontStyle={other.frontStyle}
                  cameraLayout={other.cameraLayout}
                />
              </Link>
              <div className="related-body">
                <small>
                  {other.releaseYear} · {other.chipset.name}
                </small>
                <strong>
                  <Link href={`/iphone/${other.slug}`}>{other.name}</Link>
                </strong>
                <span>
                  {other.displaySizeIn}″ · {other.launchMsrp}
                </span>
                <Link
                  href={`/compare?models=${p.slug},${other.slug}`}
                  className="related-compare-link"
                >
                  Compare vs {p.name} ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="page-footer">
        <Link href="/">← Back to all devices</Link>
        <span>SPECWISE TECHNICAL INDEX · {p.slug.toUpperCase()}</span>
      </footer>
    </main>
  );
}
