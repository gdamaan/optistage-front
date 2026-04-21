import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function Profile({ user, onUpdateUser }) {
    const [formData, setFormData] = useState({
        firstname: user?.firstname || '',
        lastname: user?.lastname || '',
        birthdate: user?.birthdate || '',
        email: user?.email || ''
    });
    const [enterprise, setEnterprise] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.role === 'Entreprise') {
            apiService.getEnterpriseByManager(user.id).then(setEnterprise);
        }
    }, [user]);

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateProfile(formData);
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            onUpdateUser(updatedUser);
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-3xl font-bold text-blue-900 border-b pb-4">Mon Profil <span className="text-sm font-normal text-gray-500">({user?.role})</span></h1>

            {message.text && (
                <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Formulaire Utilisateur Standard */}
                <form onSubmit={handleUserUpdate} className="bg-white p-6 rounded-3xl shadow-lg space-y-4 border border-gray-100">
                    <h2 className="font-bold text-gray-700">Informations Personnelles</h2>
                    <div className="space-y-3">
                        <input className="w-full p-3 border rounded-xl" value={formData.firstname} onChange={e => setFormData({...formData, firstname: e.target.value})} placeholder="Prénom" />
                        <input className="w-full p-3 border rounded-xl" value={formData.lastname} onChange={e => setFormData({...formData, lastname: e.target.value})} placeholder="Nom" />
                        <input className="w-full p-3 border rounded-xl bg-gray-50" value={formData.email} disabled title="L'email ne peut pas être modifié" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">Sauvegarder</button>
                </form>

                {/* Section Spécifique Entreprise */}
                {user?.role === 'Entreprise' && (
                    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-100 space-y-4">
                        <h2 className="font-bold text-blue-900">Ma Société</h2>
                        {enterprise ? (
                            <div className="space-y-2">
                                <p className="text-sm"><strong>Nom:</strong> {enterprise.name}</p>
                                <p className="text-sm"><strong>SIRET:</strong> {enterprise.siret}</p>
                                <button className="text-blue-600 text-sm font-bold hover:underline">Modifier les infos entreprise</button>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Aucune entreprise liée à votre compte recruteur.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}