"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import IPhoneStudioSvg from "@/components/IPhoneStudioSvg";
import type { CameraLayout, Finish, FrontStyle } from "@/types/iphone";

type IPhoneModel3DProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
  frontStyle?: FrontStyle;
  cameraLayout?: CameraLayout;
  className?: string;
  spin?: boolean;
  rotationY?: number;
  rotationX?: number;
};

export default function IPhoneModel3D({
  finish,
  dimensions,
  hasDynamicIsland,
  frontStyle,
  cameraLayout,
  className = "",
  spin = false,
  rotationY = 0,
  rotationX = 0,
}: IPhoneModel3DProps) {
  const [failed, setFailed] = useState(false);
  const hasLocalPhoto = Boolean(finish.imageUrl);
  const imageStem = finish.imageUrl
    ? finish.imageUrl.replace(/\.png(?:\?.*)?$/, "")
    : "";
  const frontSrc = imageStem ? `${imageStem}-front.png` : "";
  const backSrc = imageStem ? `${imageStem}-back.png` : "";

  const resolvedFrontStyle: FrontStyle =
    frontStyle ?? (hasDynamicIsland ? "dynamic-island" : "notch-narrow");
  const isFoldable = resolvedFrontStyle === "foldable";

  useEffect(() => {
    setFailed(false);
  }, [finish.imageUrl, finish.name]);

  const useRasterFaces = hasLocalPhoto && !failed;
  const glarePosition = ((rotationY % 360) + 360) % 360;

  return (
    <div
      className={`phone-model${spin ? " is-spinning" : ""}${isFoldable ? " is-foldable" : ""} ${className}`}
      role="img"
      aria-label={`${finish.name} iPhone, ${dimensions}`}
      style={
        {
          "--phone-tint": finish.hexCode,
          "--glare-angle": `${glarePosition}deg`,
          "--rot-x": `${rotationX}deg`,
          "--rot-y": `${rotationY}deg`,
        } as React.CSSProperties
      }
    >
      <div className="phone-model-core" aria-hidden="true">
        <div className="phone-model-side phone-model-side-left">
          <span className="chassis-antenna antenna-top" />
          <span className="chassis-btn btn-action" title="Action Button" />
          <span className="chassis-btn btn-vol-up" title="Volume Up" />
          <span className="chassis-btn btn-vol-down" title="Volume Down" />
          <span className="chassis-antenna antenna-bottom" />
        </div>

        <div className="phone-model-side phone-model-side-right">
          <span className="chassis-antenna antenna-top" />
          <span className="chassis-btn btn-power" title="Side Button" />
          <span
            className="chassis-btn btn-camera-control"
            title="Camera Control"
          />
          <span className="chassis-antenna antenna-bottom" />
        </div>

        <div className="phone-model-cap phone-model-cap-top">
          <span className="chassis-antenna antenna-top-center" />
        </div>

        <div className="phone-model-cap phone-model-cap-bottom">
          <div className="bottom-ports">
            <span className="speaker-grille" />
            <span className="connector-port" />
            <span className="speaker-grille" />
          </div>
        </div>

        <div className="phone-model-face phone-model-face-back">
          <div className="phone-face-surface">
            {useRasterFaces ? (
              <Image
                src={backSrc}
                alt=""
                width={720}
                height={900}
                sizes="220px"
                draggable={false}
                onError={() => setFailed(true)}
                onDragStart={(event) => event.preventDefault()}
                className="phone-model-image"
              />
            ) : (
              <IPhoneStudioSvg
                finish={finish}
                frontStyle={resolvedFrontStyle}
                cameraLayout={cameraLayout}
                view="back"
                className="phone-model-svg"
              />
            )}
            <div className="phone-back-glass-sheen" />
            <div className="phone-chassis-rim" />
          </div>
        </div>

        <div className="phone-model-face phone-model-face-front">
          <div className="phone-face-surface">
            {useRasterFaces ? (
              <Image
                src={frontSrc}
                alt=""
                width={720}
                height={900}
                sizes="220px"
                draggable={false}
                onError={() => setFailed(true)}
                onDragStart={(event) => event.preventDefault()}
                className="phone-model-image"
              />
            ) : (
              <IPhoneStudioSvg
                finish={finish}
                frontStyle={resolvedFrontStyle}
                cameraLayout={cameraLayout}
                view="front"
                className="phone-model-svg"
              />
            )}
            <div className="phone-screen-glare" />
            {useRasterFaces && hasDynamicIsland && (
              <div className="phone-dynamic-island-cutout" />
            )}
            <div className="phone-chassis-rim" />
          </div>
        </div>

        <div className="phone-model-shadow" />
      </div>
    </div>
  );
}
