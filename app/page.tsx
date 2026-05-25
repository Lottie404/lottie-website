"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import WanderingThread from "./components/WanderingThread";

/* ── lyric rotation pool ── */
const LYRIC_POOL = [
  "♫ 大风吹着谁 谁就倒霉",
  "♫ 每个人都想当鬼 都一样的下贱",
  "♫ 哭啊 喊啊 叫你妈妈带你去买玩具啊",
  "♫ 快 快拿到学校炫耀吧 孩子 交点朋友吧",
  "♫ 别有压力 我只想见见你",
  "♫  shortcuts to the hidden layers of the mind",
];

/* ═══════════════════════════════════════════
   Gear Lightbulb SVG (for The New Syntax)
   ═══════════════════════════════════════════ */
function GearLightbulb() {
  return (
    <svg
      viewBox="0 0 80 100"
      className="w-16 h-20 md:w-20 md:h-24"
      aria-hidden="true"
    >
      <path
        d="M24 50 Q24 20 40 16 Q56 20 56 50 Q56 66 47 72 L47 80 L33 80 L33 72 Q24 66 24 50Z"
        fill="none"
        stroke="rgba(253,251,247,0.3)"
        strokeWidth="1.2"
      />
      <rect x="31" y="80" width="18" height="5" rx="2" fill="none" stroke="rgba(253,251,247,0.25)" strokeWidth="1" />
      <line x1="33" y1="85" x2="33" y2="89" stroke="rgba(253,251,247,0.18)" strokeWidth="0.8" />
      <line x1="40" y1="85" x2="40" y2="89" stroke="rgba(253,251,247,0.18)" strokeWidth="0.8" />
      <line x1="47" y1="85" x2="47" y2="89" stroke="rgba(253,251,247,0.18)" strokeWidth="0.8" />
      <line x1="35" y1="72" x2="45" y2="72" stroke="rgba(253,251,247,0.2)" strokeWidth="0.6" />
      <path d="M37 72 Q40 62 43 72" fill="none" stroke="rgba(253,251,247,0.2)" strokeWidth="0.6" />
      <g transform="translate(40, 44)" className="gear-group">
        <circle r="8.5" fill="none" stroke="rgba(253,251,247,0.2)" strokeWidth="0.6" />
        <circle r="4" fill="none" stroke="rgba(253,251,247,0.15)" strokeWidth="0.4" strokeDasharray="1.8 1.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={Math.cos(rad) * 8.5} y1={Math.sin(rad) * 8.5}
              x2={Math.cos(rad) * 11} y2={Math.sin(rad) * 11}
              stroke="rgba(253,251,247,0.18)" strokeWidth="0.6"
            />
          );
        })}
      </g>
      <g transform="translate(49, 53)" className="gear-group" style={{ animationDirection: "reverse" }}>
        <circle r="4.5" fill="none" stroke="rgba(253,251,247,0.15)" strokeWidth="0.5" />
        <circle r="2" fill="none" stroke="rgba(253,251,247,0.1)" strokeWidth="0.4" strokeDasharray="1.2 1" />
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={angle}
              x1={Math.cos(rad) * 4.5} y1={Math.sin(rad) * 4.5}
              x2={Math.cos(rad) * 6.2} y2={Math.sin(rad) * 6.2}
              stroke="rgba(253,251,247,0.13)" strokeWidth="0.5"
            />
          );
        })}
      </g>
      <g transform="translate(31, 34)" className="gear-group" style={{ animationDuration: "3s" }}>
        <circle r="3.5" fill="none" stroke="rgba(253,251,247,0.12)" strokeWidth="0.5" />
      </g>
      {[
        { x1: 16, y1: 28, x2: 7, y2: 20 },
        { x1: 64, y1: 28, x2: 73, y2: 20 },
        { x1: 8, y1: 46, x2: 2, y2: 46 },
        { x1: 72, y1: 46, x2: 78, y2: 46 },
        { x1: 12, y1: 62, x2: 4, y2: 70 },
        { x1: 68, y1: 62, x2: 76, y2: 70 },
        { x1: 18, y1: 16, x2: 14, y2: 8 },
        { x1: 62, y1: 16, x2: 66, y2: 8 },
      ].map((ray, i) => (
        <line
          key={i}
          x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2}
          stroke="rgba(253,251,247,0.1)" strokeWidth="0.5" strokeLinecap="round"
          className="light-ray"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Fern Branch SVG (botanical decal, sways)
   ═══════════════════════════════════════════ */
function FernBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 200"
      className={`plant-sway ${className || ""}`}
      aria-hidden="true"
      style={{ opacity: 0.08 }}
    >
      <path
        d="M70 195 Q68 160 72 130 Q75 100 70 70 Q65 40 70 10"
        fill="none" stroke="#7d9b76" strokeWidth="1.2"
      />
      <path d="M71 170 Q50 165 30 155 Q15 148 10 140" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M71 170 Q55 172 40 168 Q28 164 20 160" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M71 148 Q48 140 28 128 Q15 118 8 108" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M71 148 Q52 152 35 144 Q22 136 14 128" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M71 126 Q50 116 32 102 Q18 90 10 80" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M71 126 Q55 132 38 122 Q25 112 18 104" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M71 104 Q52 94 36 80 Q22 68 14 58" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M71 104 Q56 110 40 100 Q28 90 22 82" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M71 82 Q54 74 40 62 Q28 52 20 42" fill="none" stroke="#7d9b76" strokeWidth="0.6" />
      <path d="M70 60 Q56 54 44 44 Q34 34 28 26" fill="none" stroke="#7d9b76" strokeWidth="0.6" />
      <path d="M70 38 Q58 34 50 24 Q44 16 40 10" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M70 172 Q92 168 112 158 Q128 148 134 138" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M70 172 Q86 176 104 172 Q118 166 128 160" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M70 150 Q94 144 116 132 Q130 122 138 112" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M70 150 Q88 156 108 148 Q122 140 132 132" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M70 128 Q92 120 114 106 Q128 94 136 84" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M70 128 Q86 134 106 124 Q120 114 130 106" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M70 106 Q90 98 110 84 Q124 72 132 62" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
      <path d="M70 106 Q86 112 104 102 Q118 92 128 84" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
      <path d="M70 84 Q88 76 108 62 Q120 50 128 42" fill="none" stroke="#7d9b76" strokeWidth="0.6" />
      <path d="M70 62 Q84 56 98 46 Q108 36 114 28" fill="none" stroke="#7d9b76" strokeWidth="0.6" />
      <path d="M70 40 Q82 36 96 26 Q104 18 110 10" fill="none" stroke="#7d9b76" strokeWidth="0.5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   BUTTERFLY — refined botanical SVG with
   detailed wing veins & scalloped edges
   ═══════════════════════════════════════════ */
function Butterfly({ flying }: { flying: boolean }) {
  return (
    <div className={`butterfly${flying ? " butterfly--visible butterfly--flying" : ""}`}>
      <svg viewBox="0 0 56 52" width="42" height="39" aria-hidden="true">
        <g className="butterfly__wing butterfly__wing--left">
          <path
            d="M28 26 Q22 16 16 10 Q8 6 4 8 Q2 12 4 18 Q6 24 12 28 Q18 30 24 30 Q27 29 28 26Z"
            fill="none" stroke="#2c3e50" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round"
            opacity="0.5"
          />
          <path d="M24 22 Q20 16 16 12" fill="none" stroke="#2c3e50" strokeWidth="0.45" opacity="0.3" />
          <path d="M22 24 Q18 20 14 16" fill="none" stroke="#2c3e50" strokeWidth="0.35" opacity="0.25" />
          <path d="M26 20 Q24 14 20 10" fill="none" stroke="#2c3e50" strokeWidth="0.4" opacity="0.28" />
          <path
            d="M26 27 Q22 34 14 36 Q6 36 4 32 Q3 28 8 26 Q16 24 22 26 Q25 27 26 27Z"
            fill="none" stroke="#2c3e50" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"
            opacity="0.4"
          />
          <path d="M20 30 Q16 33 10 34" fill="none" stroke="#2c3e50" strokeWidth="0.3" opacity="0.2" />
        </g>
        <g className="butterfly__wing butterfly__wing--right">
          <path
            d="M28 26 Q34 16 40 10 Q48 6 52 8 Q54 12 52 18 Q50 24 44 28 Q38 30 32 30 Q29 29 28 26Z"
            fill="none" stroke="#2c3e50" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round"
            opacity="0.5"
          />
          <path d="M32 22 Q36 16 40 12" fill="none" stroke="#2c3e50" strokeWidth="0.45" opacity="0.3" />
          <path d="M34 24 Q38 20 42 16" fill="none" stroke="#2c3e50" strokeWidth="0.35" opacity="0.25" />
          <path d="M30 20 Q32 14 36 10" fill="none" stroke="#2c3e50" strokeWidth="0.4" opacity="0.28" />
          <path
            d="M30 27 Q34 34 42 36 Q50 36 52 32 Q53 28 48 26 Q40 24 34 26 Q31 27 30 27Z"
            fill="none" stroke="#2c3e50" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"
            opacity="0.4"
          />
          <path d="M36 30 Q40 33 46 34" fill="none" stroke="#2c3e50" strokeWidth="0.3" opacity="0.2" />
        </g>
        <ellipse cx="28" cy="28" rx="1.3" ry="5.5" fill="none" stroke="#2c3e50" strokeWidth="0.85" opacity="0.45" />
        <ellipse cx="28" cy="22" rx="1" ry="2.5" fill="none" stroke="#2c3e50" strokeWidth="0.6" opacity="0.35" />
        <path d="M28 20 Q25 14 22 12 Q20 10 21 9" fill="none" stroke="#2c3e50" strokeWidth="0.45" opacity="0.3" />
        <path d="M28 20 Q31 14 34 12 Q36 10 35 9" fill="none" stroke="#2c3e50" strokeWidth="0.45" opacity="0.3" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BIRD — realistic multi-layer SVG with
   realisticFlap animation (scaleY + rotateX + skewX)
   ═══════════════════════════════════════════ */
function Bird({
  variant,
  visible,
  flying,
}: {
  variant: "a" | "b";
  visible: boolean;
  flying: boolean;
}) {
  const size = variant === "a" ? 72 : 54;
  return (
    <div
      className={`bird${visible ? " bird--visible" : ""}${flying ? (variant === "a" ? " bird--flying-a" : " bird--flying-b") : ""}`}
    >
      <svg viewBox="0 0 80 40" width={size} height={size * 0.5} aria-hidden="true">
        <g className="bird__body-group">
          {/* Main wing — upper primary feathers with realisticFlap */}
          <path
            d="M10 20 Q28 0 52 7 Q64 2 78 13"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bird__wing-main"
            opacity="0.48"
          />
          {/* Secondary wing — lower layer with offset flap phase */}
          <path
            d="M14 23 Q30 10 50 14 Q62 8 76 19"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bird__wing-secondary"
            opacity="0.32"
          />
          {/* Inner wing detail — tertiary feather edge */}
          <path
            d="M18 25 Q32 16 46 19 Q56 14 66 21"
            fill="none"
            stroke="#2C3E50"
            strokeWidth="0.5"
            strokeLinecap="round"
            className="bird__wing-tertiary"
            opacity="0.18"
          />
          {/* Feather barb lines */}
          <path d="M28 12 Q32 6 36 8" fill="none" stroke="#2C3E50" strokeWidth="0.4" opacity="0.2" />
          <path d="M36 10 Q40 5 44 7" fill="none" stroke="#2C3E50" strokeWidth="0.35" opacity="0.17" />
          <path d="M44 11 Q48 7 52 9" fill="none" stroke="#2C3E50" strokeWidth="0.35" opacity="0.17" />
          {/* Tail streamers — forked tail */}
          <path d="M78 13 Q82 6 84 14" fill="none" stroke="#2C3E50" strokeWidth="0.65" strokeLinecap="round" className="bird__tail" opacity="0.28" />
          <path d="M76 19 Q81 14 84 22" fill="none" stroke="#2C3E50" strokeWidth="0.5" strokeLinecap="round" className="bird__tail" opacity="0.22" />
          {/* Body — streamlined ellipse */}
          <ellipse cx="10" cy="22" rx="4.5" ry="3" fill="none" stroke="#2C3E50" strokeWidth="0.75" opacity="0.38" />
          {/* Head + beak */}
          <circle cx="6" cy="20" r="2" fill="none" stroke="#2C3E50" strokeWidth="0.6" opacity="0.32" />
          <path d="M4 20 Q1 19 0 19.5" fill="none" stroke="#2C3E50" strokeWidth="0.55" strokeLinecap="round" opacity="0.3" />
          {/* Eye */}
          <circle cx="5" cy="19.5" r="0.7" fill="#2C3E50" opacity="0.38" />
        </g>
        {/* Ink trail droplets — staggered fade */}
        <circle cx="32" cy="26" r="0.55" fill="#2C3E50" opacity="0" className="bird__ink-dot" />
        <circle cx="48" cy="24" r="0.45" fill="#2C3E50" opacity="0" className="bird__ink-dot" />
        <circle cx="64" cy="28" r="0.38" fill="#2C3E50" opacity="0" className="bird__ink-dot" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   WAX SEAL — deep red seal for contact letter
   ═══════════════════════════════════════════ */
function WaxSeal() {
  return (
    <svg viewBox="0 0 48 48" className="wax-seal" aria-hidden="true">
      <defs>
        <radialGradient id="waxGrad" cx="38%" cy="32%">
          <stop offset="0%" stopColor="#b33a3a" />
          <stop offset="60%" stopColor="#8b2a2a" />
          <stop offset="100%" stopColor="#5c1a1a" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="url(#waxGrad)" className="wax-seal__circle" />
      <circle cx="24" cy="24" r="16" fill="none" stroke="rgba(253,251,247,0.18)" strokeWidth="0.7" strokeDasharray="2 1.5" />
      <path d="M24 8 Q28 24 24 40 Q20 24 24 8Z" fill="none" stroke="rgba(253,251,247,0.2)" strokeWidth="0.6" />
      <path d="M8 24 Q24 20 40 24 Q24 28 8 24Z" fill="none" stroke="rgba(253,251,247,0.2)" strokeWidth="0.6" />
      <text x="24" y="27" textAnchor="middle" fontFamily="var(--font-caveat), cursive" fontSize="10" fill="rgba(253,251,247,0.7)">L</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════
   SECTION HEADER — classical section divider
   ═══════════════════════════════════════════ */
function SectionHeader({
  number,
  title,
  subtitle,
  anchorId,
  onMouseEnter,
}: {
  number: string;
  title: string;
  subtitle: string;
  anchorId: string;
  onMouseEnter?: () => void;
}) {
  return (
    <div
      data-thread-anchor={anchorId}
      className="section-header"
      onMouseEnter={onMouseEnter}
    >
      <span className="section-header__number">{number}</span>
      <div className="section-header__text">
        <h2 className="section-header__title">{title}</h2>
        <p className="section-header__sub">{subtitle}</p>
      </div>
      <div className="section-header__line" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   CENTER MODAL DOSSIER — "解剖大窗"
   ═══════════════════════════════════════════ */
type DossierId = "vr" | "bosch" | "ai" | null;

function CenterModalDossier({
  activeId,
  onClose,
}: {
  activeId: DossierId;
  onClose: () => void;
}) {
  if (!activeId) return null;

  const dossiers: Record<string, {
    heading: string;
    sub: string;
    images?: { src: string; alt: string; isLogo?: boolean }[];
    body: string;
    stamp?: string;
  }> = {
    vr: {
      heading: "VR-Driven Behavioral Research",
      sub: "SSCI Joint First Author & Provincial Leader",
      images: [
        { src: "/VR.png", alt: "VR Equipment" },
        { src: "/ssci.png", alt: "SSCI Paper Cover" },
      ],
      body: '"From Fuzzy Perception to Quantitative Models."\n\n主导 VR 行为学实验，采集 200+ 被试在动态速度变化下的时间碰撞判断数据。精通将模糊的用户主观体验（焦虑、时间感知、风险预判）转化为可通过 Bayesian Inference 优化的量化指标。这不仅是学术，更是对用户心智底层认知机制的深度拆解。',
    },
    bosch: {
      heading: "User Research @ Bosch Intelligent Technology",
      sub: "Decoupling security and friction in smart-home UX",
      images: [
        { src: "/logo.png", alt: "Bosch Logo", isLogo: true },
      ],
      body: '"The Empathy Layer — From Lab to Launch."\n\n通过 300+ 份真实问卷与深度访谈挖掘智能锁用户的隐形痛点。拒绝伪需求，主导安全机制与临时密码功能迭代，将心理学训练中习得的同理心——倾听、观察、推导——转化为可落地的产品策略与工程需求。',
      stamp: "FIELD NOTES",
    },
    ai: {
      heading: "The New Syntax",
      sub: "AI Experiments · Vibecoding · Super-Individual",
      body: '"The Super-Individual — Vibecoding to Full-Stack."\n\n利用 Vibecoding 打通全栈闭环。精通 Prompt Engineering 与 AI Cinematography (Midjourney / Runway)。将人类的心理需求与审美直觉作为最终皮肤，直接编译为可运行的 Next.js / React 产品 Demo。Prompt as source code, system architecture as skeleton, aesthetic intuition as skin.',
    },
  };

  const d = dossiers[activeId];
  if (!d) return null;

  return (
    <div className="dossier-overlay dossier-overlay--active" onClick={onClose}>
      <div
        className="dossier-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="dossier-modal__close" onClick={onClose}>
          — close —
        </button>
        <div className="dossier-modal__inner">
          <h3 className="dossier-modal__heading">{d.heading}</h3>
          <p className="dossier-modal__sub">{d.sub}</p>
          {d.images && d.images.length > 0 && (
            <div className="dossier-modal__images">
              {d.images.map((img, i) =>
                img.isLogo ? (
                  <div key={i} className="dossier-modal__img" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f6f0", minHeight: 80, maxWidth: 120 }}>
                    <img src={img.src} alt={img.alt} style={{ maxWidth: "80%", maxHeight: "60%", objectFit: "contain", opacity: 0.7 }} />
                  </div>
                ) : (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    className="dossier-modal__img"
                  />
                ),
              )}
            </div>
          )}
          <p className="dossier-modal__body">{d.body}</p>
          {d.stamp && <div className="dossier-modal__stamp">{d.stamp}</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GALLERY CONSOLE — "策展人主视觉总控台"
   ═══════════════════════════════════════════ */
interface GalleryAlbum {
  name: string;
  label: string;
  photos: string[];
  caption: string;
}

function GalleryConsole({
  albums,
  onPhotoClick,
}: {
  albums: GalleryAlbum[];
  onPhotoClick: (photo: string, caption: string) => void;
}) {
  const [activeAlbum, setActiveAlbum] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const photos = albums[activeAlbum]?.photos || [];
  const currentCaption = albums[activeAlbum]?.caption || "";

  const resetAutoRotation = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    if (photos.length === 0) return;
    autoTimerRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % photos.length);
      setSwapping(true);
      setTimeout(() => setSwapping(false), 500);
    }, 4200);
  }, [photos.length]);

  useEffect(() => {
    resetAutoRotation();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [activeAlbum, resetAutoRotation]);

  const handleThumbClick = (index: number) => {
    if (index === heroIndex) return;
    setHeroIndex(index);
    setSwapping(true);
    setTimeout(() => setSwapping(false), 500);
    resetAutoRotation();
  };

  const handleTabChange = (i: number) => {
    setActiveAlbum(i);
    setHeroIndex(0);
    setSwapping(true);
    setTimeout(() => setSwapping(false), 500);
  };

  if (photos.length === 0) return null;
  const heroPhoto = photos[heroIndex];
  const thumbs = photos.filter((_, i) => i !== heroIndex);

  return (
    <div className="gallery-console">
      <div className="gallery__tabs">
        {albums.map((album, i) => (
          <button
            key={album.name}
            className={`gallery__tab${i === activeAlbum ? " gallery__tab--active" : ""}`}
            onClick={() => handleTabChange(i)}
          >
            {album.label}
          </button>
        ))}
      </div>

      <div className="gallery__stage">
        <div
          className={`gallery__hero${swapping ? " gallery-swap" : ""}`}
          onClick={() => onPhotoClick(heroPhoto, currentCaption)}
        >
          <div className="gallery__hero-frame">
            <img
              src={heroPhoto}
              alt={`${albums[activeAlbum]?.label} hero`}
              className="gallery__hero-img"
            />
          </div>
          <p className="gallery__hero-caption">{currentCaption}</p>
        </div>

        <div className="gallery__thumb-grid">
          {thumbs.map((photo, i) => {
            const realIndex = photos.indexOf(photo);
            return (
              <img
                key={`${activeAlbum}-${realIndex}`}
                src={photo}
                alt={`Thumbnail ${realIndex + 1}`}
                className="gallery__thumb"
                onClick={() => handleThumbClick(realIndex)}
                loading="lazy"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIGHTBOX — polaroid pop-up
   ═══════════════════════════════════════════ */
function Lightbox({
  photo,
  caption,
  onClose,
}: {
  photo: string | null;
  caption: string;
  onClose: () => void;
}) {
  if (!photo) return null;
  return (
    <div
      className={`lightbox-overlay${photo ? " lightbox-overlay--active" : ""}`}
      onClick={onClose}
    >
      <div className="lightbox__polaroid" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox__close" onClick={onClose}>— close —</button>
        <img src={photo} alt="Gallery" />
        <p className="lightbox__caption">{caption}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 1 LEFT (col-span-8): SOUNDTRACK CARD
   宽卡片 — vinyl.png 点击播放/暂停 + 硬核打字机文本
   ═══════════════════════════════════════════ */
function SoundtrackCard({
  isPlaying,
  onTogglePlay,
  lyricText,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  lyricText: string;
}) {
  return (
    <div
      className="soundtrack-card bento-card p-7 md:p-9 rotate-scatter-1 relative overflow-hidden"
    >
      {/* Music notes background */}
      <div className="soundtrack-bg-notes" aria-hidden="true">
        <svg viewBox="0 0 300 200" className="w-full h-full opacity-[0.035]">
          <text x="20" y="40" fontSize="26" fill="#2C3E50">♪</text>
          <text x="100" y="70" fontSize="20" fill="#2C3E50">♫</text>
          <text x="180" y="30" fontSize="30" fill="#2C3E50">♩</text>
          <text x="250" y="60" fontSize="22" fill="#2C3E50">♪</text>
          <text x="40" y="110" fontSize="18" fill="#2C3E50">♬</text>
          <text x="120" y="140" fontSize="24" fill="#2C3E50">♫</text>
          <text x="200" y="120" fontSize="16" fill="#2C3E50">♪</text>
          <text x="60" y="170" fontSize="20" fill="#2C3E50">♩</text>
          <text x="160" y="170" fontSize="18" fill="#2C3E50">♬</text>
          <text x="260" y="150" fontSize="22" fill="#2C3E50">♫</text>
        </svg>
      </div>

      {/* Header */}
      <span className="text-xs tracking-[0.3em] uppercase text-amber-dark font-[family-name:var(--font-crimson)] relative z-10 block mb-6">
        The Soundtrack of My Mind  ·  On the Thread
      </span>

      {/* Main content: left CD + right text */}
      <div className="flex flex-col md:flex-row gap-7 md:gap-9 relative z-10">
        {/* Left: CD Player — click to play/pause */}
        <div className="flex-shrink-0 flex flex-col items-center gap-3">
          <div className="cd-player">
            <div
              className="cd-disc cd-disc--spinning"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
              onClick={onTogglePlay}
            >
              <img
                src="/vinyl.png"
                alt="Vinyl Record — click to play"
                className="w-full h-full object-contain cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              />
            </div>
            <div className="cd-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-parchment/30 shadow-md pointer-events-none">
              <img
                src="/cover.jpg"
                alt="Album Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="font-[family-name:var(--font-caveat)] text-sm text-ink-light text-center -mt-1">
            Chateau — Angus &amp; Julia Stone
          </p>
          <p className="text-[0.6rem] text-amber-dark/50 font-[family-name:var(--font-caveat)] text-center -mt-2">
            click disc to {isPlaying ? "pause" : "play"}
          </p>
        </div>

        {/* Right: Hardcore PM + Full-Stack text */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="font-mono text-[0.72rem] text-ink-light leading-relaxed">
            <p className="mb-2">
              <span className="text-amber-dark font-semibold">&gt; 网易云音乐 Lv.9 · 耳机听歌量 1w+</span>
            </p>
            <p className="mb-2 opacity-80">
              从深夜英伦摇滚到黎明极简电音——音乐是我在{" "}
              <span className="ink-accent">心理学实验数据</span>与{" "}
              <span className="ink-accent--amber">React 组件树</span>之间的缝合线。
            </p>
            <hr className="thread-divider my-3" />
            <p className="text-[0.68rem] text-ink-light/70 italic leading-relaxed">
              &ldquo;The thread that once ran through human consciousness now
              compiles through circuits and code. We translate empathy into
              architecture, intuition into inference.&rdquo;
            </p>
            <p className="text-[0.65rem] text-ink-light/50 mt-1">
              — Applied Psychology × AI Product × Full-Stack craftsmanship.
            </p>
          </div>
        </div>
      </div>

      {/* Lyrics marquee */}
      <div className="flex flex-col items-center gap-3 mt-6 relative z-10">
        <div className={`lyric-marquee ${lyricText ? "lyric-marquee--active" : ""}`}>
          <span className="lyric-marquee__text">{lyricText}</span>
        </div>
        <span className="annotation">~ music threads through mind and machine ~</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 1 RIGHT (col-span-4): SUGAR-FREE METER
   黄铜指针复古刻度盘 · 小巧能量槽
   ═══════════════════════════════════════════ */
function SugarFreeMeter({ visible }: { visible: boolean }) {
  return (
    <div className="sugar-meter-card bento-card p-6 md:p-7 flex flex-col gap-5 rotate-scatter-2">
      <span className="text-xs tracking-[0.3em] uppercase text-sage font-[family-name:var(--font-crimson)]">
        The Sugar-Free Meter
      </span>

      {/* Brass gauge: Brain Clarity */}
      <div className="gauge">
        <svg viewBox="0 0 100 60" className="gauge__arc" aria-hidden="true">
          <path
            d="M10 52 A40 40 0 0 1 90 52"
            fill="none"
            stroke="rgba(44,62,80,0.1)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M10 52 A40 40 0 0 1 90 52"
            fill="none"
            stroke="#7d9b76"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${visible ? 98 : 0} 200`}
            className="gauge__fill"
          />
          {/* Needle */}
          <line
            x1="50" y1="52"
            x2={visible ? "72" : "50"}
            y2={visible ? "18" : "52"}
            stroke="#c4944b"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="gauge__needle"
          />
          <circle cx="50" cy="52" r="3" fill="#fdfbf7" stroke="#c4944b" strokeWidth="1.2" />
        </svg>
        <span className="gauge__label">Brain Clarity</span>
        <span className="gauge__value">78%</span>
      </div>

      {/* Brass gauge: Sugar Abstinence */}
      <div className="gauge">
        <svg viewBox="0 0 100 60" className="gauge__arc" aria-hidden="true">
          <path
            d="M10 52 A40 40 0 0 1 90 52"
            fill="none"
            stroke="rgba(44,62,80,0.1)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M10 52 A40 40 0 0 1 90 52"
            fill="none"
            stroke="#b55b3c"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${visible ? 79 : 0} 200`}
            className="gauge__fill"
          />
          <line
            x1="50" y1="52"
            x2={visible ? "64" : "50"}
            y2={visible ? "20" : "52"}
            stroke="#c4944b"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="gauge__needle"
          />
          <circle cx="50" cy="52" r="3" fill="#fdfbf7" stroke="#c4944b" strokeWidth="1.2" />
        </svg>
        <span className="gauge__label">Sugar Abstinence</span>
        <span className="gauge__value">63%</span>
      </div>

      <span className="annotation self-end text-[0.75rem]">~ the struggle is real ~</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 2 (col-span-4 each): LIVEHOUSE TICKET
   垂直长条实体门票 · 锯齿边缘 · 霓虹发光
   ═══════════════════════════════════════════ */
function LivehouseTicket() {
  const PHOTOS = [
    "/livehous/photo1.jpg",
    "/livehous/photo2.jpg",
    "/livehous/photo3.jpg",
  ];
  const [heroI, setHeroI] = useState(0);
  return (
    <div className="livehouse-card bento-card p-3 md:p-4 flex flex-col items-center gap-3 rotate-scatter-1">
      <span className="text-[0.6rem] tracking-[0.35em] font-bold text-rust uppercase font-[family-name:var(--font-crimson)]">
        LIVE
      </span>

      {/* Ticket body */}
      <div className="livehouse-ticket-v">
        {/* Perforation edge */}
        <div className="livehouse-ticket-v__perf" />

        <div className="livehouse-ticket-v__inner">
          {/* Photo */}
          <div
            className="livehouse-ticket-v__photo"
            onClick={() => setHeroI((heroI + 1) % PHOTOS.length)}
          >
            <img
              src={PHOTOS[heroI]}
              alt={`Livehouse ${heroI + 1}`}
            />
            <span className="livehouse-ticket-v__hint">
              {heroI + 1}/{PHOTOS.length}
            </span>
          </div>

          {/* Info */}
          <div className="livehouse-ticket-v__info">
            <span className="livehouse-ticket-v__venue">MAO Livehouse</span>
            <span className="livehouse-ticket-v__date">2025 · INDIE NIGHT</span>
            <span className="livehouse-ticket-v__no">NO. 042</span>
          </div>

          {/* Stub */}
          <div className="livehouse-ticket-v__stub">
            <span>ADMIT ONE</span>
          </div>
        </div>
      </div>

      <p className="font-[family-name:var(--font-caveat)] text-[0.65rem] text-amber-dark text-center">
        ~ the pulsing night ~
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 2 (col-span-4): BADMINTON STACK
   方形卡片 · 球拍线稿底纹 · 3 张扑克牌堆叠
   ═══════════════════════════════════════════ */
function BadmintonStack() {
  const PHOTOS = [
    "/羽毛球/photo1.jpg",
    "/羽毛球/photo2.jpg",
    "/羽毛球/photo3.jpg",
  ];
  return (
    <div className="badge-card bento-card p-3 md:p-4 flex flex-col items-center gap-3 rotate-subtle-pos">
      {/* Crossed rackets SVG background */}
      <div className="badge-card__bg" aria-hidden="true">
        <svg viewBox="0 0 200 180" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <g transform="translate(68, 90) rotate(-28)">
            <line x1="0" y1="0" x2="0" y2="58" stroke="#2C3E50" strokeWidth="1.1" strokeLinecap="round" />
            <ellipse cx="0" cy="-12" rx="18" ry="22" fill="none" stroke="#2C3E50" strokeWidth="0.9" />
            <line x1="-12" y1="-18" x2="12" y2="-6" stroke="#2C3E50" strokeWidth="0.35" />
            <line x1="-10" y1="-8" x2="10" y2="2" stroke="#2C3E50" strokeWidth="0.35" />
          </g>
          <g transform="translate(132, 90) rotate(28)">
            <line x1="0" y1="0" x2="0" y2="58" stroke="#2C3E50" strokeWidth="1.1" strokeLinecap="round" />
            <ellipse cx="0" cy="-12" rx="18" ry="22" fill="none" stroke="#2C3E50" strokeWidth="0.9" />
            <line x1="-12" y1="-18" x2="12" y2="-6" stroke="#2C3E50" strokeWidth="0.35" />
            <line x1="-10" y1="-8" x2="10" y2="2" stroke="#2C3E50" strokeWidth="0.35" />
          </g>
          <g transform="translate(100, 50)">
            <path d="M0 0 Q-7 12 -10 18 Q0 15 10 18 Q7 12 0 0Z" fill="none" stroke="#2C3E50" strokeWidth="0.6" />
          </g>
        </svg>
      </div>

      {/* Photo fan — 3 photos stacked */}
      <div className="badge-fan">
        {PHOTOS.map((photo, i) => (
          <img
            key={photo}
            src={photo}
            alt={`Badminton ${i + 1}`}
            className={`badge-fan__photo badge-fan__photo--${i}`}
            loading="lazy"
          />
        ))}
      </div>

      <p className="font-[family-name:var(--font-caveat)] text-[0.72rem] text-amber-dark text-center leading-tight mt-1">
        Third Place<br />University Badminton Championship
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 2 (col-span-4): SKI PASS BADGE
   滑雪场挂绳吊牌 · 垂直长卡
   ═══════════════════════════════════════════ */
function SkiPass() {
  const PHOTOS = [
    "/滑雪/photo1.jpg",
    "/滑雪/photo2.jpg",
    "/滑雪/photo3.jpg",
  ];
  const [heroI, setHeroI] = useState(0);
  return (
    <div className="skipass-card bento-card p-3 md:p-4 flex flex-col items-center gap-3 rotate-scatter-3">
      {/* Lanyard hole */}
      <div className="skipass__hole" />

      {/* Header */}
      <div className="skipass__header">
        <span className="skipass__resort">ALPINE PASS</span>
        <span className="skipass__season">WINTER 2025</span>
      </div>

      {/* Photo */}
      <div
        className="skipass__photo"
        onClick={() => setHeroI((heroI + 1) % PHOTOS.length)}
      >
        <img
          src={PHOTOS[heroI]}
          alt={`Ski ${heroI + 1}`}
        />
        <span className="skipass__hint">{heroI + 1}/{PHOTOS.length}</span>
      </div>

      {/* Quote */}
      <p className="font-[family-name:var(--font-caveat)] text-[0.7rem] text-forest-900 text-center leading-snug px-2">
        &ldquo;Under gravity and snow, balancing dynamic physics at -15°C.&rdquo;
      </p>

      {/* Barcode */}
      <div className="skipass__barcode">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="skipass__bar"
            style={{
              height: `${5 + ((i * 7 + 3) % 13)}px`,
              width: `${1 + ((i * 3) % 3)}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROW 3 (col-span-12): THE SUBCONSCIOUS IDE
   潜意识编译器 · 左右对半分栏
   ═══════════════════════════════════════════ */
function SubconsciousIDE() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="subconscious-ide bento-card p-7 md:p-10 rotate-subtle-neg relative overflow-hidden">
      {/* Decorative brain-circuit SVG backdrop */}
      <div className="subconscious-ide__bg" aria-hidden="true">
        <svg viewBox="0 0 400 200" className="w-full h-full opacity-[0.04]">
          <path d="M60 100 Q80 60 120 80 Q160 100 140 140 Q120 180 180 160 Q240 140 220 100 Q200 60 260 70 Q320 80 340 120" fill="none" stroke="#2C3E50" strokeWidth="1.5" />
          <path d="M100 90 Q120 50 160 70 Q200 90 180 130" fill="none" stroke="#2C3E50" strokeWidth="0.8" strokeDasharray="4 6" />
          <path d="M200 120 Q220 80 260 90 Q300 100 280 140" fill="none" stroke="#2C3E50" strokeWidth="0.8" strokeDasharray="4 6" />
          <circle cx="120" cy="80" r="4" fill="none" stroke="#2C3E50" strokeWidth="0.6" />
          <circle cx="260" cy="90" r="4" fill="none" stroke="#2C3E50" strokeWidth="0.6" />
          <circle cx="180" cy="160" r="4" fill="none" stroke="#2C3E50" strokeWidth="0.6" />
        </svg>
      </div>

      <span className="text-xs tracking-[0.3em] uppercase text-rust font-[family-name:var(--font-crimson)] relative z-10 block mb-6">
        &lt; The Subconscious IDE /&gt;
      </span>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left: Psychology Observation */}
        <div className={`subconscious-ide__left ${visible ? "subconscious-ide--visible" : ""}`}>
          <span className="text-[0.6rem] tracking-[0.25em] uppercase text-sage font-mono mb-3 block">
            Human Psychology · Observation
          </span>
          <div className="space-y-4 font-mono text-[0.72rem] text-ink-light leading-relaxed">
            <p>
              <span className="text-rust font-semibold">&gt;&gt; </span>
              Insight: When AI response latency exceeds{" "}
              <span className="ink-accent--amber">3 seconds</span>, user
              bounce rate spikes by{" "}
              <span className="ink-accent">40%</span>. The subconscious
              interprets silence as abandonment.
            </p>
            <p>
              <span className="text-rust font-semibold">&gt;&gt; </span>
              The{" "}
              <span className="ink-accent">observer changes the observed</span>.
              Users are not static data points — they are complex probability
              engines. Attention is the{" "}
              <span className="ink-accent--amber">first act of creation</span>.
            </p>
            <p>
              <span className="text-rust font-semibold">&gt;&gt; </span>
              Cognitive load is the real currency. Every unnecessary click,
              every uninformative loading state, is a{" "}
              <span className="ink-accent">tax on the user&apos;s working memory</span>.
            </p>
          </div>
        </div>

        {/* Right: Code Translation */}
        <div className={`subconscious-ide__right ${visible ? "subconscious-ide--visible" : ""}`}>
          <span className="text-[0.6rem] tracking-[0.25em] uppercase text-amber-dark font-mono mb-3 block">
            System Translation · Code
          </span>
          <div className="subconscious-ide__code">
            <pre className="font-mono text-[0.7rem] leading-relaxed whitespace-pre-wrap" style={{ color: "#2d5a3d" }}>
{`// Cognitive-to-Code Translation Layer
if (llm_latency > 3s) {
  render_skeleton_with_vibe_text();
  // Redirect anxiety into anticipation
  // The wait becomes part of the experience
}

// The unconscious mind and the hidden
// layers of a neural network share one
// mystery: most of what matters happens
// in spaces we cannot directly access.

const product = new BayesianPM({
  prior: user_intuition,
  likelihood: observed_behavior,
});

while (meaning === undefined) {
  attention.allocate(patterns.emerge());
  cognitive_load -= delta;
}`}
            </pre>
          </div>
        </div>
      </div>

      <span className="annotation block text-center mt-5 relative z-10">~ where cognition compiles into code ~</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHAT AGENT — AI-powered typewriter letter box
   ═══════════════════════════════════════════ */
const CHAT_QUESTIONS = [
  { q: "你的心理学背景如何塑造你的AI产品思维？" },
  { q: "你现在在探索的Vibecoding项目是什么？" },
  { q: "如果现在给你充足资金，你会打造什么样的AI产品？" },
];

function ChatAgent() {
  const [messages, setMessages] = useState<
    { type: "agent" | "user"; text: string }[]
  >([]);
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastSendTime = useRef<number>(0);
  const messageCount = useRef<number>(0);

  const typeMessage = useCallback((text: string, callback?: () => void) => {
    setTyping(true);
    let i = 0;
    setMessages((prev) => [...prev, { type: "agent", text: "" }]);
    const interval = setInterval(() => {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.type === "agent") {
          last.text = text.slice(0, i + 1);
        }
        return copy;
      });
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
        callback?.();
      }
    }, 28);
  }, []);

  /* ── call DeepSeek API with full conversation history ── */
  const callAPI = useCallback(
    async (history: { type: "agent" | "user"; text: string }[]) => {
      setLoading(true);
      try {
        const apiMessages = history.map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.text,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        const data = await res.json();
        setLoading(false);
        typeMessage(data.reply || "（沉默...）");
      } catch {
        setLoading(false);
        typeMessage("Sorry, my digital shadow is flickering. Try again?");
      }
    },
    [typeMessage],
  );

  const handleStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    typeMessage(
      "Hello, I am Lottie's digital shadow. What are you seeking here?",
    );
  }, [started, typeMessage]);

  /* ── quick question click ── */
  const handleQuestion = useCallback(
    (q: string) => {
      if (typing || loading) return;
      if (messageCount.current >= 20) {
        typeMessage("You've reached the 20-message limit for this session. Feel free to reach out via email instead.");
        return;
      }
      const now = Date.now();
      if (now - lastSendTime.current < 5000) {
        typeMessage("Please wait a few seconds before sending another message.");
        return;
      }
      lastSendTime.current = now;
      messageCount.current += 1;
      const updated = [...messages, { type: "user" as const, text: q }];
      setMessages(updated);
      callAPI(updated);
    },
    [messages, typing, loading, callAPI, typeMessage],
  );

  /* ── free-text send ── */
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || typing || loading) return;
    if (messageCount.current >= 20) {
      typeMessage("You've reached the 20-message limit for this session. Feel free to reach out via email instead.");
      setInputValue("");
      return;
    }
    const now = Date.now();
    if (now - lastSendTime.current < 5000) {
      typeMessage("Please wait a few seconds before sending another message.");
      return;
    }
    lastSendTime.current = now;
    messageCount.current += 1;
    const updated = [...messages, { type: "user" as const, text }];
    setMessages(updated);
    setInputValue("");
    callAPI(updated);
  }, [inputValue, messages, typing, loading, callAPI, typeMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setTimeout(handleStart, 600);
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started, handleStart]);

  const isBusy = typing || loading;

  return (
    <div ref={observerRef} className="chat-window p-4">
      <div className="chat__messages">
        {messages.length === 0 && !started && (
          <p className="chat__message chat__message--agent" style={{ opacity: 0.35 }}>
            Scroll to start the conversation...
          </p>
        )}
        {messages.map((msg, i) => (
          <p key={i} className={`chat__message chat__message--${msg.type}`}>
            {msg.text}
            {typing && i === messages.length - 1 && msg.type === "agent" && (
              <span className="chat__cursor" />
            )}
          </p>
        ))}
        {/* Loading skeleton while waiting for API */}
        {loading && (
          <p className="chat__message chat__message--agent" style={{ opacity: 0.45 }}>
            <span className="chat__cursor" />
          </p>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick questions */}
      <div className="chat__questions">
        {CHAT_QUESTIONS.map((item, i) => (
          <button
            key={i}
            className="chat__q-btn"
            disabled={isBusy}
            onClick={() => handleQuestion(item.q)}
          >
            {item.q}
          </button>
        ))}
      </div>

      {/* Free-text input row */}
      <div className="chat__input-row">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isBusy}
          placeholder={isBusy ? "Lottie is typing..." : "Ask me anything..."}
          className="chat__input"
          aria-label="Type your message"
        />
        <button
          className="chat__send-btn"
          disabled={isBusy || !inputValue.trim()}
          onClick={handleSend}
          aria-label="Send message"
        >
          {loading ? "···" : "Send"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Photo paths — all real local files
   ═══════════════════════════════════════════ */
const SEA_PHOTOS = [
  "/摄影照片/海边/photo1.jpg",
  "/摄影照片/海边/photo2.jpg",
  "/摄影照片/海边/photo3.jpg",
  "/摄影照片/海边/photo4.jpg",
  "/摄影照片/海边/photo5.jpg",
  "/摄影照片/海边/photo6.jpg",
  "/摄影照片/海边/photo7.jpg",
  "/摄影照片/海边/photo8.jpg",
  "/摄影照片/海边/photo9.jpg",
];
const GARDEN_PHOTOS = [
  "/摄影照片/苏州园林/photo1.jpg",
  "/摄影照片/苏州园林/photo2.jpg",
  "/摄影照片/苏州园林/photo3.jpg",
  "/摄影照片/苏州园林/photo4.jpg",
  "/摄影照片/苏州园林/photo5.jpg",
  "/摄影照片/苏州园林/photo6.jpg",
  "/摄影照片/苏州园林/photo7.jpg",
  "/摄影照片/苏州园林/photo8.jpg",
  "/摄影照片/苏州园林/photo9.jpg",
];
const AUTUMN_PHOTOS = [
  "/摄影照片/姑苏暮秋/photo1.jpg",
  "/摄影照片/姑苏暮秋/photo2.jpg",
  "/摄影照片/姑苏暮秋/photo3.jpg",
  "/摄影照片/姑苏暮秋/photo4.jpg",
  "/摄影照片/姑苏暮秋/photo5.jpg",
  "/摄影照片/姑苏暮秋/photo6.jpg",
  "/摄影照片/姑苏暮秋/photo7.jpg",
  "/摄影照片/姑苏暮秋/photo8.jpg",
  "/摄影照片/姑苏暮秋/photo9.jpg",
];
const VILLAGE_PHOTOS = [
  "/摄影照片/羌寨印象/photo1.jpg",
  "/摄影照片/羌寨印象/photo2.jpg",
  "/摄影照片/羌寨印象/photo3.jpg",
  "/摄影照片/羌寨印象/photo4.jpg",
  "/摄影照片/羌寨印象/photo5.jpg",
  "/摄影照片/羌寨印象/photo6.jpg",
  "/摄影照片/羌寨印象/photo7.jpg",
  "/摄影照片/羌寨印象/photo8.jpg",
  "/摄影照片/羌寨印象/photo9.jpg",
];
const CAT_PHOTOS = [
  "/摄影照片/cat/photo1.jpg",
  "/摄影照片/cat/photo2.jpg",
  "/摄影照片/cat/photo3.jpg",
  "/摄影照片/cat/photo4.jpg",
  "/摄影照片/cat/photo5.jpg",
  "/摄影照片/cat/photo6.jpg",
  "/摄影照片/cat/photo7.jpg",
  "/摄影照片/cat/photo8.jpg",
  "/摄影照片/cat/photo9.jpg",
];

const GALLERY_ALBUMS: GalleryAlbum[] = [
  {
    name: "sea",
    label: "海边 · The Sea",
    photos: SEA_PHOTOS,
    caption: "Salt breeze, whispering waves — a soul untamed.",
  },
  {
    name: "garden",
    label: "苏州园林 · The Gardens",
    photos: GARDEN_PHOTOS,
    caption: "Silent stones, flowing waters — finding timeless peace within.",
  },
  {
    name: "autumn",
    label: "姑苏暮秋 · Late Autumn",
    photos: AUTUMN_PHOTOS,
    caption: "Falling ginkgo leaves, writing the final stanzas of autumn.",
  },
  {
    name: "village",
    label: "羌寨印象 · Qiang Village",
    photos: VILLAGE_PHOTOS,
    caption: "Stone towers whisper ancient tales beneath the mountain mist.",
  },
  {
    name: "cat",
    label: "猫 · The Feline Muse",
    photos: CAT_PHOTOS,
    caption: "Silent paws, curious eyes — tiny philosophers in fur coats.",
  },
];

/* ═══════════════════════════════════════════
   TAROT LIFE BLIND-BOX CARDS
   ═══════════════════════════════════════════ */
const TAROT_CARDS = [
  {
    id: "band",
    title: "The Pop-up Band",
    num: "I",
    folder: "band",
    text: "一次很突然的乐队体验。\n\n几个女孩子临时起意组了个乐队，设备都是东拼西凑借来的。我还莫名其妙客串了吉他和主唱，在小小的排练室里跟大家一起唱告五人。\n\n其实弹得也不算特别好，音准偶尔还会飘，但完全不影响开心。大家越唱越上头，到后面已经变成单纯在乱喊了哈哈哈。\n\n现在想起来，还是会觉得那天特别快乐。"
  },
  {
    id: "french",
    title: "Au clair de lune",
    num: "II",
    folder: "french",
    text: "最近很喜欢一首法语诗《Je t'ai écrit au clair de lune》。\n\n虽然还是会读错、卡顿，但慢慢把那些词念出来的时候，会有种很奇怪的满足感。法语真的很像月光一样，轻轻的、软软的，读起来会自然地流淌。\n\n最近还发现了一部很可爱的法语动画《Petite Casbah》，把戏剧性的情节揉进法国历史里，画风也很有意思，看着看着就会忘记时间。\n\n感觉自己像偷偷打开了一个很小、很新的世界。"
  },
  {
    id: "livehouse",
    title: "The Pearl Stage",
    num: "III",
    folder: "livehouse",
    text: "前段时间还解锁了第一次livehouse。\n\n在上海珍珠剧场，和朋友一起去的。主唱一开口真的有点像阿黛尔，英文歌特别稳，现场感染力很强，听到了喜欢的Coldplay、Queen、Linkin Park。还有一个黄色波浪长发的吉他手特别有意思，一直在和台下互动，气氛特别好。\n\n以前总觉得livehouse离自己有点远，但真的去了之后发现会完全被现场带进去。灯光、鼓点、大家一起跟着节奏晃的时候，整个人都很放松。\n\n是会想继续尝试的新体验。"
  },
  {
    id: "ski",
    title: "The White Gravity",
    num: "IV",
    folder: "ski",
    text: "在白茫茫的重力场里，踩着板刃全速下滑。滑雪是关于控制与失控的艺术，当你学会信任身体的直觉，呼啸的风声就会盖过脑海里所有的杂音。那种纯粹的速度与自由，能让人瞬间卸下所有的精神内耗。"
  },
  {
    id: "badminton",
    title: "The Shuttler's University",
    num: "V",
    folder: "badminton",
    text: "大学里最开心的意外之一，就是开始打羽毛球。\n\n本来只是想随便运动一下，结果越打越上头。击球的那一瞬间，什么烦心事都会被“啪”一下打走。\n\n但比羽毛球更让人开心的，其实是球场上的大家。有人陪我练球到很晚，有人会一遍遍陪我对动作，大家一起进步、一起上头，也总会很认真地互相鼓励。\n\n一起比赛的时候也特别热血。从小组出线到打进四强，再到最后拿季军，场上场下都吵吵闹闹的，永远有人在喊“好球！！！”\n\n现在想起来，记住的已经不只是比赛了，还有每天晚上背着球包冲去球馆、练完球一起吃饭聊天的那些瞬间。\n\n很幸运，我的大学里有羽毛球，也有这样一群可爱温暖的人。"
  },
  {
    id: "food",
    title: "The CNY Wealth Platter",
    num: "VI",
    folder: "food",
    text: "今年过年最满意的居然是这个“财神爷小果盘”哈哈哈。\n\n草莓、小番茄、香蕉、橘子皮，甚至还翻出了海带来拼表情，属于是边做边笑的程度。大菜都有家里人负责，我就专心研究这种没什么用但会让人开心的小甜品。\n\n其实比起最后成品，更喜欢大家围在一起乱七八糟讨论“财神爷长什么样”的过程。过年的快乐有时候就是这种很小很小的事情。"
  }
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [inkBlotOpen, setInkBlotOpen] = useState(false);
  const [meterVisible, setMeterVisible] = useState(false);
  const meterRef = useRef<HTMLDivElement>(null);

  /* dossier state — center modal */
  const [activeDossier, setActiveDossier] = useState<DossierId>(null);

  /* lightbox state */
  const [lightbox, setLightbox] = useState<{
    photo: string;
    caption: string;
  } | null>(null);

  /* butterfly state — triggered on Section 01 hover */
  const [butterflyFlying, setButterflyFlying] = useState(false);

  const triggerButterfly = useCallback(() => {
    if (butterflyFlying) return;
    setButterflyFlying(true);
    setTimeout(() => setButterflyFlying(false), 14500);
  }, [butterflyFlying]);

  /* bird state — triggered on Section 03 scroll */
  const [birdsVisible, setBirdsVisible] = useState(false);
  const [birdsFlying, setBirdsFlying] = useState(false);
  const section03Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section03Ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !birdsFlying) {
          setBirdsVisible(true);
          setTimeout(() => setBirdsFlying(true), 400);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [birdsFlying]);

  /* ── HTML5 Audio player for /song.mp3 ── */
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyricText, setLyricText] = useState("");

  /* lyric rotation while playing */
  useEffect(() => {
    if (!isPlaying) {
      setLyricText("");
      return;
    }
    let i = 0;
    setLyricText(LYRIC_POOL[0]);
    const interval = setInterval(() => {
      i = (i + 1) % LYRIC_POOL.length;
      setLyricText(LYRIC_POOL[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  /* sugar-free meter reveal */
  useEffect(() => {
    const el = meterRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMeterVisible(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Tarot blind-box state ── */
  const [activeTarot, setActiveTarot] = useState<(typeof TAROT_CARDS)[number] | null>(null);
  const [hoveredTarotIndex, setHoveredTarotIndex] = useState<number | null>(null);

  return (
    <main
      id="portfolio-main"
      className="relative min-h-screen px-5 py-10 md:px-10 md:py-16 lg:px-12 lg:py-24 max-w-7xl mx-auto"
    >
      {/* ═══════════════════════════════════════
         HERO HEADER — 策展式大面积留白与漂浮标签
         ═══════════════════════════════════════ */}
      <section className="relative z-10 py-24 md:py-32 px-4 text-center select-none">
        {/* Floating tags — scattered around the title */}
        <div className="relative inline-block">
          {/* Tag: Vibecoding — top-left */}
          <span
            className="absolute -top-10 -left-28 md:-left-40 font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-[var(--color-forest-700)] bg-[var(--color-forest-500)]/5 px-4 py-1.5 rounded-full border border-[var(--color-sage-light)]/30 tag-float"
            style={{ animationDelay: "0s" }}
          >
            Vibecoding
          </span>
          {/* Tag: AI Product — top-right */}
          <span
            className="absolute -top-6 -right-24 md:-right-36 font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-[var(--color-forest-700)] bg-[var(--color-forest-500)]/5 px-4 py-1.5 rounded-full border border-[var(--color-sage-light)]/30 tag-float"
            style={{ animationDelay: "0.8s" }}
          >
            AI Product
          </span>
          {/* Tag: Applied Psychology — bottom-left */}
          <span
            className="absolute top-20 -left-32 md:-left-44 font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-[var(--color-forest-700)] bg-[var(--color-forest-500)]/5 px-4 py-1.5 rounded-full border border-[var(--color-sage-light)]/30 tag-float"
            style={{ animationDelay: "1.6s" }}
          >
            Applied Psychology
          </span>
          {/* Tag: Photograph — bottom-right */}
          <span
            className="absolute top-16 -right-20 md:-right-32 font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-[var(--color-forest-700)] bg-[var(--color-forest-500)]/5 px-4 py-1.5 rounded-full border border-[var(--color-sage-light)]/30 tag-float"
            style={{ animationDelay: "2.4s" }}
          >
            Photograph
          </span>
          {/* Tag: Data Insight — far right */}
          <span
            className="absolute top-0 -right-48 md:-right-60 font-[family-name:var(--font-caveat)] text-xl md:text-2xl text-[var(--color-forest-700)] bg-[var(--color-forest-500)]/5 px-4 py-1.5 rounded-full border border-[var(--color-sage-light)]/30 tag-float hidden lg:block"
            style={{ animationDelay: "3.2s" }}
          >
            Data Insight
          </span>

          {/* Main title */}
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[var(--color-ink)] leading-tight">
            Lottie — Linxin Zhang
          </h1>
          {/* Subtitle */}
          <p className="mt-4 text-lg md:text-xl text-[var(--color-ink-light)]/70 italic font-[family-name:var(--font-crimson)] tracking-wide">
            Know about her.
          </p>
        </div>
      </section>

      {/* ═══════════ THE WANDERING THREAD ═══════════ */}
      <WanderingThread />

      {/* ═══════════ VINTAGE BACKDROP ═══════════ */}
      <div className="vintage-backdrop" />
      <div className="plant-backdrop" />

      {/* ═══════════ AUDIO PLAYER ═══════════ */}
      <audio ref={audioRef} src="/song.mp3" preload="auto" loop />

      {/* ═══════════ BOTANICAL DECALS (swaying) ═══════════ */}
      <div className="absolute top-6 left-2 hidden lg:block pointer-events-none z-0">
        <FernBranch className="w-28 h-40" />
      </div>
      <div className="absolute bottom-20 right-4 hidden lg:block pointer-events-none z-0 rotate-180">
        <FernBranch className="w-28 h-40" />
      </div>

      {/* Coffee stains */}
      <div className="coffee-stain hidden lg:block" style={{ width: 100, height: 100, top: 80, right: 60 }} />
      <div className="coffee-stain hidden lg:block" style={{ width: 80, height: 80, bottom: 200, left: 40 }} />

      {/* Ink drops */}
      <div className="ink-drop hidden lg:block" style={{ width: 36, height: 36, top: 240, right: 90 }} />
      <div className="ink-drop hidden lg:block" style={{ width: 18, height: 18, top: 640, left: 60 }} />

      {/* ═══════════ BUTTERFLY ═══════════ */}
      <Butterfly flying={butterflyFlying} />

      {/* ═══════════ BIRDS ═══════════ */}
      <Bird variant="a" visible={birdsVisible} flying={birdsFlying} />
      <Bird variant="b" visible={birdsVisible} flying={birdsFlying} />

      {/* ═══════════ CENTER MODAL DOSSIER ═══════════ */}
      <CenterModalDossier activeId={activeDossier} onClose={() => setActiveDossier(null)} />

      {/* ═══════════ PARCHMENT WRAPPER ═══════════ */}
      <div className="parchment-wrapper relative z-10 rounded-sm px-3 py-6 md:px-6 md:py-10 lg:px-8 lg:py-12">
        {/* ═══════════ GRID LAYOUT ═══════════ */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
          {/* ━━━━━ HERO / CORE PERSONA ━━━━━ */}
          <section
            data-thread-anchor="hero"
            className="bento-card washi-tape md:col-span-5 lg:col-span-7 lg:col-start-1 p-7 md:p-10 lg:p-12 flex flex-col justify-center rotate-subtle-neg"
          >
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-forest-900 leading-tight">
              The Wandering
              <br />
              Thread
            </h1>
            <p className="mt-2 text-lg md:text-xl text-[var(--color-ink-light)]/60 italic font-[family-name:var(--font-crimson)]">
              Weaving minds into machines.
            </p>

            <hr className="thread-divider my-5" />

            <p className="text-ink-light text-base md:text-lg max-w-md leading-relaxed font-[family-name:var(--font-crimson)]">
              A quiet space where{" "}
              <span className="ink-accent font-semibold">cognitive science</span> meets{" "}
              <span className="ink-accent font-semibold">artificial intelligence</span>{" "}
              — exploring the invisible threads that connect human thought to
              computational architecture.
            </p>

            <div className="mt-7 font-[family-name:var(--font-crimson)] text-sm text-[var(--color-ink-light)]/80 leading-relaxed">
              <p className="text-xs tracking-[0.25em] uppercase text-[var(--color-sage)] mb-2 font-semibold">
                Identity &amp; Toolkit:
              </p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-amber-dark)] text-xs">✦</span>
                  <span>AI Product Manager</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-amber-dark)] text-xs">✦</span>
                  <span>Applied Psychology</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[var(--color-amber-dark)] text-xs">✦</span>
                  <span>Full-Stack Explorer</span>
                </li>
              </ul>
            </div>

            <span className="text-xs tracking-widest text-[var(--color-ink-light)]/40 font-mono mt-6 self-end">
              [ 01 // Core Persona ]
            </span>
          </section>

          {/* ━━━━━ PROFILE polaroid ━━━━━ */}
          <section
            data-thread-anchor="profile"
            className="polaroid md:col-span-3 lg:col-span-4 lg:col-start-9 rotate-scatter-2"
            style={{ height: "fit-content" }}
          >
            <div className="vintage-photo__frame aspect-[4/5] flex items-center justify-center">
              <img src="/avatar.jpg" alt="Lottie" className="vintage-photo w-full h-full" />
            </div>
            <p className="polaroid__caption">
              Lottie · 2026
              <br />
              somewhere between <span className="ink-accent">neurons</span> &amp;{" "}
              <span className="ink-accent">nodes</span>
            </p>
          </section>

          {/* ═══════════ SECTION 01: Who Am I? ═══════════ */}
          <SectionHeader
            number="01"
            title="Who Am I?"
            subtitle="A mind raised on psychology, rewritten by algorithms."
            anchorId="section-who"
            onMouseEnter={triggerButterfly}
          />

          {/* ━━━━━ PHILOSOPHY (morph: cursive) ━━━━━ */}
          <section
            data-thread-anchor="philosophy"
            data-thread-morph="cursive"
            className="bento-card bento-card--reverse torn-edge washi-tape md:col-span-6 md:col-start-2 lg:col-span-8 lg:col-start-3 p-7 md:p-10 lg:p-11 flex flex-col justify-center rotate-subtle-pos"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-sage mb-4 font-[family-name:var(--font-crimson)]">
              L&apos;aventure commence
            </span>
            <p className="font-[family-name:var(--font-playfair)] italic text-lg md:text-xl text-[var(--color-forest-700)] leading-relaxed">
              Using AI as a mirror to decode human nature and nourish the inner
              self&mdash;that is where the meaningful play begins.
            </p>
            <hr className="thread-divider" />
            <div className="space-y-3 text-sm md:text-base text-[var(--color-ink-light)] font-[family-name:KaiTi,STKaiti,var(--font-crimson)] leading-relaxed tracking-wide">
              <p>在尝试过读文章、发论文的学术生活后，我发现比起留在象牙塔里那个相对清晰的确定性世界，我更渴望主动下场，去真实世界的重力场里，试试自己跨专业能力的潜力。</p>
              <p>代码是确定的逻辑，但人性是流动的需求。我觉得在这两者之间，一定有很多好玩、且真正有意义的事情值得去尝试。如果你也是志同道合的朋友，欢迎随时联系我。</p>
            </div>
            <span className="annotation self-end mt-2">~ L&apos;aventure ~</span>
          </section>

          {/* ═══════════ SECTION 02: What Am I Weaving? ═══════════ */}
          <SectionHeader
            number="02"
            title="What Am I Weaving?"
            subtitle="Connecting human cognition, market pulses, and algorithmic syntax."
            anchorId="section-weaving"
          />

          {/* ━━━━━ 3 DOSSIER CARDS ━━━━━ */}
          <section
            data-thread-anchor="projects"
            className="md:col-span-8 lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-8 lg:gap-10"
          >
            {/* ═══ CARD 1: The Rigor of Mind (VR) ═══ */}
            <div
              className="dossier-card rotate-scatter-1 relative"
              onMouseEnter={() => setActiveDossier("vr")}
            >
              <div className="bento-card p-6 md:p-7 flex flex-col items-center justify-center h-full text-center gap-4 cursor-pointer">
                <div
                  className="w-full aspect-[3/2] rounded-md flex items-center justify-center border border-ink/8 overflow-hidden"
                  style={{ background: "linear-gradient(135deg, rgba(45,90,61,0.08), rgba(182,204,176,0.2), #f2ede4)" }}
                >
                  <svg viewBox="0 0 120 80" className="w-20 h-14 opacity-35" aria-hidden="true">
                    <circle cx="60" cy="28" r="5" fill="none" stroke="#1a3a2a" strokeWidth="1" />
                    <circle cx="42" cy="48" r="4" fill="none" stroke="#1a3a2a" strokeWidth="0.8" />
                    <circle cx="78" cy="48" r="4" fill="none" stroke="#1a3a2a" strokeWidth="0.8" />
                    <circle cx="28" cy="62" r="3" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
                    <circle cx="60" cy="66" r="3" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
                    <circle cx="92" cy="62" r="3" fill="none" stroke="#7d9b76" strokeWidth="0.7" />
                    <line x1="60" y1="33" x2="42" y2="44" stroke="#2d5a3d" strokeWidth="0.6" />
                    <line x1="60" y1="33" x2="78" y2="44" stroke="#2d5a3d" strokeWidth="0.6" />
                    <line x1="42" y1="52" x2="28" y2="59" stroke="#7d9b76" strokeWidth="0.5" />
                    <line x1="42" y1="52" x2="60" y2="63" stroke="#7d9b76" strokeWidth="0.5" />
                    <line x1="78" y1="52" x2="60" y2="63" stroke="#7d9b76" strokeWidth="0.5" />
                    <line x1="78" y1="52" x2="92" y2="59" stroke="#7d9b76" strokeWidth="0.5" />
                  </svg>
                </div>
                <div>
                  <span className="inline-block font-[family-name:var(--font-crimson)] text-[0.65rem] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full border border-current text-sage opacity-70 mb-2">
                    SSCI Joint First Author
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-forest-900 mt-1 leading-tight">
                    VR-Driven
                    <br />
                    Behavioral Research
                  </h3>
                  <p className="text-xs text-ink-light mt-2 font-[family-name:var(--font-crimson)] max-w-[260px] mx-auto leading-relaxed">
                    Capturing <span className="ink-accent">200+ behavioral datasets</span> under
                    Bayesian Inference to model human intuition.
                  </p>
                </div>
                <span className="dossier-card-hint absolute top-3 right-4">hover to dissect →</span>
              </div>
            </div>

            {/* ═══ CARD 2: The Human Pulse (Bosch) ═══ */}
            <div
              className="dossier-card rotate-scatter-2 relative"
              onMouseEnter={() => setActiveDossier("bosch")}
            >
              <div className="memo-card p-6 md:p-7 flex flex-col justify-center h-full gap-3 cursor-pointer">
                <span className="text-[10px] tracking-[0.3em] uppercase text-ink-light/60 font-mono">
                  FIELD MEMO · 2025
                </span>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl md:text-2xl font-bold text-forest-900 leading-tight">
                  The Human
                  <br />
                  Pulse
                </h3>
                <hr className="thread-divider" />
                <p className="text-xs text-ink-light font-mono leading-relaxed">
                  USER RESEARCH @{" "}
                  <span className="ink-accent">BOSCH INTELLIGENT TECHNOLOGY</span>
                </p>
                <p className="text-xs text-ink-light/70 font-mono leading-relaxed">
                  Decoupling <span className="ink-accent">security</span> and{" "}
                  <span className="ink-accent--amber">friction</span> in
                  smart-home UX.
                </p>
                <span className="dossier-card-hint absolute top-3 right-4">hover to dissect →</span>
              </div>
            </div>

            {/* ═══ CARD 3: The New Syntax (AI, dark) ═══ */}
            <div
              className="dossier-card rotate-scatter-3 relative"
              onMouseEnter={() => setActiveDossier("ai")}
            >
              <div
                className="bento-card--dark p-6 md:p-7 flex flex-col items-center justify-center h-full text-center gap-3 relative overflow-hidden cursor-pointer"
                style={{ borderRadius: "22px 48px 28px 52px / 48px 22px 54px 28px" }}
              >
                <div className="absolute top-4 right-4 md:top-5 md:right-6">
                  <GearLightbulb />
                </div>
                <div className="relative z-10">
                  <span
                    className="inline-block font-[family-name:var(--font-crimson)] text-[0.65rem] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full border mb-2"
                    style={{ color: "rgba(253,251,247,0.5)", borderColor: "rgba(253,251,247,0.2)" }}
                  >
                    AI Experiments
                  </span>
                  <h3
                    className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl font-bold mt-1 leading-tight"
                    style={{ color: "#fdfbf7" }}
                  >
                    The New
                    <br />
                    Syntax
                  </h3>
                  <p
                    className="text-xs mt-2 max-w-[240px] mx-auto leading-relaxed"
                    style={{ color: "rgba(253,251,247,0.55)", fontFamily: "var(--font-crimson), Georgia, serif" }}
                  >
                    Bypassing traditional development with{" "}
                    <span style={{ color: "#b6ccb0", fontWeight: 600 }}>LLMs</span>.
                  </p>
                </div>
                <span
                  className="dossier-card-hint absolute bottom-3 right-5"
                  style={{ color: "rgba(253,251,247,0.45)" }}
                >
                  hover to dissect →
                </span>
              </div>
            </div>
          </section>

          {/* ═══════════ SECTION 03: The Living Anthology ═══════════ */}
          <div ref={section03Ref}>
            <SectionHeader
              number="03"
              title="The Living Anthology"
              subtitle="Capturing the motion of shuttlecocks, the flow of indie rock, and the frozen stanzas of winter."
              anchorId="section-curator"
            />
          </div>

          {/* ━━━━━ GALLERY CONSOLE (UNCHANGED) ━━━━━ */}
          <section
            data-thread-anchor="gallery"
            className="md:col-span-8 lg:col-span-12 relative"
          >
            <GalleryConsole
              albums={GALLERY_ALBUMS}
              onPhotoClick={(photo, caption) => setLightbox({ photo, caption })}
            />
          </section>

          {/* ═══════════════════════════════════════
             BENTO MATRIX ROW 1
             8-col Soundtrack + 4-col Sugar-Free Meter
             ═══════════════════════════════════════ */}

          {/* ━━━━━ ROW 1 LEFT: SOUNDTRACK CARD (col-span-8, morph: staff) ━━━━━ */}
          <section
            data-thread-anchor="soundtrack"
            data-thread-morph="staff"
            className="md:col-span-8 lg:col-span-8 lg:col-start-1"
          >
            <SoundtrackCard
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
              lyricText={lyricText}
            />
          </section>

          {/* ━━━━━ ROW 1 RIGHT: SUGAR-FREE METER (col-span-4) ━━━━━ */}
          <section
            ref={meterRef}
            data-thread-anchor="sugar"
            className="md:col-span-4 lg:col-span-4 lg:col-start-9"
          >
            <SugarFreeMeter visible={meterVisible} />
          </section>

          {/* ═══════════════════════════════════════
             BENTO MATRIX ROW 2: SAGE-GREEN FRENCH VINTAGE TAROT ARRAY
             （通过 pb-24 和撑高容器高度，完美将底部的 Subconscious IDE 往下推开，拒绝任何遮挡）
             ═══════════════════════════════════════ */}

          {/* ━━━━━ ROW 2: TAROT BLIND-BOX — wide French fan ━━━━━ */}
          <section
            data-thread-anchor="tarot"
            className="md:col-span-8 lg:col-span-12 pt-12 pb-24 min-h-[640px] flex flex-col items-center justify-start relative overflow-visible mt-8 w-full"
          >
            {/* 引导标语 */}
            <p
              className="text-2xl md:text-3xl text-[var(--color-forest-700)] text-center mb-20 relative z-10 w-full px-5 select-none tracking-wider inline-block transform rotate-[-1.2deg] sm:skew-x-[-3deg]"
              style={{ fontFamily: "'Lucida Handwriting', 'Chalkboard SE', 'Apple Chancery', 'Comic Sans MS', cursive" }}
            >
              Pick a card. Let the thread show you another side of her.
            </p>

            {/* 宽幅舒展大半圆矩阵容器 */}
            <div className="relative w-full flex items-center justify-center h-[430px]">
              {TAROT_CARDS.map((card, index) => {
                const isHovered = hoveredTarotIndex === index;
                const baseAngle = (index - 2.5) * 14.5;
                const baseTranslateX = (index - 2.5) * 115;
                const baseTranslateY = Math.abs(index - 2.5) * 18;

                const cardStyle = isHovered
                  ? {
                      transform: `rotate(0deg) translate(${(index - 2.5) * 45}px, -75px) scale(1.12)`,
                      zIndex: 50,
                    }
                  : {
                      transform: `rotate(${baseAngle}deg) translate(${baseTranslateX}px, ${baseTranslateY}px)`,
                      zIndex: 10 + index,
                    };

                return (
                  <div
                    key={card.id}
                    className="tarot-card absolute"
                    style={cardStyle}
                    onMouseEnter={() => setHoveredTarotIndex(index)}
                    onMouseLeave={() => setHoveredTarotIndex(null)}
                    onClick={() => setActiveTarot(card)}
                  >
                    <span className="tarot-card__num">{card.num}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ═══════════════════════════════════════
             BENTO MATRIX ROW 3
             12-col Subconscious IDE
             ═══════════════════════════════════════ */}

          {/* ━━━━━ ROW 3: THE SUBCONSCIOUS IDE (col-span-12, morph: bracket) ━━━━━ */}
          <section
            data-thread-anchor="subconscious"
            data-thread-morph="bracket"
            className="md:col-span-8 lg:col-span-12"
          >
            <SubconsciousIDE />
          </section>

          {/* ═══════════ SECTION 04: A Message in a Bottle ═══════════ */}
          <SectionHeader
            number="04"
            title="A Message in a Bottle"
            subtitle="Leaving echoes on a digital desktop."
            anchorId="section-bottle"
          />

          {/* ━━━━━ THE TERMINAL BOX — left AI chat + right wax seal contact letter ━━━━━ */}
          <section
            data-thread-anchor="connect"
            className="md:col-span-8 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left: AI Chat Agent */}
            <ChatAgent />

            {/* Right: Classical Wax Seal Contact Letter */}
            <div className="contact-letter flex flex-col justify-center relative">
              <WaxSeal />
              <h2 className="contact-letter__heading">A Letter for You</h2>
              <p className="text-ink-light text-sm mb-5 leading-relaxed font-[family-name:var(--font-crimson)]">
                Always open to conversations at the edge of{" "}
                <span className="ink-accent">psychology</span> and{" "}
                <span className="ink-accent">AI</span>. Each message finds its thread.
              </p>

              <div className="contact-letter__item">
                <span className="contact-letter__label">WeChat</span>
                <span className="contact-letter__value">Ray-sunrise</span>
              </div>

              <div className="contact-letter__item">
                <span className="contact-letter__label">Email</span>
                <a href="mailto:zhanglnxn@163.com" className="contact-letter__value">
                  zhanglnxn@163.com
                </a>
              </div>

              <div className="contact-letter__item">
                <span className="contact-letter__label">LinkedIn</span>
                <a
                  href="https://linkedin.com/in/琳昕-张-ba0916336"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-letter__value"
                >
                  linkedin.com/in/琳昕-张
                </a>
              </div>

              <span className="annotation mt-5">~ sealed with wax, sent with care ~</span>
            </div>
          </section>
        </div>
      </div>{/* end parchment-wrapper */}

      {/* ═══════════ INK BLOT ═══════════ */}
      <div className="relative z-10 flex justify-center mt-16 mb-6">
        <button
          className="ink-blot"
          onClick={() => setInkBlotOpen(true)}
          aria-label="Mysterious ink blot"
          title="?"
          style={{
            background: "radial-gradient(ellipse at 45% 40%, #2C3E5022 0%, #2C3E5010 40%, transparent 70%)",
            borderRadius: "60% 40% 55% 45% / 45% 55% 40% 60%",
          }}
        />
      </div>

      {inkBlotOpen && (
        <div className="ink-blot--revealed" onClick={() => setInkBlotOpen(false)}>
          <div className="ink-blot__story" onClick={(e) => e.stopPropagation()}>
            <h3>The 985 Drop-out</h3>
            <p>
              Some threads break before they are meant to hold. I walked away
              from the <strong>985</strong> track — not because I couldn&apos;t
              follow it, but because the path felt like someone else&apos;s thread.
            </p>
            <p>
              Psychology taught me how minds work. Building AI taught me how
              minds <em>could</em> work. Neither was on the syllabus.
            </p>
            <p className="font-[family-name:var(--font-caveat)] text-lg text-amber-dark mt-3">
              ~ there is no single thread ~
            </p>
            <button className="ink-blot__close" onClick={() => setInkBlotOpen(false)}>
              — close —
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ LIGHTBOX ═══════════ */}
      <Lightbox
        photo={lightbox?.photo || null}
        caption={lightbox?.caption || ""}
        onClose={() => setLightbox(null)}
      />

      {/* ═══════════ TAROT HIGH-LIGHT MODAL (方案 B 中央占卜弹窗) ═══════════ */}
      {activeTarot && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setActiveTarot(null)}
        >
          <div
            className="bg-[var(--color-paper)] rounded-xl max-w-3xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6 shadow-2xl border border-[var(--color-forest-200)] relative max-h-[90vh] overflow-y-auto transform scale-100 transition-transform duration-300 animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Polaroid photo */}
            <div className="flex flex-col items-center justify-center w-full">
              <div className="bg-white p-4 pb-8 shadow-xl border border-neutral-200 rounded-sm transform rotate-[-1.5deg] w-full max-w-[280px]">
                <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative border border-neutral-100">
                  <img
                    src={`/moments/${activeTarot.folder}/1.jpg`}
                    alt={activeTarot.title}
                    className="w-full height-full object-cover select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <p className="font-[family-name:var(--font-caveat)] text-center text-neutral-400 text-lg mt-4 tracking-wider select-none">
                  {activeTarot.title}
                </p>
              </div>
            </div>

            {/* Right: Story text */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[var(--color-forest-900)] mb-4 tracking-wide border-b border-[var(--color-forest-100)] pb-2">
                  {activeTarot.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-ink-light)] font-normal whitespace-pre-line text-justify">
                  {activeTarot.text}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={() => setActiveTarot(null)}
                className="mt-6 md:mt-0 self-end px-5 py-2 text-xs border border-[var(--color-forest-300)] text-[var(--color-forest-800)] hover:bg-[var(--color-forest-900)] hover:text-[var(--color-paper)] transition-all rounded-md tracking-widest font-mono uppercase"
              >
                [ Close × ]
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="relative z-10 text-center text-ink-light/45 mt-10 font-[family-name:var(--font-caveat)] text-lg tracking-wider">
        every thread leads somewhere
      </p>
    </main>
  );
}
