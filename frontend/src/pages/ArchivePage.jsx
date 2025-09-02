import React, { useEffect, useMemo, useState, useCallback, lazy, Suspense } from "react";
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
} from "lucide-react";
import API_CONFIG from "@/config/config";
import { ArchiveSection } from "@/assets/icons";
import ArchiveCard from "@/features/archives/components/ArchiveCard";

const SectionHeader = lazy(() => import("@/components/common/SectionHeader"));
const PDFViewer = lazy(() => import("@/components/PDFViewer"));

/* Helpers */
const LABELS = {
  Contract: "عقود",
  LegalAdvice: "مشورة أو رأي",
  Case: "قضايا",
};

function getLabel(type) {
  return LABELS[type] || type;
}

function groupByType(files = []) {
  return files.reduce((acc, file) => {
    acc[file.model_type] = acc[file.model_type] || [];
    acc[file.model_type].push(file);
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

export default function ArchivePage() {
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openFolders, setOpenFolders] = useState({});
  const [previewFile, setPreviewFile] = useState(null);

  // Filters
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("date_desc"); // date_desc | date_asc | name_asc | name_desc
  const debouncedQuery = useDebounced(query, 300);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getArchiveFiles();
        const files = res?.data?.data || [];
        setAllFiles(files);
        // افتح المجلدات اللي فيها بيانات افتراضيًا
        const grouped = groupByType(files);
        const openInit = Object.fromEntries(Object.keys(grouped).map(k => [k, true]));
        setOpenFolders(openInit);
      } catch (e) {
        toast.error("فشل تحميل الملفات");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let rows = [...allFiles];

    // نوع الملف
    if (typeFilter !== "ALL") {
      rows = rows.filter(f => f.model_type === typeFilter);
    }

    // البحث (بالاسم أو الوصف إن وُجد)
    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter(f => {
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
        case "date_asc": return aDate - bDate;
        case "date_desc": return bDate - aDate;
        case "name_desc": return bName.localeCompare(aName);
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
      Object.keys(byType).map(k => [k, byType[k].length])
    );
  }, [allFiles]);

  const totalCount = allFiles.length;

  const toggleFolder = (type) => {
    setOpenFolders(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const openAll = () => {
    const all = Object.fromEntries(Object.keys(grouped).map(k => [k, true]));
    setOpenFolders(prev => ({ ...prev, ...all }));
  };

  const closeAll = () => {
    const all = Object.fromEntries(Object.keys(grouped).map(k => [k, false]));
    setOpenFolders(prev => ({ ...prev, ...all }));
  };

  const handlePdfPreview = useCallback((file) => {
    if (!file?.file_path) {
      toast.error("المسار غير متوفر للملف");
      return;
    }
    const fileUrl = `${API_CONFIG.baseURL}/open-pdf/${file.file_path}`;
    setPreviewFile(fileUrl);
  }, []);

  const clearPreview = () => setPreviewFile(null);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Header */}
      <Suspense fallback={<div className="text-center text-sm">تحميل العنوان...</div>}>
        <div className="sticky top-0 z-20 border-b bg-[var(--bg)]/90 backdrop-blur-md">
          <div className="px-4 sm:px-6 py-5">
          <SectionHeader
  listName="الأرشيف"
  icon={ArchiveSection}
  subtitle="كل الوثائق المؤرشفة مرتبة حسب النوع والتاريخ."
  showBackButton
  align="start"
  actions={
    <div className="flex gap-2">
      <button className="rounded-xl px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)]">
        تحديث
      </button>
      <button className="rounded-xl px-3 py-1.5 border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)]">
        رفع ملف
      </button>
    </div>
  }
  breadcrumbs={[
    { label: "لوحة التحكم", href: "#" },
    { label: "الأرشيف" },
  ]}
/>
          </div>

          {/* Controls */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 shadow-[var(--shadow-sm)]">
                  <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
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
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--muted-foreground)]" />
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

                <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2">
                  <ArrowUpDown className="w-4 h-4 text-[var(--muted-foreground)]" />
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

                <div className="inline-flex gap-2">
                  <button
                    onClick={openAll}
                    className="rounded-xl px-3 py-2 border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)]"
                    title="فتح كل المجلدات"
                  >
                    <Layers3 className="inline w-4 h-4 mr-1" />
                    فتح الكل
                  </button>
                  <button
                    onClick={closeAll}
                    className="rounded-xl px-3 py-2 border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)]"
                    title="غلق كل المجلدات"
                  >
                    <ChevronsLeft className="inline w-4 h-4 mr-1" />
                    غلق الكل
                  </button>
                </div>
              </div>
            </div>

            {/* Meta */}
            <div className="mt-2 text-xs sm:text-sm text-[var(--muted-foreground)]">
              إجمالي الملفات: <b className="text-[var(--fg)]">{totalCount}</b>
            </div>
          </div>
        </div>
      </Suspense>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6 overflow-y-auto max-h-[calc(100vh-170px)]">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 shadow-[var(--shadow-md)]">
            <FolderKanban className="w-10 h-10 text-[var(--muted-foreground)] mb-3" />
            <p className="text-[var(--fg)] font-semibold">لا توجد نتائج مطابقة</p>
            <p className="text-[var(--muted-foreground)] text-sm">
              جرّب تعديل البحث أو فلاتر النوع/الترتيب.
            </p>
          </div>
        )}

        {/* Groups */}
        {!loading && Object.keys(grouped).length > 0 && (
          <div className="space-y-6">
            {Object.entries(grouped).map(([type, files]) => (
              <div
                key={type}
                className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-md)]"
              >
                <button
                  onClick={() => toggleFolder(type)}
                  className="w-full flex items-center gap-2 px-4 sm:px-6 py-4 text-[var(--fg)]"
                >
                  {openFolders[type] ? (
                    <FolderOpenDot className="w-5 h-5 text-[var(--primary)]" />
                  ) : (
                    <FolderKanban className="w-5 h-5 text-[var(--muted-foreground)]" />
                  )}
                  <span className="font-extrabold">{getLabel(type)}</span>
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                    ({files.length})
                  </span>
                  <span className="ms-auto text-[var(--muted-foreground)]">
                    {openFolders[type] ? <ChevronsDown /> : <ChevronsLeft />}
                  </span>
                </button>

                {openFolders[type] && (
                  <div className="px-4 sm:px-6 pb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {files.map((file) => (
                        <ArchiveCard
                          key={file.id}
                          file={file}
                          onPreview={handlePdfPreview}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Off-canvas PDF preview */}
      <Suspense fallback={null}>
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[520px] md:w-[640px] lg:w-[720px] transition-transform duration-300 z-30
          ${previewFile ? "translate-x-0" : "translate-x-full"}`}
          style={{
            background: "var(--bg)",
            boxShadow: "var(--shadow-lg)",
            borderLeft: "1px solid var(--border)",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--card)]">
            <h3 className="text-[var(--fg)] font-bold text-sm sm:text-base">معاينة الملف</h3>
            <button
              onClick={clearPreview}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border border-[var(--border)] bg-[var(--card)] hover:shadow-[var(--shadow-sm)]"
            >
              <X className="w-4 h-4" /> إغلاق
            </button>
          </div>
          <div className="h-[calc(100%-52px)] overflow-auto">
            {previewFile ? (
              <PDFViewer fileUrl={previewFile} />
            ) : null}
          </div>
        </div>

        {/* Overlay */}
        {previewFile && (
          <div
            className="fixed inset-0 z-20 bg-black/30"
            onClick={clearPreview}
            aria-hidden="true"
          />
        )}
      </Suspense>
    </div>
  );
}
