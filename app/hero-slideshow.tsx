"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { SiteImage } from "./client-media";

type Props = { images: SiteImage[]; label: string; intervalMs?: number };

export function HeroSlideshow({ images, label, intervalMs = 4800 }: Props) {
  const [index, setIndex] = useState(0);
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
    if (total < 2 || !visible || reducedMotion || !documentVisible) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % total), intervalMs);
    return () => window.clearTimeout(timer);
  }, [index, total, visible, reducedMotion, documentVisible, intervalMs]);

  if (!total) return null;
  return <div
    ref={container}
    className="hero-slideshow"
    aria-label={label}
    aria-roledescription="slideshow"
  >
    {images.map((item, i) => <div
      key={item.src}
      className={`hero-slide ${index === i ? "is-active" : ""}`}
      aria-hidden={index !== i}
    >
      <Image src={item.src} alt={index === i ? item.alt : ""} fill priority={i === 0} loading={i === 0 ? undefined : "eager"} sizes="100vw" />
    </div>)}
  </div>;
}
