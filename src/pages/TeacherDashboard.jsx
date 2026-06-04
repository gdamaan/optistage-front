import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function TeacherDashboard() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // États pour le mode Édition
    const [editingInternship, setEditingInternship] = useState(null);
    const [updateForm, setUpdateForm] = useState({ conventionStatus: '', finalGrade: '', tutorFeedback: '' });

    const currentUser = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        if (!currentUser || (currentUser.role !== 'Professeur' && currentUser.role !== 'Admin')) {
            navigate('/login');
            return;
        }
        fetchInternships();
    }, []);

    const fetchInternships = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAllInternships();
            setInternships(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (internship) => {
        setEditingInternship(internship);
        setUpdateForm({
            conventionStatus: internship.conventionStatus || 'EN_COURS',
            finalGrade: internship.finalGrade || '',
            tutorFeedback: internship.tutorFeedback || ''
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            // Le Back-end Java attend des noms de variables spécifiques pour l'entité Internship
            const payload = {
                conventionStatus: updateForm.conventionStatus,
                note_finale: updateForm.finalGrade ? parseFloat(updateForm.finalGrade) : null,
                rapport_tuteur: updateForm.tutorFeedback
            };

            await apiService.updateInternship(editingInternship.id, payload);

            // On rafraîchit la liste et on ferme la modale
            fetchInternships();
            setEditingInternship(null);
        } catch (err) {
            alert("Erreur lors de la mise à jour : " + err.message);
        }
    };

    if (loading) return <div className="text-center py-20 font-bold text-gray-500 animate-pulse">Chargement des dossiers académiques...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <header className="border-b pb-6">
                <h1 className="text-3xl font-black text-blue-900 tracking-tight">Espace Pédagogique</h1>
                <p className="text-gray-500 mt-1">Supervision et validation des stages étudiants.</p>
            </header>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 border-b font-bold">Étudiant</th>
                        <th className="p-4 border-b font-bold">Entreprise & Offre</th>
                        <th className="p-4 border-b font-bold">Statut Convention</th>
                        <th className="p-4 border-b font-bold">Note</th>
                        <th className="p-4 border-b font-bold text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {internships.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-gray-400 italic">Aucun stage généré pour le moment.</td></tr>
                    ) : (
                        internships.map(internship => (
                            <tr key={internship.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="p-4 font-bold text-gray-800">
                                    <i className="fa-solid fa-user-graduate text-blue-500 mr-2"></i>
                                    {internship.studentName || 'Non assigné'}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-sm text-gray-700">{internship.enterpriseName}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{internship.offerTitle}</div>
                                </td>
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            internship.conventionStatus === 'VALIDEE' || internship.conventionStatus === 'SIGNEE'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {internship.conventionStatus}
                                        </span>
                                </td>
                                <td className="p-4 font-bold text-gray-700">
                                    {internship.finalGrade ? `${internship.finalGrade} / 20` : '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleEditClick(internship)}
                                        className="bg-gray-900 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        <i className="fa-solid fa-pen-to-square mr-1"></i> Évaluer
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* MODALE D'ÉDITION DU STAGE */}
            {editingInternship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-blue-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-blue-900">Évaluation du stage</h2>
                            <button onClick={() => setEditingInternship(null)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Étudiant</label>
                                <div className="p-3 bg-gray-50 rounded-xl font-bold text-gray-700">{editingInternship.studentName}</div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Statut de la Convention</label>
                                <select
                                    value={updateForm.conventionStatus}
                                    onChange={(e) => setUpdateForm({...updateForm, conventionStatus: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 font-bold text-gray-700"
                                >
                                    <option value="EN_COURS">En cours d'édition</option>
                                    <option value="SIGNEE">Signée par les parties</option>
                                    <option value="VALIDEE">Validée académiquement</option>
                                    <option value="ANNULEE">Annulée</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Note Finale (sur 20)</label>
                                <input
                                    type="number" step="0.5" min="0" max="20"
                                    value={updateForm.finalGrade}
                                    onChange={(e) => setUpdateForm({...updateForm, finalGrade: e.target.value})}
                                    placeholder="Ex: 15.5"
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Appréciation / Rapport du Tuteur</label>
                                <textarea
                                    rows="4"
                                    value={updateForm.tutorFeedback}
                                    onChange={(e) => setUpdateForm({...updateForm, tutorFeedback: e.target.value})}
                                    placeholder="Commentaires sur le déroulement du stage..."
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 resize-none text-sm"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <button type="button" onClick={() => setEditingInternship(null)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Annuler</button>
                                <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"><i className="fa-solid fa-floppy-disk mr-2"></i> Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}