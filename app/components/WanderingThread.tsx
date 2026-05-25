"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── hand-drawn bezier helpers ── */
function jitter(amplitude: number): number {
  return (Math.random() - 0.5) * 2 * amplitude;
}
function handDrawnOffset(t: number, amplitude = 2.5): number {
  return (
    Math.sin(t * 7.3 + 0.8) * amplitude +
    Math.sin(t * 13.7 + 2.1) * (amplitude * 0.5)
  );
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  const wobble = 1.8;
  let d = `M ${points[0].x + jitter(wobble)} ${points[0].y + jitter(wobble)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const sway = (i % 2 === 0 ? 1 : -1) * Math.min(dist * 0.26, 60);
    const cp1x = prev.x + dx * 0.36 + sway + jitter(wobble);
    const cp1y = prev.y + dy * 0.1 + handDrawnOffset(i) + jitter(wobble);
    const cp2x = curr.x - dx * 0.36 - sway + jitter(wobble);
    const cp2y = curr.y - dy * 0.1 + handDrawnOffset(i + 1) + jitter(wobble);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/* ── music-staff 5-line fragment ── */
function staffLines(cx: number, cy: number, width: number): string {
  const w = width / 2;
  const lines: string[] = [];
  for (let l = -2; l <= 2; l++) {
    const yOff = l * 7;
    lines.push(
      `M ${cx - w} ${cy + yOff} Q ${cx - w * 0.5} ${cy + yOff - 3.5} ${cx} ${cy + yOff} T ${cx + w} ${cy + yOff}`,
    );
  }
  return lines.join(" ");
}

function bracketPath(
  cx: number,
  cy: number,
  size: number,
): { left: string; right: string } {
  const h = size;
  return {
    left: `M ${cx - 18} ${cy - h} L ${cx - 5} ${cy} L ${cx - 18} ${cy + h}`,
    right: `M ${cx + 18} ${cy - h} L ${cx + 5} ${cy} L ${cx + 18} ${cy + h}`,
  };
}

type MorphKind = "staff" | "cursive" | "bracket";

interface MorphZone {
  kind: MorphKind;
  anchorId: string;
  cx: number;
  cy: number;
}

export default function WanderingThread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const threadPathRef = useRef<SVGPathElement>(null);
  const dotsRef = useRef<SVGGElement>(null);
  const morphGroupRef = useRef<SVGGElement>(null);

  const updateThread = useCallback(() => {
    const main = document.getElementById("portfolio-main");
    const svg = svgRef.current;
    const threadPath = threadPathRef.current;
    const dotsGroup = dotsRef.current;
    const morphGroup = morphGroupRef.current;

    if (!main || !svg || !threadPath) return;

    const anchors = main.querySelectorAll<HTMLElement>("[data-thread-anchor]");
    if (anchors.length < 2) return;

    const mainRect = main.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const mainTop = mainRect.top + scrollTop;
    const mainLeft = mainRect.left;
    const mainHeight = main.scrollHeight;

    svg.setAttribute("width", String(mainRect.width));
    svg.setAttribute("height", String(mainHeight));

    const points: { x: number; y: number }[] = [];
    const zones: MorphZone[] = [];

    anchors.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - mainLeft;
      const cy = rect.top + rect.height / 2 + scrollTop - mainTop;
      points.push({ x: cx, y: cy });

      const morph = el.getAttribute("data-thread-morph") as MorphKind | null;
      if (morph) {
        zones.push({
          kind: morph,
          anchorId: el.getAttribute("data-thread-anchor") || "",
          cx,
          cy,
        });
      }
    });

    /* ── build the visible thread path ── */
    const d = buildPath(points);
    threadPath.setAttribute("d", d);

    /* ── dots ── */
    if (dotsGroup) {
      let html = "";
      points.forEach((p) => {
        html += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="#2C3E50" opacity="0.35"><animate attributeName="opacity" values="0.15;0.5;0.15" dur="3.5s" repeatCount="indefinite"/></circle>`;
      });
      dotsGroup.innerHTML = html;
    }

    /* ── morph overlays ── */
    if (morphGroup) {
      let morphHtml = "";
      zones.forEach((z) => {
        if (z.kind === "staff") {
          morphHtml += `<g class="morph-zone morph-staff" data-morph-anchor="${z.anchorId}" opacity="0">`;
          morphHtml += `<path d="${staffLines(z.cx, z.cy, 130)}" fill="none" stroke="#2C3E50" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>`;
          morphHtml += `<text x="${z.cx}" y="${z.cy - 28}" text-anchor="middle" font-family="var(--font-caveat), cursive" font-size="13" fill="#7D9B76" opacity="0.6">♪ ♫</text>`;
          morphHtml += `</g>`;
        } else if (z.kind === "cursive") {
          morphHtml += `<g class="morph-zone morph-cursive" data-morph-anchor="${z.anchorId}" opacity="0">`;
          morphHtml += `<text x="${z.cx}" y="${z.cy + 7}" text-anchor="middle" font-family="var(--font-caveat), cursive" font-size="28" fill="#2C3E50" opacity="0.85">L'aventure</text>`;
          morphHtml += `<path d="M ${z.cx - 55} ${z.cy + 14} Q ${z.cx} ${z.cy + 18} ${z.cx + 55} ${z.cy + 14}" fill="none" stroke="#C4944B" stroke-width="0.8" opacity="0.35"/>`;
          morphHtml += `</g>`;
        } else if (z.kind === "bracket") {
          const b = bracketPath(z.cx, z.cy, 16);
          morphHtml += `<g class="morph-zone morph-bracket" data-morph-anchor="${z.anchorId}" opacity="0">`;
          morphHtml += `<path d="${b.left}" fill="none" stroke="#2C3E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>`;
          morphHtml += `<path d="${b.right}" fill="none" stroke="#2C3E50" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>`;
          morphHtml += `<circle cx="${z.cx}" cy="${z.cy}" r="2.5" fill="#B55B3C" opacity="0.5"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/></circle>`;
          morphHtml += `</g>`;
        }
      });
      morphGroup.innerHTML = morphHtml;
    }

    /* ── kill existing GSAP triggers before re-creating ── */
    ScrollTrigger.getAll().forEach((st) => st.kill());
    anchors.forEach((el) => gsap.killTweensOf(el));

    /* ── ① THREAD LINE REVEAL: animate stroke-dashoffset on scroll ── */
    const trunkLength = threadPath.getTotalLength();
    gsap.set(threadPath, {
      strokeDasharray: trunkLength,
      strokeDashoffset: trunkLength,
    });
    gsap.to(threadPath, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: main,
        start: "top center",
        end: "bottom bottom",
        scrub: 0.8,
      },
    });

    /* ── ② card reveal ── */
    anchors.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=80px",
            end: "top center",
            scrub: 0.9,
          },
        },
      );
    });
  }, []);

  /* ── morph zone crossfade on scroll ── */
  useEffect(() => {
    const main = document.getElementById("portfolio-main");
    if (!main) return;
    const morphSts: ScrollTrigger[] = [];

    const setupMorphTriggers = () => {
      const morphEls = svgRef.current?.querySelectorAll(".morph-zone");
      if (!morphEls || morphEls.length === 0) return;

      morphEls.forEach((morphEl) => {
        const anchorId = morphEl.getAttribute("data-morph-anchor");
        if (!anchorId) return;
        const el = main.querySelector<HTMLElement>(
          `[data-thread-anchor="${anchorId}"]`,
        );
        if (!el) return;

        const st = ScrollTrigger.create({
          trigger: el,
          start: "top+=150px center",
          end: "bottom center",
          scrub: 0.6,
          onUpdate(self) {
            const p = self.progress;
            const opacity = p < 0.5 ? p * 2 : (1 - p) * 2;
            morphEl.setAttribute("opacity", String(Math.min(opacity, 0.85)));
          },
        });
        morphSts.push(st);
      });
    };

    const timer = setTimeout(setupMorphTriggers, 500);
    return () => {
      clearTimeout(timer);
      morphSts.forEach((st) => st.kill());
    };
  }, []);

  /* ── init + resize ── */
  useEffect(() => {
    const timer = setTimeout(updateThread, 300);
    const onResize = () => requestAnimationFrame(updateThread);
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(updateThread);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [updateThread]);

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 overflow-visible pointer-events-none z-20"
      aria-hidden="true"
    >
      {/* Visible hand-drawn thread line, revealed on scroll */}
      <path
        ref={threadPathRef}
        fill="none"
        stroke="#2C3E50"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.28"
      />

      {/* Subtle dotted thread markers at anchor points */}
      <g ref={dotsRef} />

      {/* Morph overlays (staff lines, cursive text, brackets) */}
      <g ref={morphGroupRef} />
    </svg>
  );
}
