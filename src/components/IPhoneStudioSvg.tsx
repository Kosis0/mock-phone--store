"use client";

import type { CameraLayout, Finish, FrontStyle } from "@/types/iphone";

export interface IPhoneStudioSvgProps {
  finish: Finish;
  dimensions?: string;
  hasDynamicIsland?: boolean;
  frontStyle?: FrontStyle;
  cameraLayout?: CameraLayout;
  angle?: "studio" | "front" | "back";
  view?: "studio" | "front" | "back";
  className?: string;
}

function parseColor(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.padEnd(6, "0");
  const num = parseInt(full.slice(0, 6), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function shiftHex(hex: string, delta: number): string {
  const [r, g, b] = parseColor(hex);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r + delta)}, ${clamp(g + delta)}, ${clamp(b + delta)})`;
}

function isLightColor(hex: string): boolean {
  const [r, g, b] = parseColor(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 152;
}

function parseRatio(dimensions?: string): { ratio: number; isSquareDual: boolean; isLegacyNoLidar: boolean } {
  const match = dimensions?.match(/(\d+(?:\.\d+)?)\s*×\s*(\d+(?:\.\d+)?)/);
  const h = match ? parseFloat(match[1]) : 150.0;
  const w = match ? parseFloat(match[2]) : 71.9;
  const ratio = Math.max(0.45, Math.min(1.5, w / h));
  // iPhone 11 / 12 / 12 mini have wide square dual bumps; 11 Pro / 11 Pro Max lacked LiDAR
  const isSquareDual = Math.abs(h - 150.9) < 0.3 || Math.abs(h - 146.7) < 0.25 || Math.abs(h - 131.5) < 0.25;
  const isLegacyNoLidar = Math.abs(h - 144.0) < 0.2 || Math.abs(h - 158.0) < 0.2;
  return { ratio, isSquareDual, isLegacyNoLidar };
}

function LensGroup({
  cx,
  cy,
  r,
  ringColor,
}: {
  cx: number;
  cy: number;
  r: number;
  ringColor: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.4} fill={ringColor} opacity={0.92} />
      <circle cx={cx} cy={cy} r={r} fill="#0e1116" />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="#182230" />
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#0a0d12" />
      <circle cx={cx - r * 0.22} cy={cy - r * 0.24} r={r * 0.16} fill="#7dd3fc" opacity={0.55} />
    </g>
  );
}

export default function IPhoneStudioSvg({
  finish,
  dimensions,
  hasDynamicIsland = true,
  frontStyle,
  cameraLayout = "triple-square",
  angle,
  view,
  className = "",
}: IPhoneStudioSvgProps) {
  const activeView = angle ?? view ?? "studio";
  const resolvedFront: FrontStyle = frontStyle ?? (hasDynamicIsland ? "dynamic-island" : "notch-wide");
  const { ratio, isSquareDual, isLegacyNoLidar } = parseRatio(dimensions);
  const isDuo = cameraLayout === "dual-fold";
  const light = isLightColor(finish.hexCode);

  const uid = finish.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "-" + activeView;
  const chassisMain = finish.hexCode;
  const chassisDark = shiftHex(finish.hexCode, light ? -24 : -14);
  const chassisFrame = shiftHex(finish.hexCode, light ? -38 : 22);
  const rearInset = finish.accentHex ?? shiftHex(finish.hexCode, light ? -10 : 9);
  const plateauFill = shiftHex(finish.hexCode, light ? -14 : 12);
  const ringStroke = shiftHex(finish.hexCode, light ? -46 : 36);
  const logoFill = light ? "rgba(0,0,0,0.16)" : "rgba(255,255,255,0.18)";

  if (isDuo) {
    // Hardware-accurate foldable Duo geometry (unfolded 7.6" horizontal interior + horizontal dual-lens rear plateau)
    const duoFrontW = 196;
    const duoFrontH = 148;
    const duoBackW = 104;
    const duoBackH = 146;

    return (
      <svg
        viewBox="0 0 280 260"
        className={`iphone-studio-svg is-duo ${className}`.trim()}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={chassisMain} />
            <stop offset="100%" stopColor={chassisDark} />
          </linearGradient>
          <linearGradient id={`scr-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#162133" />
            <stop offset="48%" stopColor="#262c3f" />
            <stop offset="100%" stopColor="#0f141e" />
          </linearGradient>
        </defs>

        {(activeView === "studio" || activeView === "back") && (
          <g transform={activeView === "studio" ? "translate(22, 56)" : "translate(88, 56)"}>
            <rect
              x={0}
              y={0}
              width={duoBackW}
              height={duoBackH}
              rx={16}
              fill={`url(#bg-${uid})`}
              stroke={chassisFrame}
              strokeWidth={2}
            />
            {/* Horizontal top dual-lens pill plateau */}
            <rect
              x={8}
              y={10}
              width={duoBackW - 16}
              height={28}
              rx={14}
              fill={plateauFill}
              stroke={ringStroke}
              strokeWidth={0.9}
              opacity={0.95}
            />
            <LensGroup cx={26} cy={24} r={8.5} ringColor={ringStroke} />
            <LensGroup cx={48} cy={24} r={8.5} ringColor={ringStroke} />
            <circle cx={duoBackW - 22} cy={24} r={3.2} fill="#fef3c7" opacity={0.85} />
            <circle cx={52} cy={78} r={9} fill={logoFill} />
          </g>
        )}

        {(activeView === "studio" || activeView === "front") && (
          <g transform={activeView === "studio" ? "translate(62, 56)" : "translate(42, 56)"}>
            <rect
              x={0}
              y={0}
              width={duoFrontW}
              height={duoFrontH}
              rx={16}
              fill={chassisFrame}
            />
            <rect x={4} y={4} width={duoFrontW - 8} height={duoFrontH - 8} rx={13} fill="#080a0f" />
            <rect x={8} y={8} width={duoFrontW - 16} height={duoFrontH - 16} rx={10} fill={`url(#scr-${uid})`} />
            {/* Center book hinge fold crease */}
            <line
              x1={duoFrontW / 2}
              y1={4}
              x2={duoFrontW / 2}
              y2={duoFrontH - 4}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth={1.2}
            />
            <circle cx={duoFrontW - 28} cy={17} r={3} fill="#090c12" />
          </g>
        )}
      </svg>
    );
  }

  const phoneH = 198;
  const phoneW = Math.round(phoneH * ratio);
  const rx = resolvedFront === "home-button" ? 15 : 22;

  const renderBack = (tx: number, ty: number) => {
    const isTriple = cameraLayout === "triple-square" || cameraLayout === "plateau-triple";
    const isPlateau = cameraLayout === "plateau-triple" || cameraLayout === "plateau-single";
    const isTwoTone = cameraLayout === "plateau-triple";
    const isSingle = cameraLayout === "single-classic" || cameraLayout === "single-modern" || cameraLayout === "plateau-single";

    return (
      <g transform={`translate(${tx}, ${ty})`}>
        <rect x={0} y={0} width={phoneW} height={phoneH} rx={rx} fill={`url(#bg-${uid})`} stroke={chassisFrame} strokeWidth={1.8} />

        {/* Two-tone ceramic glass MagSafe panel (17 Pro / 18 Pro) */}
        {isTwoTone && (
          <rect x={7} y={58} width={phoneW - 14} height={phoneH - 65} rx={15} fill={rearInset} opacity={0.82} />
        )}

        {/* Full-width horizontal plateau for 17 Pro / 18 Pro / Air */}
        {isPlateau ? (
          <g>
            <rect
              x={6}
              y={7}
              width={phoneW - 12}
              height={cameraLayout === "plateau-single" ? 32 : 52}
              rx={15}
              fill={plateauFill}
              stroke={ringStroke}
              strokeWidth={0.9}
            />
            {cameraLayout === "plateau-single" ? (
              <>
                <LensGroup cx={22} cy={23} r={8.5} ringColor={ringStroke} />
                <circle cx={phoneW - 20} cy={23} r={3.2} fill="#fef3c7" opacity={0.9} />
                <circle cx={phoneW - 29} cy={23} r={1.4} fill="#11161e" />
              </>
            ) : (
              <>
                <LensGroup cx={21} cy={21} r={8} ringColor={ringStroke} />
                <LensGroup cx={21} cy={43} r={8} ringColor={ringStroke} />
                <LensGroup cx={41} cy={32} r={8} ringColor={ringStroke} />
                <circle cx={phoneW - 18} cy={19} r={3.2} fill="#fef3c7" opacity={0.92} />
                <circle cx={phoneW - 18} cy={44} r={4.2} fill="#0e1116" />
              </>
            )}
          </g>
        ) : isTriple ? (
          <g>
            <rect x={8} y={8} width={44} height={46} rx={12} fill={plateauFill} stroke={ringStroke} strokeWidth={0.9} />
            <LensGroup cx={20} cy={20} r={7.4} ringColor={ringStroke} />
            <LensGroup cx={20} cy={40} r={7.4} ringColor={ringStroke} />
            <LensGroup cx={39} cy={30} r={7.4} ringColor={ringStroke} />
            <circle cx={39} cy={17} r={2.8} fill="#fef3c7" opacity={0.9} />
            {!isLegacyNoLidar && <circle cx={39} cy={43} r={3.6} fill="#0e1116" />}
          </g>
        ) : isSingle ? (
          <g>
            <LensGroup cx={22} cy={22} r={7.6} ringColor={ringStroke} />
            <circle cx={36} cy={22} r={2.6} fill="#fef3c7" opacity={0.9} />
          </g>
        ) : cameraLayout === "dual-diagonal" ? (
          <g>
            <rect x={8} y={8} width={38} height={38} rx={11} fill={plateauFill} stroke={ringStroke} strokeWidth={0.9} />
            <LensGroup cx={19} cy={19} r={6.6} ringColor={ringStroke} />
            <LensGroup cx={34} cy={34} r={6.6} ringColor={ringStroke} />
            <circle cx={35} cy={17} r={2.6} fill="#fef3c7" opacity={0.9} />
          </g>
        ) : isSquareDual ? (
          <g>
            <rect x={8} y={8} width={36} height={38} rx={11} fill={plateauFill} stroke={ringStroke} strokeWidth={0.9} />
            <LensGroup cx={19} cy={19} r={6.5} ringColor={ringStroke} />
            <LensGroup cx={19} cy={35} r={6.5} ringColor={ringStroke} />
            <circle cx={33} cy={27} r={2.7} fill="#fef3c7" opacity={0.9} />
          </g>
        ) : (
          /* Vertical capsule bump (16 / 16 Plus / 17) */
          <g>
            <rect x={9} y={8} width={22} height={42} rx={11} fill={plateauFill} stroke={ringStroke} strokeWidth={0.9} />
            <LensGroup cx={20} cy={19} r={6.6} ringColor={ringStroke} />
            <LensGroup cx={20} cy={39} r={6.6} ringColor={ringStroke} />
            <circle cx={37} cy={29} r={2.6} fill="#fef3c7" opacity={0.9} />
          </g>
        )}

        {/* Centered Apple silhouette circle accent */}
        <circle cx={phoneW / 2} cy={phoneH * 0.49} r={9.5} fill={logoFill} />
      </g>
    );
  };

  const renderFront = (tx: number, ty: number) => {
    const isHomeBtn = resolvedFront === "home-button";
    const bezelPad = isHomeBtn ? 4 : 3.5;
    const screenTop = isHomeBtn ? 22 : bezelPad + 1.5;
    const screenBottom = isHomeBtn ? 22 : bezelPad + 1.5;
    const scrH = phoneH - screenTop - screenBottom;
    const scrW = phoneW - bezelPad * 2;
    const scrRx = isHomeBtn ? 2 : rx - 4;
    const islandW = resolvedFront === "dynamic-island-compact" ? 21 : 28;
    const notchW = resolvedFront === "notch-narrow" ? 30 : 40;

    return (
      <g transform={`translate(${tx}, ${ty})`}>
        <rect x={0} y={0} width={phoneW} height={phoneH} rx={rx} fill={chassisFrame} />
        <rect x={1.6} y={1.6} width={phoneW - 3.2} height={phoneH - 3.2} rx={rx - 1.5} fill="#080a0f" />
        <rect x={bezelPad} y={screenTop} width={scrW} height={scrH} rx={scrRx} fill={`url(#scr-${uid})`} />

        {(resolvedFront === "dynamic-island" || resolvedFront === "dynamic-island-compact") && (
          <rect x={phoneW / 2 - islandW / 2} y={screenTop + 6} width={islandW} height={8} rx={4} fill="#050608" />
        )}
        {(resolvedFront === "notch-narrow" || resolvedFront === "notch-wide") && (
          <path
            d={`M ${phoneW / 2 - notchW / 2} ${screenTop} h ${notchW} v 6 a 5 5 0 0 1 -5 5 h -${notchW - 10} a 5 5 0 0 1 -5 -5 z`}
            fill="#06070a"
          />
        )}
        {isHomeBtn && (
          <>
            <rect x={phoneW / 2 - 10} y={10} width={20} height={3} rx={1.5} fill="#1f242c" />
            <circle cx={phoneW / 2} cy={phoneH - 11.5} r={6.5} fill="none" stroke={chassisFrame} strokeWidth={1.3} />
          </>
        )}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 240 240" className={`iphone-studio-svg ${className}`.trim()} aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={chassisMain} />
          <stop offset="100%" stopColor={chassisDark} />
        </linearGradient>
        <linearGradient id={`scr-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1b263b" />
          <stop offset="50%" stopColor="#262e42" />
          <stop offset="100%" stopColor="#101520" />
        </linearGradient>
      </defs>
      {activeView === "studio" && (
        <>
          {renderBack(120 - phoneW * 0.72, 21)}
          {renderFront(120 - phoneW * 0.28, 21)}
        </>
      )}
      {activeView === "front" && renderFront(120 - phoneW / 2, 21)}
      {activeView === "back" && renderBack(120 - phoneW / 2, 21)}
    </svg>
  );
}
