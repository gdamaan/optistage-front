import { useState } from 'react';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Turnstile } from '@marsidev/react-turnstile';

export default function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // On ajoute notre conteneur pour le jeton de sécurité
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // On bloque toute tentative si le bouclier n'a pas validé l'utilisateur
        if (!captchaToken) {
            setError("L'analyse de sécurité n'est pas terminée.");
            return;
        }

        setIsLoading(true);

        try {
            // On glisse discrètement le jeton dans la requête
            const userData = await apiService.login(email, password, captchaToken);

            if (userData.isActive === false) {
                setError("Accès suspendu : Votre compte est en attente de validation.");
                setIsLoading(false);
                return;
            }

            // --- PROTOCOLE DE PERSISTANCE ---
            sessionStorage.setItem('user', JSON.stringify(userData));

            if (onLoginSuccess) {
                onLoginSuccess(userData);
            }

            // --- REDIRECTION INTELLIGENTE SELON LE RÔLE ---
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
        <div className="min-h-screen bg-brand-100 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="text-center mb-8">
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
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-500 outline-none transition text-brand-900"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-accent-500 outline-none transition text-brand-900"
                        required
                    />

                    {/* Déploiement du radar Turnstile */}
                    <div className="flex justify-center my-4">
                        <Turnstile
                            siteKey="0x4AAAAAADhc_YcW1B3blj0W"
                            onSuccess={(token) => setCaptchaToken(token)}
                            onError={() => setError("Échec de la validation de sécurité réseau.")}
                            onExpire={() => setCaptchaToken(null)}
                        />
                    </div>

                    <button
                        type="submit"
                        // Le bouton reste grisé tant que le widget n'a pas renvoyé le feu vert
                        disabled={isLoading || !captchaToken}
                        className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-4 ${isLoading || !captchaToken ? 'bg-accent-400 cursor-not-allowed' : 'bg-accent-500 hover:bg-accent-600 active:scale-95'}`}
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