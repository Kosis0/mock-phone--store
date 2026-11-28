"use client";

import Image from "next/image";
import { useState } from "react";
import IPhoneStudioSvg from "@/components/IPhoneStudioSvg";
import type { CameraLayout, Finish, FrontStyle } from "@/types/iphone";

type IPhoneRenderProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
  frontStyle?: FrontStyle;
  cameraLayout?: CameraLayout;
  className?: string;
  priority?: boolean;
};

export default function IPhoneRender({
  finish,
  dimensions,
  hasDynamicIsland,
  frontStyle,
  cameraLayout,
  className = "",
  priority = false,
}: IPhoneRenderProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageUrl = finish.imageUrl;
  const imageFailed = Boolean(imageUrl && failedImage === imageUrl);

  const resolvedFrontStyle: FrontStyle =
    frontStyle ?? (hasDynamicIsland ? "dynamic-island" : "notch-narrow");

  return (
    <div
      className={`phone-stage ${className}`}
      role="img"
      aria-label={`${finish.name} iPhone, ${dimensions}`}
    >
      {imageUrl && !imageFailed ? (
        <Image
          src={imageUrl}
          alt=""
          width={640}
          height={800}
          priority={priority}
          fetchPriority={priority ? "high" : undefined}
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 280px"
          onError={() => setFailedImage(imageUrl)}
          className="phone-image"
        />
      ) : imageFailed ? (
        <div
          className="phone-shell"
          style={{ "--phone-color": finish.hexCode } as React.CSSProperties}
        >
          <div className="phone-side-button" />
          <div className="camera-island">
            <i />
            <i />
            <i />
            <b />
          </div>
          <div className="phone-screen">
            <div className="screen-glow" />
            {hasDynamicIsland ? (
              <div className="dynamic-island" />
            ) : (
              <div className="notch" />
            )}
            <div className="screen-time">9:41</div>
            <div className="screen-bottom" />
          </div>
        </div>
      ) : (
        <IPhoneStudioSvg
          finish={finish}
          frontStyle={resolvedFrontStyle}
          cameraLayout={cameraLayout}
          view="studio"
          className="phone-studio-render"
        />
      )}
    </div>
  );
}
