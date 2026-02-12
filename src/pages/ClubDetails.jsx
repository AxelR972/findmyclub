import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';

function ClubDetails() { 
  const { id } = useParams(); // Récupère l'ID du club depuis l'URL
  const { position } = useGeolocation(); // Récupère la position de l'utilisateur à l'aide du hook useGeolocation
  const [club, setClub] = useState(null); // État pour stocker les détails du club
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement des données
  const [error, setError] = useState(null); // État pour stocker les erreurs éventuelles

 useEffect(() => {
  setLoading(true);
  setError(null);

  // Si on n'a pas la position, on utilise une position par défaut (centre de France)
  const lat = position?.lat || 46.5;
  const lng = position?.lng || 2.5;

  const url = `http://localhost:5000/api/clubs/padel/${id}?lat=${lat}&lng=${lng}`;
  
  fetch(url) // Requête à l'API pour récupérer les détails du club en fonction de son ID et de la position de l'utilisateur
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`); // Si la réponse n'est pas OK, on lance une erreur
      return res.json();
    })
    .then((data) => {
      setClub(data); 
    })
    .catch((e) => {
      console.error('Error fetching club:', e);
      setError(e.message || "Erreur");
    })
    .finally(() => setLoading(false));
}, [id]);

  const distanceLabel = (d) => { // Fonction pour formater l'affichage de la distance
  if (!d && d !== 0) return "–";     // Si la distance n'est pas définie, retourne un tiret
  return typeof d === "string" ? d : `${d} km`; // Si c'est une chaîne, la retourne telle quelle, sinon ajoute " km"
};

  return (
    <div className="min-h-screen flex flex-col bg-dark-900">
      <header className="bg-gradient-to-r from-accent-600 to-primary-600 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <h1 className="text-lg font-semibold">{club ? club.name : 'Détails du club'}</h1>
          <Link to="/" className="text-sm underline hover:opacity-80 transition-opacity">Retour</Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-5xl w-full mx-auto space-y-6">
        {loading && <p className="text-sm text-gray-400">Chargement…</p>} {/* Affiche un message de chargement si les données sont en cours de récupération */}
        {error && <p className="text-sm text-red-400">{error}</p>} {/* Affiche un message d'erreur si une erreur s'est produite */}
        {!loading && !error && !club && (
          <p className="text-sm text-gray-400">Club introuvable.</p> )} {/* Affiche un message si le club n'a pas été trouvé */}

        {!loading && !error && club && ( 
          <>
            <section className="bg-dark-800 rounded-xl shadow-lg p-5 border border-dark-700">
              <h2 className="font-medium text-lg mb-2 text-gray-50">Informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-gray-300">
                  <p><span className="text-gray-400">Adresse:</span> {club.address || '—'}</p>
                  <p><span className="text-gray-400">Téléphone:</span> {club.phone || '—'}</p>
                  <p><span className="text-gray-400">Email:</span> {club.email || '—'}</p>
                </div>
                <div className="text-gray-300">
                  <p><span className="text-gray-400">Distance:</span> {distanceLabel(club.distance)}</p>
                  <p><span className="text-gray-400">Horaires:</span> {club.openingHours || '—'}</p>
                  <p><span className="text-gray-400">Terrains:</span> {club.courts ?? '—'}</p>
                </div>
              </div>
            </section>

            <section className="bg-dark-800 rounded-xl shadow-lg p-5 border border-dark-700">
              <h2 className="font-medium text-lg mb-2 text-gray-50">Description</h2>
              <p className="text-sm text-gray-300 whitespace-pre-line">{club.description || '—'}</p>
            </section>

            {Array.isArray(club.amenities) && club.amenities.length > 0 && (
              <section className="bg-dark-800 rounded-xl shadow-lg p-5 border border-dark-700">
                <h2 className="font-medium text-lg mb-2 text-gray-50">Équipements</h2>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {club.amenities.map((a, idx) => (
                    <li key={idx} className="px-3 py-1 bg-dark-700 rounded-full text-gray-300 border border-dark-600">{a}</li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ClubDetails;
