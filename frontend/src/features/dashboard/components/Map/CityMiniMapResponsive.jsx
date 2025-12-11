import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function CityMiniMapResponsive({
  lat,
  lng,
  zoom = 11,
  height = 260,
}) {
  // لو الإحداثيات مش متوفرة، ما نعرضش الماب
  if (lat == null || lng == null) return null;

  return (
    <div
      style={{
        width: '100%',
        height,
      }}
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '0.75rem',
          overflow: 'hidden',
        }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[lat, lng]}>
          <Popup>Current location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
