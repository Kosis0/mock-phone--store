import Link from "next/link";
import { MOCK_IPHONES, POPULAR_COMPARISONS } from "@/data/mockIphones";

export default function Footer() {
  const activeCount = MOCK_IPHONES.filter((p) => p.currentLineup).length;

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand-col">
          <Link href="/" className="brand">
            <span className="brand-mark">◉</span> spec<span>wise</span>
          </Link>
          <p>
            An independent technical index for Apple iPhone hardware — verified
            specifications, regional model identifiers, silicon architecture,
            and side-by-side comparisons from 2019 through 2026.
          </p>
          <div className="footer-stats">
            <span>
              <b>{MOCK_IPHONES.length}</b> MODELS
            </span>
            <span>
              <b>{activeCount}</b> ACTIVE LINEUP
            </span>
            <span>
              <b>iOS 27</b> VERIFIED
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>2026 LINEUP</h4>
          <ul>
            {MOCK_IPHONES.filter((p) => p.currentLineup).map((phone) => (
              <li key={phone.slug}>
                <Link href={`/iphone/${phone.slug}`}>
                  {phone.name} <span>{phone.launchMsrp}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>POPULAR COMPARISONS</h4>
          <ul>
            {POPULAR_COMPARISONS.map((preset) => (
              <li key={preset.title}>
                <Link href={`/compare?models=${preset.slugs.join(",")}`}>
                  {preset.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>EXPLORE</h4>
          <ul>
            <li>
              <Link href="/">Full Hardware Catalog</Link>
            </li>
            <li>
              <Link href="/compare">Side-by-Side Matrix</Link>
            </li>
            <li>
              <Link href="/timeline">Generations Timeline (2019–2026)</Link>
            </li>
            <li>
              <Link href="/iphone/iphone-18-pro-max">
                iPhone 18 Pro Max Profile
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>SPECWISE HARDWARE INDEX · UPDATED NOVEMBER 2026</span>
        <span>
          INDEPENDENT TECHNICAL REFERENCE · ALL TRADEMARKS BELONG TO THEIR
          RESPECTIVE OWNERS
        </span>
      </div>
    </footer>
  );
}
