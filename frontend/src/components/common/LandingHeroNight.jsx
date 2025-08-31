
/**
 * LandingHeroNight.jsx
 * Responsive night-variant hero image for the landing page.
 * Place the exported files under: public/landing/
 * Usage: <LandingHeroNight className="w-full h-[min(72vh,680px)] object-cover" />
 */
export default function LandingHeroNight({ className = "w-full h-auto object-cover" }) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/landing/hero-night-640.webp 640w,
          /landing/hero-night-960.webp 960w,
          /landing/hero-night-1152.webp 1152w"
        sizes="100vw"
      />
      <source
        type="image/jpeg"
        srcSet="/landing/hero-night-640.jpg 640w,
          /landing/hero-night-960.jpg 960w,
          /landing/hero-night-1152.jpg 1152w"
        sizes="100vw"
      />
      <img
        src="/landing/hero-night-1152.jpg"
        srcSet="/landing/hero-night-640.jpg 640w,
          /landing/hero-night-960.jpg 960w,
          /landing/hero-night-1152.jpg 1152w"
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchpriority="high"
        className={className}
      />
    </picture>
  );
}
