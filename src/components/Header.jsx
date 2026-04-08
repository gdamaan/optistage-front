import { Link } from 'react-router-dom';
export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-lg">
                            <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-blue-900">OptiStage</span>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition">Offres de stage</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition">Entreprises</a>
                        <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition">Aide & Contact</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="hidden md:block text-blue-700 font-semibold hover:text-blue-900 transition text-sm">
                            Connexion
                        </Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-md transition text-sm">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}