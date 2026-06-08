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
            const payload = {
                conventionStatus: updateForm.conventionStatus,
                note_finale: updateForm.finalGrade ? parseFloat(updateForm.finalGrade) : null,
                rapport_tuteur: updateForm.tutorFeedback
            };

            await apiService.updateInternship(editingInternship.id, payload);

            fetchInternships();
            setEditingInternship(null);
        } catch (err) {
            alert("Erreur lors de la mise à jour : " + err.message);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20 flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
            <div className="font-bold text-gray-500 animate-pulse">Chargement des dossiers académiques...</div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <header className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-black text-brand-900 tracking-tight">Espace Pédagogique</h1>
                <p className="text-gray-500 mt-1">Supervision et validation des stages étudiants.</p>
            </header>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-lg border border-brand-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-brand-50 text-brand-900 text-[10px] font-black uppercase tracking-widest">
                        <th className="p-4 border-b border-brand-100">Étudiant</th>
                        <th className="p-4 border-b border-brand-100">Entreprise & Offre</th>
                        <th className="p-4 border-b border-brand-100">Statut Convention</th>
                        <th className="p-4 border-b border-brand-100">Note</th>
                        <th className="p-4 border-b border-brand-100 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {internships.length === 0 ? (
                        <tr><td colSpan="5" className="p-12 text-center text-gray-400 italic">Aucun stage généré pour le moment.</td></tr>
                    ) : (
                        internships.map(internship => (
                            <tr key={internship.id} className="hover:bg-brand-50/30 transition-colors group">
                                <td className="p-4 font-bold text-brand-900">
                                    <i className="fa-solid fa-user-graduate text-brand-600 mr-2 group-hover:text-accent-500 transition-colors"></i>
                                    {internship.studentName || 'Non assigné'}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-sm text-gray-700">{internship.enterpriseName}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{internship.offerTitle}</div>
                                </td>
                                <td className="p-4">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-black shadow-sm ${
                                            internship.conventionStatus === 'VALIDEE' || internship.conventionStatus === 'SIGNEE'
                                                ? 'bg-green-100 text-green-700 border border-green-200'
                                                : 'bg-orange-100 text-orange-700 border border-orange-200'
                                        }`}>
                                            {internship.conventionStatus}
                                        </span>
                                </td>
                                <td className="p-4 font-bold text-brand-900">
                                    {internship.finalGrade ? (
                                        <span className="bg-brand-50 px-2 py-1 rounded-lg border border-brand-100">{internship.finalGrade} / 20</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => handleEditClick(internship)}
                                        className="bg-brand-900 hover:bg-accent-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-brand-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-brand-900">Évaluation du stage</h2>
                            <button onClick={() => setEditingInternship(null)} className="text-gray-400 hover:text-red-500 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-brand-900 uppercase tracking-wider mb-2">Étudiant</label>
                                <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl font-bold text-brand-900">{editingInternship.studentName}</div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-900 uppercase tracking-wider mb-2">Statut de la Convention</label>
                                <select
                                    value={updateForm.conventionStatus}
                                    onChange={(e) => setUpdateForm({...updateForm, conventionStatus: e.target.value})}
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-500 font-bold text-gray-700 transition-all bg-gray-50 focus:bg-white"
                                >
                                    <option value="EN_COURS">En cours d'édition</option>
                                    <option value="SIGNEE">Signée par les parties</option>
                                    <option value="VALIDEE">Validée académiquement</option>
                                    <option value="ANNULEE">Annulée</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-900 uppercase tracking-wider mb-2">Note Finale (sur 20)</label>
                                <input
                                    type="number" step="0.5" min="0" max="20"
                                    value={updateForm.finalGrade}
                                    onChange={(e) => setUpdateForm({...updateForm, finalGrade: e.target.value})}
                                    placeholder="Ex: 15.5"
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-500 transition-all font-bold text-brand-900 bg-gray-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-brand-900 uppercase tracking-wider mb-2">Appréciation / Rapport du Tuteur</label>
                                <textarea
                                    rows="4"
                                    value={updateForm.tutorFeedback}
                                    onChange={(e) => setUpdateForm({...updateForm, tutorFeedback: e.target.value})}
                                    placeholder="Commentaires sur le déroulement du stage..."
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-accent-500 resize-none text-sm transition-all bg-gray-50 focus:bg-white"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                                <button type="button" onClick={() => setEditingInternship(null)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Annuler</button>
                                <button type="submit" className="bg-accent-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-accent-600 hover:shadow-xl transition-all flex items-center gap-2">
                                    <i className="fa-solid fa-floppy-disk"></i> Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}