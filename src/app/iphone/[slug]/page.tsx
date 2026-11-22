"use client";

import Link from "next/link";
import { use, useState } from "react";
import { MOCK_IPHONES } from "@/data/mockIphones";
import IPhoneRender from "@/components/IPhoneRender";
import { useCompare } from "@/context/CompareContext";

function Table({
  title,
  rows,
}: {
  title: string;
  rows: [string, string][];
}) {
  return (
    <section className="spec-section">
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

export default function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const p = MOCK_IPHONES.find((x) => x.slug === slug);
  const [active, setActive] = useState(0);
  const { toggle, slugs } = useCompare();

  if (!p) {
    return (
      <main className="not-found">
        <h1>Device not found</h1>
        <Link href="/">Back to catalog →</Link>
      </main>
    );
  }

  const f = p.finishes[active] || p.finishes[0];
  const launch = p.storageTiers.map((t) => `${t} · ${p.launchMsrp}`).join(" / ");

  return (
    <main className="detail-page">
      <div className="breadcrumb">
        <Link href="/">CATALOG</Link>
        <span>/</span>
        {p.name.toUpperCase()}
        <span className="breadcrumb-index">
          HARDWARE PROFILE · {p.releaseYear}
        </span>
      </div>

      <section className="detail-hero">
        <div className="detail-art">
          <span className="art-coordinate">IP / {p.releaseYear}</span>
          <IPhoneRender
            finish={f}
            dimensions={p.dimensionsMm}
            hasDynamicIsland={p.hasDynamicIsland}
          />
          <div className="detail-colors">
            {p.finishes.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setActive(i)}
                style={{ background: c.hexCode }}
                className={active === i ? "active" : ""}
                aria-label={c.name}
                title={c.name}
              />
            ))}
          </div>
          <span className="color-name">
            FINISH / <b>{f.name.toUpperCase()}</b>
          </span>
        </div>

        <div className="detail-intro">
          <div className="eyebrow">
            {p.series.toUpperCase()} SERIES{" "}
            <span>PROFILE NO. {p.releaseYear}-01</span>
          </div>
          <h1>{p.name}</h1>
          <p className="detail-summary">
            The complete technical profile. Verified hardware specifications,
            regional identifiers, and system details for the {p.name}.
          </p>

          <div className="detail-quick">
            <div>
              <small>DISPLAY</small>
              <b>{p.displaySizeIn}″ OLED</b>
            </div>
            <div>
              <small>CHIPSET</small>
              <b>{p.chipset.name}</b>
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

          <button
            className="button button-primary detail-compare"
            onClick={() => toggle(p.slug)}
          >
            {slugs.includes(p.slug)
              ? "✓ Added to comparison"
              : "＋ Compare this iPhone"}
          </button>
          <span className="detail-ref">
            MODEL REF. {p.variants[0]?.modelNumber} <i />{" "}
            {p.variants[0]?.identifier}
          </span>
        </div>
      </section>

      <div className="detail-specs">
        <div className="specs-intro">
          <span>TECHNICAL DATA</span>
          <p>Full specifications</p>
          <small>LAST UPDATED · NOV 2026</small>
        </div>

        <div className="specs-groups">
          <Table
            title="01 / Launch & lifecycle"
            rows={[
              ["Release date", p.releaseDate],
              ["Initial operating system", p.initialIos],
              ["Maximum supported iOS", p.maxIos],
              ["Storage & launch MSRP", launch],
            ]}
          />
          <Table
            title="02 / Body & build"
            rows={[
              ["Dimensions", `${p.dimensionsMm} mm`],
              ["Weight", `${p.weightG} g`],
              ["Frame material", p.frameMaterial],
              ["Ingress protection", p.ipRating],
            ]}
          />
          <Table
            title="03 / Display"
            rows={[
              ["Size", `${p.displaySizeIn} inches`],
              ["Panel type", p.panelType],
              ["Resolution", p.resolution],
              ["Pixel density", `${p.ppi} ppi`],
              [
                "Refresh rate",
                `${p.refreshRateHz} Hz${
                  p.refreshRateHz === 120 ? " ProMotion" : ""
                }`,
              ],
              ["Peak brightness", `${p.peakBrightnessNits} nits`],
              ["Dynamic Island", p.hasDynamicIsland ? "Yes" : "No"],
              ["Always-On display", p.alwaysOn ? "Yes" : "No"],
            ]}
          />
          <Table
            title="04 / Platform & performance"
            rows={[
              ["Chipset", p.chipset.name],
              ["Process", `${p.chipset.processNm} nm`],
              ["CPU / GPU cores", `${p.chipset.cpuCores} / ${p.chipset.gpuCores}`],
              ["Neural Engine", `${p.chipset.neuralEngineCores} cores`],
              ["Memory", `${p.ramGb} GB RAM`],
              [
                "Apple Intelligence",
                p.chipset.supportsAppleIntelligence
                  ? "Supported"
                  : "Not supported",
              ],
            ]}
          />

          <section className="spec-section">
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
          </section>

          <Table
            title="06 / Battery & connectivity"
            rows={[
              ["Battery capacity", `${p.batteryMah.toLocaleString()} mAh`],
              ["Video playback", `${p.videoPlaybackHours} hours`],
              ["Connector", p.portType],
              ["MagSafe wireless charging", `${p.magsafeWatts} W`],
              ["Wireless standards", p.wireless.join(" · ")],
            ]}
          />

          <section className="spec-section">
            <div className="spec-section-title">
              <span>07 / Regional models & identifiers</span>
              <i />
            </div>
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
          </section>
        </div>
      </div>

      <footer className="page-footer">
        <Link href="/">← Back to all devices</Link>
        <span>SPECWISE TECHNICAL INDEX · {p.slug.toUpperCase()}</span>
      </footer>
    </main>
  );
}
