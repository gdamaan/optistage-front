import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

export default function Offers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Récupération de l'utilisateur actif depuis la mémoire de session
    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    // États pour la modale de candidature
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [motivationLetter, setMotivationLetter] = useState('');

    // NOUVEAU : État pour stocker le fichier CV sélectionné par l'étudiant
    const [cvFile, setCvFile] = useState(null);

    const [applyStatus, setApplyStatus] = useState({ loading: false, message: '', type: '' });

    const titleQuery = searchParams.get('title') || '';

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                let data;
                if (titleQuery) {
                    data = await apiService.searchOffers(titleQuery);
                } else {
                    data = await apiService.getAllOffers();
                }
                setOffers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, [titleQuery]);

    const handleApply = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (currentUser.role !== 'Étudiant') {
            setApplyStatus({ loading: false, type: 'error', message: 'Seuls les étudiants peuvent postuler.' });
            return;
        }

        // NOUVEAU : Vérification de sécurité, on force l'étudiant à mettre un CV
        if (!cvFile) {
            setApplyStatus({ loading: false, type: 'error', message: 'Veuillez joindre votre CV au format PDF.' });
            return;
        }

        setApplyStatus({ loading: true, message: 'Envoi du CV sécurisé en cours...', type: '' });

        try {
            // NOUVEAU : 1. On envoie d'abord le CV dans la base NoSQL et on récupère son ID
            const generatedCvId = await apiService.uploadCV(cvFile);

            setApplyStatus({ loading: true, message: 'Transmission du dossier académique...', type: '' });

            // NOUVEAU : 2. On prépare la candidature SQL en y glissant l'ID du CV
            const applicationData = {
                studentId: currentUser.id,
                offerId: selectedOffer.id,
                motivationLetter: motivationLetter,
                status: "EN_ATTENTE",
                cvId: generatedCvId // Le lien entre SQL et NoSQL se fait ici
            };

            // 3. On valide la candidature
            await apiService.applyToOffer(applicationData);

            setApplyStatus({ loading: false, type: 'success', message: 'Candidature transmise avec succès !' });

            // Nettoyage de la modale
            setTimeout(() => {
                setSelectedOffer(null);
                setMotivationLetter('');
                setCvFile(null); // On vide le fichier
                setApplyStatus({ loading: false, message: '', type: '' });
            }, 2000);
        } catch (err) {
            setApplyStatus({ loading: false, type: 'error', message: err.message });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 relative">
            <header className="flex justify-between items-end border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 tracking-tight">
                        {titleQuery ? `Résultats pour "${titleQuery}"` : "Toutes les offres"}
                    </h1>
                    <p className="text-gray-500 mt-1">Trouvez le stage qui propulsera votre carrière.</p>
                </div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                    {offers.length} offre(s) trouvée(s)
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 text-center">
                    <i className="fa-solid fa-triangle-exclamation text-2xl mb-2 block"></i>
                    <p className="font-bold">{error}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                                    {offer.enterprise?.name || 'Entreprise'}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <i className="fa-solid fa-location-dot"></i> {offer.ville}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                                {offer.title}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow italic">
                                "{offer.description}"
                            </p>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <div className="text-green-600 font-bold text-sm">
                                    {offer.remuneration ? `${offer.remuneration}€ / mois` : 'Non spécifié'}
                                </div>
                                <button
                                    onClick={() => setSelectedOffer(offer)}
                                    className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
                                >
                                    Postuler
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODALE DE CANDIDATURE */}
            {selectedOffer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-blue-900">{selectedOffer.title}</h2>
                                <p className="text-sm text-gray-500 font-medium">{selectedOffer.enterprise?.name} • {selectedOffer.ville}</p>
                            </div>
                            <button onClick={() => setSelectedOffer(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="mb-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Missions</h3>
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedOffer.description}
                                </p>
                            </div>

                            <form onSubmit={handleApply} className="space-y-4">

                                {/* NOUVEAU : Champ d'upload du CV */}
                                <div>
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                                        <i className="fa-solid fa-file-pdf mr-1"></i> Votre Curriculum Vitae (PDF)
                                    </h3>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        required
                                        onChange={(e) => setCvFile(e.target.files[0])}
                                        className="w-full p-3 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                                        <i className="fa-solid fa-pen-nib mr-1"></i> Votre Lettre de Motivation
                                    </h3>
                                    <textarea
                                        required
                                        rows="8"
                                        value={motivationLetter}
                                        onChange={(e) => setMotivationLetter(e.target.value)}
                                        placeholder="Monsieur, Madame, Actuellement étudiant en..."
                                        className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm resize-none shadow-inner bg-gray-50"
                                    ></textarea>
                                </div>

                                {applyStatus.message && (
                                    <div className={`p-3 rounded-xl text-sm font-bold text-center ${applyStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {applyStatus.loading && <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>}
                                        {applyStatus.message}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOffer(null)}
                                        className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={applyStatus.loading}
                                        className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <i className="fa-solid fa-paper-plane"></i> Transmettre le dossier
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}