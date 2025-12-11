import Home from './Pages/home.jsx';
import ClubDetails from './Pages/ClubDetails.jsx';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import NotFound from './components/NotFound.jsx';


function App() {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur connecté
  const [error, setError] = useState(''); // État pour stocker les erreurs liées à la récupération des informations utilisateur
  useEffect(() => { 
    const fetchUser = async () => {
      const token = localStorage.getItem("token"); // Récupère le token JWT depuis le stockage local
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, { // Requête pour récupérer les informations de l'utilisateur connecté
            headers: {Authorization: `Bearer ${token}`}, 
          });
          setUser(response.data); // Met à jour l'état avec les informations de l'utilisateur
        } catch (err) {
          setError('Erreur lors de la récupération des informations utilisateur.');
          localStorage.removeItem("token");
        }
      }
    }
    fetchUser();
  }, []);


  return (
    
      <Routes>
        <Route path="/" element={<Home user={user} error={error} />} />
        <Route path="/club/:id" element={<ClubDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    
  );
}

export default App;
