import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import IconMedallion from "./IconMedallion";

/**
 * Props:
 * - listName: string | ReactNode            (العنوان الرئيسي)
 * - icon?: string | ReactNode               (صورة أو ReactNode)
 * - subtitle?: string | ReactNode           (اختياري)
 * - showBackButton?: boolean                (زر الرجوع)
 * - onBack?: () => void                     (لو عايز تتجاوز window.history.back)
 * - actions?: ReactNode                     (أزرار إضافية يمين/يسار العنوان)
 * - breadcrumbs?: Array<{label:string, onClick?:()=>void, href?:string}>
 * - align?: 'center' | 'start'              (محاذاة المحتوى)
 */
const SectionHeader = ({
  listName,
  icon,
  subtitle,
  showBackButton,
  onBack,
  actions,
  breadcrumbs = [],
  align = "center",
}) => {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: "50%", y: "50%" });

  // لمسة ضوء تتحرك مع الماوس/اللمس
  const updatePos = (e) => {
    const rect = cardRef.current?.getBoundingClientRect?.();
    if (!rect) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setPos({ x: `${x}%`, y: `${y}%` });
  };

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const aligned = align === "start" ? "items-start text-start" : "items-center text-center";

  return (
    <div
      ref={cardRef}
      onMouseMove={updatePos}
      onTouchMove={updatePos}
      className={`
        group relative overflow-hidden
        rounded-3xl border border-[var(--border)]
        bg-[var(--card)] text-[var(--fg)]
        shadow-[var(--shadow-sm)] md:shadow-[var(--shadow-md)]
        px-5 sm:px-6 md:px-8 py-7 sm:py-9
        transition-all duration-300
      `}
      aria-label={typeof listName === "string" ? listName : "section header"}
    >
      {/* خلفية ناعمة */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.9]"
        style={{ background: "var(--gradient-subtle)" }}
        aria-hidden="true"
      />

      {/* لمعة تتبع المؤشر (Gradient spotlight) */}
      <div
        className="pointer-events-none absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px 350px at ${pos.x} ${pos.y}, hsl(0 0% 100% / 0.12), transparent 55%)`,
        }}
        aria-hidden="true"
      />

      {/* لمسات لونية خفيفة (blobs) */}
      <div
        className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--map-start)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: "var(--map-end)" }}
        aria-hidden="true"
      />

      {/* شريط علوي رفيع لوني */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{ background: "var(--gradient-primary)" }}
        aria-hidden="true"
      />

      {/* Breadcrumbs (اختياري) */}
      {breadcrumbs?.length > 0 && (
        <nav
          className="relative z-10 mb-3 flex flex-wrap gap-x-2 gap-y-1 text-[12px] sm:text-[13px] text-[var(--muted-foreground)]"
          aria-label="breadcrumb"
        >
          {breadcrumbs.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              {b.href ? (
                <a
                  href={b.href}
                  onClick={b.onClick}
                  className="hover:underline hover:text-[var(--fg)]"
                >
                  {b.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={b.onClick}
                  className="hover:underline hover:text-[var(--fg)]"
                >
                  {b.label}
                </button>
              )}
              {i < breadcrumbs.length - 1 && <span>›</span>}
            </span>
          ))}
        </nav>
      )}

      {/* المحتوى الرئيسي */}
      <div
        className={`relative z-10 flex flex-col ${aligned} justify-center gap-4`}
      >
        {/* أيقونة */}
        {icon && (
          <IconMedallion size="md" spin={true}>
            {typeof icon === "string" ? (
              <img
                src={icon}
                alt={typeof listName === "string" ? listName : "section icon"}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            ) : (
              // لو الأيقونة ReactNode (SVG)
              <div className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--fg)]">
                {icon}
              </div>
            )}
          </IconMedallion>
        )}

        {/* العنوان + أكشنات */}
        <div
          className={`w-full flex flex-col ${align === "start" ? "sm:flex-row sm:items-center" : "items-center"} gap-3`}
        >
          <h2
            className="
              section-title text-balance leading-tight font-extrabold font-heading
              text-2xl sm:text-3xl md:text-4xl
              bg-clip-text text-transparent
              hover:opacity-95 transition
            "
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            {listName}
          </h2>

          {/* Actions */}
          {actions && (
            <div className={`ms-0 ${align === "start" ? "sm:ms-auto" : ""}`}>
              {actions}
            </div>
          )}
        </div>

        {/* العنوان الفرعي */}
        {subtitle && (
          <p className="text-[13px] sm:text-sm text-[var(--muted-foreground)] max-w-prose">
            {subtitle}
          </p>
        )}

        {/* زر الرجوع */}
        {showBackButton && (
          <div className={`${align === "start" ? "" : "mx-auto"}`}>
            <button
              onClick={handleBack}
              className="
                inline-flex items-center gap-2 rounded-2xl px-4 py-1.5
                border border-[var(--border)] bg-[var(--card)]
                text-[var(--fg)]
                hover:shadow-[var(--shadow-sm)]
                focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
                transition
              "
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">رجوع</span>
            </button>
          </div>
        )}
      </div>

      {/* خط زخرفي متحرك تحت العنوان */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-3 h-[2px] w-24 sm:w-32 rounded-full opacity-70 transition-all duration-300 group-hover:w-40"
        style={{ background: "var(--gradient-primary)" }}
        aria-hidden="true"
      />
    </div>
  );
};

export default SectionHeader;
