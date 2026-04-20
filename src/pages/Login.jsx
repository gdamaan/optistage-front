import { useState } from 'react';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const userData = await apiService.login(email, password);

            if (userData.isActive === false) {
                setError("Accès suspendu : Votre compte est en attente de validation.");
                setIsLoading(false);
                return;
            }

            // --- PROTOCOLE DE PERSISTANCE ---
            // On stocke l'objet utilisateur dans le navigateur pour ne pas le perdre au rafraîchissement
            localStorage.setItem('user', JSON.stringify(userData));

            if (onLoginSuccess) {
                onLoginSuccess(userData);
            }

            // --- REDIRECTION INTELLIGENTE SELON LE RÔLE ---
            // On vérifie le rôle retourné par votre UserDto (Java)
            switch(userData.role) {
                case 'STUDENT':
                    navigate('/offers');
                    break;
                case 'TEACHER':
                    navigate('/teacher-dashboard');
                    break;
                case 'TUTOR':
                    navigate('/tutor-dashboard');
                    break;
                default:
                    navigate('/home');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-blue-900">OptiStage</h2>
                    <p className="text-gray-500 mt-2 text-sm">Authentification requise</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-xs font-bold text-center border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition text-black"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition text-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-4 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
                    >
                        {isLoading ? "Vérification..." : "Se connecter"}
                    </button>
                </form>

                <div className="text-center mt-6 space-y-2">
                    <p className="text-xs text-gray-400">
                        Nouveau sur la plateforme ? <Link to="/register" className="text-blue-600 font-bold hover:underline">Créer un compte</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}