"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { GalleryImage } from "./client-media";

export function PhotoGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const headingId = useId();
  const trackId = useId();
  const track = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ previous: false, next: images.length > 2 });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      const previous = element.scrollLeft > 2;
      const next = element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
      setCanScroll(current => current.previous === previous && current.next === next ? current : { previous, next });
    };
    const frame = requestAnimationFrame(update);
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, [images.length]);

  if (!images.length) return null;

  function scroll(direction: number) {
    const element = track.current;
    if (!element) return;
    const firstImage = element.firstElementChild;
    const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
    const distance = (firstImage?.getBoundingClientRect().width ?? element.clientWidth) + gap;
    element.scrollBy({
      left: direction * distance,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  return <section className={`client-gallery ${images.length === 1 ? "client-gallery-single" : ""}`} aria-labelledby={headingId}>
    <div className="content-shell">
      <div className="client-gallery-heading">
        <h2 id={headingId}>{title}</h2>
        {images.length > 1 && <div className="client-gallery-controls" aria-label="Photo gallery controls">
          <button type="button" onClick={() => scroll(-1)} disabled={!canScroll.previous} aria-label="Previous photos" aria-controls={trackId}>←</button>
          <button type="button" onClick={() => scroll(1)} disabled={!canScroll.next} aria-label="Next photos" aria-controls={trackId}>→</button>
        </div>}
      </div>
      <div className="client-gallery-track" id={trackId} ref={track}>
        {images.map(item => <a key={item.src} href={item.href ?? item.src}
          target={item.href ? undefined : "_blank"} rel={item.href ? undefined : "noopener noreferrer"}
          aria-label={item.href ? `View ${item.label ?? item.alt} project` : `${item.alt} — open full photo in a new tab`}>
          <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 700px) 90vw, 45vw" />
          {item.label && <strong>{item.label} <span aria-hidden="true">→</span></strong>}
        </a>)}
      </div>
    </div>
  </section>;
}
