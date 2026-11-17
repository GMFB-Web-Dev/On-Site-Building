"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SiteImage } from "./client-media";

type Props = { images: SiteImage[]; label: string; intervalMs?: number };

export function HeroSlideshow({ images, label, intervalMs = 4800 }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const container = useRef<HTMLDivElement>(null);
  const total = images.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? true), { threshold: .15 });
    if (container.current) observer.observe(container.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (total < 2 || paused || !visible || reducedMotion || !documentVisible) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % total), intervalMs);
    return () => window.clearTimeout(timer);
  }, [index, total, paused, visible, reducedMotion, documentVisible, intervalMs]);

  if (!total) return null;
  const select = (next: number) => setIndex((next + total) % total);
  return <div
    ref={container}
    className="hero-slideshow"
    aria-label={label}
    aria-roledescription="slideshow"
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
  >
    {images.map((item, i) => <div
      key={item.src}
      className={`hero-slide ${index === i ? "is-active" : ""}`}
      aria-hidden={index !== i}
    >
      <Image src={item.src} alt={index === i ? item.alt : ""} fill priority={i === 0} loading={i === 0 ? "eager" : "lazy"} sizes="100vw" />
    </div>)}
    {total > 1 && <div className="hero-slide-controls" aria-label={`${label} photo controls`}>
      <button type="button" className="hero-slide-arrow" onClick={() => select(index - 1)} aria-label="Previous photograph">‹</button>
      <div className="hero-slide-dots" role="group" aria-label="Choose photograph">
        {images.map((item, i) => <button key={item.src} type="button" className={index === i ? "is-active" : ""} aria-label={`Show photograph ${i + 1} of ${total}`} aria-pressed={index === i} onClick={() => select(i)} />)}
      </div>
      <button type="button" className="hero-slide-arrow" onClick={() => select(index + 1)} aria-label="Next photograph">›</button>
    </div>}
  </div>;
}
