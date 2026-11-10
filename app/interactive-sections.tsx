"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const workImages = [
  ["work-1.jpg", "Completed modern home exterior"],
  ["work-2.jpg", "Residential construction project"],
  ["work-3.jpg", "Finished contemporary home"],
] as const;

const sampleTestimonials = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    client: "Placeholder testimonial 01",
    area: "Client location",
  },
  {
    quote: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    client: "Placeholder testimonial 02",
    area: "Client location",
  },
  {
    quote: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    client: "Placeholder testimonial 03",
    area: "Client location",
  },
] as const;

export function ScrollableWorkGallery() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const showProject = (index: number) => {
    const row = rowRef.current;
    if (!row) return;
    const nextIndex = (index + workImages.length) % workImages.length;
    const target = row.children[nextIndex] as HTMLElement | undefined;
    if (!target) return;
    setActiveIndex(nextIndex);
    target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const syncActiveProject = () => {
    const row = rowRef.current;
    if (!row) return;
    const rowCenter = row.scrollLeft + row.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(row.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - rowCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex((current) => current === closestIndex ? current : closestIndex);
  };

  return (
    <section className="home-work-section">
      <div className="home-work-heading content-shell">
        <div>
          <span>RECENT PROJECTS</span>
          <h2>OUR WORK</h2>
        </div>
      </div>
      <div className="home-work-row" ref={rowRef} tabIndex={0} onScroll={syncActiveProject} aria-label="Scrollable project gallery">
        {workImages.map(([file, alt], index) => (
          <figure key={file}>
            <Image src={`/design/${file}`} alt={alt} fill sizes="(max-width: 800px) 84vw, 498px" unoptimized />
            <figcaption><span>0{index + 1}</span> VIEW PROJECT</figcaption>
          </figure>
        ))}
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
  const testimonial = sampleTestimonials[activeIndex];
  const goToPrevious = () => setActiveIndex((current) => (current - 1 + sampleTestimonials.length) % sampleTestimonials.length);
  const goToNext = () => setActiveIndex((current) => (current + 1) % sampleTestimonials.length);

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="content-shell testimonials-inner">
        <div className="testimonials-heading">
          <span>SAMPLE CLIENT FEEDBACK</span>
          <h2 id="testimonials-heading">TESTIMONIALS</h2>
          <p>Lorem ipsum placeholder content for layout preview. Replace with verified client reviews before launch.</p>
        </div>
        <div className="testimonial-carousel">
          <button type="button" className="testimonial-arrow" onClick={goToPrevious} aria-label="Previous testimonial">←</button>
          <article key={activeIndex} aria-live="polite">
            <span className="testimonial-quote-mark" aria-hidden="true">“</span>
            <blockquote>{testimonial.quote}</blockquote>
            <p><strong>{testimonial.client}</strong><span>{testimonial.area}</span></p>
          </article>
          <button type="button" className="testimonial-arrow" onClick={goToNext} aria-label="Next testimonial">→</button>
        </div>
        <div className="testimonial-dots" aria-label="Choose a testimonial">
          {sampleTestimonials.map((item, index) => (
            <button
              type="button"
              key={`${item.client}-${item.area}`}
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
