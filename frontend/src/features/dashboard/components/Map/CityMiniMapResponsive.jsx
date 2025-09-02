import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { useLanguage } from "@/context/LanguageContext";

const geoUrl = "/geo/libya-country.geojson";
const DEFAULT_CENTER = [17.5, 26.5];
const DEFAULT_ZOOM = 1;
const CLICK_ZOOM = 5;

const DEMO = [
  { ar: "طرابلس",  en: "Tripoli",  coord: [13.1913, 32.8872], contracts: 1500, cases: 1200 },
  { ar: "بنغازي",  en: "Benghazi", coord: [20.0647, 32.1167], contracts: 1100, cases: 980  },
  { ar: "مصراتة",  en: "Misrata",  coord: [15.0906, 32.3754], contracts: 920,  cases: 860  },
  { ar: "الزاوية", en: "Zawiya",   coord: [12.7278, 32.7571], contracts: 780,  cases: 740  },
  { ar: "سبها",    en: "Sebha",    coord: [14.4333, 27.0377], contracts: 700,  cases: 620  },
  { ar: "البيضاء", en: "Al Bayda", coord: [21.7551, 32.7627], contracts: 610,  cases: 540  },
];

export default function CityMiniMapResponsive({ cities: inputCities, className = "" }) {
  const { lang } = useLanguage?.() || { lang: "ar" };

  const cities = useMemo(() => {
    const src = Array.isArray(inputCities) && inputCities.length ? inputCities : DEMO;
    return src
      .filter(c => (c.contracts ?? 0) > 0 || (c.cases ?? 0) > 0)
      .map(c => ({ ...c, name: lang === "ar" ? c.ar : c.en }));
  }, [inputCities, lang]);

  const [view, setView] = useState({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    setView({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    if (selectedCity && !cities.find(c => c.name === selectedCity.name)) setSelectedCity(null);
  }, [cities, selectedCity]);

  const handleCityClick = useCallback((city) => {
    setSelectedCity(city);
    setView({ center: city.coord, zoom: CLICK_ZOOM });
  }, []);

  const resetView = useCallback(() => {
    setSelectedCity(null);
    setView({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  }, []);

  const InfoCard = ({ city }) => {
    if (!city) return null;
    return (
      <div
        className={[
          "absolute top-4", lang === "ar" ? "right-4" : "left-4",
          "z-10 min-w-[220px] rounded-xl border border-border shadow-soft",
          "bg-card text-card-foreground px-4 py-3 backdrop-blur-sm"
        ].join(" ")}
        dir={lang === "ar" ? "rtl" : "ltr"}
        aria-live="polite"
      >
        <div className="font-extrabold text-sm sm:text-base mb-1">{city.name}</div>
        <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5">
          <div>{lang === "ar" ? "العقود" : "Contracts"}: <b className="text-foreground">{(city.contracts ?? 0).toLocaleString()}</b></div>
          <div>{lang === "ar" ? "القضايا" : "Cases"}: <b className="text-foreground">{(city.cases ?? 0).toLocaleString()}</b></div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={["absolute inset-0 rounded-2xl bg-gradient-to-b from-background to-muted", className].join(" ")}
      onMouseLeave={resetView}
    >
      <InfoCard city={selectedCity} />

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: DEFAULT_CENTER, scale: 1800 }}
        style={{ width: "100%", height: "100%" }}
        preserveAspectRatio="xMidYMid slice"
      >
      + <ZoomableGroup center={view.center} zoom={view.zoom}>   <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo, index) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={`var(--chart-${(index % 8) + 1})`}
                  stroke="var(--border)"
                  strokeWidth={0.7}
                  style={{
                    default: { outline: "none" },
                    hover:   { outline: "none", filter: "brightness(1.05)" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {cities.map(city => {
            const active = selectedCity?.name === city.name;
            return (
              <Marker
                key={city.name}
                coordinates={city.coord}
                onClick={() => handleCityClick(city)}
                style={{ cursor: "pointer" }}
              >
                <g transform="translate(-12, -24)">
                  {active && (
                    <circle cx="12" cy="10" r="12" fill="var(--primary)" fillOpacity={0.12}>
                      <animate attributeName="r" values="8;12;8" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="fill-opacity" values="0.18;0.04;0.18" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <g
                    fill="none"
                    stroke={active ? "var(--neon-title)" : "var(--primary)"}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                    <circle cx="12" cy="10" r="2.2" />
                  </g>
                </g>
                <text
                  textAnchor="middle"
                  y={-26}
                  fontFamily="var(--font-map)"
                  fontSize={active ? 13 : 12}
                  fontWeight={active ? 800 : 700}
                  fill={active ? "var(--fg)" : "var(--muted-foreground)"}
                  style={{ paintOrder: "stroke", stroke: "var(--bg)", strokeWidth: 3, vectorEffect: "non-scaling-stroke" }}
                >
                  {city.name}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
