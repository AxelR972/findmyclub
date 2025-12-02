import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ClubDetails() { 
  const { id } = useParams(); // Récupère l'ID du club depuis l'URL
  const [club, setClub] = useState(null); // État pour stocker les détails du club
  const [loading, setLoading] = useState(true); // État pour indiquer le chargement des données
  const [error, setError] = useState(null); // État pour stocker les erreurs éventuelles

 useEffect(() => {
  setLoading(true); // Indique que le chargement commence
  setError(null); // Réinitialise les erreurs avant une nouvelle requête
  fetch('/data/clubs.json') // Récupère les données des clubs depuis le fichier JSON
    .then(res => res.json()) // Récupère la réponse au format JSON
    .then(data =>
      setClub(data.find(c => String(c.id) === String(id)) || null) // Trouve le club correspondant à l'ID ou null si non trouvé
    )
    .catch(() => setError("Erreur")) // En cas d'erreur, met à jour l'état error
    .finally(() => setLoading(false)); // Indique que le chargement est terminé
}, [id]);


  const distanceLabel = (d) => { // Fonction pour formater l'affichage de la distance
  if (!d && d !== 0) return "–";     // Si la distance n'est pas définie, retourne un tiret
  return typeof d === "string" ? d : `${d} km`; // Si c'est une chaîne, la retourne telle quelle, sinon ajoute " km"
};


  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white px-6 py-4 shadow">
        <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
          <h1 className="text-lg font-semibold">{club ? club.name : 'Détails du club'}</h1>
          <Link to="/" className="text-sm underline hover:opacity-80">Retour</Link>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 max-w-5xl w-full mx-auto space-y-6">
        {loading && <p className="text-sm text-gray-600">Chargement…</p>} {/* Affiche un message de chargement si les données sont en cours de récupération */}
        {error && <p className="text-sm text-red-600">{error}</p>} {/* Affiche un message d'erreur si une erreur s'est produite */}
        {!loading && !error && !club && (
          <p className="text-sm text-gray-600">Club introuvable.</p> )} {/* Affiche un message si le club n'a pas été trouvé */}

        {!loading && !error && club && ( 
          <>
            <section className="bg-white rounded-xl shadow p-5">
              <h2 className="font-medium text-lg mb-2">Informations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="text-gray-500">Adresse:</span> {club.address || '—'}</p>
                  <p><span className="text-gray-500">Téléphone:</span> {club.phone || '—'}</p>
                  <p><span className="text-gray-500">Email:</span> {club.email || '—'}</p>
                </div>
                <div>
                  <p><span className="text-gray-500">Distance:</span> {distanceLabel(club.distance)}</p>
                  <p><span className="text-gray-500">Horaires:</span> {club.openHours || '—'}</p>
                  <p><span className="text-gray-500">Terrains:</span> {club.courts ?? '—'}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow p-5">
              <h2 className="font-medium text-lg mb-2">Description</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{club.description || '—'}</p>
            </section>

            {Array.isArray(club.amenities) && club.amenities.length > 0 && (
              <section className="bg-white rounded-xl shadow p-5">
                <h2 className="font-medium text-lg mb-2">Équipements</h2>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {club.amenities.map((a, idx) => (
                    <li key={idx} className="px-3 py-1 bg-gray-100 rounded-full">{a}</li>
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
