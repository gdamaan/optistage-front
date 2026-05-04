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
    }, [currentUser]);

    // Fonction utilitaire pour styliser les statuts
    const getStatusStyle = (status) => {
        switch (status) {
            case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ACCEPTE': return 'bg-green-100 text-green-800 border-green-200';
            case 'REFUSE': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (!currentUser || currentUser.role !== 'Étudiant') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-200">
                    Accès restreint. Espace réservé aux étudiants.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* En-tête du Dashboard */}
            <header className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        Bonjour, {currentUser.firstname}
                    </h1>
                    <p className="text-blue-100 text-sm">
                        Bienvenue sur votre centre de suivi de candidatures.
                    </p>
                </div>
                <div className="text-center bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                    <div className="text-3xl font-black">{applications.length}</div>
                    <div className="text-xs uppercase tracking-wider text-blue-100 font-bold mt-1">Candidatures</div>
                </div>
            </header>

            {/* Zone de contenu */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <i className="fa-solid fa-folder-open text-blue-600"></i> Dossiers en cours
                </h2>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-bold border border-red-100">
                        {error}
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <div className="text-4xl mb-4">📭</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Aucune candidature</h3>
                        <p className="text-gray-500 text-sm mb-6">Vous n'avez pas encore postulé à une offre de stage.</p>
                        <Link to="/offres" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors">
                            Parcourir les offres
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b-2 border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="pb-4 font-black">Date</th>
                                <th className="pb-4 font-black">Entreprise</th>
                                <th className="pb-4 font-black">Offre</th>
                                <th className="pb-4 font-black text-center">Statut</th>
                            </tr>
                            </thead>
                            <tbody className="text-sm">
                            {applications.map((app) => (
                                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 text-gray-500 font-medium">
                                        {/* Si vous avez une date dans le DTO, affichez-la ici. Sinon, on met un placeholder */}
                                        {app.applyDate ? new Date(app.applyDate).toLocaleDateString() : 'Récente'}
                                    </td>
                                    <td className="py-4 font-bold text-gray-800">
                                        {app.enterpriseName || 'Non spécifié'}
                                    </td>
                                    <td className="py-4 text-gray-600">
                                        {app.offerTitle || `Offre #${app.offerId}`}
                                    </td>
                                    <td className="py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusStyle(app.status)}`}>
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