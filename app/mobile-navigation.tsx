"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function MobileNavigation({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const dismissOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1181px)");
    const dismissOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    const dismiss = () => setOpen(false);

    document.addEventListener("pointerdown", dismissOutside, true);
    document.addEventListener("keydown", dismissOnEscape);
    desktop.addEventListener("change", dismissOnDesktop);
    window.addEventListener("blur", dismiss);
    window.addEventListener("popstate", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside, true);
      document.removeEventListener("keydown", dismissOnEscape);
      desktop.removeEventListener("change", dismissOnDesktop);
      window.removeEventListener("blur", dismiss);
      window.removeEventListener("popstate", dismiss);
    };
  }, [open]);

  return (
    <div
      className="mobile-nav"
      ref={containerRef}
      onBlurCapture={(event) => {
        // Safari touch can blur to null before a link's click is dispatched.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        className="mobile-nav-toggle"
        type="button"
        ref={toggleRef}
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
      </button>
      {open && (
        <nav
          id={menuId}
          aria-label="Mobile navigation"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
          }}
        >
          {children}
        </nav>
      )}
    </div>
  );
}
