"use client";

import { useEffect, useRef, useState } from "react";

interface BorderBeamProps {
  beamLength?: number;
  numberOfBeams?: number;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  color?: string;
  colorTo?: string;
  reverse?: boolean;
  glow?: number;
  hotCore?: boolean;
  className?: string;
}

export default function BorderBeam({
  beamLength = 220,
  numberOfBeams = 1,
  duration = 8,
  borderWidth = 2,
  borderRadius,
  color = "#8b5cf6",
  colorTo = "#22d3ee",
  reverse = false,
  glow = 14,
  hotCore = true,
  className = ""
}: BorderBeamProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0, autoRadius: 0 });

  useEffect(() => {
    const el = wrapperRef.current?.parentElement;
    if (!el) return;

    const update = () => {
      const cs = window.getComputedStyle(el);
      const parsedRadius = parseFloat(cs.borderTopLeftRadius) || 0;
      setBox({
        width: el.clientWidth,
        height: el.clientHeight,
        autoRadius: parsedRadius
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { width, height, autoRadius } = box;
  const effectiveRadius = borderRadius ?? autoRadius;
  const r = Math.min(effectiveRadius, width / 2, height / 2) || 0;

  const straightW = Math.max(width - 2 * r, 0);
  const straightH = Math.max(height - 2 * r, 0);
  const perimeter = 2 * straightW + 2 * straightH + 2 * Math.PI * r;

  const gap = Math.max(perimeter / Math.max(numberOfBeams, 1) - beamLength, 0);
  const dashArray = `${beamLength} ${gap}`;

  const uid = useRef(`bb-${Math.random().toString(36).slice(2, 9)}`).current;

  if (!width || !height) {
    return <div ref={wrapperRef} className="pointer-events-none absolute inset-0" />;
  }

  return (
    <div
      ref={wrapperRef}
      className={`pointer-events-none absolute inset-0 overflow-visible ${className}`}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="absolute inset-0"
        style={{ overflow: "visible" }}
        shapeRendering="geometricPrecision"
      >
        <defs>
          <linearGradient id={`${uid}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="20%" stopColor={color} stopOpacity="0.35" />
            <stop offset="42%" stopColor={color} stopOpacity="0.9" />
            <stop offset="50%" stopColor={colorTo} stopOpacity="1" />
            <stop offset="58%" stopColor={colorTo} stopOpacity="0.9" />
            <stop offset="80%" stopColor={colorTo} stopOpacity="0.35" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Layer 1 — wide soft outer bloom */}
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          rx={r}
          ry={r}
          fill="none"
          stroke={`url(#${uid}-grad)`}
          strokeWidth={borderWidth * 4}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          opacity={0.55}
          style={{
            filter: `blur(${glow}px)`,
            animation: `${uid}-travel ${duration}s linear infinite ${
              reverse ? "reverse" : "normal"
            }, ${uid}-pulse-kf ${Math.max(duration / 3, 1.5)}s ease-in-out infinite`
          }}
        />

        {/* Layer 2 — tighter mid glow, gives depth to the bloom */}
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          rx={r}
          ry={r}
          fill="none"
          stroke={`url(#${uid}-grad)`}
          strokeWidth={borderWidth * 1.8}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          style={{
            filter: `blur(${glow * 0.35}px)`,
            animation: `${uid}-travel ${duration}s linear infinite ${
              reverse ? "reverse" : "normal"
            }, ${uid}-pulse-kf ${Math.max(duration / 3, 1.5)}s ease-in-out infinite`
          }}
        />

        {/* Layer 3 — crisp core line */}
        <rect
          x={borderWidth / 2}
          y={borderWidth / 2}
          width={width - borderWidth}
          height={height - borderWidth}
          rx={r}
          ry={r}
          fill="none"
          stroke={`url(#${uid}-grad)`}
          strokeWidth={borderWidth}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          style={{
            animation: `${uid}-travel ${duration}s linear infinite ${
              reverse ? "reverse" : "normal"
            }`
          }}
        />

        {/* Layer 4 — bright white core riding inside the beam, for a premium hot sheen. Uses the SAME dash pattern as the beam itself, so it only ever exists inside the moving segment — never as a static line. */}
        {hotCore && (
          <rect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={width - borderWidth}
            height={height - borderWidth}
            rx={r}
            ry={r}
            fill="none"
            stroke="#ffffff"
            strokeWidth={Math.max(borderWidth * 0.45, 0.75)}
            strokeDasharray={dashArray}
            strokeLinecap="round"
            opacity={0.7}
            style={{
              mixBlendMode: "screen",
              filter: "blur(0.5px)",
              animation: `${uid}-travel ${duration}s linear infinite ${
                reverse ? "reverse" : "normal"
              }`
            }}
          />
        )}
      </svg>

      <style>{`
        @keyframes ${uid}-travel {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -${perimeter}; }
        }
        @keyframes ${uid}-pulse-kf {
            0%, 100% { opacity: 0.75; }
            50% { opacity: 1; }
        }
        `}</style>
    </div>
  );
}
