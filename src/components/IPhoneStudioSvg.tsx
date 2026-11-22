"use client";

import { useId } from "react";
import type { CameraLayout, Finish, FrontStyle } from "@/types/iphone";

type IPhoneStudioSvgProps = {
  finish: Finish;
  frontStyle?: FrontStyle;
  cameraLayout?: CameraLayout;
  view?: "front" | "back" | "studio";
  className?: string;
};

function isLightHex(hex: string): boolean {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

function BackCameraModule({
  layout,
  bodyColor,
  isLight,
}: {
  layout: CameraLayout;
  bodyColor: string;
  isLight: boolean;
}) {
  const ringStroke = isLight ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.24)";
  const plateauFill = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)";

  const lens = (cx: number, cy: number, r = 13) => (
    <g key={`${cx}-${cy}`}>
      <circle cx={cx} cy={cy} r={r + 2.5} fill={bodyColor} stroke={ringStroke} strokeWidth="1.6" />
      <circle cx={cx} cy={cy} r={r} fill="#0c0f14" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#141e2e" stroke="#2c3e58" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="#05080d" />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.16} fill="rgba(160,215,255,0.55)" />
    </g>
  );

  if (layout === "plateau-triple") {
    return (
      <g>
        <rect
          x="16"
          y="18"
          width="128"
          height="62"
          rx="20"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(39, 36, 11.5)}
        {lens(39, 63, 11.5)}
        {lens(68, 49.5, 11.5)}
        <circle cx="122" cy="36" r="5.5" fill="#f5e6c8" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
        <circle cx="122" cy="61" r="6.5" fill="#17191d" stroke={ringStroke} strokeWidth="0.8" />
      </g>
    );
  }

  if (layout === "plateau-single") {
    return (
      <g>
        <rect
          x="16"
          y="18"
          width="128"
          height="38"
          rx="19"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(39, 37, 11.5)}
        <circle cx="122" cy="37" r="5" fill="#f5e6c8" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" />
        <circle cx="104" cy="37" r="2.2" fill="rgba(0,0,0,0.55)" />
      </g>
    );
  }

  if (layout === "dual-fold") {
    return (
      <g>
        <rect
          x="18"
          y="18"
          width="42"
          height="78"
          rx="21"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(39, 39, 11)}
        {lens(39, 75, 11)}
        <circle cx="72" cy="57" r="4.8" fill="#f5e6c8" stroke="rgba(0,0,0,0.18)" strokeWidth="0.8" />
      </g>
    );
  }

  if (layout === "triple-square") {
    return (
      <g>
        <rect
          x="16"
          y="16"
          width="74"
          height="74"
          rx="20"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(36, 36, 11.5)}
        {lens(36, 70, 11.5)}
        {lens(68, 53, 11.5)}
        <circle cx="68" cy="29" r="4.8" fill="#f5e6c8" />
        <circle cx="68" cy="76" r="5.5" fill="#17191d" />
      </g>
    );
  }

  if (layout === "dual-diagonal") {
    return (
      <g>
        <rect
          x="16"
          y="16"
          width="66"
          height="66"
          rx="18"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(35, 35, 11)}
        {lens(63, 63, 11)}
        <circle cx="63" cy="31" r="4.5" fill="#f5e6c8" />
        <circle cx="35" cy="65" r="2.2" fill="rgba(0,0,0,0.5)" />
      </g>
    );
  }

  if (layout === "dual-vertical") {
    return (
      <g>
        <rect
          x="18"
          y="18"
          width="40"
          height="74"
          rx="20"
          fill={plateauFill}
          stroke={ringStroke}
          strokeWidth="1.2"
        />
        {lens(38, 38, 11)}
        {lens(38, 72, 11)}
        <circle cx="70" cy="55" r="4.5" fill="#f5e6c8" />
      </g>
    );
  }

  if (layout === "single-modern") {
    return (
      <g>
        {lens(38, 38, 12)}
        <circle cx="66" cy="38" r="4.5" fill="#f5e6c8" />
        <circle cx="53" cy="38" r="2" fill="rgba(0,0,0,0.45)" />
      </g>
    );
  }

  // single-classic (SE 2 / SE 3)
  return (
    <g>
      {lens(35, 34, 9.5)}
      <circle cx="58" cy="34" r="4" fill="#f5e6c8" />
      <circle cx="48" cy="34" r="1.8" fill="rgba(0,0,0,0.45)" />
    </g>
  );
}

