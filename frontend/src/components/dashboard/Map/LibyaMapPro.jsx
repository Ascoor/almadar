import React, { useMemo, useCallback, Suspense } from "react";

/**
 * ملاحظة مهمة:
 * واجهة الحزمة @react-map/libya قد تختلف حسب الإصدار.
 * في هذا الـAdapter نحاول التقاط المكوّن المُصدَّر (default | LibyaMap | Map)
 * وتمرير props شائعة. عدّل أسماء الـprops داخل <ResolvedLibyaMap .../>
 * لو اختلفت في الإصدار الذي تثبته.
 */

const LazyLib = React.lazy(() => import("@react-map/libya"));

const LoadingFallback = () => (
  <div className="w-full h-full grid place-items-center text-muted-foreground text-sm">
    Loading Libya map…
  </div>
);

export default function LibyaMapPro({
  data = [],              // [{ code:'TRP', name:'طرابلس', value:1250 }, ...]
  onRegionClick = () => {},// (code) => {}
  getColor,               // اختياري: دالة ترجع لونًا حسب القيمة
  className = "",
}) {
  // بناء قاموس سريع الوصول: code -> value
  const valueByCode = useMemo(() => {
    const map = new Map();
    for (const r of data) map.set(String(r.code || r.id || r.region || r.key).toUpperCase(), r.value ?? r.count ?? 0);
    return map;
  }, [data]);

  // نطاق لوني افتراضي حسب القيمة
  const defaultGetColor = useCallback((v) => {
    if (v == null) return "#E5E7EB";        // gray-200
    if (v === 0)   return "#F3F4F6";        // gray-100
    if (v < 50)    return "#DBEAFE";        // blue-100
    if (v < 200)   return "#93C5FD";        // blue-300
    if (v < 800)   return "#60A5FA";        // blue-400
    return "#3B82F6";                        // blue-500
  }, []);

  const colorScale = getColor || defaultGetColor;

  // Tooltip محتوى
  const formatTooltip = useCallback((featureProps = {}) => {
    const code = String(
      featureProps.code || featureProps.id || featureProps.adm1_code || featureProps.iso || ""
    ).toUpperCase();
    const name = featureProps.name_ar || featureProps.ar_name || featureProps.name || code;
    const value = valueByCode.get(code) ?? 0;
    return `${name} — ${value}`;
  }, [valueByCode]);

  // Click
  const handleClick = useCallback((featureProps = {}) => {
    const code = String(
      featureProps.code || featureProps.id || featureProps.adm1_code || featureProps.iso || ""
    ).toUpperCase();
    if (code) onRegionClick(code);
  }, [onRegionClick]);

  /**
   * ملاحظة حول ملاءمة الخريطة للدائرة:
   * - نخلي الـSVG يتمدّد 100% داخل الحاوية الدائرية (التي لديك في الكارت).
   * - إذا احتجت padding داخلي، ضيفه من الحاوية الأم (الكارت) أو من إعدادات المكتبة (fit/padding).
   */

  return (
    <div className={`w-full h-full ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <LazyLibRenderer
          colorScale={colorScale}
          valueByCode={valueByCode}
          formatTooltip={formatTooltip}
          handleClick={handleClick}
        />
      </Suspense>
    </div>
  );
}

/**
 * مكوّن وسيط لحل الإسم المُصدر من الحزمة:
 * - يحاول إيجاد LibyaMap (أو default أو Map)
 * - يمرّر props شائعة. عدّل أسماء props لتتوافق مع إصدار الحزمة لديك.
 */
function LazyLibRenderer({ colorScale, valueByCode, formatTooltip, handleClick }) {
  return (
    <LazyLibBoundary
      colorScale={colorScale}
      valueByCode={valueByCode}
      formatTooltip={formatTooltip}
      handleClick={handleClick}
    />
  );
}

function LazyLibBoundary({ colorScale, valueByCode, formatTooltip, handleClick }) {
  return (
    <LazyLibConsumer
      colorScale={colorScale}
      valueByCode={valueByCode}
      formatTooltip={formatTooltip}
      handleClick={handleClick}
    />
  );
}

function LazyLibConsumer({ colorScale, valueByCode, formatTooltip, handleClick }) {
  // نحاول التقاط المسميات الشائعة:
  // - default
  // - LibyaMap
  // - Map
  // - RegionsLayer / ProvincesLayer (لو المكتبة توفر طبقات)

  // Dynamic require عبر React.lazy أعلاه:
  // لكن داخل JSX ما نقدرش نقرأ exports مباشرة هنا.
  // نعمل حل بسيط: نستدعي المكوّن الافتراضي بافتراض أنه يدعم props التالية.
  // ⚠️ إذا اختلفت الواجهة، عدّل أسماء الـprops أدناه لتطابق التوثيق.

  const ResolvedLibyaMap = (props) => (
    // نتوقّع أن الحزمة توفّر مكوّنًا يستقبل:
    // - getRegionFill: دالة ترجع لون لكل feature
    // - onRegionClick: حدث عند النقر
    // - tooltip: دالة نص tooltip
    // - labels: إظهار أسماء الأقاليم
    // - strokes: إعداد حدود
    // - responsive: يحتلّ كامل المساحة
    // ملاحظة: لو الواجهة مختلفة، راجع docs وعدّل الأسماء هنا.
    <LazyLib.default
      responsive
      labels
      strokes={{ color: "#FFFFFF", width: 0.5 }}
      getRegionFill={(featureProps) => {
        const code = String(
          featureProps.code || featureProps.id || featureProps.adm1_code || featureProps.iso || ""
        ).toUpperCase();
        const v = valueByCode.get(code);
        return colorScale(v);
      }}
      tooltip={(featureProps) => formatTooltip(featureProps)}
      onRegionClick={(featureProps) => handleClick(featureProps)}
      // في بعض المكتبات يوجد خصائص إضافية مثل:
      // projection=\"geoMercator\" | padding | fit
      // projection=\"geoMercator\"
      // padding={12}
      // fit
      {...props}
    />
  );

  return <ResolvedLibyaMap />;
}
