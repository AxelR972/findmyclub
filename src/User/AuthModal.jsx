import axios from 'axios';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


const AuthModal = ({ isOpen = true, onClose, onAuthSuccess }) => { //Création du modal d'authentification avec isOpen et onClose en props pour gérer son affichage
    const [isLogin, setIsLogin] = useState(true); //État pour basculer entre les vues de connexion et d'inscription
    const [formData, setFormData] = useState({ //État pour stocker les données du formulaire
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });

    const [error, setError] = useState(""); //État pour gérer les erreurs d'authentification
    const [loading, setLoading] = useState(false); //État pour gérer l'état de chargement lors de la soumission du formulaire

    const handleChange = (e) => { //Gestion des changements dans les champs du formulaire
        setFormData({ //Mise à jour des données du formulaire avec les nouvelles valeurs
            ...formData, //spred operator pour conserver les autres champs inchangés
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => { //Gestion de la soumission du formulaire
        e.preventDefault();
        setError("");

        // Validation côté client pour l'inscription
        if (!isLogin && formData.password !== formData.confirmPassword) { // Vérifie si les mots de passe correspondent
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        const endpoint = `/api/users/${isLogin ? 'login' : 'register'}`; // Utilise l'endpoint approprié selon le mode login ou register
        const payload = isLogin // Envoie les données appropriées au serveur selon le mode (login ou register)
            ? { email: formData.email, password: formData.password }
            : { username: formData.username, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword };

        try {
            setLoading(true);
            const res = await axios.post(endpoint, payload);
            localStorage.setItem("token", res.data.token);
            if (typeof onAuthSuccess === 'function') {
                onAuthSuccess(res.data); //Vérifie si onAuthSuccess est une fonction avant de l'appeler avec les données utilisateur
            }
            onClose(); // Ferme le modal après une connexion ou inscription réussie
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'authentification.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const original = document.body.style.overflow; // Préservation du style d'origine
        document.body.style.overflow = 'hidden'; // Empêche le défilement de la page lorsque le modal est ouvert
        return () => {
            document.body.style.overflow = original; // Restauration du style d'origine lors de la fermeture du modal
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null; // Ne rien retourner si le modal n'est pas ouvert

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}> {/* fond semi-transparent qui ferme le modal lorsqu'on clique dessus */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-10 bg-dark-800 rounded-2xl p-6 md:p-8 max-w-md w-full mx-4 shadow-2xl border border-dark-700"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture du modal lorsqu'on clique à l'intérieur
            >
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl font-bold transition-colors" onClick={onClose}>&times;</button> {/* Bouton de fermeture */}

                <h2 className="text-2xl font-bold mb-6 text-center text-gray-50">{isLogin ? 'Connexion' : 'Inscription'}</h2> {/* Titre dynamique si l'utilisateur est en mode connexion ou inscription */}

                <form onSubmit={handleSubmit} className="space-y-4"> {/* Formulaire d'authentification */}
                    {!isLogin && ( // Si l'utilisateur est en mode inscription, afficher le champ nom
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange} // Mise à jour des données du formulaire lors du changement
                                required
                                className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label> {/* Champ email */}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange} // Mise à jour des données du formulaire lors du changement
                            required
                            className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Mot de passe</label> {/* Champ mot de passe */}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                        />
                    </div>

                    {!isLogin && ( // Si l'utilisateur est en mode inscription, afficher le champ de confirmation du mot de passe
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-dark-600 rounded-md bg-dark-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-transparent"
                            />
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-400 bg-red-900 bg-opacity-20 p-3 rounded-md" role="alert">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        aria-busy={loading}
                        className="w-full bg-gradient-to-r from-accent-600 to-primary-600 text-white py-2 px-4 rounded-md hover:from-accent-700 hover:to-primary-700 transition-all font-medium mt-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? 'Veuillez patienter…' : (isLogin ? 'Se connecter' : "S'inscrire")}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-4">
                    {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "} {/* Texte dynamique pour basculer entre les vues Inscription et Connexion */}
                    <span onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-accent-400 hover:text-accent-300 cursor-pointer font-medium transition-colors">
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </span>
                </p>
            </div>
        </div>,
        document.body
    );
};

export default AuthModal;