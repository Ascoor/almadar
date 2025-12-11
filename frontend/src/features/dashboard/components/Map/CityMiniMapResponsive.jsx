import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Ensure marker icons load correctly when bundling with Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [32.8872, 13.1913]; // Tripoli
const REGION_COORDS = {
  TRP: { lat: 32.8872, lng: 13.1913, label: "طرابلس" },
  BEN: { lat: 32.1167, lng: 20.0667, label: "بنغازي" },
  MIS: { lat: 32.3774, lng: 15.1018, label: "مصراتة" },
  ZAW: { lat: 32.7522, lng: 12.7278, label: "الزاوية" },
  SBH: { lat: 27.0377, lng: 14.4283, label: "سبها" },
};

export default function CityMiniMapResponsive({
  lat,
  lng,
  zoom = 6,
  width = "100%",
  height = 260,
  data = [],
  onRegionClick,
  showMarker = true,
}) {
  const center = useMemo(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      return [lat, lng];
    }
    if (Array.isArray(data) && data.length > 0) {
      const firstWithCoords = data.find((item) => REGION_COORDS[item.regionCode]);
      if (firstWithCoords) {
        const coords = REGION_COORDS[firstWithCoords.regionCode];
        return [coords.lat, coords.lng];
      }
    }
    return DEFAULT_CENTER;
  }, [lat, lng, data]);

  const markers = useMemo(
    () =>
      data
        .map((item) => ({
          ...item,
          coords: REGION_COORDS[item.regionCode],
        }))
        .filter((item) => item.coords),
    [data]
  );

  return (
    <div
      style={{
        width,
        height,
        maxWidth: "100%",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {showMarker && (
          <Marker position={center}>
            <Popup>الموقع المحدد</Popup>
          </Marker>
        )}

        {markers.map((item) => (
          <CircleMarker
            key={item.regionCode}
            center={[item.coords.lat, item.coords.lng]}
            radius={Math.max(6, Math.min(18, item.count / 80))}
            pathOptions={{
              color: "var(--primary, #2563eb)",
              fillColor: "var(--primary, #2563eb)",
              fillOpacity: 0.35,
            }}
            eventHandlers={{
              click: () => onRegionClick?.(item.regionCode),
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
              <div className="space-y-1 text-right">
                <div className="font-semibold text-sm">
                  {item.name || REGION_COORDS[item.regionCode]?.label || item.regionCode}
                </div>
                {typeof item.count === "number" && (
                  <div className="text-xs text-muted-foreground">القضايا: {item.count}</div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