export default function IPhoneStudioSvg({
  finish,
  frontStyle = "dynamic-island",
  cameraLayout = "triple-square",
  view = "studio",
  className = "",
}: IPhoneStudioSvgProps) {
  const uid = useId().replace(/:/g, "");
  const isLight = isLightHex(finish.hexCode);
  const accent = finish.accentHex || (isLight ? "#8fa7c2" : finish.hexCode);
  const isFoldable = frontStyle === "foldable";

  const renderFrontFace = (width = 160, height = 330) => {
    const isHome = frontStyle === "home-button";
    const screenX = isHome ? 9 : 7;
    const screenY = isHome ? 40 : 7;
    const screenW = width - screenX * 2;
    const screenH = isHome ? height - 84 : height - 14;
    const screenRx = isHome ? 3 : 24;

    return (
      <g>
        <defs>
          <linearGradient id={`frame-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} />
            <stop offset="45%" stopColor={finish.hexCode} />
            <stop offset="100%" stopColor="#14161a" />
          </linearGradient>
          <radialGradient id={`wall-${uid}`} cx="32%" cy="24%" r="85%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="48%" stopColor={finish.hexCode} stopOpacity="0.88" />
            <stop offset="100%" stopColor="#090c12" stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="38%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* Outer metallic frame */}
        <rect
          x="1"
          y="1"
          width={width - 2}
          height={height - 2}
          rx={isHome ? 24 : 30}
          fill={`url(#frame-${uid})`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.4"
        />
        {/* Black glass bezel */}
        <rect
          x="4"
          y="4"
          width={width - 8}
          height={height - 8}
          rx={isHome ? 21 : 27}
          fill="#07080a"
        />
        {/* OLED / LCD Display */}
        <rect
          x={screenX}
          y={screenY}
          width={screenW}
          height={screenH}
          rx={screenRx}
          fill={`url(#wall-${uid})`}
        />
        {/* Flowing wallpaper silk arcs */}
        <path
          d={`M ${screenX} ${screenY + screenH * 0.62} Q ${screenX + screenW * 0.45} ${screenY + screenH * 0.25}, ${screenX + screenW} ${screenY + screenH * 0.48} L ${screenX + screenW} ${screenY + screenH} L ${screenX} ${screenY + screenH} Z`}
          fill="rgba(8, 12, 22, 0.42)"
        />
        <ellipse
          cx={screenX + screenW * 0.7}
          cy={screenY + screenH * 0.34}
          rx={screenW * 0.42}
          ry={screenH * 0.22}
          fill={accent}
          opacity="0.32"
        />

        {/* Foldable center crease shimmer */}
        {isFoldable && (
          <line
            x1={width / 2}
            y1={screenY}
            x2={width / 2}
            y2={screenY + screenH}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="2"
          />
        )}

        {/* Lock screen clock */}
        <text
          x={width / 2}
          y={isHome ? screenY + 46 : screenY + 62}
          textAnchor="middle"
          fill="rgba(255,255,255,0.92)"
          fontSize={isFoldable ? "30" : "24"}
          fontWeight="600"
          fontFamily="Inter, -apple-system, sans-serif"
          letterSpacing="-1"
        >
          9:41
        </text>
        <text
          x={width / 2}
          y={isHome ? screenY + 60 : screenY + 76}
          textAnchor="middle"
          fill="rgba(255,255,255,0.68)"
          fontSize="7.5"
          fontWeight="500"
          fontFamily="Inter, -apple-system, sans-serif"
        >
          Sunday, November 22
        </text>

        {/* Top sensor housing */}
        {frontStyle === "dynamic-island" && (
          <rect x={width / 2 - 22} y={14} width="44" height="12" rx="6" fill="#040507" />
        )}
        {frontStyle === "dynamic-island-compact" && (
          <rect x={width / 2 - 15} y={14} width="30" height="10" rx="5" fill="#040507" />
        )}
        {frontStyle === "notch-narrow" && (
          <path
            d={`M ${width / 2 - 28} 7 H ${width / 2 + 28} V 15 Q ${width / 2 + 28} 22 ${width / 2 + 20} 22 H ${width / 2 - 20} Q ${width / 2 - 28} 22 ${width / 2 - 28} 15 Z`}
            fill="#050608"
          />
        )}
        {frontStyle === "notch-wide" && (
          <path
            d={`M ${width / 2 - 38} 7 H ${width / 2 + 38} V 15 Q ${width / 2 + 38} 22 ${width / 2 + 30} 22 H ${width / 2 - 30} Q ${width / 2 - 38} 22 ${width / 2 - 38} 15 Z`}
            fill="#050608"
          />
        )}
        {isHome && (
          <>
            <rect x={width / 2 - 14} y="21" width="28" height="3.5" rx="2" fill="#232529" />
            <circle cx={width / 2} cy={height - 23} r="12" fill="#0c0d10" stroke="#3a3d44" strokeWidth="1.6" />
          </>
        )}

        {/* Home indicator */}
        {!isHome && (
          <rect
            x={width / 2 - 24}
            y={height - 16}
            width="48"
            height="3"
            rx="1.5"
            fill="rgba(255,255,255,0.72)"
          />
        )}

        {/* Glass sheen */}
        <rect
          x="4"
          y="4"
          width={width - 8}
          height={height - 8}
          rx={isHome ? 21 : 27}
          fill={`url(#sheen-${uid})`}
        />
      </g>
    );
  };

  const renderBackFace = (width = 160, height = 330) => (
    <g>
      <defs>
        <linearGradient id={`back-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accent} />
          <stop offset="35%" stopColor={finish.hexCode} />
          <stop offset="100%" stopColor={finish.hexCode} />
        </linearGradient>
        <linearGradient id={`back-sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={isLight ? "0.45" : "0.24"} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#000000" stopOpacity={isLight ? "0.08" : "0.28"} />
        </linearGradient>
      </defs>

      <rect
        x="1"
        y="1"
        width={width - 2}
        height={height - 2}
        rx={frontStyle === "home-button" ? 24 : 30}
        fill={`url(#back-${uid})`}
        stroke={isLight ? "rgba(0,0,0,0.16)" : "rgba(255,255,255,0.24)"}
        strokeWidth="1.5"
      />
      <rect
        x="4"
        y="4"
        width={width - 8}
        height={height - 8}
        rx={frontStyle === "home-button" ? 21 : 27}
        fill={finish.hexCode}
      />
      <rect
        x="4"
        y="4"
        width={width - 8}
        height={height - 8}
        rx={frontStyle === "home-button" ? 21 : 27}
        fill={`url(#back-sheen-${uid})`}
      />

      {/* Minimalist center emblem mark */}
      <circle
        cx={width / 2}
        cy={height * 0.51}
        r="12"
        fill={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.14)"}
      />
      <circle
        cx={width / 2 + 8}
        cy={height * 0.51 - 2}
        r="4.5"
        fill={finish.hexCode}
      />

      <BackCameraModule layout={cameraLayout} bodyColor={finish.hexCode} isLight={isLight} />
    </g>
  );

  // Single face view for 3D turntable
  if (view === "front" || view === "back") {
    const w = isFoldable ? 210 : 160;
    const h = 330;
    return (
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className={`studio-svg ${className}`}
        aria-hidden="true"
      >
        {view === "front" ? renderFrontFace(w, h) : renderBackFace(w, h)}
      </svg>
    );
  }

  // Foldable Duo studio hero render (unfolded 7.6" tablet-like + outer back glimpse)
  if (isFoldable) {
    return (
      <svg viewBox="0 0 280 340" className={`studio-svg ${className}`} aria-hidden="true">
        {/* Titanium spine hinge */}
        <rect x="28" y="24" width="224" height="292" rx="28" fill="rgba(0,0,0,0.08)" />
        <g transform="translate(35, 16) scale(0.95)">
          {renderFrontFace(220, 320)}
        </g>
        {/* Subtle badge marking unfolded 7.6" canvas */}
        <g transform="translate(166, 20) scale(0.32)">
          {renderBackFace(160, 330)}
        </g>
      </svg>
    );
  }

  // Dual-angle studio catalog render (Back + Front overlapping cleanly like Apple Store cards)
  return (
    <svg viewBox="0 0 245 345" className={`studio-svg ${className}`} aria-hidden="true">
      <g transform="translate(10, 12) scale(0.94)">
        {renderBackFace(160, 330)}
      </g>
      <g transform="translate(86, 20) scale(0.94)">
        {renderFrontFace(160, 330)}
      </g>
    </svg>
  );
}
