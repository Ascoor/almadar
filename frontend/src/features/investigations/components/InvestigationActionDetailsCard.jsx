import {
  XCircle,
  Calendar,
  ShieldCheck,
  UserCheck,
  FileText,
  ClipboardList,
} from "lucide-react";

function getStatusMeta(status) {
  const s = String(status || "").toLowerCase();

  if (s === "pending") {
    return { label: "معلّق", dot: "bg-warning", tone: "text-warning border-warning/40 bg-warning/10" };
  }

  if (s === "in_review") {
    return { label: "قيد المراجعة", dot: "bg-secondary", tone: "text-secondary border-secondary/40 bg-secondary/10" };
  }

  if (s === "done") {
    return { label: "منجز", dot: "bg-success", tone: "text-success border-success/40 bg-success/10" };
  }

  if (s === "cancelled" || s === "canceled") {
    return { label: "ملغي", dot: "bg-destructive", tone: "text-destructive border-destructive/40 bg-destructive/10" };
  }

  
  return { label: "—", dot: "bg-muted-foreground", tone: "text-muted-foreground border-border bg-bg/70" };
}

export default function InvestigationActionDetailsCard({ selected, onClose }) {
  if (!selected) return null;
  return (
    <section className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
      {/* Background: token-driven gradient + soft blobs */}
      
      <button
  type="button"
  aria-label="إغلاق"
  className="absolute top-3 start-3 inline-flex items-center justify-center rounded-2xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof onClose === "function") {
      onClose();
      return;
    }
    
    // fallback لو onClose غير موجود
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/"; // عدّلها لمسار مناسب عندك
  }}
>
  <XCircle className="size-5" />
</button>
  <div className="pointer-events-none absolute inset-0 bg-gradient-subtle opacity-60" />
  <div className="pointer-events-none absolute -top-28 -end-28 size-72 rounded-full bg-primary/15 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-28 -start-28 size-72 rounded-full bg-accent/20 blur-3xl" />

  {/* Close */}

 
      <div className="relative p-6 md:p-10">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-start gap-3">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-muted shadow-inner">
            <ClipboardList className="size-6 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              تفاصيل الإجراء
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              ملخص سريع ثم تفاصيل المتطلبات والنتائج
            </p>
          </div>

          <div className="ms-auto hidden sm:block">
            <StatusPill value={selected.status} />
          </div>
        </header>

        {/* Summary grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            icon={<Calendar className="size-4" />}
            label="تاريخ الإجراء"
            value={selected.action_date}
          />

          <InfoItem
            icon={<FileText className="size-4" />}
            label="نوع الإجراء"
            value={
              selected.action_type?.action_name ||
              selected.action_type_name ||
              "—"
            }
          />
<InfoItem
  icon={<ShieldCheck className="size-4" />}
  label="الحالة"
  value={getStatusMeta(selected.status).label}
/>


          <InfoItem
            icon={<UserCheck className="size-4" />}
            label="المسؤول"
            value={selected.assigned_to?.name || selected.created_by?.name || "—"}
          />

          {/* Mobile status */}
          <div className="sm:hidden">
            <div className="rounded-2xl border border-border bg-bg/60 p-4">
              <div className="mb-2 text-xs text-muted-foreground">الحالة</div>
              <StatusPill value={selected.status} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SectionCard
            title="المتطلبات"
            subtitle="ما الذي يلزم لتنفيذ الإجراء"
            icon={<FileText className="size-4" />}
          >
            {selected.requirements || "—"}
          </SectionCard>

          <SectionCard
            title="النتائج"
            subtitle="ماذا تم الوصول إليه بعد الإجراء"
            icon={<ShieldCheck className="size-4" />}
          >
            {selected.results || "—"}
          </SectionCard>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon, label, value }) {
  const empty = value === null || value === undefined || value === "";
  const shown = empty ? "—" : value;

  return (
    <div className="group relative rounded-2xl border border-border bg-bg/60 p-4 shadow-sm transition hover:bg-muted/40">
      {/* Accent line */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-border opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start gap-3">
        <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted shadow-inner text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs text-muted-foreground">{label}</div>
          <div
            className={[
              "truncate font-semibold",
              empty ? "text-muted-foreground" : "text-foreground",
            ].join(" ")}
            title={String(shown)}
          >
            {shown}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, icon, children }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-inner">
      <div className="pointer-events-none absolute inset-0 bg-gradient-subtle opacity-30" />

      <header className="relative mb-3 flex items-start gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-muted shadow-inner text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </header>

      <div className="relative">
        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {children}
        </p>
      </div>
    </section>
  );
}
function StatusPill({ value }) {
  const meta = getStatusMeta(value);

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm ${meta.tone}`}>
      <span className={`size-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

