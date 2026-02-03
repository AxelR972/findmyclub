import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Composant pour centrer la carte sur la position de l'utilisateur
function UserPosition({ userPosition }) {
  const map = useMap();

  useEffect(() => {
    if (userPosition) {
      map.setView([userPosition.lat, userPosition.lng], 14);
    }
  }, [userPosition, map]);

  return null; 
}

export default function MapView({ clubs = [], userPosition }) {
  return (
    <MapContainer
      center={[45.75, 4.85]}
      zoom={12}
      className="w-full h-full flex-grow-1 fixed"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {userPosition && <UserPosition userPosition={userPosition} />}

      {Array.isArray(clubs) && clubs.map((club) => (
        <Marker key={club.id} position={[club.lat, club.lng]} >
          <Popup>
            <strong>{club.name}</strong>
            <br />
            Emplacement en attente
          </Popup>
        </Marker>
      ))}

    </MapContainer>
  )
}