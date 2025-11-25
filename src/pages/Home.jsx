import { Search } from "lucide-react";
import MapView from "../components/MapView";
import ClubCard from "../components/ClubCard";
import { useState } from "react";
import AuthModal from "../User/AuthModal";


function Home() {
    const dummyClubs = [
        { id: 1, name: "Club de Padel Central", lat: 45.75, lng: 4.85, distance: 0.5 }, //
        { id: 2, name: "Padel Sports Club", lat: 45.76, lng: 4.83, distance: 1.2 }
    ];



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
                </div>
            </div>

            {/* Carte */}
            <div className="w-full flex-1 rounded-lg overflow-hidden shadow-md">
                <MapView clubs={dummyClubs} />
            </div>


            {/* Section clubs - Mobile: bottom sheet, Tablet+: left sidebar */}
            <div className="md:fixed md:left-0 md:top-[4.5rem] md:h-screen md:w-80 md:bg-white md:shadow-lg md:p-6 md:overflow-y-auto
                                        fixed bottom-0 left-0 w-full h-[360px] bg-slate-100 shadow-lg p-6 overflow-y-auto">
                {/* Barre de recherche - visible uniquement sur tablette et desktop */}
                <div className="relative mb-4 hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un club..."
                        className="pl-10 bg-gray-100 border border-gray-200 shadow-sm w-full p-2 rounded-lg"
                    />
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
