import React, { useEffect, useMemo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { scaleOrdinal } from 'd3-scale';
import { useThemeProvider } from '@/utils/ThemeContext';

const DEFAULT_GEO_URL = '/geo/LY_regions.geojson';
const CASES_URL = '/data/cases.libya.json';
 const REGION_COLORS_NIGHT = {
  'طرابلس': '#60a5fa',   // أزرق فاتح
  'برقة':   '#a78bfa',   // بنفسجي فاتح
  'فزّان':  '#34d399',   // أخضر نعناعي فاتح
  'غير مصنّف': '#cbd5e1' // رمادي فاتح
};

const THEMES = {
  day:  { stroke: '#0f172a', label: '#0f172a', legendBg: 'rgba(255,255,255,.7)', legendText: '#0f172a', tooltipBg: '#0f172a', tooltipText: '#fff', border: '#1f2937' },
  night:{ stroke: '#ffffff', label: '#ffffff', legendBg: 'rgba(0,0,0,.55)', legendText: '#ffffff', tooltipBg: '#111827', tooltipText: '#fff', border: '#94a3b8' } // stroke أبيض واضح
};

const EN_TO_AR = {
  'Tripoli':'طرابلس','Al Jafarah':'الجفارة','Zawiya':'الزاوية','Nuqat al Khams':'النقاط الخمس','Almurgeb':'المرقب','Misrata':'مصراتة','Sirt':'سرت','Jabal al Gharbi':'الجبل الغربي','Nalut':'نالوت','Zliten':'زليتن','Ghadames':'غدامس',
  'Butnan':'البطنان','Derna':'درنة','Al Jabal al Akhdar':'الجبل الأخضر','Al Marj':'المرج','Benghazi':'بنغازي','Ajdabiya':'أجدابيا','Al Kufrah':'الكفرة','Shahat':'شحات','Quba':'القبة',
  'Sabha':'سبها','Murzuq':'مرزق','Wadi al Hayaa':'وادي الحياة','Wadi ash Shati':'وادي الشاطئ','Ghat':'غات','Al Jufrah':'الجفرة'
};

const TRIPOLITANIA = new Set(['Tripoli','Al Jafarah','Zawiya','Nuqat al Khams','Almurgeb','Misrata','Sirt','Jabal al Gharbi','Nalut','Zliten','Ghadames']);
const CYRENAICA   = new Set(['Butnan','Derna','Al Jabal al Akhdar','Al Marj','Benghazi','Ajdabiya','Al Kufrah','Shahat','Quba']);
const FEZZAN      = new Set(['Sabha','Murzuq','Wadi al Hayaa','Wadi ash Shati','Ghat','Al Jufrah']);

const REGION_AR = { Tripolitania:'طرابلس', Cyrenaica:'برقة', Fezzan:'فزّان', Unknown:'غير مصنّف' };

// ألوان واضحة للأقاليم (نهار/ليل)
const REGION_COLORS_DAY = { 'طرابلس': '#bbf7d0', 'برقة': '#86efac', 'فزّان': '#4ade80', 'غير مصنّف': '#d1fae5' };
 
// Helpers
function pick(props, keys){ for(const k of keys){ if(props && props[k]!=null) return props[k]; } return undefined; }
function getNameEn(props){ return pick(props, ['name','NAME_1','NAME_EN','AdminName','adminName']); }
function getNameAr(props){ return pick(props, ['name_ar','NAME_AR','AR_NAME']); }
function toArabicName(props){
  const ar = getNameAr(props);
  if (ar) return ar;
  const en = getNameEn(props);
  if (!en) return '';
  return EN_TO_AR[en] || en;
}
function regionOfEn(en){
  if (TRIPOLITANIA.has(en)) return REGION_AR.Tripolitania;
  if (CYRENAICA.has(en))   return REGION_AR.Cyrenaica;
  if (FEZZAN.has(en))      return REGION_AR.Fezzan;
  return REGION_AR.Unknown;
}

export default function LibyaMapPro({
  mode = 'auto',
  geographyUrl = DEFAULT_GEO_URL,
  showLabels = true,
  enableZoom = true
}) {
  const { currentTheme } = useThemeProvider?.() ?? { currentTheme: 'light' };
  const resolvedMode = mode === 'auto' ? (currentTheme === 'dark' ? 'night' : 'day') : mode;
  const theme = THEMES[resolvedMode] || THEMES.day;
  const colorMap = resolvedMode === 'night' ? REGION_COLORS_NIGHT : REGION_COLORS_DAY;

  const fallbackScale = useMemo(
    () =>
      scaleOrdinal().range(
        resolvedMode === 'night'
          ? ['#14532d', '#166534', '#065f46', '#047857', '#064e3b', '#022c22']
          : ['#d1fae5', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a']
      ),
    [resolvedMode]
  );

  const [cases, setCases] = useState({});
  const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
  const [selected, setSelected] = useState(null);

  // حمّل بيانات القضايا (اختياري)
  useEffect(() => {
    fetch(CASES_URL)
      .then(r => r.ok ? r.json() : {})
      .then(setCases)
      .catch(() => setCases({}));
  }, []);

  // حساب مراكز التسميات مرة واحدة
  const centroidsMap = useMemo(() => new Map(), []);

  const onMove = (e, text) => {
    const x = (e.clientX ?? 0) + 12;
    const y = (e.clientY ?? 0) + 12;
    setTooltip({ content: text, x, y });
  };

  return (
    <div className="relative w-full h-full bg-transparent rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.12)] dark:shadow-[0_0_15px_rgba(255,255,255,0.06)]">
  <ComposableMap
    projection="geoMercator"
    projectionConfig={{ center: [17.5, 26], scale: 2200 }}
    style={{ background: 'transparent', width: '100%', height: '100%' }}
  >
        {enableZoom ? (
        <ZoomableGroup
  minZoom={0.9}
  maxZoom={8}
  translateExtent={[[0, 0], [1000, 700]]}>
            <MapLayers
              geographyUrl={geographyUrl}
              theme={theme}
              colorMap={colorMap}
              fallbackScale={fallbackScale}
              selected={selected}
              setSelected={setSelected}
              onMove={onMove}
              setTooltip={setTooltip}
              showLabels={showLabels}
              centroidsMap={centroidsMap}
              cases={cases}
            />
          </ZoomableGroup>
        ) : (
          <MapLayers
            geographyUrl={geographyUrl}
            theme={theme}
            colorMap={colorMap}
            fallbackScale={fallbackScale}
            selected={selected}
            setSelected={setSelected}
            onMove={onMove}
            setTooltip={setTooltip}
            showLabels={showLabels}
            centroidsMap={centroidsMap}
            cases={cases}
          />
        )}
      </ComposableMap>

      {/* Tooltip */}
      {tooltip.content && (
        <div
          className="absolute text-[11px] px-2 py-1 rounded pointer-events-none shadow"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            background: theme.tooltipBg,
            color: theme.tooltipText,
            border: `1px solid ${theme.border}`,
            whiteSpace: 'nowrap'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

function MapLayers({
  geographyUrl,
  theme,
  colorMap,
  fallbackScale,
  selected,
  setSelected,
  onMove,
  setTooltip,
  showLabels,
  centroidsMap,
  cases
}) {
  return (
    <Geographies geography={geographyUrl}>
      {({ geographies }) => {
        const legend = new Map();

        return (
          <>
            {/* طبقة المناطق */}
            {geographies.map((geo, idx) => {
              const en = getNameEn(geo.properties) || `Region ${idx + 1}`;
              const ar = toArabicName(geo.properties) || en;
              const region = regionOfEn(en);
              const color = colorMap[region] || fallbackScale(idx);
              legend.set(region, colorMap[region] || color);

              const v = cases[ar] ?? cases[en]; // يدعم العربية/الإنجليزية
              const sel = selected === ar;

              // خَزِّن السنترودز مرّة واحدة
              if (!centroidsMap.has(geo.rsmKey)) {
                const c = geoCentroid(geo);
                centroidsMap.set(geo.rsmKey, c);
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
               
  stroke={theme.stroke}
  strokeWidth={1.2} // كان 0.9
  style={{
    default: { outline: 'none', transition: 'filter .2s ease, fill .25s ease' },
    hover:   { outline: 'none', filter: 'brightness(0.94)' },
    pressed: { outline: 'none', opacity: 0.9 }
  }}
                  onMouseMove={(e) => onMove(e, v == null ? ar : `${ar} — ${v}`)}
                  onMouseLeave={() => setTooltip({ content: '', x: 0, y: 0 })}
                  onClick={() => setSelected(sel ? null : ar)}
                />
              );
            })}

            {/* طبقة العناوين */}
            {showLabels && geographies.map((geo, idx) => {
              const ar = toArabicName(geo.properties) || getNameEn(geo.properties) || `Region ${idx+1}`;
              const [cx, cy] = centroidsMap.get(geo.rsmKey) || [];
              if (!isFinite(cx) || !isFinite(cy)) return null;

              return (
                <Marker key={`lbl-${geo.rsmKey}`} coordinates={[cx, cy]}>
                  <text
                    textAnchor="middle"
                    fontSize={10}
                    style={{
                      pointerEvents:'none',
                      fill: theme.label,
                      paintOrder:'stroke',
                      stroke:'#000',
                      strokeWidth:0.5,
                      opacity:0.9
                    }}
                  >
                    {ar}
                  </text>
                </Marker>
              );
            })}

            {/* ليدجند الأقاليم */}
            <foreignObject x="8" y="8" width="320" height="180">
              <div className="rounded-md p-2 shadow text-xs" style={{ background: theme.legendBg, color: theme.legendText }}>
                <div className="font-semibold mb-1">الأقاليم</div>
                <div className="flex flex-wrap gap-3">
                  {[...legend.entries()].map(([r, c]) => (
                    <div key={r} className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded" style={{ background:c }} />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </foreignObject>
          </>
        );
      }}
    </Geographies>
  );
}
