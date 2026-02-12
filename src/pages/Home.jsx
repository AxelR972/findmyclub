import { Search } from "lucide-react";
import MapView from "../components/MapView";
import ClubCard from "../components/ClubCard";
import { useState } from "react";
import AuthModal from "../User/AuthModal";
import { useGeolocation } from "../hooks/useGeolocation";
import { useEffect } from "react";



function Home() {
    const [clubs, setClubs] = useState([]); // État pour stocker les clubs récupérés
    const [clubsLoading, setClubsLoading] = useState(false); // État pour indiquer le chargement des clubs
    const [clubsError, setClubsError] = useState(null); // État pour stocker les erreurs lors de la récupération des clubs

    const { position, startWatching, loading, error } = useGeolocation(); // Utilisation du hook pour la géolocalisation

    const [showAuthModal, setShowAuthModal] = useState(false); // État pour afficher ou cacher le modal d'authentification

    useEffect(() => {
        if (!position) return; // Si la position n'est pas encore disponible, on ne fait rien

        const fetchClubs = async () => {
            try {
                setClubsLoading(true);
                setClubsError(null);

                // Ajouter un timeout de 40 secondes au fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 40000);

                const res = await fetch(
                    `/api/clubs/padel?lat=${position.lat}&lng=${position.lng}`,
                    { signal: controller.signal }
                ); // Requête à l'API backend pour récupérer les clubs de padel autour de la position de l'utilisateur

                clearTimeout(timeoutId);

                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`); // Gestion des erreurs HTTP
                }

                const data = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid response: expected array"); // Vérification que la réponse est bien un tableau
                }

                setClubs(data);
            } catch (err) {
                console.error(err);
                setClubsError("Failed to load clubs");
            } finally {
                setClubsLoading(false);
            }
        };

        fetchClubs();
    }, [position]);



    return (
        <div className="w-auto h-screen flex flex-col pb-[400px] md:pb-4">

            {/* Header avec titre et bouton */}
            <div className="bg-gradient-to-r from-accent-600 to-primary-600 px-6 py-8 shadow-lg -m-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">FindMyClub</h1>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-dark-800 to-dark-700 text-accent-400 rounded-lg hover:from-dark-700 hover:to-dark-600 transition-all border border-dark-600 font-medium"
                    >
                        Se connecter/S'inscrire
                    </button>
                </div>

                {/* Barre de recherche - visible uniquement sur mobile */}
                <div className="relative mt-4 md:hidden">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un club..."
                        className="pl-10 bg-dark-700 border border-dark-600 shadow-sm w-full p-2 rounded-lg text-gray-100 placeholder-gray-500"
                    />
                    <button
                        onClick={startWatching}
                        disabled={loading}
                        aria-busy={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    {error && (
                        <p className="absolute top-full left-0 mt-2 text-xs text-red-400">{error}</p>
                    )}

                </div>
            </div>

            {/* Carte */}
            <div className="w-full flex-1 rounded-lg overflow-hidden shadow-md">
                <MapView clubs={clubs} userPosition={position} />

            </div>


            {/* Section clubs - Mobile: affichage en bas, Tablette+: sidebar */}
            <div className="md:fixed md:left-0 md:top-[4.5rem] md:h-screen md:w-80 md:bg-dark-800 md:shadow-lg md:p-6 md:overflow-y-auto md:border-r md:border-dark-700
                                                    fixed bottom-0 left-0 w-full h-[340px] bg-dark-800 shadow-lg p-6 overflow-y-auto rounded-t-3xl md:rounded-none border-t border-dark-700">
                {/* Barre de recherche - visible uniquement sur tablette et desktop */}
                <div className="relative mb-4 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Rechercher un club..."
                        className="pl-10 pr-12 bg-dark-700 border border-dark-600 shadow-sm w-full p-2 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-600"
                    />
                    <button
                        onClick={startWatching}
                        disabled={loading}
                        aria-busy={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    {error && (
                        <p className="absolute top-full left-0 mt-2 text-xs text-red-400">{error}</p>
                    )}
                </div>
                {/* Petit trait gris - visible uniquement sur mobile */}
                <div className="w-12 h-1 bg-dark-600 rounded-full mx-auto mb-4 md:hidden"></div>

                <h2 className="text-lg font-semibold mb-4 text-gray-50">Clubs à proximité</h2>

                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible pb-4">
                    {clubsLoading && <p className="text-gray-400">Loading clubs...</p>}

                    {!clubsLoading && clubs.length === 0 && (
                        <p className="text-sm text-gray-500">No clubs found nearby</p>
                    )}
                    {clubsLoading && <p className="text-gray-400">Loading clubs...</p>}
                    {clubsError && <p className="text-red-400">{clubsError}</p>}

                    {clubs.map((club) => (
                        <ClubCard key={club.id} club={club} />
                    ))}


                </div>
            </div>

            {/* Auth Modal */}
            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}

        </div>
    );
}

export default Home;