import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ clubs = [] }) {
  return (
    
    <MapContainer
      center={[45.75, 4.85]} 
      zoom={12}
      className="w-full h-full flex-grow-1 fixed"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {clubs.map((club) => (
        <Marker key={club.id} position={[club.lat, club.lng]}>
          <Popup>
            <strong>{club.name}</strong>
            <br />
            Emplacement en attente
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;