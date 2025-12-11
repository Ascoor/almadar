import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  lazy,
  Suspense,
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

const SectionHeader = lazy(() => import("@/components/common/SectionHeader"));
const PDFViewer = lazy(() => import("@/components/PDFViewer"));
const DocumentEditor = lazy(() =>
  import("@/components/editor/DocumentEditor")
);

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
    acc[key] = acc[key] || [];
    acc[key].push(file);
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
    (file?.file_path ||
      file?.original_name ||
      file?.file_name ||
      "").toLowerCase();

  return type === "pdf" || path.endsWith(".pdf");
}

function buildEditorContent(file) {
  if (file?.html_content) return file.html_content;

  if (file?.extracted_text) {
    // نحول النص العادي لـ HTML بسيط
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

  // Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("date_desc"); // date_desc | date_asc | name_asc | name_desc
  const debouncedQuery = useDebounced(query, 300);

  const fetchFiles = useCallback(async (withToast = false) => {
    try {
      withToast && setRefreshing(true);
      setLoading(true);
      const res = await getArchiveFiles();
      const files = res?.data?.data || [];
      setAllFiles(files);

      const grouped = groupByType(files);
      const openInit = Object.fromEntries(
        Object.keys(grouped).map((k) => [k, true])
      );
      setOpenFolders(openInit);

      if (withToast) {
        toast.success("✅ تم تحديث الأرشيف بنجاح", { duration: 2000 });
      }
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

    // نوع الملف
    if (typeFilter !== "ALL") {
      rows = rows.filter((f) => f.model_type === typeFilter);
    }

    // البحث
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((f) => {
        const name = (f?.file_name || "").toLowerCase();
        const original = (f?.original_name || "").toLowerCase();
        const note = (f?.note || "").toLowerCase();
        return name.includes(q) || original.includes(q) || note.includes(q);
      });
    }

    // الترتيب
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
    return Object.fromEntries(
      Object.keys(byType).map((k) => [k, byType[k].length])
    );
  }, [allFiles]);

  const totalCount = allFiles.length;

  const toggleFolder = (type) => {
    setOpenFolders((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const openAll = () => {
    const all = Object.fromEntries(Object.keys(grouped).map((k) => [k, true]));
    setOpenFolders((prev) => ({ ...prev, ...all }));
  };

  const closeAll = () => {
    const all = Object.fromEntries(
      Object.keys(grouped).map((k) => [k, false])
    );
    setOpenFolders((prev) => ({ ...prev, ...all }));
  };

  const handleCardPreview = useCallback((file) => {
    setActiveFile(file);
    if (isPdfFile(file)) {
      setViewerMode("preview");
    } else {
      setViewerMode("edit");
    }
  }, []);

  const handleUploadClick = () => {
    toast.info("📂 سيتم إضافة واجهة رفع الملفات لاحقًا.");
  };

  const fileUrlForPdf = activeFile?.file_path
    ? `${API_CONFIG.baseURL}/open-pdf/${activeFile.file_path}`
    : null;

  const currentMode = (() => {
    if (viewerMode !== "auto") return viewerMode;
    return activeFile && isPdfFile(activeFile) ? "preview" : "edit";
  })();

  return (
    <div className="relative flex h-full w-full flex-col bg-[var(--bg)] text-[var(--fg)]">
      {/* Header */}
      <Suspense
        fallback={
          <div className="border-b bg-[var(--bg)]/90 px-4 py-4 text-center text-sm text-[var(--muted-foreground)]">
            تحميل العنوان...
          </div>
        }
      >
        <div className="sticky top-0 z-20 border-b bg-[var(--bg)]/90 backdrop-blur-md">
          <div className="px-4 py-4 sm:px-6">
            <SectionHeader
              listName="الأرشيف"
              icon={ArchiveSection}
              subtitle="كل الوثائق المؤرشفة، يمكنك استعراضها وتحرير محتواها في الأسفل."
              showBackButton
              align="start"
              actions={
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fetchFiles(true)}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs sm:text-sm hover:shadow-[var(--shadow-sm)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        refreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span className="hidden sm:inline">تحديث</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs sm:text-sm hover:shadow-[var(--shadow-sm)]"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span className="hidden sm:inline">رفع ملف</span>
                  </button>
                </div>
              }
              breadcrumbs={[
                { label: "لوحة التحكم", href: "#" },
                { label: "الأرشيف" },
              ]}
            />
          </div>

          {/* Filters & search */}
          <div className="px-4 pb-4 sm:px-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[var(--shadow-sm)]">
                  <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="ابحث بالاسم أو الملاحظة…"
                    className="w-full bg-transparent text-[var(--fg)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                  />
                  {!!debouncedQuery && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-[var(--muted-foreground)] hover:text-[var(--fg)]"
                      aria-label="مسح البحث"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters row */}
              <div className="flex flex-wrap gap-2">
                {/* نوع الملف */}
                <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <select
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

                {/* الترتيب */}
                <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm">
                  <ArrowUpDown className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <select
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

                {/* فتح / غلق الكل */}
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    onClick={openAll}
                    className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm hover:shadow-[var(--shadow-sm)]"
                    title="فتح كل المجلدات"
                  >
                    <Layers3 className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">فتح الكل</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="inline-flex items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs sm:text-sm hover:shadow-[var(--shadow-sm)]"
                    title="غلق كل المجلدات"
                  >
                    <ChevronsLeft className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">غلق الكل</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)]">
              إجمالي الملفات:{" "}
              <b className="text-[var(--fg)]">{totalCount}</b>
              {typeFilter !== "ALL" && (
                <>
                  {" "}
                  • المعروضة حاليًا:{" "}
                  <b className="text-[var(--fg)]">{filtered.length}</b>
                </>
              )}
            </div>
          </div>
        </div>
      </Suspense>

      {/* Content + preview/editor layout */}
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6">
        {/* قائمة الملفات */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 shadow-[var(--shadow-md)]">
          <div className="max-h-[45vh] overflow-y-auto px-3 pb-4 pt-3 sm:px-5 sm:pt-4">
            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 rounded-xl bg-[var(--muted)] animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center shadow-[var(--shadow-md)] max-w-xl mx-auto">
                <FolderKanban className="mb-3 h-10 w-10 text-[var(--muted-foreground)]" />
                <p className="font-semibold text-[var(--fg)]">
                  لا توجد نتائج مطابقة
                </p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  جرّب تعديل البحث أو فلاتر النوع/الترتيب.
                </p>
              </div>
            )}

            {/* Groups */}
            {!loading && Object.keys(grouped).length > 0 && (
              <div className="space-y-5">
                {Object.entries(grouped).map(([type, files]) => (
                  <section
                    key={type}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFolder(type)}
                      className="flex w-full items-center gap-2 px-4 py-3 text-right text-[var(--fg)] sm:px-6 sm:py-4"
                    >
                      {openFolders[type] ? (
                        <FolderOpenDot className="h-5 w-5 text-[var(--primary)]" />
                      ) : (
                        <FolderKanban className="h-5 w-5 text-[var(--muted-foreground)]" />
                      )}
                      <span className="font-extrabold">{getLabel(type)}</span>
                      <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                        ({files.length})
                      </span>
                      <span className="ms-auto text-[var(--muted-foreground)]">
                        {openFolders[type] ? (
                          <ChevronsDown className="h-4 w-4" />
                        ) : (
                          <ChevronsLeft className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {openFolders[type] && (
                      <div className="pb-4 pl-4 pr-4 sm:pb-5 sm:pl-6 sm:pr-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                          {files.map((file) => (
                            <div key={file.id} className="flex flex-col gap-2">
                              <ArchiveCard
                                file={file}
                                onPreview={handleCardPreview}
                              />
                              <button
                                type="button"
                                onClick={() => handleCardPreview(file)}
                                className={`
                                  mt-1 inline-flex items-center justify-center gap-2 rounded-xl
                                  border border-[var(--border)] bg-[var(--card)]
                                  px-3 py-1.5 text-xs sm:text-sm
                                  hover:shadow-[var(--shadow-sm)]
                                  transition
                                  ${
                                    activeFile?.id === file.id
                                      ? "ring-1 ring-[var(--ring)] bg-[var(--muted)]"
                                      : ""
                                  }
                                `}
                              >
                                <Eye className="h-4 w-4" />
                                <span>عرض في الأسفل</span>
                              </button>
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

        {/* منطقة المعاينة / المحرر أسفل الأرشيف */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-lg)] min-h-[220px] flex flex-col">
          {!activeFile ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center p-6">
              <img
                src={ArchiveSection}
                alt="ملف الأرشيف"
                className="mb-3 h-10 w-10 text-[var(--muted-foreground)]"
              />
              <p className="font-semibold text-[var(--fg)]">
                اختر ملفًا من الأرشيف لعرضه أو تحريره هنا
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                اضغط على زر{" "}
                <span className="font-semibold">"عرض في الأسفل"</span> أسفل أي
                ملف.
              </p>
            </div>
          ) : (
            <>
              {/* Header for viewer/editor */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--card)] px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    ملف مختار من الأرشيف
                  </p>
                  <h3 className="truncate text-sm font-bold text-[var(--fg)] sm:text-base">
                    {activeFile.title ||
                      activeFile.original_name ||
                      activeFile.file_name ||
                      "ملف بدون عنوان"}
                  </h3>
                </div>

                <div className="ms-auto flex items-center gap-2">
                  {isPdfFile(activeFile) && (
                    <button
                      type="button"
                      onClick={() => setViewerMode("preview")}
                      className={`
                        inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs sm:text-sm
                        border border-[var(--border)]
                        ${
                          currentMode === "preview"
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                            : "bg-[var(--card)] text-[var(--fg)] hover:shadow-[var(--shadow-sm)]"
                        }
                      `}
                    >
                      <Eye className="h-4 w-4" />
                      <span>معاينة</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewerMode("edit")}
                    className={`
                      inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs sm:text-sm
                      border border-[var(--border)]
                      ${
                        currentMode === "edit"
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "bg-[var(--card)] text-[var(--fg)] hover:shadow-[var(--shadow-sm)]"
                      }
                    `}
                  >
                    <FilePenLine className="h-4 w-4" />
                    <span>تحرير النص</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveFile(null);
                      setViewerMode("auto");
                    }}
                    className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs sm:text-sm hover:shadow-[var(--shadow-sm)]"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">إغلاق</span>
                  </button>
                </div>
              </div>

              {/* Body: PDF preview OR editor */}
              <div className="min-h-[180px] flex-1 overflow-auto">
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
                    <DocumentEditor
                      initialContent={buildEditorContent(activeFile)}
                    />
                  )}
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
