import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'; // Importation du nouveau module
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
    return (
        <Router>
            {/* min-h-screen : occupe toute la hauteur de l'écran
                flex-col : aligne les éléments verticalement
            */}
            <div className="App min-h-screen flex flex-col bg-gray-50">

                {/* Le Header reste toujours affiché en haut */}
                <Header />

                {/* flex-grow : permet au contenu principal de pousser le footer vers le bas
                */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </main>


                <Footer />
            </div>
        </Router>
    );
}

export default App;