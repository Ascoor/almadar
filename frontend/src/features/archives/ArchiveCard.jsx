import {
  FileText,
  Eye,
  Download,
  FileType as FileTypeIcon,
  Hash,
  CalendarDays,
} from "lucide-react";
import API_CONFIG from "@/config/config";
import { getFileIcon, toneColors } from "./fileIcons";

export default function ArchiveCard({ file = {}, onPreview, fileIcon }) {
  const {
    id,
    number,
    title,
    file_path,
    file_type,
    extracted_text,
    created_at,
    size,
    original_name,
  } = file || {};

  const handlePreview = (e) => {
    e.stopPropagation();
    onPreview?.(file);
  };

  const downloadHref = file_path ? `${API_CONFIG.baseURL}/storage/${file_path}` : "#";

  const niceTitle = title || original_name || "بدون عنوان";
  const niceNumber = number || "بدون رقم";
  const snippet = extracted_text?.trim()
    ? extracted_text.slice(0, 110)
    : "لا يوجد نص مستخرج للمعاينة";
  const sizeLabel = formatBytes(size);
  const dateLabel = created_at ? new Date(created_at).toLocaleDateString() : "غير محدد";

  // نبرة اللون حسب النوع (كلها من tokens)
  const tone = toneForType(file_type);
  const resolvedIcon = fileIcon || getFileIcon(file);
  const Icon = resolvedIcon.icon || FileText;
  const iconTone = toneColors[resolvedIcon.tone] || toneColors.slate;

  return (
    <article
      role="region"
      tabIndex={0}
      aria-label={niceTitle}
      className="
        group relative isolate overflow-hidden w-full h-full flex flex-col
        rounded-2xl border border-[var(--border)]
        bg-[var(--card)] text-[var(--fg)]
        shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]
        transition-all duration-200
        focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--ring)]
        active:scale-[0.995]
      "
      style={{
        // حافّة متدرجة لطيفة (gradient border mask)
        WebkitMask:
          "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        backgroundImage: `linear-gradient(var(--card), var(--card)), ${tone.borderGrad}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* لمعة ناعمة أعلى البطاقة */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 h-28 w-28 rounded-full blur-2xl opacity-20"
        style={{ background: tone.softGlow }}
      />

      {/* شريط علوي ملوّن */}
      <div aria-hidden className="h-1 w-full" style={{ background: tone.bar }} />

      {/* الهيدر */}
      <div className="flex items-start gap-3 p-4">
        {/* أيقونة دائرية */}
        <div
          aria-hidden
          className="
            shrink-0 grid place-items-center w-11 h-11 rounded-xl
            shadow-[var(--shadow-sm)] ring-1 ring-[var(--border)]
            transition-transform duration-200 group-hover:scale-105
          "
          style={{ background: tone.bg, color: tone.fg }}
        >
          <Icon className={`w-5 h-5 ${iconTone.text}`} />
        </div>

        {/* عناوين ومعلومات */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11px] text-[var(--muted-foreground)]">
            <Hash className="w-3.5 h-3.5" />
            <span className="truncate" title={niceNumber}>{niceNumber}</span>
            <span className="mx-1">•</span>
            <CalendarDays className="w-3.5 h-3.5" />
            <span className="truncate" title={dateLabel}>{dateLabel}</span>
          </div>

          <h3
            title={niceTitle}
            className="
              mt-1 font-extrabold text-sm leading-5 truncate
              bg-clip-text text-transparent
            "
            style={{ backgroundImage: "var(--gradient-primary)" }}
          >
            {niceTitle}
          </h3>

          {/* بادج النوع + الحجم */}
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            <span
              title={file_type || "ملف"}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1"
              style={{
                background: tone.bg,
                color: tone.fg,
                boxShadow: "inset 0 0 0 1px " + tone.border,
              }}
            >
              <FileTypeIcon className="w-3.5 h-3.5" />
              {file_type || "غير معروف"}
            </span>
            {sizeLabel && (
              <span className="text-[var(--muted-foreground)]">• {sizeLabel}</span>
            )}
          </div>
        </div>
      </div>

      {/* المقتطف */}
      <p
        className="px-4 text-[12px] leading-5 text-[var(--muted-foreground)] line-clamp-2 break-words"
        title={snippet}
      >
        {snippet}
      </p>

      {/* المسار */}
      {file_path && (
        <p
          className="px-4 mt-1 text-[10px] text-[var(--muted-foreground)] truncate"
          title={file_path}
        >
          {file_path}
        </p>
      )}

      {/* أزرار */}
      <div className="mt-3 flex items-center gap-2 border-t border-[var(--border)] p-3">
        <button
          onClick={handlePreview}
          className="
            inline-flex items-center justify-center gap-2 rounded-lg
            border border-[var(--border)] bg-[var(--card)]
            px-3 py-1.5 text-sm text-[var(--fg)]
            hover:shadow-[var(--shadow-sm)]
            focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
            active:scale-95
            transition
          "
          title="معاينة"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">معاينة</span>
        </button>

        <a
          href={downloadHref}
          target="_blank"
          rel="noreferrer"
          className={`
            inline-flex items-center justify-center gap-2 rounded-lg
            px-3 py-1.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--ring)]
            ${file_path
              ? "border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)] text-[var(--fg)] active:scale-95"
              : "opacity-50 pointer-events-none border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]"
            }
          `}
          title={file_path ? "تحميل" : "لا يمكن التحميل"}
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">تحميل</span>
        </a>

        <div className="ms-auto text-[10px] text-[var(--muted-foreground)]">
          ID: {id ?? "—"}
        </div>
      </div>

      {/* توهج عند التحويم */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ boxShadow: "var(--shadow-glow)" }}
      />
    </article>
  );
}

/* ---------- Utils ---------- */

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024, dm = 1;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function toneForType(type) {
  // كل القيم من tokens عندك + تدرّج للحدود ولمسة توهج خفيفة
  switch ((type || "").toLowerCase()) {
    case "pdf":
    case "contract":
      return {
        bg: "hsla(25, 90%, 55%, 0.10)",    // --accent
        fg: "hsl(25 90% 40%)",
        border: "hsl(25 90% 70%)",
        bar: "hsl(25 90% 55%)",
        borderGrad: "linear-gradient(135deg, hsl(25 90% 65%), hsl(25 90% 45%))",
        softGlow: "hsl(25 90% 55%)",
      };
    case "case":
      return {
        bg: "hsla(180, 100%, 28%, 0.12)",  // --primary
        fg: "hsl(180 100% 28%)",
        border: "hsl(180 100% 45%)",
        bar: "hsl(180 100% 28%)",
        borderGrad: "linear-gradient(135deg, hsl(178 85% 50%), hsl(180 100% 28%))",
        softGlow: "hsl(178 85% 45%)",
      };
    case "legaladvice":
    case "advice":
      return {
        bg: "hsla(146, 91%, 45%, 0.12)",   // --secondary
        fg: "hsl(146 91% 35%)",
        border: "hsl(146 91% 55%)",
        bar: "hsl(146 91% 45%)",
        borderGrad: "linear-gradient(135deg, hsl(146 70% 50%), hsl(146 91% 40%))",
        softGlow: "hsl(146 70% 48%)",
      };
    default:
      return {
        bg: "hsla(210, 14%, 92%, 0.6)",    // --muted
        fg: "hsl(215 16% 35%)",
        border: "hsl(0 0% 82%)",
        bar: "hsl(200 18% 86%)",
        borderGrad: "linear-gradient(135deg, hsl(210 16% 86%), hsl(200 18% 86%))",
        softGlow: "hsl(200 18% 86%)",
      };
  }
}
