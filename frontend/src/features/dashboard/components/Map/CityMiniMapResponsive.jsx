import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  Marker,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useLanguage } from "@/context/LanguageContext";
import { topCities as DEFAULT_CITIES } from "./topCities";
import { getLocalizedNameByCode } from "./regionsMap";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const REGION_COORDS = {
  TRP: { lat: 32.8872, lng: 13.1913 },
  BEN: { lat: 32.1167, lng: 20.0647 },
  MIS: { lat: 32.3754, lng: 15.0906 },
  ZAW: { lat: 32.7571, lng: 12.7278 },
  SBH: { lat: 27.0377, lng: 14.4333 },
  BAY: { lat: 32.7627, lng: 21.7551 }
};

const DEFAULT_VIEW = { lat: 26.5, lng: 17.5, zoom: 5.2 };

function formatDimension(value, fallback = "100%") {
  if (typeof value === "number") return `${value}px`;
  if (typeof value === "string" && value.trim().length) return value;
  return fallback;
}

function Recenter({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
}

export default function CityMiniMapResponsive({
  lat = DEFAULT_VIEW.lat,
  lng = DEFAULT_VIEW.lng,
  zoom = DEFAULT_VIEW.zoom,
  width = "100%",
  height = "100%",
  cities: inputCities,
  className = "",
  showCenterMarker = true,
  onCityClick
}) {
  const { lang } = useLanguage?.() || { lang: "ar" };
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const normalizedCities = useMemo(() => {
    const source = Array.isArray(inputCities) && inputCities.length ? inputCities : DEFAULT_CITIES;

    return source
      .map((city, idx) => {
        const coordArray = city.coord;
        const inferredCoords = coordArray
          ? { lng: Number(coordArray[0]), lat: Number(coordArray[1]) }
          : REGION_COORDS[city.regionCode];
        const coords = city.lat && city.lng
          ? { lat: Number(city.lat), lng: Number(city.lng) }
          : inferredCoords;

        if (!coords) return null;

        const contracts = Number.isFinite(city.contracts) ? Number(city.contracts) : Number(city.count ?? 0);
        const cases = Number.isFinite(city.cases) ? Number(city.cases) : 0;
        const label =
          city.name ||
          (lang === "ar" ? city.ar : city.en) ||
          getLocalizedNameByCode(city.regionCode, lang) ||
          `${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`;

        return {
          key: city.regionCode || label || `city-${idx}`,
          label,
          lat: coords.lat,
          lng: coords.lng,
          contracts,
          cases
        };
      })
      .filter(Boolean);
  }, [inputCities, lang]);

  const center = useMemo(() => [Number(lat), Number(lng)], [lat, lng]);
  const maxValue = useMemo(() => {
    return normalizedCities.reduce((max, city) => Math.max(max, city.contracts + city.cases), 1);
  }, [normalizedCities]);

  if (!isClient) {
    return (
      <div
        className={["relative rounded-2xl bg-muted animate-pulse", className].join(" ")}
        style={{ width: formatDimension(width), height: formatDimension(height) }}
      />
    );
  }

  return (
    <div
      className={["relative overflow-hidden rounded-2xl bg-gradient-to-b from-background to-muted", className].join(" ")}
      style={{ width: formatDimension(width), height: formatDimension(height) }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={4}
        maxZoom={12}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Recenter center={center} zoom={zoom} />

        {showCenterMarker && (
          <Marker position={center} title={lang === "ar" ? "المركز" : "Center"}>
            <Tooltip direction="top" offset={[0, -12]} opacity={0.9} permanent>
              {lang === "ar" ? "المركز" : "Center"}
            </Tooltip>
          </Marker>
        )}

        {normalizedCities.map((city) => {
          const value = city.contracts + city.cases;
          const radius = 6 + (value / maxValue) * 10;

          return (
            <CircleMarker
              key={city.key}
              center={[city.lat, city.lng]}
              radius={radius}
              pathOptions={{
                color: "var(--primary)",
                weight: 2,
                fillColor: "var(--chart-1)",
                fillOpacity: 0.35
              }}
              eventHandlers={{
                click: () => onCityClick?.(city.regionCode || city.label, city)
              }}
            >
              <Tooltip direction="top" offset={[0, -2]} opacity={0.95} permanent>
                <div className="text-xs font-semibold text-foreground">
                  {city.label}
                  <div className="font-normal text-muted-foreground space-y-0.5 mt-0.5">
                    <div>{lang === "ar" ? "العقود" : "Contracts"}: {city.contracts.toLocaleString()}</div>
                    <div>{lang === "ar" ? "القضايا" : "Cases"}: {city.cases.toLocaleString()}</div>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
