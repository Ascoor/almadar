import React,
{
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import { getArchiveFiles } from "@/services/api/archives";
import { toast } from "sonner";
import {
  ArrowUpDown,
  CalendarClock,
  Eye,
  FilePenLine,
  LayoutGrid,
  PanelRightOpen,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import API_CONFIG from "@/config/config";
import { ArchiveSection } from "@/assets/icons";
import { getFileIcon } from "@/features/archives/fileIcons";
import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import LanguageToggle from "@/components/common/LanguageToggle";
import SectionHeader from "@/components/common/SectionHeader";

const PDFViewer = lazy(() => import("@/components/PDFViewer"));
const DocumentEditor = lazy(() => import("@/components/editor/DocumentEditor"));

/* ----------------- Helpers ----------------- */

const TYPE_LABELS = {
  Contract: { ar: "عقود", en: "Contracts" },
  LegalAdvice: { ar: "مشورة أو رأي", en: "Legal advice" },
  Case: { ar: "قضايا", en: "Cases" },
};

const COPY = {
  title: { ar: "مركز الأرشيف", en: "Archive Hub" },
  subtitle: {
    ar: "مساحتك المركزية لاستعراض ملفات الأرشيف، البحث والتحرير بسرعة.",
    en: "Your central place to browse, search, and edit archived files.",
  },
  refresh: { ar: "تحديث", en: "Refresh" },
  searchLabel: { ar: "البحث في الأرشيف", en: "Search archive" },
  searchPlaceholder: {
    ar: "اكتب اسم الملف أو الملاحظة…",
    en: "Type a file name or note…",
  },
  clearSearch: { ar: "مسح البحث", en: "Clear search" },
  sortLabel: { ar: "ترتيب", en: "Sort" },
  typeLabel: { ar: "نوع", en: "Type" },
  newest: { ar: "الأحدث أولًا", en: "Newest first" },
  oldest: { ar: "الأقدم أولًا", en: "Oldest first" },
  nameAsc: { ar: "الاسم (أ-ي)", en: "Name (A-Z)" },
  nameDesc: { ar: "الاسم (ي-أ)", en: "Name (Z-A)" },
  all: { ar: "الكل", en: "All" },
  preview: { ar: "معاينة", en: "Preview" },
  edit: { ar: "تحرير", en: "Edit" },
  close: { ar: "إغلاق", en: "Close" },
  noResults: { ar: "لا توجد نتائج مطابقة", en: "No matching results" },
  adjustFilters: {
    ar: "عدّل البحث أو نوع الملف أو الترتيب للحصول على نتائج.",
    en: "Tweak search, type, or sorting to see matching files.",
  },
  selectFileTitle: {
    ar: "اختر ملفًا لعرضه هنا",
    en: "Choose a file to view here",
  },
  selectFileHint: {
    ar: "استخدم البحث والتصنيفات للوصول السريع لملفك.",
    en: "Use search and categories to quickly open a file.",
  },
  typeCounts: { ar: "عدد الملفات", en: "File count" },
  statsVisible: { ar: "المعروضة الآن", en: "Visible" },
  statsTotal: { ar: "إجمالي", en: "Total" },
  activeFile: { ar: "الملف النشط", en: "Active file" },
};

function getLabel(type, lang) {
  const label = TYPE_LABELS[type];
  return label ? label[lang] : type || (lang === "ar" ? "غير معروف" : "Unknown");
}

function groupByType(files = []) {
  return files.reduce((acc, file) => {
    const key = file.model_type || "OTHER";
    (acc[key] ||= []).push(file);
    return acc;
  }, {});
}

function useDebounced(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

  function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
      const mql = window.matchMedia(query);
      const handler = (e) => setMatches(e.matches);
      setMatches(mql.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }, [query]);
    return matches;
  }

function isPdfFile(file) {
  const type = (file?.file_type || "").toLowerCase();
  const path =
    (file?.file_path || file?.original_name || file?.file_name || "").toLowerCase();
  return type === "pdf" || path.endsWith(".pdf");
}

function buildEditorContent(file, lang = "ar") {
  if (file?.html_content) return file.html_content;

  if (file?.extracted_text) {
    const safe = file.extracted_text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<p>${safe.replace(/\n/g, "<br />")}</p>`;
  }

  return lang === "ar"
    ? "<p>لا يوجد نص مستخرج لهذا الملف حتى الآن.</p>"
    : "<p>No extracted text is available for this file yet.</p>";
}

/* ----------------- Components ----------------- */

function PageHeader() {
  return (
    
    <SectionHeader   showBackButton listName="قسم الأرشيف" icon={ArchiveSection} />
  );
}

function TypeChip({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
        active
          ? "border-[var(--ring)] bg-[var(--muted)]/60 text-[var(--foreground)] shadow-[var(--shadow-sm)]"
          : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:shadow-[var(--shadow-sm)]"
      }`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--muted)]/60 text-xs font-semibold text-[var(--foreground)]">
        {count}
      </span>
      <span className="truncate text-sm font-medium">{label}</span>
    </button>
  );
}

