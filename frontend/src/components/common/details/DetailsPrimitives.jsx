import { XCircle } from 'lucide-react';
import clsx from 'clsx';

export function DetailsShell({
  title,
  subtitle,
  icon: Icon,
  onClose,
  actions,
  children,
}) {
  return (
    <div className="relative mt-4 rounded-[1.75rem] border border-border bg-card/80 backdrop-blur shadow-[var(--shadow-lg)] overflow-hidden">
      <div className="h-1 w-full bg-[var(--gradient-primary)] opacity-70" />

      <div className="pointer-events-none absolute -top-28 -right-28 h-[28rem] w-[28rem] rounded-full opacity-0 dark:opacity-100 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--ring)_18%,transparent),transparent_72%)] blur-3xl" />

      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        {actions}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid place-items-center w-9 h-9 rounded-full border border-border bg-muted/30 hover:bg-muted/55 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="إغلاق"
            title="إغلاق"
          >
            <XCircle size={20} className="text-destructive" />
          </button>
        )}
      </div>

      <div className="p-6 md:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <div
            className="grid place-items-center w-11 h-11 rounded-2xl border border-border bg-muted/30 shadow-[var(--shadow-sm)]"
            aria-hidden="true"
          >
            {Icon ? <Icon size={22} className="text-primary" /> : null}
          </div>

          <div className="leading-tight">
            <h2 className="text-2xl font-extrabold text-fg">{title}</h2>
            {subtitle ? (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

export function InfoItem({ icon: Icon, label, value, className }) {
  return (
    <div className={clsx('flex items-start gap-2 text-fg', className)}>
      {Icon ? (
        <div className="pt-1 text-primary shrink-0">
          <Icon size={16} />
        </div>
      ) : null}
      <div>
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div
          className={clsx('font-semibold', !value && 'text-muted-foreground')}
        >
          {value || '—'}
        </div>
      </div>
    </div>
  );
}

export function SectionCard({ title, icon: Icon, children, hint, className }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-card/60 p-5 shadow-[var(--shadow-sm)] space-y-3',
        className,
      )}
    >
      {(title || hint) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-fg">
            {Icon ? <Icon size={16} className="text-primary" /> : null}
            {title ? (
              <h3 className="font-semibold text-base">{title}</h3>
            ) : null}
          </div>
          {hint ? (
            <span className="text-xs text-muted-foreground">{hint}</span>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}
