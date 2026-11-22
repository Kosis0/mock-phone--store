export type Series = "Standard" | "Plus" | "Pro" | "Pro Max" | "SE" | "mini";
export interface Finish { name: string; hexCode: string; imageUrl: string; }
export interface Variant { modelNumber: string; identifier: string; region: string; simConfiguration: string; }
export interface Camera { position: string; megapixels: number; aperture: string; focalLength: string; opticalZoom: string; sensorNotes: string; }
export interface IPhone {
  slug: string; name: string; series: Series; releaseYear: number; releaseDate: string; initialIos: string; maxIos: string;
  storageTiers: string[]; launchMsrp: string; dimensionsMm: string; weightG: number; frameMaterial: string; ipRating: string;
  displaySizeIn: number; panelType: string; resolution: string; ppi: number; refreshRateHz: number; peakBrightnessNits: number;
  hasDynamicIsland: boolean; alwaysOn: boolean; chipset: { name: string; processNm: number; cpuCores: number; gpuCores: number; neuralEngineCores: number; supportsAppleIntelligence: boolean };
  ramGb: number; cameras: Camera[]; batteryMah: number; videoPlaybackHours: number; portType: "Lightning" | "USB-C";
  magsafeWatts: number; wireless: string[]; finishes: Finish[]; variants: Variant[];
}
