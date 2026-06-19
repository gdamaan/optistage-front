import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo_test_nbg.png';

export default function Header({ user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Propulse vers la page des offres avec le terme de recherche
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/offers?title=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        } else {
            navigate('/offers');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 gap-4">

                    {/* Logo - Zone mise à jour avec une taille plus grande */}
                    <Link to="/" className="shrink-0 flex items-center gap-3 cursor-pointer">
                        {/* Augmentation de w-10 h-10 à w-14 h-14 */}
                        <img src={logo} alt="Logo OptiStage" className="w-14 h-14 object-contain drop-shadow-sm" />
                        <span className="font-bold text-2xl tracking-tight text-brand-900 hidden sm:block">OptiStage</span>
                    </Link>

                    {/* Barre de recherche */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative group">
                        <input
                            type="text"
                            placeholder="Rechercher un stage..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-5 pr-12 py-2.5 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-accent-500 focus:ring-2 focus:ring-accent-400 outline-none transition-all text-sm shadow-inner"
                        />
                        <button type="submit" className="absolute right-1 top-1 bottom-1 bg-accent-500 text-white w-10 rounded-full hover:bg-accent-600 transition-colors flex items-center justify-center shadow-sm">
                            <i className="fa-solid fa-magnifying-glass text-xs"></i>
                        </button>
                    </form>

                    {/* Navigation Centrale */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        <Link to="/offers" className="text-gray-600 hover:text-brand-900 font-bold transition text-sm">
                            Offres de stage
                        </Link>

                        {/* Modules Étudiant */}
                        {user?.role === 'Étudiant' && (
                            <Link to="/student-dashboard" className="text-brand-600 hover:text-brand-900 font-bold transition text-sm">
                                Mon Espace
                            </Link>
                        )}

                        {/* Modules Entreprise/Tuteur */}
                        {user?.role === 'Entreprise' && (
                            <>
                                <Link to="/tutor-dashboard" className="text-brand-600 hover:text-brand-900 font-bold transition text-sm">Mes Offres</Link>
                                <Link to="/applications" className="text-brand-600 hover:text-brand-900 font-bold transition text-sm">Candidats</Link>
                                <Link to="/evaluations" className="text-brand-600 hover:text-brand-900 font-bold transition text-sm">Évaluations</Link>
                            </>
                        )}

                        {/* Modules Professeur */}
                        {user?.role === 'Professeur' && (
                            <Link to="/teacher-dashboard" className="text-brand-600 hover:text-brand-900 font-bold transition text-sm">
                                Console Professeur
                            </Link>
                        )}
                    </nav>

                    {/* Zone de Session */}
                    <div className="flex items-center gap-4 shrink-0">
                        {!user ? (
                            <>
                                <Link to="/login" className="hidden md:block text-brand-900 font-semibold hover:text-brand-600 transition text-sm">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-brand-900 hover:bg-brand-600 text-white px-5 py-2.5 rounded-full font-semibold shadow-md transition text-sm">
                                    S'inscrire
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                {/* Bouton Déclencheur du Menu */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-2xl border border-gray-200 transition-all shadow-sm"
                                >
                                    <div className="w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {/* Liste Déroulante */}
                                {isMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>

                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 overflow-hidden ring-1 ring-black ring-opacity-5">

                                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                                <p className="text-xs font-black text-gray-800 truncate">{user.firstname}</p>
                                                <p className="text-[10px] font-bold text-accent-500 uppercase tracking-widest">{user.role}</p>
                                            </div>

                                            <Link
                                                to="/profile"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-900 transition font-medium"
                                            >
                                                <i className="fa-solid fa-user-gear w-6 text-gray-400"></i>
                                                Mon Profil
                                            </Link>

                                            <div className="my-1 border-t border-gray-100"></div>

                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    onLogout();
                                                }}
                                                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold transition"
                                            >
                                                <i className="fa-solid fa-power-off w-6"></i>
                                                Déconnexion
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}