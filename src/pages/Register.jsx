import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        secretQuestion: '',
        secretAnswer: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Appel au service API que nous avons configuré
            await apiService.register(formData);
            alert("Inscription réussie ! Direction la page de connexion.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-brand-50 px-4 py-12">
            {/* Carte avec effet Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-brand-900">Rejoindre OptiStage</h2>
                    <p className="text-gray-500 mt-2">Créez votre compte pour commencer.</p>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="prenom" placeholder="Prénom" onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition" />
                        <input name="nom" placeholder="Nom" onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition" />
                    </div>

                    <input type="email" name="email" placeholder="Adresse email" onChange={handleChange} required
                           className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition" />

                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required
                           className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition" />

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-wider">Sécurité du compte</p>
                        <input name="secretQuestion" placeholder="Votre question secrète" onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition mb-3" />
                        <input name="secretAnswer" placeholder="Votre réponse" onChange={handleChange} required
                               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-600 outline-none transition" />
                    </div>

                    <button type="submit"
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:-translate-y-1 mt-6">
                        Créer mon compte
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Déjà inscrit ? <Link to="/login" className="text-brand-600 font-bold hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}