import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ user, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo - Toujours visible */}
                    <Link to="/" className="shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-blue-900">OptiStage</span>
                    </Link>

                    {/* Zone de Session */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="hidden md:block text-blue-700 font-semibold hover:text-blue-900 transition text-sm">
                                    Connexion
                                </Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-md transition text-sm">
                                    S'inscrire
                                </Link>
                            </>
                        ) : (
                            <div className="relative">
                                {/* Bouton Déclencheur du Menu */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-2xl border border-gray-200 transition-all shadow-sm"
                                >
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm shadow-md">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <span className="font-bold text-gray-700 text-sm">Menu</span>
                                    <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
                                </button>

                                {/* Liste Déroulante */}
                                {isMenuOpen && (
                                    <>
                                        {/* Overlay invisible pour fermer en cliquant ailleurs */}
                                        <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>

                                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200 overflow-hidden ring-1 ring-black ring-opacity-5">

                                            <div className="px-4 pb-2 mb-2 border-b border-gray-50">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation</p>
                                            </div>

                                            {/* Lien général accessible à tous les connectés */}
                                            <Link
                                                to="/offers"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                                            >
                                                <i className="fa-solid fa-list-ul w-6 text-gray-400"></i>
                                                Offres de stage
                                            </Link>

                                            {/* Rôle : Professeur */}
                                            {user.role === 'Professeur' && (
                                                <Link
                                                    to="/teacher-dashboard"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                                                >
                                                    <i className="fa-solid fa-chart-line w-6 text-gray-400"></i>
                                                    Tableau de bord Prof
                                                </Link>
                                            )}

                                            {/* Rôle : Entreprise */}
                                            {user.role === 'Entreprise' && (
                                                <Link
                                                    to="/tutor-dashboard"
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                                                >
                                                    <i className="fa-solid fa-briefcase w-6 text-gray-400"></i>
                                                    Gérer mes offres
                                                </Link>
                                            )}

                                            <Link
                                                to="/profile"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
                                            >
                                                <i className="fa-solid fa-user-circle w-6 text-gray-400"></i>
                                                Mon Profil
                                            </Link>

                                            <div className="my-2 border-t border-gray-100"></div>

                                            {/* Bouton de Déconnexion */}
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