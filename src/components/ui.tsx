"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export type IconProps = { className?: string; strokeWidth?: number };

const base = (className = "h-5 w-5") => ({
  className,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true,
});

export function IconCart({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
    </svg>
  );
}

export function IconSearch({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function IconSun({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function IconMenu({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M3 6h18M3 12h18M3 18h12" />
    </svg>
  );
}

export function IconClose({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconChevron({ className, strokeWidth = 1.6, direction = "right" }: IconProps & { direction?: "left" | "right" | "down" | "up" }) {
  const rotation = { right: 0, down: 90, left: 180, up: 270 }[direction];
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rotation}deg)` }}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconArrow({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconPlus({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus({ className, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconTrash({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5h6v2M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconShield({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function IconTruck({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6h11v11H2zM13 10h4l3 3v4h-7" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}

export function IconCard({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6 15h4" />
    </svg>
  );
}

export function IconSupport({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13a8 8 0 0 1 16 0" />
      <path d="M4 13v3a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2ZM20 13v3a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2Z" />
      <path d="M17 19a4 4 0 0 1-4 3h-1" />
    </svg>
  );
}

export function IconWhatsApp({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.2 5.06 4.48.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.37-1.41a9.85 9.85 0 0 0 4.67 1.19h.01c5.43 0 9.85-4.42 9.85-9.86A9.79 9.79 0 0 0 19 4.88 9.8 9.8 0 0 0 12.04 2Zm0 18.03h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.33c0-4.52 3.68-8.2 8.21-8.2 2.19 0 4.25.86 5.8 2.4a8.15 8.15 0 0 1 2.4 5.81c0 4.52-3.68 8.2-8.2 8.2Z" />
    </svg>
  );
}

export function IconInstagram({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function IconMapPin({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-5 w-5"} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="m10 1.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" />
    </svg>
  );
}

export function IconCheck({ className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function IconFilter({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  );
}

export function IconSliders({ className, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(className)} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </svg>
  );
}

export function Stars({ rating, className = "", size = "text-[13px]" }: { rating: number; className?: string; size?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-gold ${className}`} aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <svg key={index} viewBox="0 0 20 20" className={`${size} h-[1em] w-[1em]`} fill={rating >= index - 0.25 ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.3} aria-hidden>
          <path d="m10 1.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" />
        </svg>
      ))}
    </span>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      element.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add("is-visible");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "start",
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  action?: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end ${align === "center" ? "text-center md:flex-col md:items-center" : "md:justify-between"}`}>
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="font-display text-3xl leading-[1.08] sm:text-4xl lg:text-[2.9rem]">{title}</h2>
        {subtitle ? <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[0.95rem]">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-500">{message}</p>;
}
