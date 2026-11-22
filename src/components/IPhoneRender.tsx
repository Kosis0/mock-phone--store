"use client";
import { useState } from "react";
import type { Finish } from "@/types/iphone";
export default function IPhoneRender({ finish, dimensions, hasDynamicIsland, className = "" }: { finish: Finish; dimensions: string; hasDynamicIsland: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  return <div className={`phone-stage ${className}`} aria-label={`${finish.name} iPhone, ${dimensions}`}>
    {!failed && <img src={finish.imageUrl} alt="" onError={() => setFailed(true)} className="phone-image" />}
    {failed && <div className="phone-shell" style={{ "--phone-color": finish.hexCode } as React.CSSProperties}>
      <div className="phone-side-button" /><div className="camera-island"><i /><i /><i /><b /></div>
      <div className="phone-screen"><div className="screen-glow" />{hasDynamicIsland ? <div className="dynamic-island" /> : <div className="notch" />}<div className="screen-time">9:41</div><div className="screen-bottom" /></div>
    </div>}
  </div>;
}
