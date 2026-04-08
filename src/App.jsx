import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register'; // Nous allons le créer juste après
import './App.css';

function App() {
    return (
        <Router>
            <div className="App min-h-screen bg-gray-50 flex flex-col">
                {/* Le Header reste toujours affiché en haut */}
                <Header />

                <main className="flex-grow">
                    <Routes>
                        {/* Définition des chemins (URLs) */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>

                {/* Le Footer pourra être ajouté ici plus tard */}
            </div>
        </Router>
    );
}

export default App;