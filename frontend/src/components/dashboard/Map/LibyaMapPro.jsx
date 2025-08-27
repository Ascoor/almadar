import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { scaleOrdinal } from 'd3-scale';

const DEFAULT_GEO_URL = '/geo/Libya_wgs84.json';

const THEMES = {
  day:  { stroke: '#0f172a', label: '#0f172a', legendBg: 'rgba(255,255,255,.7)', legendText: '#0f172a', tooltipBg: '#0f172a', tooltipText: '#fff', border: '#1f2937' },
  night:{ stroke: '#e5e7eb', label: '#e5e7eb', legendBg: 'rgba(0,0,0,.4)',  legendText: '#e5e7eb', tooltipBg: '#111827', tooltipText: '#fff', border: '#374151' },
};

const REGIONS = {
  Tripolitania: new Set([
    'Tripoli','Al Jafarah','Zawiya','Nuqat al Khams','Almurgeb','Misrata','Sirt','Jabal al Gharbi','Nalut','Zliten','Ghadames'
  ]),
  Cyrenaica: new Set([
    'Butnan','Derna','Al Jabal al Akhdar','Al Marj','Benghazi','Ajdabiya','Al Kufrah','Shahat','Quba'
  ]),
  Fezzan: new Set([
    'Sabha','Murzuq','Wadi al Hayaa','Wadi ash Shati','Ghat','Al Jufrah'
  ]),
};

const REGION_COLORS = {
  Tripolitania: '#22c55e',
  Cyrenaica: '#3b82f6',
  Fezzan: '#f59e0b',
  Unknown: '#94a3b8',
};

function resolveRegion(name) {
  if (REGIONS.Tripolitania.has(name)) return 'Tripolitania';
  if (REGIONS.Cyrenaica.has(name)) return 'Cyrenaica';
  if (REGIONS.Fezzan.has(name)) return 'Fezzan';
  return 'Unknown';
}

export default function LibyaMapPro({
  mode = 'day',
  geographyUrl = DEFAULT_GEO_URL,
  showLabels = true,
  regionColorOverrides = {},
}) {
  const theme = THEMES[mode] || THEMES.day;
  const fallbackScale = useMemo(() => scaleOrdinal().range(['#60a5fa','#34d399','#fbbf24','#f472b6','#a78bfa','#f87171']), []);

  const [tooltip, setTooltip] = useState({ content: '', x: 0, y: 0 });
  const [selected, setSelected] = useState(null);

  const getFill = (name, idx) => {
    const region = resolveRegion(name);
    return regionColorOverrides[region] || REGION_COLORS[region] || fallbackScale(idx);
  };

  const onMove = (e, text) => {
    const { clientX, clientY } = e;
    setTooltip({ content: text, x: clientX + 10, y: clientY + 10 });
  };

  return (
    <div className="relative w-full h-full bg-transparent">
      <ComposableMap projection="geoMercator" projectionConfig={{ center: [17.5, 26], scale: 2100 }} style={{ background: 'transparent' }}>
        <Geographies geography={geographyUrl}>
          {({ geographies }) => {
            const legendRegions = ['Tripolitania','Cyrenaica','Fezzan'].filter(r => geographies.some(g => resolveRegion(g.properties?.name || '') === r));
            return (
              <>
                {geographies.map((geo, idx) => {
                  const name = geo.properties?.name || `Region ${idx + 1}`;
                  const region = resolveRegion(name);
                  const sel = selected === name;
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={getFill(name, idx)}
                      stroke={theme.stroke}
                      strokeWidth={sel ? 1.6 : 0.9}
                      onMouseMove={(e) => onMove(e, `${name} — ${region}`)}
                      onMouseLeave={() => setTooltip({ content: '', x: 0, y: 0 })}
                      onClick={() => setSelected(sel ? null : name)}
                      style={{
                        default: { outline: 'none' },
                        hover:   { outline: 'none', filter: 'brightness(0.98)' },
                        pressed: { outline: 'none', opacity: 0.9 },
                      }}
                    />
                  );
                })}

                {showLabels &&
                  geographies.map((geo, idx) => {
                    const name = geo.properties?.name || `Region ${idx + 1}`;
                    const [cx, cy] = geoCentroid(geo);
                    if (!isFinite(cx) || !isFinite(cy)) return null;
                    return (
                      <Marker key={`lbl-${geo.rsmKey}`} coordinates={[cx, cy]}>
                        <text
                          textAnchor="middle"
                          fontSize={10}
                          style={{ pointerEvents: 'none', fill: theme.label, paintOrder: 'stroke', stroke: '#000', strokeWidth: 0.5, opacity: 0.9 }}
                        >
                          {name}
                        </text>
                      </Marker>
                    );
                  })}

                <foreignObject x="8" y="8" width="320" height="180">
                  <div className="rounded-md p-2 shadow text-xs" style={{ background: theme.legendBg, color: theme.legendText }}>
                    <div className="font-semibold mb-1">الأقاليم</div>
                    <div className="flex flex-wrap gap-3">
                      {legendRegions.map((r) => (
                        <div key={r} className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 rounded" style={{ background: regionColorOverrides[r] || REGION_COLORS[r] }} />
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
        <div
          className="absolute text-xs px-2 py-1 rounded pointer-events-none shadow"
          style={{ left: tooltip.x, top: tooltip.y, background: theme.tooltipBg, color: theme.tooltipText, border: `1px solid ${theme.border}`, whiteSpace: 'nowrap' }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}
