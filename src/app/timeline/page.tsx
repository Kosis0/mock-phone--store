import Link from "next/link";
import { GENERATION_NOTES, MOCK_IPHONES } from "@/data/mockIphones";
import IPhoneRender from "@/components/IPhoneRender";

export default function TimelinePage() {
  const years = Array.from(
    new Set(MOCK_IPHONES.map((phone) => phone.releaseYear))
  ).sort((a, b) => b - a);

  return (
    <main className="timeline-page">
      <div className="breadcrumb">
        <Link href="/">CATALOG</Link>
        <span>/</span>GENERATIONS TIMELINE
        <span className="breadcrumb-index">
          2019–2026 · {years.length} GENERATIONS · {MOCK_IPHONES.length} MODELS
        </span>
      </div>

      <section className="timeline-hero">
        <div className="eyebrow">
          HARDWARE EVOLUTION <span>03 — CHRONOLOGICAL ARCHIVE</span>
        </div>
        <h1>
          Eight years of <em>iPhone silicon & design.</em>
        </h1>
        <p>
          Trace the complete hardware progression from the first 7nm triple-lens
          Pro in 2019 through 5G, ProMotion, Dynamic Island, Titanium, USB-C,
          ultra-thin iPhone Air, and 2nm foldable iPhone Duo in 2026.
        </p>

        <div className="timeline-jump-bar" aria-label="Jump to year">
          {years.map((yr) => (
            <a key={yr} href={`#gen-${yr}`}>
              {yr}
            </a>
          ))}
        </div>
      </section>

      <div className="timeline-stream">
        {years.map((yr) => {
          const models = MOCK_IPHONES.filter((p) => p.releaseYear === yr);
          const note = GENERATION_NOTES[yr];
          const topCompare = models.slice(0, 4).map((m) => m.slug).join(",");
          const minProcess = Math.min(...models.map((m) => m.chipset.processNm));
          const maxBattery = Math.max(...models.map((m) => m.batteryMah));
          const hasProMotion = models.some((m) => m.refreshRateHz === 120);
          const hasUsbC = models.some((m) => m.portType === "USB-C");

          return (
            <section className="generation-block" id={`gen-${yr}`} key={yr}>
              <div className="generation-header">
                <div className="generation-title-wrap">
                  <span className="generation-year">{yr}</span>
                  <div>
                    <h2>{note?.headline ?? `${yr} Generation`}</h2>
                    <p>{note?.milestone}</p>
                  </div>
                </div>
                <Link
                  href={`/compare?models=${topCompare}`}
                  className="button button-ghost generation-compare-btn"
                >
                  Compare {yr} lineup ↗
                </Link>
              </div>

              <div className="generation-metrics">
                <span>
                  SILICON <b>{minProcess} nm</b>
                </span>
                <span>
                  PEAK BATTERY <b>{maxBattery.toLocaleString()} mAh</b>
                </span>
                <span>
                  DISPLAY <b>{hasProMotion ? "Up to 120Hz" : "60Hz"}</b>
                </span>
                <span>
                  CONNECTOR <b>{hasUsbC ? "USB-C" : "Lightning"}</b>
                </span>
                <span>
                  MODELS <b>{models.length}</b>
                </span>
              </div>

              <div className="generation-grid">
                {models.map((phone) => (
                  <Link
                    key={phone.slug}
                    href={`/iphone/${phone.slug}`}
                    className="generation-card"
                  >
                    <div className="generation-card-art">
                      <IPhoneRender
                        finish={phone.finishes[0]}
                        dimensions={phone.dimensionsMm}
                        hasDynamicIsland={phone.hasDynamicIsland}
                        frontStyle={phone.frontStyle}
                        cameraLayout={phone.cameraLayout}
                      />
                    </div>
                    <div className="generation-card-meta">
                      <div className="generation-card-top">
                        <span className="model-tag">
                          {phone.series.toUpperCase()}
                        </span>
                        <span className="generation-price">
                          {phone.launchMsrp}
                        </span>
                      </div>
                      <h3>{phone.name}</h3>
                      <p>
                        {phone.displaySizeIn}″ · {phone.chipset.name} ·{" "}
                        {phone.batteryMah.toLocaleString()} mAh
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="page-footer">
        <Link href="/">← Back to full catalog</Link>
        <span>SPECWISE HARDWARE TIMELINE · 2019–2026</span>
      </footer>
    </main>
  );
}
