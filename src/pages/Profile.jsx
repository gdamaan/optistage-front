import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function Profile({ user, onUpdateUser }) {
    // Initialisation sécurisée
    const [formData, setFormData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        birthdate: user?.birthdate || '',
        email: user?.email || ''
    });

    // --- PROTOCOLE DE RÉHYDRATATION ---
    // Indispensable pour remplir les champs quand 'user' arrive après le chargement du localStorage
    useEffect(() => {
        if (user) {
            setFormData({
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                birthdate: user.birthdate || '',
                email: user.email || ''
            });

            // On prépare aussi le managerId pour le formulaire entreprise
            setEntFormData(prev => ({ ...prev, managerId: user.id }));
        }
    }, [user]);

    // --- ÉTATS POUR L'ENTREPRISE ---
    const [enterprise, setEnterprise] = useState(null);
    const [isEditingEnterprise, setIsEditingEnterprise] = useState(false);
    const [isRegisteringEnterprise, setIsRegisteringEnterprise] = useState(false);
    const [entFormData, setEntFormData] = useState({
        name: '',
        siret: '',
        sector: '',
        description: '',
        website: '',
        managerId: user?.id
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.role === 'Entreprise') {
            fetchEnterprise();
        }
    }, [user]);

    const fetchEnterprise = async () => {
        try {
            const data = await apiService.getEnterpriseByManager(user.id);
            setEnterprise(data);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'entreprise:", err);
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateProfile(formData);
            const updatedUser = { ...user, ...formData };
            sessionStorage.setItem('user', JSON.stringify(updatedUser));
            onUpdateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const startEditingEnterprise = () => {
        setEntFormData({
            id: enterprise.id,
            name: enterprise.name,
            siret: enterprise.siret,
            sector: enterprise.sector || '',
            description: enterprise.description || '',
            website: enterprise.website || '',
            managerId: user.id
        });
        setIsEditingEnterprise(true);
    };

    const handleEnterpriseSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedEnt;
            if (isEditingEnterprise) {
                updatedEnt = await apiService.updateEnterprise(entFormData);
                setMessage({ type: 'success', text: 'Informations de l\'entreprise mises à jour !' });
            } else {
                updatedEnt = await apiService.createEnterprise(entFormData);
                setMessage({ type: 'success', text: 'Entreprise enregistrée avec succès !' });
            }
            setEnterprise(updatedEnt);
            setIsEditingEnterprise(false);
            setIsRegisteringEnterprise(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-blue-900 border-b pb-4">
                Mon Profil <span className="text-sm font-normal text-gray-500">({user?.role})</span>
            </h1>

            {message.text && (
                <div className={`p-4 rounded-xl border animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <form onSubmit={handleUserUpdate} className="bg-white p-6 rounded-3xl shadow-lg space-y-4 border border-gray-100">
                    <h2 className="font-bold text-gray-700 flex items-center gap-2">
                        <i className="fa-solid fa-user-circle text-blue-600"></i> Informations Personnelles
                    </h2>
                    <div className="space-y-3">
                        <input required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} placeholder="Prénom" />
                        <input required className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} placeholder="Nom" />
                        <input className="w-full p-3 border rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed" value={formData.email} disabled title="L'identifiant est immuable." />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
                        Sauvegarder les changements
                    </button>
                </form>

                {user?.role === 'Entreprise' && (
                    <div className="space-y-4">
                        {enterprise && !isEditingEnterprise ? (
                            <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-100 space-y-4 animate-in slide-in-from-right-4">
                                <h2 className="font-bold text-blue-900 flex items-center gap-2">
                                    <i className="fa-solid fa-building text-blue-600"></i> Ma Société
                                </h2>
                                <div className="space-y-2 border-l-4 border-blue-600 pl-4 bg-blue-50/50 py-2 rounded-r-xl">
                                    <p className="text-sm"><strong>Nom:</strong> {enterprise.name}</p>
                                    <p className="text-sm"><strong>SIRET:</strong> {enterprise.siret}</p>
                                    <p className="text-sm"><strong>Secteur:</strong> {enterprise.sector || 'N/A'}</p>
                                </div>
                                <button onClick={startEditingEnterprise} className="w-full bg-blue-50 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-100 transition border border-blue-200">
                                    Modifier la fiche entreprise
                                </button>
                            </div>
                        ) : (enterprise || isRegisteringEnterprise || isEditingEnterprise) ? (
                            <form onSubmit={handleEnterpriseSubmit} className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-100 space-y-3 animate-in zoom-in-95">
                                <h2 className="font-bold text-blue-900">
                                    {isEditingEnterprise ? "Mise à jour technique" : "Nouvel enregistrement"}
                                </h2>
                                <input required className="w-full p-3 border rounded-xl" value={entFormData.name} placeholder="Nom commercial" onChange={e => setEntFormData({...entFormData, name: e.target.value})} />
                                <input required className="w-full p-3 border rounded-xl" value={entFormData.siret} placeholder="SIRET (14 chiffres)" maxLength="14" onChange={e => setEntFormData({...entFormData, siret: e.target.value})} />
                                <input className="w-full p-3 border rounded-xl" value={entFormData.sector} placeholder="Secteur" onChange={e => setEntFormData({...entFormData, sector: e.target.value})} />
                                <input className="w-full p-3 border rounded-xl" value={entFormData.website} placeholder="Site Web (URL)" onChange={e => setEntFormData({...entFormData, website: e.target.value})} />
                                <textarea className="w-full p-3 border rounded-xl" value={entFormData.description} placeholder="Mission de l'entreprise" rows="3" onChange={e => setEntFormData({...entFormData, description: e.target.value})}></textarea>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => {setIsEditingEnterprise(false); setIsRegisteringEnterprise(false);}} className="flex-1 bg-gray-100 py-3 rounded-xl font-bold">Annuler</button>
                                    <button type="submit" className="flex-[2] bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">Confirmer</button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-amber-50 border-2 border-dashed border-amber-200 p-8 rounded-3xl text-center space-y-4">
                                <i className="fa-solid fa-triangle-exclamation text-amber-500 text-3xl"></i>
                                <p className="text-amber-800 text-sm italic">Aucune structure détectée. Veuillez régulariser votre situation.</p>
                                <button onClick={() => setIsRegisteringEnterprise(true)} className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-700 transition shadow-lg">
                                    Enregistrer ma société
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}