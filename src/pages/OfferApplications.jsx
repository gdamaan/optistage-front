import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';

export default function OfferApplications() {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // État pour gérer l'ouverture du dossier (La modale)
    const [selectedApp, setSelectedApp] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [id]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await apiService.getApplicationsByOffer(id);
            setApplications(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        if (newStatus === 'ACCEPTE') {
            const confirm = window.confirm("Attention : Accepter ce candidat refusera automatiquement tous les autres et générera le stage. Confirmer ?");
            if (!confirm) return;
        }

        try {
            await apiService.updateApplicationStatus(appId, newStatus);
            setSelectedApp(null); // On ferme le dossier après décision
            fetchApplications();  // On recharge la liste
        } catch (err) {
            alert(`Erreur : ${err.message}`);
        }
    };

    // NOUVEAU : Fonction pour récupérer et afficher le CV
    const handleViewCV = async (cvId) => {
        if (!cvId) return;

        try {
            const blob = await apiService.getCV(cvId);
            // On crée une URL locale pour le fichier PDF (le Blob)
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            // Ouverture dans un nouvel onglet
            window.open(url, '_blank');
        } catch (error) {
            console.error("Erreur lors de la récupération du CV :", error);
            alert("Impossible de charger le CV pour le moment. L'armure a un léger raté de communication avec la base NoSQL.");
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Scan des dossiers en cours...</div>;

    const isOfferFilled = applications.some(app => app.status === 'ACCEPTE');

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 relative">
            <div className="flex items-center gap-4">
                <Link to="/tutor-dashboard" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl transition">
                    <i className="fa-solid fa-arrow-left"></i> Retour
                </Link>
                <h1 className="text-3xl font-black text-blue-900 tracking-tight">Dossiers de candidature</h1>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                </div>
            )}

            {isOfferFilled && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl font-bold flex items-center gap-3 shadow-sm">
                    <i className="fa-solid fa-circle-check text-xl"></i>
                    Félicitations ! Vous avez recruté votre stagiaire. Le processus académique est maintenant lancé.
                </div>
            )}

            {applications.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center text-gray-400">
                    <i className="fa-solid fa-inbox text-4xl mb-2"></i>
                    <p>Aucun étudiant n'a encore postulé à cette offre.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map(app => (
                        <div key={app.id} className={`bg-white p-6 rounded-2xl shadow-sm border transition-all flex flex-col md:flex-row justify-between items-center gap-4 ${app.status === 'ACCEPTE' ? 'border-green-400 ring-2 ring-green-100 bg-green-50/30' : 'border-gray-100 hover:shadow-md'}`}>

                            <div className="flex-1">
                                <h3 className="font-bold text-lg text-gray-800">
                                    <i className="fa-solid fa-user-graduate text-blue-500 mr-2"></i>
                                    {app.studentName || `Étudiant n°${app.studentId}`}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    <i className="fa-regular fa-calendar mr-1"></i> Postulé le : {new Date(app.applyDate).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                {app.status === 'EN_ATTENTE' && <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold">En attente</span>}
                                {app.status === 'ACCEPTE' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold"><i className="fa-solid fa-check mr-1"></i> Accepté</span>}
                                {app.status === 'REFUSE' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold">Refusé</span>}

                                <button
                                    onClick={() => setSelectedApp(app)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold transition"
                                >
                                    <i className="fa-solid fa-magnifying-glass mr-2"></i> Examiner
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- LE SCANNER HOLOGRAPHIQUE (LA MODALE) --- */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">

                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-gray-800">Dossier de {selectedApp.studentName}</h2>
                                <p className="text-sm text-gray-500">Postulé le {new Date(selectedApp.applyDate).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-red-500 transition text-2xl">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Lettre de motivation</h3>
                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 text-gray-700 whitespace-pre-wrap font-serif leading-relaxed">
                                {selectedApp.motivationLetter ? selectedApp.motivationLetter : <span className="italic text-gray-400">Cet étudiant n'a pas laissé de lettre de motivation.</span>}
                            </div>

                            {/* Section CV mise à jour */}
                            <div className="mt-6 border-t border-dashed border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Pièces jointes</h3>

                                {selectedApp.cvId ? (
                                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <i className="fa-solid fa-file-pdf text-red-500 text-2xl"></i>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700">Curriculum Vitae (CV)</p>
                                                <p className="text-xs text-gray-500">Document disponible</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewCV(selectedApp.cvId)}
                                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2"
                                        >
                                            <i className="fa-solid fa-eye"></i> Consulter le CV
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <i className="fa-solid fa-file-circle-xmark text-gray-400 text-2xl"></i>
                                        <div>
                                            <p className="text-sm font-bold text-gray-700">Aucun CV joint</p>
                                            <p className="text-xs text-gray-500">Ce candidat n'a pas fourni de CV avec sa candidature.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-5 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition"
                            >
                                Fermer
                            </button>

                            {selectedApp.status === 'EN_ATTENTE' && !isOfferFilled && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'REFUSE')}
                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 px-5 py-2 rounded-xl font-bold transition"
                                    >
                                        <i className="fa-solid fa-xmark mr-1"></i> Refuser
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'ACCEPTE')}
                                        className="bg-green-600 hover:bg-green-700 text-white shadow-md px-6 py-2 rounded-xl font-bold transition"
                                    >
                                        <i className="fa-solid fa-check mr-1"></i> Recruter cet étudiant
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}