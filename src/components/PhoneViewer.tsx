"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import IPhoneStudioSvg from "@/components/IPhoneStudioSvg";
import type { CameraLayout, Finish, FrontStyle } from "@/types/iphone";

type PhoneViewerProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
  frontStyle?: FrontStyle;
  cameraLayout?: CameraLayout;
  deviceName?: string;
};

type GalleryAngle = "studio" | "front" | "back";

const ANGLES: { id: GalleryAngle; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
];

export default function PhoneViewer({
  finish,
  dimensions,
  hasDynamicIsland,
  frontStyle,
  cameraLayout,
  deviceName = "iPhone",
}: PhoneViewerProps) {
  const [angle, setAngle] = useState<GalleryAngle>("studio");
  const [zoomed, setZoomed] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const resolvedFrontStyle: FrontStyle =
    frontStyle ?? (hasDynamicIsland ? "dynamic-island" : "notch-narrow");

  useEffect(() => {
    setZoomed(false);
    setFailedSrc(null);
  }, [finish.imageUrl, finish.name]);

  const getImageSrc = (view: GalleryAngle): string | undefined => {
    if (!finish.imageUrl) return undefined;
    if (view === "studio") return finish.imageUrl;
    const stem = finish.imageUrl.replace(/\.png(?:\?.*)?$/, "");
    return `${stem}-${view}.png`;
  };

  const activeSrc = getImageSrc(angle);
  const showPhoto = Boolean(activeSrc && failedSrc !== activeSrc);

  const stepAngle = (direction: -1 | 1) => {
    const idx = ANGLES.findIndex((item) => item.id === angle);
    const nextIdx = (idx + direction + ANGLES.length) % ANGLES.length;
    setAngle(ANGLES[nextIdx].id);
  };

  return (
    <div
      className={`studio-gallery${zoomed ? " is-zoomed" : ""}`}
      role="group"
      aria-label={`${finish.name} ${deviceName} gallery`}
    >
      <div className="gallery-toolbar">
        <div
          className="gallery-tabs"
          role="tablist"
          aria-label="Device angle"
        >
          {ANGLES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={angle === item.id}
              className={`gallery-tab${angle === item.id ? " is-active" : ""}`}
              onClick={() => setAngle(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`gallery-zoom-btn${zoomed ? " is-active" : ""}`}
          aria-pressed={zoomed}
          aria-label={zoomed ? "Reset zoom" : "Zoom in on device"}
          onClick={() => setZoomed((current) => !current)}
        >
          {zoomed ? "− 1×" : "+ Zoom"}
        </button>
      </div>

      <div
        className="gallery-stage"
        onClick={() => setZoomed((current) => !current)}
        role="img"
        aria-label={`${finish.name} iPhone ${angle} view, ${dimensions}`}
      >
        <div className="gallery-spotlight" aria-hidden="true" />
        <div className="gallery-media">
          {showPhoto && activeSrc ? (
            <Image
              key={activeSrc}
              src={activeSrc}
              alt={`${deviceName} in ${finish.name} (${angle} view)`}
              width={720}
              height={900}
              priority
              sizes="(max-width: 768px) 80vw, 420px"
              onError={() => setFailedSrc(activeSrc)}
              className="gallery-photo"
            />
          ) : (
            <IPhoneStudioSvg
              finish={finish}
              frontStyle={resolvedFrontStyle}
              cameraLayout={cameraLayout}
              view={angle}
              className="gallery-svg"
            />
          )}
        </div>
      </div>

      <button
        type="button"
        className="gallery-nav gallery-nav-prev"
        aria-label="Previous angle"
        onClick={() => stepAngle(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="gallery-nav gallery-nav-next"
        aria-label="Next angle"
        onClick={() => stepAngle(1)}
      >
        ›
      </button>
    </div>
  );
}
