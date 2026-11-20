"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { GalleryImage } from "./client-media";

function moveGallery(track: HTMLDivElement, direction: -1 | 1) {
  const [first, second] = Array.from(track.children) as HTMLElement[];
  if (!first || !second) return;

  const step = second.offsetLeft - first.offsetLeft;
  const end = track.scrollWidth - track.clientWidth;
  const position = track.scrollLeft;
  let left = position + direction * step;
  if (direction === 1 && position >= end - 1) left = 0;
  if (direction === -1 && position <= 1) left = end;

  track.scrollTo({
    left,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
}

export function PhotoGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const headingId = useId();
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const mouseOver = useRef(false);
  const [canScroll, setCanScroll] = useState(false);
  const [paused, setPaused] = useState(false);
  const photoCount = images.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track || photoCount < 2) return;

    const observer = new ResizeObserver(() => setCanScroll(track.scrollWidth > track.clientWidth + 1));
    observer.observe(track);
    return () => observer.disconnect();
  }, [photoCount]);

  useEffect(() => {
    const track = trackRef.current;
    const section = track?.closest("section");
    if (!track || !section || !canScroll || paused) return;

    let inView = false;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.intersectionRatio >= 0.25;
    }, { threshold: 0.25 });
    observer.observe(track);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      if (inView && !document.hidden && !reducedMotion.matches && !mouseOver.current && !section.contains(document.activeElement)) {
        moveGallery(track, 1);
      }
    }, 4600);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [canScroll, paused]);

  if (!photoCount) return null;

  return (
    <section
      className={`client-gallery ${photoCount === 1 ? "client-gallery-single" : ""}`}
      aria-labelledby={headingId}
      onPointerEnter={(event) => { mouseOver.current = event.pointerType === "mouse"; }}
      onPointerLeave={() => { mouseOver.current = false; }}
    >
      <div className="content-shell">
        <div className="client-gallery-heading">
          <h2 id={headingId}>{title}</h2>
          {canScroll && (
            <div className="client-gallery-controls" role="group" aria-label={`${title} controls`}>
              <button type="button" aria-label="Previous photos" aria-controls={trackId} onClick={() => { if (trackRef.current) moveGallery(trackRef.current, -1); }}>‹</button>
              <button type="button" className="client-gallery-playback" aria-controls={trackId} onClick={() => setPaused((current) => !current)}>
                {paused ? "Play" : "Pause"}
              </button>
              <button type="button" aria-label="Next photos" aria-controls={trackId} onClick={() => { if (trackRef.current) moveGallery(trackRef.current, 1); }}>›</button>
            </div>
          )}
        </div>
        <div className="client-gallery-track" id={trackId} ref={trackRef} tabIndex={canScroll ? 0 : undefined} role="region" aria-label={`${title} photos`}>
          {images.map(item => {
            const picture = (
              <>
                <span className="client-gallery-frame">
                  <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 700px) 90vw, 45vw" />
                </span>
                {item.label && <strong>{item.label} <span aria-hidden="true">→</span></strong>}
              </>
            );
            return item.href
              ? <a key={item.src} href={item.href} aria-label={`View ${item.label ?? item.alt} project`}>{picture}</a>
              : <div className="client-gallery-image" key={item.src}>{picture}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
