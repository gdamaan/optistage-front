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
            sessionStorage.setItem('user', JSON.stringify(userData));

            if (onLoginSuccess) {
                onLoginSuccess(userData);
            }

            // --- REDIRECTION INTELLIGENTE SELON LE RÔLE ---
            // On vérifie le rôle retourné par votre UserDto (Java)
            switch(userData.role) {
                case 'Étudiant':
                    navigate('/offers');
                    break;
                case 'Professeur':
                    navigate('/teacher-dashboard');
                    break;
                case 'Entreprise':
                    navigate('/tutor-dashboard');
                    break;
                default:
                    navigate('/');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Remplacement de slate-50 par brand-100 pour la cohérence du fond
        <div className="min-h-screen bg-brand-100 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="text-center mb-8">
                    {/* Le titre passe en Gris Anthracite (brand-900) */}
                    <h2 className="text-3xl font-bold text-brand-900">OptiStage</h2>
                    <p className="text-gray-500 mt-2 text-sm">Authentification requise</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-xs font-bold text-center border border-red-200 animate-in fade-in">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Adresse email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // Focus ring passe en accent (Émeraude)
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-500 outline-none transition text-brand-900"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // Focus ring passe en accent (Émeraude)
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-500 outline-none transition text-brand-900"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        // Bouton principal en accent (Émeraude)
                        className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-4 ${isLoading ? 'bg-accent-400 cursor-not-allowed' : 'bg-accent-500 hover:bg-accent-600 active:scale-95'}`}
                    >
                        {isLoading ? "Vérification..." : "Se connecter"}
                    </button>
                </form>

                <div className="text-center mt-6 space-y-2">
                    <p className="text-xs text-gray-400">
                        Nouveau sur la plateforme ? <Link to="/register" className="text-accent-500 font-bold hover:text-accent-600 hover:underline transition-colors">Créer un compte</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}