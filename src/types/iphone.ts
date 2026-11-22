export type Series =
  | "Foldable"
  | "Pro Max"
  | "Pro"
  | "Air"
  | "Plus"
  | "Standard"
  | "e"
  | "SE"
  | "mini";

export type CameraLayout =
  | "plateau-triple"
  | "plateau-single"
  | "triple-square"
  | "dual-vertical"
  | "dual-diagonal"
  | "dual-fold"
  | "single-modern"
  | "single-classic";

export type FrontStyle =
  | "foldable"
  | "dynamic-island-compact"
  | "dynamic-island"
  | "notch-narrow"
  | "notch-wide"
  | "home-button";

export interface Finish {
  name: string;
  hexCode: string;
  imageUrl?: string;
  accentHex?: string;
}

export interface Variant {
  modelNumber: string;
  identifier: string;
  region: string;
  simConfiguration: string;
}

export interface Camera {
  position: string;
  megapixels: number;
  aperture: string;
  focalLength: string;
  opticalZoom: string;
  sensorNotes: string;
}

export interface StoragePrice {
  capacity: string;
  priceUsd: number;
}

export interface IPhone {
  slug: string;
  name: string;
  series: Series;
  releaseYear: number;
  releaseDate: string;
  currentLineup: boolean;
  tagline: string;
  highlights: string[];
  initialIos: string;
  maxIos: string;
  storageTiers: string[];
  storagePricing: StoragePrice[];
  launchMsrp: string;
  launchMsrpUsd: number;
  dimensionsMm: string;
  foldedDimensionsMm?: string;
  thicknessMm: number;
  weightG: number;
  frameMaterial: string;
  ipRating: string;
  displaySizeIn: number;
  outerDisplaySizeIn?: number;
  panelType: string;
  resolution: string;
  ppi: number;
  refreshRateHz: number;
  peakBrightnessNits: number;
  hasDynamicIsland: boolean;
  frontStyle: FrontStyle;
  cameraLayout: CameraLayout;
  alwaysOn: boolean;
  chipset: {
    name: string;
    processNm: number;
    cpuCores: number;
    gpuCores: number;
    neuralEngineCores: number;
    supportsAppleIntelligence: boolean;
  };
  ramGb: number;
  cooling?: string;
  cameras: Camera[];
  frontCamera: string;
  videoCapabilities: string;
  maxOpticalZoomX: number;
  batteryMah: number;
  videoPlaybackHours: number;
  fastChargeNote: string;
  portType: "Lightning" | "USB-C";
  magsafeWatts: number;
  biometrics: string;
  modem?: string;
  wireless: string[];
  finishes: Finish[];
  variants: Variant[];
  splineUrl?: string;
}
