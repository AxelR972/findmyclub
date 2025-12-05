import { Search } from "lucide-react";
import MapView from "../components/MapView";
import ClubCard from "../components/ClubCard";
import { useState } from "react";
import AuthModal from "../User/AuthModal";
import { useGeolocation } from "../hooks/useGeolocation";


function Home() {
    const dummyClubs = [
        { id: 1, name: "Club de Padel Central", lat: 45.75, lng: 4.85, distance: 0.5 },
        { id: 2, name: "Padel Sports Club", lat: 45.76, lng: 4.83, distance: 1.2 },
        { id: 3, name: "Padel Elite Paris", lat: 45.74, lng: 4.87, distance: 2.1 },
    ];

    const { position, startWatching, loading, error } = useGeolocation();

    const [showAuthModal, setShowAuthModal] = useState(false); // État pour contrôler l'affichage du modal d'authentification

    return (
        <div className="w-auto h-screen flex flex-col pb-[400px] md:pb-4">

            {/* Header avec titre et bouton */}
            <div className=" bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-8 shadow-md -m-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">FindMyClub</h1>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
                        className="pl-10 bg-white border-none shadow-sm w-full p-2 rounded-lg"
                    />
                    <button
                        onClick={startWatching}
                        disabled={loading}
                        aria-busy={loading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    {error && (
                        <p className="absolute top-full left-0 mt-2 text-xs text-red-600">{error}</p>
                    )}

                </div>
            </div>

            {/* Carte */}
            <div className="w-full flex-1 rounded-lg overflow-hidden shadow-md">
                <MapView clubs={dummyClubs} userPosition={position} />
            </div>


            {/* Section clubs - Mobile: affichage en bas, Tablette+: sidebar */}
            <div className="md:fixed md:left-0 md:top-[4.5rem] md:h-screen md:w-80 md:bg-white md:shadow-lg md:p-6 md:overflow-y-auto
                                                    fixed bottom-0 left-0 w-full h-[340px] bg-slate-100 shadow-lg p-6 overflow-y-auto rounded-t-3xl md:rounded-none">
                {/* Barre de recherche - visible uniquement sur tablette et desktop */}
                                <div className="relative mb-4 hidden md:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un club..."
                                        className="pl-10 pr-12 bg-gray-100 border border-gray-200 shadow-sm w-full p-2 rounded-lg"
                                    />
                                    <button
                                        onClick={startWatching}
                                        disabled={loading}
                                        aria-busy={loading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    {error && (
                                        <p className="absolute top-full left-0 mt-2 text-xs text-red-600">{error}</p>
                                    )}
                                </div>
                                {/* Petit trait gris - visible uniquement sur mobile */}
                                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>

                                <h2 className="text-lg font-semibold mb-4">Clubs à proximité</h2>

                                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible pb-4">
                                    {dummyClubs.map((club) => (
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