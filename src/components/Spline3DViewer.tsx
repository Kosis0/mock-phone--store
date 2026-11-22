"use client";

import { useEffect, useState } from "react";

type Spline3DViewerProps = {
  sceneUrl: string;
  className?: string;
  title?: string;
};

export default function Spline3DViewer({
  sceneUrl,
  className = "",
  title = "Interactive 3D iPhone Model",
}: Spline3DViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const isGlb = sceneUrl.endsWith(".glb") || sceneUrl.endsWith(".gltf");
  const isIframe = sceneUrl.includes("my.spline.design");

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(timer);
  }, [sceneUrl]);

  return (
    <div className={`spline-3d-container ${className}`}>
      {!loaded && (
        <div className="spline-loading-skeleton" aria-hidden="true">
          <div className="spline-spinner" />
          <span>Loading 3D Engine…</span>
        </div>
      )}

      {isGlb ? (
        <div
          ref={(node) => {
            if (!node || node.querySelector("model-viewer")) return;
            const mv = document.createElement("model-viewer");
            mv.setAttribute("src", sceneUrl);
            mv.setAttribute("auto-rotate", "");
            mv.setAttribute("camera-controls", "");
            mv.setAttribute("shadow-intensity", "1.2");
            mv.setAttribute("shadow-softness", "0.8");
            mv.setAttribute("exposure", "1.0");
            mv.setAttribute("loading", "lazy");
            mv.className = "spline-canvas";
            mv.addEventListener("load", () => setLoaded(true));
            node.appendChild(mv);
          }}
          className="spline-canvas-wrap"
        />
      ) : isIframe ? (
        <iframe
          src={sceneUrl}
          title={title}
          className="spline-iframe"
          onLoad={() => setLoaded(true)}
          allow="autoplay; fullscreen"
        />
      ) : (
        <div
          ref={(node) => {
            if (!node || node.querySelector("spline-viewer")) return;
            const viewer = document.createElement("spline-viewer");
            viewer.setAttribute("url", sceneUrl);
            viewer.setAttribute("events-target", "global");
            viewer.setAttribute("loading", "lazy");
            viewer.className = "spline-canvas";
            viewer.addEventListener("load", () => setLoaded(true));
            node.appendChild(viewer);
          }}
          className="spline-canvas-wrap"
        />
      )}

      <div className="spline-overlay-badge" aria-hidden="true">
        <span className="spline-badge-dot" />
        REALTIME 3D · DRAG TO ORBIT
      </div>
    </div>
  );
}
