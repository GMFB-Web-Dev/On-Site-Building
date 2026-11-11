"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const workImages = [
  ["work-1.jpg", "Completed modern home exterior"],
  ["work-2.jpg", "Residential construction project"],
  ["work-3.jpg", "Finished contemporary home"],
] as const;

const sampleTestimonials = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Distinctio exercitationem laboriosam culpa sit qui placeat, aut officia facere sed amet pariatur ex sunt esse maxime corrupti tempor enim fuga atque accusamus.",
    client: "Lorem Ipsum",
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempor enim fuga atque accusamus sint in facilis nihil quis iusto, aut quo est sit dolores atque dolorem labore et dolore magna aliqua.",
    client: "Dolor Sit",
  },
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip.",
    client: "Amet Elit",
  },
] as const;

export function ScrollableWorkGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const showProject = (index: number) => {
    const nextIndex = (index + workImages.length) % workImages.length;
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    if (isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setActiveIndex((current) => (current + 1) % workImages.length),
      4600,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused]);

  return (
    <section
      className="home-work-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="home-work-heading content-shell">
        <div>
          <span>RECENT PROJECTS</span>
          <h2>OUR WORK</h2>
        </div>
      </div>
      <div className="home-work-viewport" aria-live="polite" aria-label={`Project ${activeIndex + 1} of ${workImages.length}`}>
        <div className="home-work-row" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {workImages.map(([file, alt], index) => (
            <figure key={file} aria-hidden={index !== activeIndex}>
              <Image src={`/design/${file}`} alt={alt} fill sizes="(max-width: 800px) calc(100vw - 32px), 1040px" unoptimized />
            </figure>
          ))}
        </div>
      </div>
      <div className="work-gallery-footer content-shell">
        <div className="work-dots" aria-label="Choose a project">
          {workImages.map(([file], index) => (
            <button
              type="button"
              key={file}
              className={index === activeIndex ? "active" : ""}
              onClick={() => showProject(index)}
              aria-label={`Show project ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </div>
        <div className="work-controls" aria-label="Project gallery controls">
          <button type="button" className="work-arrow previous" onClick={() => showProject(activeIndex - 1)} aria-label="Previous project" />
          <button type="button" className="work-arrow next" onClick={() => showProject(activeIndex + 1)} aria-label="Next project" />
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
          <h2 id="testimonials-heading">TESTIMONIALS</h2>
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
              key={item.client}
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