function FileCard({ file, lang, active, onPreview }) {
  const Icon = getFileIcon(file).icon;
  const previewText =
    file.note ||
    (file.extracted_text ? `${file.extracted_text.slice(0, 140)}...` : "");
  const date = file.created_at || file.updated_at;

  return (
    <article
      className={`group flex flex-col justify-between rounded-2xl border bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-md)] ${
        active ? "ring-2 ring-[var(--ring)]" : "border-[var(--border)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 shadow-[var(--shadow-xs)]">
          <Icon className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
        </span>
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <Tag className="h-4 w-4" aria-hidden="true" />
            <span className="rounded-full bg-[var(--muted)]/50 px-2 py-0.5 text-[10px] font-semibold text-[var(--foreground)]">
              {file.file_type || "FILE"}
            </span>
            <span className="rounded-full bg-[var(--muted)]/30 px-2 py-0.5 text-[10px] text-[var(--muted-foreground)]">
              {getLabel(file.model_type, lang)}
            </span>
          </div>
          <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">
            {file.title || file.original_name || file.file_name || (lang === "ar" ? "بدون اسم" : "Untitled")}
          </h3>
          <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">{previewText}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
        <CalendarClock className="h-4 w-4" aria-hidden="true" />
        <span>{date ? new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US") : "--"}</span>
        <span className="ms-auto inline-flex gap-1 opacity-0 transition group-hover:opacity-100">
          <IconButton icon={Eye} label={COPY.preview[lang]} onClick={() => onPreview(file)} />
          <IconButton icon={FilePenLine} label={COPY.edit[lang]} onClick={() => onPreview(file, "edit")}
          />
          <IconButton icon={PanelRightOpen} label={COPY.activeFile[lang]} onClick={() => onPreview(file)} />
        </span>
      </div>
    </article>
  );
}

function IconButton({ icon: IconComp, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-1.5 text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      title={label}
    >
      <IconComp className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ViewerShell({
  lang,
  activeFile,
  currentMode,
  setViewerMode,
  onClose,
  fileUrlForPdf,
}) {
  const previewIcon = activeFile ? getFileIcon(activeFile) : null;
  const PreviewIcon = previewIcon?.icon;
  const date = activeFile?.created_at || activeFile?.updated_at;

  return (
    <div className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lg)]">
      {!activeFile ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <img src={ArchiveSection} alt="archive" className="h-12 w-12 text-[var(--muted-foreground)]" />
          <p className="text-lg font-semibold text-[var(--foreground)]">{COPY.selectFileTitle[lang]}</p>
          <p className="max-w-xl text-sm text-[var(--muted-foreground)]">{COPY.selectFileHint[lang]}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--background)]/70 px-4 py-4 sm:px-6">
            <div className="flex flex-wrap items-start gap-3 sm:items-center">
              <div className="flex items-center gap-2">
                {PreviewIcon && (
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 shadow-[var(--shadow-xs)]">
                    <PreviewIcon className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted-foreground)]">{COPY.activeFile[lang]}</p>
                  <h3 className="truncate text-base font-bold text-[var(--foreground)] sm:text-lg">
                    {activeFile.title ||
                      activeFile.original_name ||
                      activeFile.file_name ||
                      (lang === "ar" ? "ملف بدون عنوان" : "Untitled file")}
                  </h3>
                </div>
              </div>

              <div className="ms-auto flex items-center gap-2 text-xs text-[var(--muted-foreground)] sm:text-sm">
                <span className="rounded-full bg-[var(--muted)] px-2 py-1">{getLabel(activeFile.model_type, lang)}</span>
                {date && <span>{new Date(date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</span>}
                <button
                  type="button"
                  onClick={onClose}
                  className="ms-2 inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] p-2 text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  aria-label={COPY.close[lang]}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)]/70 p-2 shadow-[var(--shadow-xs)]">
              {isPdfFile(activeFile) && (
                <button
                  type="button"
                  onClick={() => setViewerMode("preview")}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
                    currentMode === "preview"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border border-[var(--border)] bg-[var(--background)] hover:shadow-[var(--shadow-sm)]"
                  }`}
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  <span>{COPY.preview[lang]}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setViewerMode("edit")}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
                  currentMode === "edit"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "border border-[var(--border)] bg-[var(--background)] hover:shadow-[var(--shadow-sm)]"
                }`}
              >
                <FilePenLine className="h-4 w-4" aria-hidden="true" />
                <span>{COPY.edit[lang]}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs sm:text-sm transition hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                <span>{COPY.close[lang]}</span>
              </button>
            </div>
          </div>

          <div className="min-h-[280px] flex-1 overflow-auto bg-[var(--card)]">
            <Suspense
              fallback={
                <div className="flex h-40 items-center justify-center text-sm text-[var(--muted-foreground)]">
                  {lang === "ar" ? "جاري تحميل العارض..." : "Loading viewer..."}
                </div>
              }
            >
              {currentMode === "preview" && isPdfFile(activeFile) && fileUrlForPdf ? (
                <PDFViewer fileUrl={fileUrlForPdf} />
              ) : (
                <DocumentEditor initialContent={buildEditorContent(activeFile, lang)} />
              )}
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------- Page ----------------- */

export default function ArchivePage() {
  const { lang, dir } = useLanguage();
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [viewerMode, setViewerMode] = useState("auto");

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("date_desc");
  const debouncedQuery = useDebounced(query, 300);

  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [mobileViewerOpen, setMobileViewerOpen] = useState(false);

  const previewRef = useRef(null);

  const fetchFiles = useCallback(
    async (withToast = false) => {
      try {
        if (withToast) setRefreshing(true);
        setLoading(true);

        const res = await getArchiveFiles();
        const files = res?.data?.data || [];
        setAllFiles(files);

        if (withToast)
          toast.success(lang === "ar" ? "✅ تم تحديث الأرشيف بنجاح" : "✅ Archive refreshed", {
            duration: 2000,
          });
      } catch (e) {
        toast.error(lang === "ar" ? "❌ فشل تحميل الملفات" : "❌ Failed to load files");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [lang]
  );

  useEffect(() => {
    fetchFiles(false);
  }, [fetchFiles]);

  useEffect(() => {
    if (!isMobile) setMobileViewerOpen(false);
  }, [isMobile]);

  const filtered = useMemo(() => {
    let rows = [...allFiles];

    if (typeFilter !== "ALL") {
      rows = rows.filter((f) => f.model_type === typeFilter);
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((f) => {
        const name = (f?.file_name || "").toLowerCase();
        const original = (f?.original_name || "").toLowerCase();
        const note = (f?.note || "").toLowerCase();
        return name.includes(q) || original.includes(q) || note.includes(q);
      });
    }

    rows.sort((a, b) => {
      const aName = (a?.original_name || a?.file_name || "").toLowerCase();
      const bName = (b?.original_name || b?.file_name || "").toLowerCase();
      const aDate = new Date(a?.created_at || a?.updated_at || 0).getTime();
      const bDate = new Date(b?.created_at || b?.updated_at || 0).getTime();

      switch (sortKey) {
        case "date_asc":
          return aDate - bDate;
        case "date_desc":
          return bDate - aDate;
        case "name_desc":
          return bName.localeCompare(aName);
        case "name_asc":
        default:
          return aName.localeCompare(bName);
      }
    });

    return rows;
  }, [allFiles, typeFilter, debouncedQuery, sortKey]);

  const countsByType = useMemo(() => {
    const byType = groupByType(allFiles);
    return Object.fromEntries(Object.keys(byType).map((k) => [k, byType[k].length]));
  }, [allFiles]);

  const totalCount = allFiles.length;
  const filteredCount = filtered.length;

  const handleCardPreview = useCallback(
    (file, mode = "auto") => {
      setActiveFile(file);
      setViewerMode(mode === "auto" ? (isPdfFile(file) ? "preview" : "edit") : mode);
      if (isMobile) {
        setMobileViewerOpen(true);
      } else if (previewRef.current) {
        const headerOffset = 96;
        const rect = previewRef.current.getBoundingClientRect();
        const targetTop = Math.max(rect.top + window.scrollY - headerOffset, 0);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    },
    [isMobile]
  );

  const fileUrlForPdf = activeFile?.file_path
    ? `${API_CONFIG.baseURL}/open-pdf/${activeFile.file_path}`
    : null;

  const currentMode = useMemo(() => {
    if (viewerMode !== "auto") return viewerMode;
    return activeFile && isPdfFile(activeFile) ? "preview" : "edit";
  }, [viewerMode, activeFile]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]" dir={dir}>
      <PageHeader lang={lang} onRefresh={fetchFiles} refreshing={refreshing} />

      <main className="container mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)]/80 p-4 shadow-[var(--shadow-md)] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 shadow-[var(--shadow-xs)] focus-within:ring-2 focus-within:ring-[var(--ring)]">
              <Search className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
              <label htmlFor="archive-search" className="sr-only">
                {COPY.searchLabel[lang]}
              </label>
              <input
                id="archive-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={COPY.searchPlaceholder[lang]}
                className="w-full bg-transparent text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
              />
              {!!debouncedQuery && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-full p-1 text-[var(--muted-foreground)] transition hover:bg-[var(--muted)]/40 hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                  aria-label={COPY.clearSearch[lang]}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3 sm:gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs sm:text-sm shadow-[var(--shadow-xs)]">
                <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                <label htmlFor="type-filter" className="sr-only">
                  {COPY.typeLabel[lang]}
                </label>
                <select
                  id="type-filter"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-[var(--foreground)] focus:outline-none"
                >
                  <option value="ALL">{COPY.all[lang]}</option>
                  {Object.keys(countsByType).map((t) => (
                    <option key={t} value={t}>
                      {getLabel(t, lang)} ({countsByType[t]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs sm:text-sm shadow-[var(--shadow-xs)]">
                <ArrowUpDown className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                <label htmlFor="sort-filter" className="sr-only">
                  {COPY.sortLabel[lang]}
                </label>
                <select
                  id="sort-filter"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="bg-transparent text-[var(--foreground)] focus:outline-none"
                >
                  <option value="date_desc">{COPY.newest[lang]}</option>
                  <option value="date_asc">{COPY.oldest[lang]}</option>
                  <option value="name_asc">{COPY.nameAsc[lang]}</option>
                  <option value="name_desc">{COPY.nameDesc[lang]}</option>
                </select>
              </div>

              <div className="hidden items-center justify-end gap-3 rounded-xl bg-[var(--background)] px-3 py-2 text-xs text-[var(--muted-foreground)] shadow-[var(--shadow-xs)] sm:flex">
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                <span>
                  {COPY.statsVisible[lang]}: {filteredCount} / {COPY.statsTotal[lang]}: {totalCount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <TypeChip
              key="all"
              label={`${COPY.all[lang]} (${totalCount})`}
              count={totalCount}
              active={typeFilter === "ALL"}
              onClick={() => setTypeFilter("ALL")}
            />
            {Object.keys(countsByType).map((key) => (
              <TypeChip
                key={key}
                label={getLabel(key, lang)}
                count={countsByType[key]}
                active={typeFilter === key}
                onClick={() => setTypeFilter(key)}
              />
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(520px,1fr)_420px]">
          <section className="space-y-4">
            {loading && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-36 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/40 shadow-[var(--shadow-xs)] animate-pulse"
                  />
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-md)]">
                <LayoutGrid className="h-10 w-10 text-[var(--muted-foreground)]" aria-hidden="true" />
                <p className="text-lg font-semibold">{COPY.noResults[lang]}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{COPY.adjustFilters[lang]}</p>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filtered.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    lang={lang}
                    active={activeFile?.id === file.id}
                    onPreview={handleCardPreview}
                  />
                ))}
              </div>
            )}
          </section>

        </div>
          <section ref={previewRef} className="hidden lg:block lg:sticky lg:top-[96px]">
            <ViewerShell
              lang={lang}
              activeFile={activeFile}
              currentMode={currentMode}
              setViewerMode={setViewerMode}
              onClose={() => {
                setActiveFile(null);
                setViewerMode("auto");
              }}
              fileUrlForPdf={fileUrlForPdf}
            />
          </section>
      </main>

      {/* Mobile viewer */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
          mobileViewerOpen && activeFile ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {activeFile && (
          <div className="relative rounded-t-3xl border border-[var(--border)] bg-[var(--background)] p-3 shadow-[var(--shadow-lg)]">
            <div className="mb-3 flex items-center justify-center">
              <span className="h-1.5 w-12 rounded-full bg-[var(--muted)]" aria-hidden="true" />
            </div>
            <ViewerShell
              lang={lang}
              activeFile={activeFile}
              currentMode={currentMode}
              setViewerMode={setViewerMode}
              onClose={() => {
                setMobileViewerOpen(false);
                setActiveFile(null);
                setViewerMode("auto");
              }}
              fileUrlForPdf={fileUrlForPdf}
            />
          </div>
        )}
      </div>
    </div>
  );
}
