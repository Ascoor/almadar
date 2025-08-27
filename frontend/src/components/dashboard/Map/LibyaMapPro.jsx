import React, { useEffect, useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { scaleOrdinal } from 'd3-scale';
import { useThemeProvider } from '@/utils/ThemeContext';

const DEFAULT_GEO_URL = '/geo/LY_regions.geojson';
const CASES_URL = '/data/cases.libya.json';

const THEMES = {
  day:  { stroke: '#0f172a', label: '#0f172a', legendBg: 'rgba(255,255,255,.7)', legendText: '#0f172a', tooltipBg: '#0f172a', tooltipText: '#fff', border: '#1f2937' },
  night:{ stroke: '#e5e7eb', label: '#e5e7eb', legendBg: 'rgba(0,0,0,.4)',  legendText: '#e5e7eb', tooltipBg: '#111827', tooltipText: '#fff', border: '#374151' }
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

// Use soft green gradients in the day theme and a muted back‑lit palette at night
const REGION_COLORS_DAY = {
  'طرابلس': '#bbf7d0',
  'برقة': '#86efac',
  'فزّان': '#4ade80',
  'غير مصنّف': '#d1fae5'
};
const REGION_COLORS_NIGHT = {
  'طرابلس': '#14532d',
  'برقة': '#166534',
  'فزّان': '#065f46',
  'غير مصنّف': '#0f172a'
};

function pick(props, keys){ for(const k of keys){ if(props && props[k]!=null) return props[k]; } return undefined; }
function getNameEn(props){ return pick(props, ['name','NAME_1','NAME_EN']); }
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
  showLabels = true
}) {
  const { currentTheme } = useThemeProvider();
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

  useEffect(() => {
    fetch(CASES_URL).then(r => r.json()).then(setCases).catch(() => setCases({}));
  }, []);

  const onMove = (e, text) => {
    const { clientX, clientY } = e;
    setTooltip({ content: text, x: clientX + 10, y: clientY + 10 });
  };

  return (
    <div className="relative w-full h-full bg-transparent rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
      <ComposableMap projection="geoMercator" projectionConfig={{ center: [17.5, 26], scale: 2100 }} style={{ background: 'transparent' }}>
        <Geographies geography={geographyUrl}>
          {({ geographies }) => {
            const legend = new Map();
            return (
              <>
                {geographies.map((geo, idx) => {
                  const en = getNameEn(geo.properties) || `Region ${idx + 1}`;
                  const ar = toArabicName(geo.properties) || en;
                  const region = regionOfEn(en);
                  const color = colorMap[region] || fallbackScale(idx);
                  legend.set(region, colorMap[region] || color);
                  const v = cases[ar];
                  const sel = selected === ar;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={color}
                      stroke={theme.stroke}
                      strokeWidth={sel ? 1.6 : 0.9}
                      onMouseMove={(e) => onMove(e, v==null ? ar : `${ar} — ${v}`)}
                      onMouseLeave={() => setTooltip({ content: '', x: 0, y: 0 })}
                      onClick={() => setSelected(sel ? null : ar)}
                      style={{
                        default: { outline: 'none', transition: 'fill 0.3s ease' },
                        hover: { outline: 'none', filter: 'brightness(0.98)' },
                        pressed: { outline: 'none', opacity: 0.9 }
                      }}
                    />
                  );
                })}

                {showLabels && geographies.map((geo, idx) => {
                  const ar = toArabicName(geo.properties) || getNameEn(geo.properties) || `Region ${idx+1}`;
                  const [cx, cy] = geoCentroid(geo);
                  if (!isFinite(cx) || !isFinite(cy)) return null;
                  return (
                    <Marker key={`lbl-${geo.rsmKey}`} coordinates={[cx, cy]}>
                      <text textAnchor="middle" fontSize={10} style={{ pointerEvents:'none', fill: theme.label, paintOrder:'stroke', stroke:'#000', strokeWidth:0.5, opacity:0.9 }}>
                        {ar}
                      </text>
                    </Marker>
                  );
                })}

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
      </ComposableMap>

      {tooltip.content && (
        <div className="absolute text-xs px-2 py-1 rounded pointer-events-none shadow" style={{ left: tooltip.x, top: tooltip.y, background: theme.tooltipBg, color: theme.tooltipText, border: `1px solid ${theme.border}`, whiteSpace: 'nowrap' }}>
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
