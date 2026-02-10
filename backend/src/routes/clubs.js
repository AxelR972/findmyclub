import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// Cache en mémoire pour stocker les clubs récemment chargés
let clubsCache = {
  data: [],
  timestamp: 0,
  ttl: 15 * 60 * 1000 // 15 minutes
};

// GET /api/clubs/padel?lat=...&lng=...
router.get("/padel", async (req, res) => { // Récupère les clubs de padel autour d'une position donnée
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat and lng are required" }); // On vérifie que les paramètres lat et lng sont présents
  }
// Requête Overpass API pour récupérer les terrains de padel autour des coordonnées données
  try {
    const query = `
      [out:json][timeout:20];
      (
        node["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
        way["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
        relation["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
      );
      out center tags;
    `;
 // Envoi de la requête à l'Overpass API avec un timeout de 30 secondes
    const controller = new AbortController(); // Permet d'annuler la requête si elle prend trop de temps
    const timeoutId = setTimeout(() => controller.abort(), 30000); // Timeout de 30 secondes
    
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
 // Gestion des erreurs de la réponse
    if (!response.ok) {
      const text = await response.text();
      // Si l'API échoue, retourner le cache expiré si disponible
      if (clubsCache.data.length > 0) {
        console.warn("Overpass API error, returning cached data");
        return res.json(clubsCache.data);
      }
      return res.status(response.status).json({ 
        message: "Erreur Overpass API", 
        details: text.substring(0, 200) 
      });
    }
// Vérification que la réponse est bien au format JSON pour éviter les erreurs de parsing
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      return res.status(400).json({ 
        message: "L'API Overpass a retourné du non-JSON", 
        details: text.substring(0, 200) 
      });
    }

    const data = await response.json();

    // Transformer les données pour avoir les bonnes propriétés
   const transformedElements = data.elements
  .map((element) => {
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;

    if (!lat || !lng) return null;

    const tags = element.tags || {}; // Les tags contiennent les informations sur le club

    return {
      id: element.id,
      name: tags.name || tags.operator || "Terrain de padel",
      lat,
      lng,

      address: [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:postcode"],
        tags["addr:city"]
      ]
        .filter(Boolean)
        .join(" ") || null,

      phone: tags.phone || null,
      website: tags.website || null,
      email: tags.email || null,
      openingHours: tags.opening_hours || null,
    };
  })
  .filter(Boolean);

    // On élimine les doublons basés sur l'ID du club ET par position (lat/lng)
    const uniqueClubs = [];
    const seenIds = new Set();
    
    for (const club of transformedElements) {
      // Vérifier si l'ID a déjà été ajouté
      if (seenIds.has(club.id)) {
        continue;
      }
      
      // Vérifier si un club existe déjà à la même position (tolérance de ~50m)
      const tolerance = 0.0005; // ~50 mètres
      const isDuplicate = uniqueClubs.some(existingClub => {
        const latDiff = Math.abs(existingClub.lat - club.lat);
        const lngDiff = Math.abs(existingClub.lng - club.lng);
        return latDiff < tolerance && lngDiff < tolerance;
      });
      
      if (!isDuplicate) {
        seenIds.add(club.id);
        uniqueClubs.push(club);
      }
    }

    res.json(uniqueClubs);
    
    // Mettre en cache les clubs
    clubsCache.data = uniqueClubs;
    clubsCache.timestamp = Date.now();
  } catch (error) {
    console.error("Error fetching clubs:", error);
    // Retourner le cache expiré en cas d'erreur (timeout, réseau, etc.)
    if (clubsCache.data.length > 0) {
      console.warn("Error fetching clubs, returning cached data:", error.message);
      return res.json(clubsCache.data);
    }
    // Si pas de cache disponible, retourner une erreur 504
    res.status(504).json({ message: "Service temporarily unavailable. Please try again later." });
  }
});

// GET /api/clubs/padel/:id
router.get("/padel/:id", (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si le cache est encore valide
    const isCacheValid = Date.now() - clubsCache.timestamp < clubsCache.ttl;
    
    if (!isCacheValid || clubsCache.data.length === 0) {
      return res.status(404).json({ message: "Club cache expired. Please refresh the club list first." });
    }
    
    // Chercher le club par ID dans le cache
    const club = clubsCache.data.find((c) => String(c.id) === String(id));
    
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.json(club);
  } catch (error) {
    console.error("Error fetching club:", error);
    res.status(500).json({ message: "Error fetching club", error: error.message });
  }
});

export default router;
