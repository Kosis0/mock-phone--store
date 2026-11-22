"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import IPhoneRender from "@/components/IPhoneRender";
import type { Finish } from "@/types/iphone";

const MODEL_HEIGHT = 220;
const DEFAULT_FACE_WIDTH = 88;

type IPhoneModel3DProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
  className?: string;
  spin?: boolean;
};

type FaceSide = "front" | "back";

export default function IPhoneModel3D({
  finish,
  dimensions,
  hasDynamicIsland,
  className = "",
  spin = false,
}: IPhoneModel3DProps) {
  const [faceWidths, setFaceWidths] = useState({
    front: DEFAULT_FACE_WIDTH,
    back: DEFAULT_FACE_WIDTH,
  });
  const [failed, setFailed] = useState(false);
  const imageStem = finish.imageUrl.replace(/\.png(?:\?.*)?$/, "");
  const frontSrc = `${imageStem}-front.png`;
  const backSrc = `${imageStem}-back.png`;

  useEffect(() => {
    setFailed(false);
    setFaceWidths({ front: DEFAULT_FACE_WIDTH, back: DEFAULT_FACE_WIDTH });
  }, [finish.imageUrl]);

  const rememberFaceWidth = (side: FaceSide, image: HTMLImageElement) => {
    if (!image.naturalWidth || !image.naturalHeight) return;
    const width = (image.naturalWidth / image.naturalHeight) * MODEL_HEIGHT;
    setFaceWidths((current) => ({ ...current, [side]: width }));
  };

  if (failed) {
    return (
      <IPhoneRender
        finish={finish}
        dimensions={dimensions}
        hasDynamicIsland={hasDynamicIsland}
        className={`phone-model-fallback ${className}`}
      />
    );
  }

  const modelWidth = Math.max(faceWidths.front, faceWidths.back) + 8;

  return (
    <div
      className={`phone-model${spin ? " is-spinning" : ""} ${className}`}
      role="img"
      aria-label={`${finish.name} iPhone, ${dimensions}`}
      style={{
        "--phone-tint": finish.hexCode,
        "--phone-model-width": `${modelWidth}px`,
        "--phone-model-half-width": `${modelWidth / 2}px`,
      } as React.CSSProperties}
    >
      <div className="phone-model-core" aria-hidden="true">
        <span className="phone-model-side phone-model-side-left" />
        <span className="phone-model-side phone-model-side-right" />
        <span className="phone-model-cap phone-model-cap-top" />
        <span className="phone-model-cap phone-model-cap-bottom" />
        <div className="phone-model-face phone-model-face-back" style={{ width: `${faceWidths.back}px` }}>
          <Image
            src={backSrc}
            alt=""
            width={720}
            height={900}
            sizes="160px"
            draggable={false}
            onLoad={(event) => rememberFaceWidth("back", event.currentTarget)}
            onError={() => setFailed(true)}
            onDragStart={(event) => event.preventDefault()}
            className="phone-model-image"
          />
        </div>
        <div className="phone-model-face phone-model-face-front" style={{ width: `${faceWidths.front}px` }}>
          <Image
            src={frontSrc}
            alt=""
            width={720}
            height={900}
            sizes="160px"
            draggable={false}
            onLoad={(event) => rememberFaceWidth("front", event.currentTarget)}
            onError={() => setFailed(true)}
            onDragStart={(event) => event.preventDefault()}
            className="phone-model-image"
          />
        </div>
      </div>
    </div>
  );
}
