"use client";

import { useEffect, useRef, useState } from "react";
import IPhoneModel3D from "@/components/IPhoneModel3D";
import type { Finish } from "@/types/iphone";

type PhoneViewerProps = {
  finish: Finish;
  dimensions: string;
  hasDynamicIsland: boolean;
};

type DragStart = {
  x: number;
  y: number;
  rotation: number;
  pitch: number;
  pointerId: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function PhoneViewer({
  finish,
  dimensions,
  hasDynamicIsland,
}: PhoneViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<DragStart | null>(null);

  useEffect(() => {
    setRotation(0);
    setPitch(0);
  }, [finish.imageUrl]);

  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (event.button !== 0) return;

    event.preventDefault();
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      rotation,
      pitch,
      pointerId: event.pointerId,
    };
    setDragging(true);
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const movePhone = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start || start.pointerId !== event.pointerId) return;
    setRotation(start.rotation + (event.clientX - start.x) * 0.9);
    setPitch(clamp(start.pitch - (event.clientY - start.y) * 0.35, -22, 22));
  };

  const finishDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
    dragStart.current = null;
    setDragging(false);
  };

  const rotateBy = (amount: number) => setRotation((current) => current + amount);

  return (
    <div
      className={`phone-viewer${dragging ? " is-dragging" : ""}`}
      role="group"
      aria-label={`${finish.name} interactive iPhone viewer`}
      onPointerDown={startDrag}
      onPointerMove={movePhone}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
    >
      <div className="viewer-orbit" aria-hidden="true" />
      <div
        className="viewer-phone"
        style={{ transform: `perspective(900px) rotateX(${pitch}deg) rotateY(${rotation}deg)` }}
      >
        <IPhoneModel3D
          key={finish.imageUrl}
          finish={finish}
          dimensions={dimensions}
          hasDynamicIsland={hasDynamicIsland}
        />
      </div>
      <button
        type="button"
        className="viewer-control viewer-control-left"
        aria-label="Rotate view left"
        title="Rotate view left"
        onClick={() => rotateBy(-45)}
      >
        ‹
      </button>
      <button
        type="button"
        className="viewer-control viewer-control-right"
        aria-label="Rotate view right"
        title="Rotate view right"
        onClick={() => rotateBy(45)}
      >
        ›
      </button>
      <button
        type="button"
        className="viewer-reset"
        aria-label="Reset phone view"
        title="Reset phone view"
        onClick={() => { setRotation(0); setPitch(0); }}
      >
        ↻
      </button>
      <span className="viewer-hint" aria-hidden="true">
        <span>↔</span> DRAG PHONE TO ROTATE
      </span>
    </div>
  );
}
