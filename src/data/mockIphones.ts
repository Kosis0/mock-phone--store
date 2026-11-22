import type { IPhone } from "@/types/iphone";

const colors = (items: [string, string][]) => items.map(([name, hexCode]) => ({ name, hexCode, imageUrl: `/phones/${name.toLowerCase().replaceAll(" ", "-")}.png` }));
const standardCameras = [{ position: "Main", megapixels: 48, aperture: "f/1.6", focalLength: "26 mm", opticalZoom: "2x in-sensor", sensorNotes: "Sensor-shift OIS" }, { position: "Ultra wide", megapixels: 12, aperture: "f/2.4", focalLength: "13 mm", opticalZoom: "0.5x", sensorNotes: "120° field of view" }];
const proCameras = [...standardCameras, { position: "Telephoto", megapixels: 12, aperture: "f/2.8", focalLength: "120 mm", opticalZoom: "5x optical", sensorNotes: "3D sensor-shift OIS" }];
const make = (slug: string, name: string, series: IPhone["series"], year: number, chip: string, refresh: number, battery: number, weight: number, price: string, port: IPhone["portType"], pro = false): IPhone => ({
  slug, name, series, releaseYear: year, releaseDate: `September ${year}`, initialIos: `iOS ${year - 2007}`, maxIos: `iOS 26`, storageTiers: pro ? ["256 GB", "512 GB", "1 TB"] : ["128 GB", "256 GB", "512 GB"], launchMsrp: price,
  dimensionsMm: "149.6 × 71.5 × 8.25", weightG: weight, frameMaterial: pro ? "Titanium" : "Aluminum", ipRating: "IP68", displaySizeIn: 6.3, panelType: "Super Retina XDR OLED", resolution: "2622 × 1206", ppi: 460, refreshRateHz: refresh, peakBrightnessNits: 2000, hasDynamicIsland: true, alwaysOn: pro,
  chipset: { name: chip, processNm: 3, cpuCores: 6, gpuCores: pro ? 6 : 5, neuralEngineCores: 16, supportsAppleIntelligence: true }, ramGb: pro ? 8 : 8, cameras: pro ? proCameras : standardCameras, batteryMah: battery, videoPlaybackHours: pro ? 27 : 22, portType: port, magsafeWatts: 25, wireless: ["5G", "Wi‑Fi 7", "Bluetooth 5.3", "NFC"], finishes: colors(pro ? [["Natural Titanium", "#aaa69e"], ["Black Titanium", "#373737"], ["Desert Titanium", "#b59b7b"], ["White Titanium", "#e4e2dd"]] : [["Black", "#292929"], ["White", "#e9e8e3"], ["Pink", "#edc7c4"], ["Teal", "#a5c4bd"]]),
  variants: [{ modelNumber: "A3101", identifier: "iPhone17,1", region: "Global", simConfiguration: "Nano-SIM + eSIM" }, { modelNumber: "A3102", identifier: "iPhone17,1", region: "China", simConfiguration: "Dual Nano-SIM" }]
});
export const MOCK_IPHONES: IPhone[] = [
  make("iphone-17-pro", "iPhone 17 Pro", "Pro", 2025, "A19 Pro", 120, 3582, 204, "$1,099", "USB-C", true),
  make("iphone-17", "iPhone 17", "Standard", 2025, "A19", 120, 3692, 177, "$799", "USB-C"),
  make("iphone-16-pro", "iPhone 16 Pro", "Pro", 2024, "A18 Pro", 120, 3582, 199, "$999", "USB-C", true),
  make("iphone-16", "iPhone 16", "Standard", 2024, "A18", 60, 3561, 170, "$799", "USB-C"),
  make("iphone-15-pro", "iPhone 15 Pro", "Pro", 2023, "A17 Pro", 120, 3274, 187, "$999", "USB-C", true),
  make("iphone-15", "iPhone 15", "Standard", 2023, "A16 Bionic", 60, 3349, 171, "$799", "USB-C"),
  make("iphone-se-3", "iPhone SE (3rd gen)", "SE", 2022, "A15 Bionic", 60, 2018, 144, "$429", "Lightning")
];
