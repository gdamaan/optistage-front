import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function TutorDashboard({ user }) {
    const navigate = useNavigate();
    const [enterprise, setEnterprise] = useState(null);
    const [offers, setOffers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [newOffer, setNewOffer] = useState({
        title: '',
        description: '',
        location: '',
        salary: 0,
        startDate: '',
        endDate: '',
        enterpriseId: null
    });

    useEffect(() => {
        const initDashboard = async () => {
            try {
                // 1. On récupère l'entreprise liée au manager
                const ent = await apiService.getEnterpriseByManager(user.id);
                if (!ent) {
                    setMessage({ type: 'error', text: 'Veuillez enregistrer votre entreprise dans votre profil avant de publier.' });
                    setLoading(false);
                    return;
                }
                setEnterprise(ent);
                setNewOffer(prev => ({ ...prev, enterpriseId: ent.id }));

                // 2. On récupère les offres déjà postées
                const offersData = await apiService.getOffersByEnterprise(ent.id);
                setOffers(offersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        initDashboard();
    }, [user.id]);

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        try {
            const created = await apiService.createOffer(newOffer);
            setOffers([created, ...offers]); // On ajoute l'offre en haut de la liste
            setShowForm(false);
            setNewOffer({ ...newOffer, title: '', description: '', location: '', salary: 0 });
            setMessage({ type: 'success', text: 'Offre publiée avec succès !' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    if (loading) return <div className="text-center py-20 animate-pulse">Récupération des offres publiées...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 tracking-tight">Gestion des Offres</h1>
                    <p className="text-gray-500">{enterprise?.name || 'Structure non identifiée'}</p>
                </div>
                {enterprise && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center gap-2"
                    >
                        <i className={`fa-solid ${showForm ? 'fa-xmark' : 'fa-plus'}`}></i>
                        {showForm ? 'Annuler' : 'Nouvelle Offre'}
                    </button>
                )}
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                    {!enterprise && <Link to="/profile" className="ml-2 underline font-bold">Aller au profil</Link>}
                </div>
            )}

            {/* Formulaire de création */}
            {showForm && (
                <form onSubmit={handleCreateOffer} className="bg-white p-8 rounded-3xl shadow-2xl border-2 border-blue-50 grid md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-200">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Intitulé du poste</label>
                        <input required className="w-full p-3 border rounded-xl" value={newOffer.title} onChange={e => setNewOffer({...newOffer, title: e.target.value})} placeholder="Ex: Développeur Fullstack React/Java" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Missions et description</label>
                        <textarea required className="w-full p-3 border rounded-xl" rows="4" value={newOffer.description} onChange={e => setNewOffer({...newOffer, description: e.target.value})} placeholder="Détaillez les missions..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Lieu</label>
                        <input required className="w-full p-3 border rounded-xl" value={newOffer.location} onChange={e => setNewOffer({...newOffer, location: e.target.value})} placeholder="Ville, Télétravail..." />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gratification (€/mois)</label>
                        <input type="number" className="w-full p-3 border rounded-xl" value={newOffer.salary} onChange={e => setNewOffer({...newOffer, salary: parseFloat(e.target.value)})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date de début</label>
                        <input type="date" required className="w-full p-3 border rounded-xl" onChange={e => setNewOffer({...newOffer, startDate: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date de fin</label>
                        <input type="date" required className="w-full p-3 border rounded-xl" onChange={e => setNewOffer({...newOffer, endDate: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl hover:brightness-110 transition">
                            Publier l'offre sur OptiStage
                        </button>
                    </div>
                </form>
            )}

            {/* Liste des offres existantes */}
            <div className="grid gap-4">
                <h2 className="text-xl font-bold text-gray-700">Vos publications ({offers.length})</h2>
                {offers.length === 0 ? (
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 rounded-3xl text-center text-gray-400">
                        <i className="fa-solid fa-box-open text-4xl mb-2"></i>
                        <p>Aucune offre publiée pour le moment.</p>
                    </div>
                ) : (
                    offers.map(off => (
                        <div key={off.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex justify-between items-center group hover:border-blue-200 transition-all">
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{off.title}</h3>
                                <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                    <span><i className="fa-solid fa-location-dot"></i> {off.location}</span>
                                    <span><i className="fa-solid fa-calendar"></i> Début: {new Date(off.startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i className="fa-solid fa-pen"></i></button>
                                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><i className="fa-solid fa-trash"></i></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}