"use client";

import Image from "next/image";
import { useState } from "react";
import type { Finish } from "@/types/iphone";

type IPhoneRenderProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
  className?: string;
};

export default function IPhoneRender({
  finish,
  dimensions,
  hasDynamicIsland,
  className = "",
}: IPhoneRenderProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const imageFailed = failedImage === finish.imageUrl;

  return (
    <div
      className={`phone-stage ${className}`}
      role="img"
      aria-label={`${finish.name} iPhone, ${dimensions}`}
    >
      {!imageFailed ? (
        <Image
          src={finish.imageUrl}
          alt=""
          width={720}
          height={900}
          sizes="(max-width: 680px) 35vw, 220px"
          onError={() => setFailedImage(finish.imageUrl)}
          className="phone-image"
        />
      ) : (
        <div
          className="phone-shell"
          style={{ "--phone-color": finish.hexCode } as React.CSSProperties}
        >
          <div className="phone-side-button" />
          <div className="camera-island"><i /><i /><i /><b /></div>
          <div className="phone-screen">
            <div className="screen-glow" />
            {hasDynamicIsland ? <div className="dynamic-island" /> : <div className="notch" />}
            <div className="screen-time">9:41</div>
            <div className="screen-bottom" />
          </div>
        </div>
      )}
    </div>
  );
}
