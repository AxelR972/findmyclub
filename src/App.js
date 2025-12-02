import Home from './Pages/home.jsx';
import ClubDetails from './Pages/ClubDetails.jsx';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club/:id" element={<ClubDetails />} />
      </Routes>
    
  );
}

export default App;
