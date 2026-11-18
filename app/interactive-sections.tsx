"use client";

import Image from "next/image";
import { useId } from "react";
import type { GalleryImage } from "./client-media";

export function PhotoGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const headingId = useId();
  const trackId = useId();

  if (!images.length) return null;


  return <section className={`client-gallery ${images.length === 1 ? "client-gallery-single" : ""}`} aria-labelledby={headingId}>
    <div className="content-shell">
      <div className="client-gallery-heading">
        <h2 id={headingId}>{title}</h2>

      </div>
      <div className="client-gallery-track" id={trackId} tabIndex={images.length > 1 ? 0 : undefined} role="region" aria-label={`${title} photos, scroll to explore`}>
        {images.map(item => {
          const picture = <><Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 700px) 90vw, 45vw" />{item.label && <strong>{item.label} <span aria-hidden="true">→</span></strong>}</>;
          return item.href
            ? <a key={item.src} href={item.href} aria-label={`View ${item.label ?? item.alt} project`}>{picture}</a>
            : <div className="client-gallery-image" key={item.src}>{picture}</div>;
        })}
      </div>
    </div>
  </section>;
}
