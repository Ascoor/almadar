import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { scaleOrdinal } from 'd3-scale';

const COUNTRY_URL = '/geo/libya-country.geojson';  // حدود الدولة (Feature واحدة)
const ADM1_URL    = '/geo/libya-adm1.geojson';     // تقسيم المحافظات/الولايات (Features متعددة)

const REGION_AR = { Tripolitania:'طرابلس', Cyrenaica:'برقة', Fezzan:'فزّان', Unknown:'غير مصنّف' };
const TRIPOLITANIA = new Set(['Tripoli','Al Jafarah','Zawiya','Nuqat al Khams','Almurgeb','Misrata','Sirt','Jabal al Gharbi','Nalut','Zliten','Ghadames']);
const CYRENAICA   = new Set(['Butnan','Derna','Al Jabal al Akhdar','Al Marj','Benghazi','Ajdabiya','Al Kufrah','Shahat','Quba']);
const FEZZAN      = new Set(['Sabha','Murzuq','Wadi al Hayaa','Wadi ash Shati','Ghat','Al Jufrah']);

const COLORS = {
  'طرابلس': '#bbf7d0',
  'برقة':   '#86efac',
  'فزّان':  '#4ade80',
  'غير مصنّف': '#d1fae5',
};

const EN_TO_AR = {
  Tripoli:'طرابلس','Al Jafarah':'الجفارة','Zawiya':'الزاوية','Nuqat al Khams':'النقاط الخمس','Almurgeb':'المرقب','Misrata':'مصراتة','Sirt':'سرت','Jabal al Gharbi':'الجبل الغربي','Nalut':'نالوت','Zliten':'زليتن','Ghadames':'غدامس',
  Butnan:'البطنان','Derna':'درنة','Al Jabal al Akhdar':'الجبل الأخضر','Al Marj':'المرج','Benghazi':'بنغازي','Ajdabiya':'أجدابيا','Al Kufrah':'الكفرة','Shahat':'شحات','Quba':'القبة',
  Sabha:'سبها','Murzuq':'مرزق','Wadi al Hayaa':'وادي الحياة','Wadi ash Shati':'وادي الشاطئ','Ghat':'غات','Al Jufrah':'الجفرة'
};

const pick = (o, ks) => ks.reduce((acc,k)=> acc ?? (o?.[k] ?? o?.[k?.toUpperCase?.()] ), undefined);
const getNameEn = (props) => pick(props, ['name','NAME_1','NAME_EN','adminName']);
const getNameAr = (props) => pick(props, ['name_ar','NAME_AR','AR_NAME','ar_name']);
const toArabic = (props) => getNameAr(props) ?? EN_TO_AR[getNameEn(props)] ?? getNameEn(props) ?? '';

const regionOfEn = (en) => {
  if (TRIPOLITANIA.has(en)) return REGION_AR.Tripolitania;
  if (CYRENAICA.has(en))    return REGION_AR.Cyrenaica;
  if (FEZZAN.has(en))       return REGION_AR.Fezzan;
  return REGION_AR.Unknown;
};

export default function LibyaMap() {
  const fallback = useMemo(() => scaleOrdinal().range(['#d1fae5','#bbf7d0','#86efac','#4ade80']), []);

  return (
    <div className="relative w-full h-full">
      <ComposableMap projection="geoMercator" projectionConfig={{ center: [17.5, 26], scale: 500 }} style={{ background: 'transparent' }}>

        {/* طبقة حدود الدولة */}
        <Geographies geography={COUNTRY_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={`ly-${geo.rsmKey}`}
                geography={geo}
                fill="transparent"
                stroke="#334155"
                strokeWidth={1.2}
                style={{ default:{outline:'none'}, hover:{outline:'none'}, pressed:{outline:'none'} }}
              />
            ))
          }
        </Geographies>

        {/* طبقة الأقاليم/المحافظات (ADM1) */}
        <Geographies geography={ADM1_URL}>
          {({ geographies }) => (
            <>
              {geographies.map((geo, i) => {
                const en = getNameEn(geo.properties) || `ADM1-${i+1}`;
                const ar = toArabic(geo.properties) || en;
                const reg = regionOfEn(en);
                const fill = COLORS[reg] || fallback(i);
                return (
                  <Geography
                    key={`adm1-${geo.rsmKey}`}
                    geography={geo}
                    fill={fill}
                    stroke="#0f172a"
                    strokeWidth={0.7}
                    style={{ default:{outline:'none'}, hover:{filter:'brightness(.98)'}, pressed:{opacity:.9} }}
                  />
                );
              })}

              {/* لابل عربية داخل كل محافظة */}
              {geographies.map((geo, i) => {
                const ar = toArabic(geo.properties) || getNameEn(geo.properties) || `ADM1-${i+1}`;
                const [cx, cy] = geoCentroid(geo);
                if(!isFinite(cx)||!isFinite(cy)) return null;
                return (
                  <Marker key={`label-${geo.rsmKey}`} coordinates={[cx, cy]}>
                    <text textAnchor="middle" fontSize={10} style={{ pointerEvents:'none', fill:'#0f172a', paintOrder:'stroke', stroke:'#fff', strokeWidth:.75 }}>
                      {ar}
                    </text>
                  </Marker>
                );
              })}
            </>
          )}
        </Geographies>

      </ComposableMap>
    </div>
  );
}
