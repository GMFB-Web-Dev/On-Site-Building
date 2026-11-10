"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const workImages = [
  ["work-1.jpg", "Completed modern home exterior"],
  ["work-2.jpg", "Residential construction project"],
  ["work-3.jpg", "Finished contemporary home"],
  ["project-whitford.jpg", "Whitford Heights design and build project"],
  ["project-new-lynn.jpg", "New Lynn two-storey home project"],
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

  const scrollGallery = (direction: -1 | 1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth * 0.82, behavior: "smooth" });
  };

  return (
    <section className="home-work-section">
      <div className="home-work-heading content-shell">
        <div>
          <span>RECENT PROJECTS</span>
          <h2>OUR WORK</h2>
        </div>
        <div className="work-controls" aria-label="Project gallery controls">
          <button type="button" onClick={() => scrollGallery(-1)} aria-label="Scroll projects left">←</button>
          <button type="button" onClick={() => scrollGallery(1)} aria-label="Scroll projects right">→</button>
        </div>
      </div>
      <div className="home-work-row" ref={rowRef} tabIndex={0} aria-label="Scrollable project gallery">
        {workImages.map(([file, alt], index) => (
          <figure key={file}>
            <Image src={`/design/${file}`} alt={alt} fill sizes="(max-width: 800px) 84vw, 498px" unoptimized />
            <figcaption><span>0{index + 1}</span> VIEW PROJECT</figcaption>
          </figure>
        ))}
      </div>
      <p className="work-scroll-hint">Drag, swipe or use the arrows to explore more projects.</p>
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
