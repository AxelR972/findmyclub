import express from "express";
import fetch from "node-fetch";
const router = express.Router();

// GET /api/clubs/padel?lat=...&lng=...
router.get("/padel", async (req, res) => { // Récupère les clubs de padel autour d'une position donnée
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: "lat and lng are required" }); // On vérifie que les paramètres lat et lng sont présents
  }
// Requête Overpass API pour récupérer les terrains de padel autour des coordonnées données
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
        way["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
        relation["sport"="padel"]["leisure"="pitch"](around:25000, ${lat}, ${lng});
      );
      out center tags;
    `;
 // Envoi de la requête à l'Overpass API
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });
 // Gestion des erreurs de la réponse
    if (!response.ok) {
      const text = await response.text();
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

    // On élimine les doublons basés sur le nom du club
    const uniqueClubs = [];
    const seenNames = new Set();
    
    for (const club of transformedElements) {
      if (!seenNames.has(club.name)) {
        seenNames.add(club.name);
        uniqueClubs.push(club);
      }
    }

    res.json(uniqueClubs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Overpass API error" });
  }
});

export default router;
