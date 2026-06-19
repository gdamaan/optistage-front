import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';
import Profile from "./pages/Profile.jsx";
import Offers from "./pages/Offres.jsx";
import TutorDashboard from "./pages/TutorDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import Validate from './pages/Validate';
import OfferApplications from "./pages/OfferApplications.jsx";
import CGU from "./pages/CGU.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsInitialLoad(false); // Chargement terminé
    }, []);

    // Empêche le rendu des routes tant que le localStorage n'est pas lu
    if (isInitialLoad) {
        return <div className="flex items-center justify-center min-h-screen">Initialisation...</div>;
    }

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login'; // Redirection propre
    };

    return (
        <Router>
            <div className="App min-h-screen flex flex-col bg-gray-50">
                {/* On passe l'utilisateur et la fonction de déconnexion au Header */}
                <Header user={user} onLogout={handleLogout} />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* On passe setUser à Login pour mettre à jour le Header immédiatement après connexion */}
                        <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/offers" element={<Offers />} />
                        <Route path="/student-dashboard" element={<StudentDashboard />} />
                        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                        <Route path="/tutor-dashboard" element={<TutorDashboard user={user} />} />
                        <Route path="/tutor/offer/:id/applications" element={<OfferApplications />} />
                        <Route path="/profile" element={<Profile user={user} onUpdateUser={setUser} />} />
                        <Route path="/validate" element={<Validate />} />
                        <Route path={"/cgu"} element={<CGU />} />
                        <Route path={"/mentions-legales"} element={<MentionsLegales />} />

                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;