import type { IPhone } from "@/types/iphone";

export interface ComparisonRow {
  label: string;
  key: string;
  value: (p: IPhone) => string | number;
  numericValue?: (p: IPhone) => number;
  better?: "higher" | "lower";
  unit?: string;
  decimals?: number;
}

export interface ComparisonSection {
  section: string;
  rows: ComparisonRow[];
}

export const comparisonRows: ComparisonSection[] = [
  {
    section: "Overview",
    rows: [
      { label: "Release date", key: "releaseDate", value: (p) => p.releaseDate },
      { label: "Series", key: "series", value: (p) => p.series },
      {
        label: "Launch price",
        key: "launchMsrpUsd",
        value: (p) => p.launchMsrp,
        numericValue: (p) => p.launchMsrpUsd,
        better: "lower",
        unit: " less",
      },
      {
        label: "Base storage",
        key: "baseStorage",
        value: (p) => p.storageTiers[0] ?? "—",
      },
      {
        label: "Apple Store status",
        key: "currentLineup",
        value: (p) => (p.currentLineup ? "Active 2026 lineup" : "Archive / Refurb"),
      },
      {
        label: "OS lifecycle",
        key: "iosLifecycle",
        value: (p) => `${p.initialIos} → ${p.maxIos}`,
      },
    ],
  },
  {
    section: "Display",
    rows: [
      {
        label: "Main screen size",
        key: "displaySizeIn",
        value: (p) => `${p.displaySizeIn}″`,
        numericValue: (p) => p.displaySizeIn,
        better: "higher",
        unit: "″",
        decimals: 1,
      },
      {
        label: "Outer display",
        key: "outerDisplaySizeIn",
        value: (p) => (p.outerDisplaySizeIn ? `${p.outerDisplaySizeIn}″ OLED` : "—"),
      },
      { label: "Panel technology", key: "panelType", value: (p) => p.panelType },
      { label: "Resolution", key: "resolution", value: (p) => p.resolution },
      {
        label: "Pixel density",
        key: "ppi",
        value: (p) => `${p.ppi} ppi`,
        numericValue: (p) => p.ppi,
        better: "higher",
        unit: " ppi",
      },
      {
        label: "Refresh rate",
        key: "refreshRateHz",
        value: (p) =>
          p.refreshRateHz === 120 ? "120 Hz ProMotion" : `${p.refreshRateHz} Hz`,
        numericValue: (p) => p.refreshRateHz,
        better: "higher",
        unit: " Hz",
      },
      {
        label: "Peak outdoor brightness",
        key: "peakBrightnessNits",
        value: (p) => `${p.peakBrightnessNits.toLocaleString()} nits`,
        numericValue: (p) => p.peakBrightnessNits,
        better: "higher",
        unit: " nits",
      },
      {
        label: "Dynamic Island",
        key: "hasDynamicIsland",
        value: (p) => (p.hasDynamicIsland ? "Yes" : "No"),
      },
      {
        label: "Always-On display",
        key: "alwaysOn",
        value: (p) => (p.alwaysOn ? "Yes" : "No"),
      },
    ],
  },
  {
    section: "Silicon & performance",
    rows: [
      { label: "Chipset", key: "chipset", value: (p) => p.chipset.name },
      {
        label: "Process node",
        key: "processNm",
        value: (p) => `${p.chipset.processNm} nm`,
        numericValue: (p) => p.chipset.processNm,
        better: "lower",
        unit: " nm",
      },
      {
        label: "CPU / GPU cores",
        key: "cores",
        value: (p) => `${p.chipset.cpuCores}-core CPU · ${p.chipset.gpuCores}-core GPU`,
        numericValue: (p) => p.chipset.gpuCores,
        better: "higher",
        unit: " GPU",
      },
      {
        label: "Neural Engine",
        key: "neuralEngine",
        value: (p) => `${p.chipset.neuralEngineCores}-core`,
        numericValue: (p) => p.chipset.neuralEngineCores,
        better: "higher",
        unit: " cores",
      },
      {
        label: "Memory (RAM)",
        key: "ramGb",
        value: (p) => `${p.ramGb} GB`,
        numericValue: (p) => p.ramGb,
        better: "higher",
        unit: " GB",
      },
      {
        label: "Apple Intelligence",
        key: "ai",
        value: (p) =>
          p.chipset.supportsAppleIntelligence ? "Supported" : "Not supported",
      },
      {
        label: "Thermal system",
        key: "cooling",
        value: (p) => p.cooling ?? "Graphite thermal sheet",
      },
    ],
  },
  {
    section: "Camera system",
    rows: [
      {
        label: "Main camera",
        key: "maincam",
        value: (p) =>
          `${p.cameras[0]?.megapixels ?? "—"} MP · ${p.cameras[0]?.aperture ?? ""}`,
      },
      {
        label: "Rear lens array",
        key: "cameras",
        value: (p) => `${p.cameras.length} ${p.cameras.length === 1 ? "lens" : "lenses"}`,
        numericValue: (p) => p.cameras.length,
        better: "higher",
        unit: " lens",
      },
      {
        label: "Optical zoom reach",
        key: "maxOpticalZoomX",
        value: (p) => `${p.maxOpticalZoomX}x`,
        numericValue: (p) => p.maxOpticalZoomX,
        better: "higher",
        unit: "x",
      },
      { label: "Front camera", key: "frontCamera", value: (p) => p.frontCamera },
      { label: "Video engine", key: "video", value: (p) => p.videoCapabilities },
    ],
  },
  {
    section: "Battery & charging",
    rows: [
      {
        label: "Battery capacity",
        key: "batteryMah",
        value: (p) => `${p.batteryMah.toLocaleString()} mAh`,
        numericValue: (p) => p.batteryMah,
        better: "higher",
        unit: " mAh",
      },
      {
        label: "Video playback",
        key: "videoPlaybackHours",
        value: (p) => `${p.videoPlaybackHours} hrs`,
        numericValue: (p) => p.videoPlaybackHours,
        better: "higher",
        unit: " hrs",
      },
      { label: "Fast charge", key: "fastCharge", value: (p) => p.fastChargeNote },
      { label: "Charging port", key: "portType", value: (p) => p.portType },
      {
        label: "MagSafe wireless",
        key: "magsafeWatts",
        value: (p) => (p.magsafeWatts > 0 ? `${p.magsafeWatts} W` : "Qi only (7.5 W)"),
        numericValue: (p) => p.magsafeWatts,
        better: "higher",
        unit: " W",
      },
    ],
  },
  {
    section: "Body & connectivity",
    rows: [
      { label: "Dimensions", key: "dimensionsMm", value: (p) => `${p.dimensionsMm} mm` },
      {
        label: "Thickness",
        key: "thicknessMm",
        value: (p) => `${p.thicknessMm} mm`,
        numericValue: (p) => p.thicknessMm,
        better: "lower",
        unit: " mm thinner",
        decimals: 2,
      },
      {
        label: "Weight",
        key: "weightG",
        value: (p) => `${p.weightG} g`,
        numericValue: (p) => p.weightG,
        better: "lower",
        unit: "g lighter",
      },
      { label: "Frame material", key: "frameMaterial", value: (p) => p.frameMaterial },
      { label: "Biometrics", key: "biometrics", value: (p) => p.biometrics },
      { label: "Ingress protection", key: "ipRating", value: (p) => p.ipRating },
      {
        label: "Wireless stack",
        key: "wireless",
        value: (p) => p.wireless.join(" · "),
      },
    ],
  },
];

export function formatDeltaBadge(
  values: number[],
  better: "higher" | "lower",
  unit = "",
  decimals = 0,
  key?: string
) {
  if (values.length < 2 || new Set(values).size === 1) return "";
  const rawDelta = Math.max(...values) - Math.min(...values);
  const rounded =
    decimals > 0
      ? Number(rawDelta.toFixed(decimals)).toString()
      : Math.round(rawDelta).toLocaleString();
  if (key === "launchMsrpUsd") {
    return `$${rounded}${unit}`;
  }
  return `${better === "lower" ? "−" : "+"}${rounded}${unit}`;
}
