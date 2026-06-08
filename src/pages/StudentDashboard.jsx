import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        const fetchApplications = async () => {
            if (!currentUser) return;
            try {
                setLoading(true);
                const data = await apiService.getStudentApplications(currentUser.id);
                setApplications(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [currentUser?.id]);

    // Fonction utilitaire pour styliser les statuts (Conservée pour la sémantique)
    const getStatusStyle = (status) => {
        switch (status) {
            case 'EN_ATTENTE': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'ACCEPTE': return 'bg-green-100 text-green-800 border-green-200';
            case 'REFUSE': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-brand-100 text-brand-800 border-brand-200';
        }
    };

    if (!currentUser || currentUser.role !== 'Étudiant') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-200 shadow-sm">
                    Accès restreint. Espace réservé aux étudiants.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* En-tête du Dashboard : Dégradé de Gris Anthracite */}
            <header className="bg-gradient-to-r from-brand-900 to-brand-600 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                {/* Touche décorative tech en arrière-plan */}
                <svg className="absolute -bottom-8 -right-8 w-48 h-48 text-brand-600 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>

                <div className="relative z-10">
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        Bonjour, {currentUser.firstname}
                    </h1>
                    <p className="text-brand-50 text-sm opacity-90">
                        Bienvenue sur votre centre de suivi de candidatures.
                    </p>
                </div>
                <div className="relative z-10 text-center bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 shadow-inner">
                    <div className="text-3xl font-black">{applications.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-brand-50 font-bold mt-1 opacity-90">Candidatures</div>
                </div>
            </header>

            {/* Zone de contenu */}
            <div className="bg-white rounded-3xl shadow-lg border border-brand-100 p-6">
                <h2 className="text-xl font-bold text-brand-900 mb-6 flex items-center gap-2">
                    {/* Icône en Émeraude */}
                    <i className="fa-solid fa-folder-open text-accent-500"></i> Dossiers en cours
                </h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        {/* Spinner Émeraude */}
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-bold border border-red-100">
                        {error}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-brand-50 rounded-2xl border border-brand-100 border-dashed">
                        <div className="text-4xl mb-4 opacity-75">📭</div>
                        <h3 className="text-lg font-bold text-brand-900 mb-2">Aucune candidature</h3>
                        <p className="text-gray-500 text-sm mb-6">Vous n'avez pas encore postulé à une offre de stage.</p>
                        {/* Bouton d'action en Émeraude */}
                        <Link to="/offers" className="bg-accent-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-accent-600 hover:shadow-lg transition-all flex items-center gap-2 w-fit mx-auto">
                            <i className="fa-solid fa-magnifying-glass"></i> Parcourir les offres
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b-2 border-brand-100 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="pb-4 font-black pl-2">Date</th>
                                <th className="pb-4 font-black">Entreprise</th>
                                <th className="pb-4 font-black">Offre</th>
                                <th className="pb-4 font-black text-center pr-2">Statut</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {applications.map((app) => (
                                <tr key={app.id} className="border-b border-brand-50 hover:bg-brand-50/50 transition-colors group">
                                    <td className="py-4 text-gray-500 font-medium pl-2">
                                        {app.applyDate ? new Date(app.applyDate).toLocaleDateString() : 'Récente'}
                                    </td>
                                    <td className="py-4 font-bold text-brand-900 group-hover:text-accent-600 transition-colors">
                                        {app.enterpriseName || 'Non spécifié'}
                                    </td>
                                    <td className="py-4 text-gray-600">
                                        {app.offerTitle || `Offre #${app.offerId}`}
                                    </td>
                                    <td className="py-4 text-center pr-2">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-black border shadow-sm ${getStatusStyle(app.status)}`}>
                                            {app.status ? app.status.replace('_', ' ') : 'INCONNU'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}