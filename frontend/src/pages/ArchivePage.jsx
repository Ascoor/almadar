import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  lazy,
  Suspense,
  useRef,
} from "react";
import { getArchiveFiles } from "@/services/api/archives";
import { toast } from "sonner";
import {
  FolderKanban,
  FolderOpenDot,
  ChevronsDown,
  ChevronsLeft,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Layers3,
  RefreshCw,
  UploadCloud,
  Eye,
  FilePenLine,
} from "lucide-react";
import API_CONFIG from "@/config/config";
import { ArchiveSection } from "@/assets/icons";
import ArchiveCard from "@/features/archives/ArchiveCard";
import { getFileIcon } from "@/features/archives/fileIcons";

const SectionHeader = lazy(() => import("@/components/common/SectionHeader"));
const PDFViewer = lazy(() => import("@/components/PDFViewer"));
const DocumentEditor = lazy(() => import("@/components/editor/DocumentEditor"));

/* ----------------- Helpers ----------------- */

const LABELS = {
  Contract: "عقود",
  LegalAdvice: "مشورة أو رأي",
  Case: "قضايا",
};

function getLabel(type) {
  return LABELS[type] || type || "غير معروف";
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

function isPdfFile(file) {
  const type = (file?.file_type || "").toLowerCase();
  const path =
    (file?.file_path || file?.original_name || file?.file_name || "").toLowerCase();
  return type === "pdf" || path.endsWith(".pdf");
}

function buildEditorContent(file) {
  if (file?.html_content) return file.html_content;

  if (file?.extracted_text) {
    const safe = file.extracted_text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<p>${safe.replace(/\n/g, "<br />")}</p>`;
  }

  return "<p>لا يوجد نص مستخرج لهذا الملف حتى الآن.</p>";
}

/* ----------------- Page ----------------- */

export default function ArchivePage() {
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [openFolders, setOpenFolders] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [viewerMode, setViewerMode] = useState("auto"); // auto | preview | edit

  const headerRef = useRef(null);
  const previewRef = useRef(null);

  // Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("date_desc");
  const debouncedQuery = useDebounced(query, 300);

  const fetchFiles = useCallback(async (withToast = false) => {
    try {
      if (withToast) setRefreshing(true);
      setLoading(true);

      const res = await getArchiveFiles();
      const files = res?.data?.data || [];
      setAllFiles(files);

      const groupedInit = groupByType(files);
      const openInit = Object.fromEntries(
        Object.keys(groupedInit).map((k) => [k, true])
      );
      setOpenFolders(openInit);

      if (withToast) toast.success("✅ تم تحديث الأرشيف بنجاح", { duration: 2000 });
    } catch (e) {
      toast.error("❌ فشل تحميل الملفات");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles(false);
  }, [fetchFiles]);

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

  const grouped = useMemo(() => groupByType(filtered), [filtered]);

  const countsByType = useMemo(() => {
    const byType = groupByType(allFiles);
    return Object.fromEntries(Object.keys(byType).map((k) => [k, byType[k].length]));
  }, [allFiles]);

  const totalCount = allFiles.length;
  const filteredCount = filtered.length;

  const toggleFolder = (type) => {
    setOpenFolders((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const openAll = () => {
    const all = Object.fromEntries(Object.keys(grouped).map((k) => [k, true]));
    setOpenFolders((prev) => ({ ...prev, ...all }));
  };

  const closeAll = () => {
    const all = Object.fromEntries(Object.keys(grouped).map((k) => [k, false]));
    setOpenFolders((prev) => ({ ...prev, ...all }));
  };

  const scrollToPreview = useCallback(() => {
    if (!previewRef.current) return;
    const headerHeight = headerRef.current?.offsetHeight ?? 72;
    const rect = previewRef.current.getBoundingClientRect();
    const targetTop = Math.max(rect.top + window.scrollY - headerHeight - 12, 0);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  }, []);

  const handleCardPreview = useCallback(
    (file) => {
      setActiveFile(file);
      setViewerMode(isPdfFile(file) ? "preview" : "edit");
      requestAnimationFrame(scrollToPreview);
    },
    [scrollToPreview]
  );

  const handleUploadClick = () => {
    toast.info("📂 سيتم إضافة واجهة رفع الملفات لاحقًا.");
  };

  const fileUrlForPdf = activeFile?.file_path
    ? `${API_CONFIG.baseURL}/open-pdf/${activeFile.file_path}`
    : null;

  const previewIcon = useMemo(() => (activeFile ? getFileIcon(activeFile) : null), [activeFile]);
  const PreviewIcon = previewIcon?.icon;

  const currentMode = useMemo(() => {
    if (viewerMode !== "auto") return viewerMode;
    return activeFile && isPdfFile(activeFile) ? "preview" : "edit";
  }, [viewerMode, activeFile]);

  const statsChips = useMemo(
    () => [
      {
        label: "إجمالي الملفات",
        value: totalCount,
      },
      {
        label: "المعروضة حاليًا",
        value: filteredCount,
      },
      ...Object.keys(countsByType).map((key) => ({
        label: getLabel(key),
        value: countsByType[key],
      })),
    ],
    [countsByType, filteredCount, totalCount]
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <Suspense
        fallback={
          <div className="border-b bg-[var(--bg)]/90 px-4 py-4 text-center text-sm text-[var(--muted-foreground)]">
            تحميل العنوان...
          </div>
        }
      >
        <div
          ref={headerRef}
          className="sticky top-0 z-20 border-b bg-[var(--bg)]/90 backdrop-blur-md"
        >
          <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <SectionHeader
              listName="الأرشيف"
              icon={ArchiveSection}
              subtitle="كل الوثائق المؤرشفة، يمكنك استعراضها وتحرير محتواها في الأسفل."
              showBackButton
              align="start"
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fetchFiles(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                      aria-hidden="true"
                    />
                    <span>تحديث</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--primary)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                  >
                    <UploadCloud className="h-4 w-4" aria-hidden="true" />
                    <span>رفع ملف</span>
                  </button>
                </div>
              }
              breadcrumbs={[{ label: "لوحة التحكم", href: "#" }, { label: "الأرشيف" }]}
            />
          </div>

          {/* Filters & stats */}
          <div className="container mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-4 shadow-[var(--shadow-sm)] sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <label className="sr-only" htmlFor="archive-search">
                    البحث في الأرشيف
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 shadow-[var(--shadow-xs)] focus-within:ring-2 focus-within:ring-[var(--ring)]">
                    <Search className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                    <input
                      id="archive-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="ابحث بالاسم أو الملاحظة…"
                      className="w-full bg-transparent text-[var(--fg)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                    />
                    {!!debouncedQuery && (
                      <button
                        onClick={() => setQuery("")}
                        className="rounded-full p-1 text-[var(--muted-foreground)] transition hover:bg-[var(--muted)] hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        aria-label="مسح البحث"
                        type="button"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs sm:text-sm shadow-[var(--shadow-xs)]">
                    <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                    <label htmlFor="type-filter" className="sr-only">
                      نوع الملف
                    </label>
                    <select
                      id="type-filter"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bg-transparent text-[var(--fg)] focus:outline-none"
                    >
                      <option value="ALL">الكل</option>
                      {Object.keys(countsByType).map((t) => (
                        <option key={t} value={t}>
                          {getLabel(t)} ({countsByType[t]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs sm:text-sm shadow-[var(--shadow-xs)]">
                    <ArrowUpDown className="h-4 w-4 text-[var(--muted-foreground)]" aria-hidden="true" />
                    <label htmlFor="sort-filter" className="sr-only">
                      ترتيب الملفات
                    </label>
                    <select
                      id="sort-filter"
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value)}
                      className="bg-transparent text-[var(--fg)] focus:outline-none"
                    >
                      <option value="date_desc">الأحدث أولًا</option>
                      <option value="date_asc">الأقدم أولًا</option>
                      <option value="name_asc">الاسم (تصاعدي)</option>
                      <option value="name_desc">الاسم (تنازلي)</option>
                    </select>
                  </div>

                  <div className="inline-flex gap-2 rounded-xl bg-[var(--bg)] px-2 py-1.5 shadow-[var(--shadow-xs)]">
                    <button
                      type="button"
                      onClick={openAll}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs sm:text-sm transition hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
                      title="فتح كل المجلدات"
                    >
                      <Layers3 className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">فتح الكل</span>
                    </button>

                    <button
                      type="button"
                      onClick={closeAll}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs sm:text-sm transition hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
                      title="غلق كل المجلدات"
                    >
                      <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                      <span className="hidden sm:inline">غلق الكل</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {statsChips.map((chip, idx) => (
                  <div
                    key={`${chip.label}-${idx}`}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 px-3 py-2 text-sm shadow-[var(--shadow-xs)]"
                  >
                    <span className="text-[var(--muted-foreground)]">{chip.label}</span>
                    <span className="font-semibold text-[var(--fg)]">{chip.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Content + preview/editor layout */}
      <div className="container mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(320px,380px)_1fr] xl:grid-cols-[minmax(360px,420px)_1fr]">
          {/* قائمة الملفات */}
          <aside className="order-1 flex flex-col gap-3 lg:order-none lg:sticky lg:top-[120px]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-[var(--muted-foreground)]">قائمة الوثائق</p>
                  <h3 className="text-base font-semibold">المجلدات وملفاتها</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fetchFiles(true)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--muted-foreground)] transition hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                    aria-label="تحديث القائمة"
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--muted-foreground)] transition hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                    aria-label="رفع ملف جديد"
                  >
                    <UploadCloud className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-4 pb-4 pt-3 sm:px-5">
                {loading && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-28 rounded-xl bg-[var(--muted)]/60 shadow-[var(--shadow-xs)] animate-pulse"
                      />
                    ))}
                  </div>
                )}

                {!loading && filtered.length === 0 && (
                  <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-md)]">
                    <FolderKanban className="mb-3 h-10 w-10 text-[var(--muted-foreground)]" aria-hidden="true" />
                    <p className="font-semibold text-[var(--fg)]">لا توجد نتائج مطابقة</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      جرّب تعديل البحث أو فلاتر النوع/الترتيب.
                    </p>
                  </div>
                )}

                {!loading && Object.keys(grouped).length > 0 && (
                  <div className="space-y-4">
                    {Object.entries(grouped).map(([type, files]) => (
                      <section
                        key={type}
                        className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-sm)]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFolder(type)}
                          aria-expanded={!!openFolders[type]}
                          className="flex w-full items-center gap-2 px-4 py-3 text-right text-[var(--fg)] transition hover:bg-[var(--muted)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                        >
                          {openFolders[type] ? (
                            <FolderOpenDot className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                          ) : (
                            <FolderKanban className="h-5 w-5 text-[var(--muted-foreground)]" aria-hidden="true" />
                          )}

                          <span className="font-extrabold">{getLabel(type)}</span>

                          <span className="ml-2 rounded-full bg-[var(--muted)]/60 px-2 py-0.5 text-xs text-[var(--muted-foreground)]">
                            {files.length}
                          </span>

                          <span className="ms-auto text-[var(--muted-foreground)]">
                            {openFolders[type] ? (
                              <ChevronsDown className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
                            )}
                          </span>
                        </button>

                        {openFolders[type] && (
                          <div className="pb-4 pl-4 pr-4 sm:pb-5 sm:pl-6 sm:pr-6">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {files.map((file) => (
                                <div key={file.id} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)]/60 p-3 shadow-[var(--shadow-xs)] transition hover:border-[var(--ring)] hover:shadow-[var(--shadow-sm)]">
                                  <ArchiveCard file={file} onPreview={handleCardPreview} />

                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleCardPreview(file)}
                                      className={`flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs sm:text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
                                        activeFile?.id === file.id
                                          ? "bg-[var(--muted)] ring-1 ring-[var(--ring)]"
                                          : "bg-[var(--bg)] hover:shadow-[var(--shadow-sm)]"
                                      }`}
                                    >
                                      <Eye className="h-4 w-4" aria-hidden="true" />
                                      <span>عرض التفاصيل</span>
                                    </button>

                                    {activeFile?.id === file.id && (
                                      <span className="rounded-lg bg-[var(--muted)] px-2 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">
                                        الملف النشط
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* منطقة المعاينة / المحرر */}
          <section
            ref={previewRef}
            className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lg)]"
          >
            {!activeFile ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                <img
                  src={ArchiveSection}
                  alt="ملف الأرشيف"
                  className="h-12 w-12 text-[var(--muted-foreground)]"
                />
                <p className="text-lg font-semibold text-[var(--fg)]">
                  اختر ملفًا من الأرشيف لعرضه أو تحريره هنا
                </p>
                <p className="max-w-xl text-sm text-[var(--muted-foreground)]">
                  اضغط على زر <span className="font-semibold">"عرض التفاصيل"</span> أسفل أي ملف لفتحه.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--bg)]/70 px-4 py-4 sm:px-6">
                  <div className="flex flex-wrap items-start gap-3 sm:items-center">
                    <div className="flex items-center gap-2">
                      {PreviewIcon && (
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-xs)]">
                          <PreviewIcon className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-[var(--muted-foreground)]">ملف مختار من الأرشيف</p>
                        <h3 className="truncate text-base font-bold text-[var(--fg)] sm:text-lg">
                          {activeFile.title ||
                            activeFile.original_name ||
                            activeFile.file_name ||
                            "ملف بدون عنوان"}
                        </h3>
                      </div>
                    </div>

                    <div className="ms-auto flex items-center gap-2 text-xs text-[var(--muted-foreground)] sm:text-sm">
                      <span className="rounded-full bg-[var(--muted)] px-2 py-1">
                        {getLabel(activeFile.model_type)}
                      </span>
                      {activeFile.created_at && <span>{new Date(activeFile.created_at).toLocaleDateString()}</span>}
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
                            : "border border-[var(--border)] bg-[var(--bg)] hover:shadow-[var(--shadow-sm)]"
                        }`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                        <span>معاينة</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setViewerMode("edit")}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)] ${
                        currentMode === "edit"
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "border border-[var(--border)] bg-[var(--bg)] hover:shadow-[var(--shadow-sm)]"
                      }`}
                    >
                      <FilePenLine className="h-4 w-4" aria-hidden="true" />
                      <span>تحرير النص</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveFile(null);
                        setViewerMode("auto");
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs sm:text-sm transition hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                      <span>إغلاق</span>
                    </button>
                  </div>
                </div>

                <div className="min-h-[260px] flex-1 overflow-auto bg-[var(--card)]">
                  <Suspense
                    fallback={
                      <div className="flex h-40 items-center justify-center text-sm text-[var(--muted-foreground)]">
                        جاري تحميل العارض...
                      </div>
                    }
                  >
                    {currentMode === "preview" && isPdfFile(activeFile) && fileUrlForPdf ? (
                      <PDFViewer fileUrl={fileUrlForPdf} />
                    ) : (
                      <DocumentEditor initialContent={buildEditorContent(activeFile)} />
                    )}
                  </Suspense>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
