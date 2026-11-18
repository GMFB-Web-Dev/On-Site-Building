"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { masterContent } from "./master-content";
import { homeWorkImages, suppliedServiceGalleries } from "./site-images";
import { galleryOffset } from "./gallery-position";

const serviceWorkImages = [
  ["/design/figma-newbuild-work-1.png", "Residential new build"],
  ["/design/figma-newbuild-work-2.png", "Contemporary residential new build"],
  ["/design/figma-newbuild-work-3.png", "Residential new build"],
] as const;

const sampleTestimonials = Array.from({ length: 3 }, (_, id) => ({
  id,
  quote: masterContent.testimonials.quote,
  client: masterContent.testimonials.client,
}));

export function ScrollableWorkGallery({ service = false, page, gallery, heading = masterContent.work.title }: { service?: boolean; page?: string; gallery?: readonly (readonly [string, string])[]; heading?: string }) {
  const images = gallery ?? (service ? suppliedServiceGalleries[page ?? "service"] ?? serviceWorkImages : homeWorkImages);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activePhase, setActivePhase] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const workPhaseCount = images.length;
  const focusedProject = activePhase % workPhaseCount;

  const showPhase = (index: number) => {
    const nextPhase = (index + workPhaseCount) % workPhaseCount;
    setActivePhase(nextPhase);
  };

  useEffect(() => {
    if (workPhaseCount <= 1 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setActivePhase((current) => (current + 1) % workPhaseCount),
      gallery ? 6100 : page === "serviceRenovations" ? 5600 : page === "service" ? 6500 : 4600,
    );
    return () => window.clearTimeout(timer);
  }, [activePhase, isPaused, workPhaseCount, gallery, page]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    const position = () => {
      const item = track.children[focusedProject] as HTMLElement | undefined;
      if (!item) return;
      const offset = galleryOffset(item.offsetLeft, item.offsetWidth, viewport.clientWidth, track.scrollWidth);
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };
    position();
    const resize = new ResizeObserver(position);
    resize.observe(viewport);
    return () => resize.disconnect();
  }, [focusedProject, workPhaseCount]);

  return (
    <section
      className="home-work-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false); }}
    >
      <div className="home-work-heading content-shell">
        <div>
          <h2>{heading}</h2>
        </div>
      </div>
      <div className="home-work-viewport" ref={viewportRef} role="region" aria-roledescription="carousel" tabIndex={0} aria-live={isPaused ? "polite" : "off"} aria-label={`Image ${focusedProject + 1} of ${workPhaseCount}`}
        onKeyDown={(event) => {
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            showPhase(event.key === "Home" ? 0 : event.key === "End" ? workPhaseCount - 1 : focusedProject + (event.key === "ArrowLeft" ? -1 : 1));
          }
        }}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(distance) >= 48) showPhase(focusedProject + (distance > 0 ? -1 : 1));
        }}>
        <div className="home-work-row" ref={trackRef}>
          {images.map(([file, alt], index) => (
            <figure
              key={file}
              className={index === focusedProject ? "is-focused" : ""}
              aria-label={`Image ${index + 1} of ${workPhaseCount}`}
            >
              <Image src={file} alt={alt} fill sizes="(max-width: 800px) calc((100vw - 56px) / 1.5), min(calc((100vw - 96px) / 2.5), 621px)" />
            </figure>
          ))}
        </div>
      </div>
      <div className="work-gallery-footer content-shell">
        <div className="work-dots" role="group" aria-label="Choose an image">
          {Array.from({ length: workPhaseCount }, (_, index) => (
            <button
              type="button"
              key={index}
              className={index === focusedProject ? "active" : ""}
              onClick={() => showPhase(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === focusedProject ? "true" : undefined}
            />
          ))}
        </div>
        <div className="work-controls" aria-label="Project gallery controls">
          <button type="button" className="work-arrow previous" onClick={() => showPhase(focusedProject - 1)} aria-label="Previous image" />
          <button type="button" className="work-arrow next" onClick={() => showPhase(focusedProject + 1)} aria-label="Next image" />
        </div>
      </div>
    </section>
  );
}

export function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const testimonial = sampleTestimonials[activeIndex];
  const goToPrevious = () => setActiveIndex((current) => (current - 1 + sampleTestimonials.length) % sampleTestimonials.length);
  const goToNext = () => setActiveIndex((current) => (current + 1) % sampleTestimonials.length);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(sampleTestimonials.length - 1);
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 48) return;
    if (distance > 0) goToPrevious();
    else goToNext();
  };

  return (
    <section
      className="testimonials-section"
      aria-labelledby="testimonials-heading"
    >
      <div className="content-shell testimonials-inner">
        <div className="testimonials-heading">
          <h2 id="testimonials-heading">{masterContent.testimonials.title}</h2>
        </div>
        <div
          className="testimonial-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
          onTouchEnd={handleTouchEnd}
        >
          <button type="button" className="testimonial-arrow previous" onClick={goToPrevious} aria-label="Previous testimonial">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <article key={activeIndex} aria-live="polite" aria-label={`Testimonial ${activeIndex + 1} of ${sampleTestimonials.length}`}>
            <blockquote>“{testimonial.quote}”</blockquote>
            <p><strong>{testimonial.client}</strong></p>
          </article>
          <button type="button" className="testimonial-arrow next" onClick={goToNext} aria-label="Next testimonial">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <div className="testimonial-dots" role="group" aria-label="Choose a testimonial">
          {sampleTestimonials.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === activeIndex ? "active" : ""}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show testimonial ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
