import { useState } from "react";

export function useGeolocation() { // Hook personnalisé pour la géolocalisation
  const [position, setPosition] = useState(null); // État pour stocker la position de l'utilisateur
  const [error, setError] = useState(null); // État pour stocker les erreurs éventuelles
  const [loading, setLoading] = useState(false); // État pour gérer le chargement

  const startWatching = () => { // Fonction pour récupérer la position une seule fois
    if (!navigator.geolocation) { // Vérifie si la géolocalisation est supportée par le navigateur
      setError("La géolocalisation n'est pas supportée");  
      return;
    }

    setError(null);
    setLoading(true);

    // Utilise getCurrentPosition pour récupérer la position actuelle
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition({ lat: latitude, lng: longitude, accuracy });
        setLoading(false);
      },
      (err) => {
        setError("Erreur : " + err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
      }
    );
  };

  return { position, startWatching, loading, error };
}
