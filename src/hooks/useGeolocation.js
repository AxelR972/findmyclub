import { useState, useEffect, useRef } from "react";

export function useGeolocation() { // Hook personnalisé pour la géolocalisation
  const [position, setPosition] = useState(null); // État pour stocker la position de l'utilisateur
  const [error, setError] = useState(null); // État pour stocker les erreurs éventuelles

  const watchId = useRef(null); // useRef pour stocker l'ID du watchPosition afin de pouvoir l'arrêter plus tard

  const startWatching = () => { // Fonction pour démarrer la surveillance de la position
    if (!navigator.geolocation) { // Vérifie si la géolocalisation est supportée par le navigateur
      setError("La géolocalisation n’est pas supportée");  
      return;
    }

    if (watchId.current !== null) { 
      navigator.geolocation.clearWatch(watchId.current); // Si une surveillance est déjà en cours, l'arrêter avant d'en démarrer une nouvelle
    }

    setError(null);

    watchId.current = navigator.geolocation.watchPosition( // Démarre la surveillance de la position
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setPosition({ lat: latitude, lng: longitude, accuracy });
      },
      (err) => {
        setError("Erreur : " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 20000,
      }
    );
  };

  // Nettoyage automatique : arrête le watch si le composant se démonte
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return { position, startWatching, error };
}
