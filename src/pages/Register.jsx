import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        birthdate: '',
        response: '',
        question: { id: "" },
        role: { name: "" },
        isActive: false
    });

    // --- NOUVEAU : État dédié aux données de l'entreprise ---
    const [enterpriseData, setEnterpriseData] = useState({
        name: '',
        siret: '',
        sector: ''
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [qData, rData] = await Promise.all([
                    apiService.getQuestions(),
                    apiService.getRoles()
                ]);
                setQuestions(qData);
                setRoles(rData);
            } catch (err) {
                setError("Erreur de liaison avec les serveurs.");
            }
        };
        loadInitialData();
    }, []);

    const validateForm = () => {
        const { email, password, birthdate, role } = formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("L'adresse email n'est pas conforme aux standards.");
            return false;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Le mot de passe manque de complexité : 8 caractères, 1 Maj, 1 min, 1 Chiffre.");
            return false;
        }

        const birth = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age < 18) {
            setError("Accès refusé. Vous devez être majeur pour utiliser OptiStage.");
            return false;
        }

        // --- NOUVEAU : Validation spécifique si le rôle est "Entreprise" ---
        if (role.name === 'Entreprise') {
            if (!enterpriseData.name || !enterpriseData.siret) {
                setError("Les informations de l'entreprise (Nom et SIRET) sont obligatoires.");
                return false;
            }
            if (enterpriseData.siret.length !== 14) {
                setError("Le numéro SIRET doit comporter exactement 14 chiffres.");
                return false;
            }
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "roleId") {
            const selectedRole = roles.find(r => r.id === parseInt(value));
            setFormData({
                ...formData,
                role: { name: selectedRole ? selectedRole.label : "" }
            });
        } else if (name === "questionId") {
            setFormData({ ...formData, question: { id: parseInt(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // --- NOUVEAU : Gestionnaire pour les champs de l'entreprise ---
    const handleEnterpriseChange = (e) => {
        const { name, value } = e.target;
        setEnterpriseData({ ...enterpriseData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        let formattedBirthdate = formData.birthdate;
        if (formData.birthdate.includes('-')) {
            const [year, month, day] = formData.birthdate.split('-');
            formattedBirthdate = `${day}/${month}/${year}`;
        }

        const dataToSend = {
            ...formData,
            birthdate: formattedBirthdate
        };

        // --- NOUVEAU : Injection des données entreprise dans le flux principal ---
        if (formData.role.name === 'Entreprise') {
            dataToSend.enterprise = enterpriseData;
        }

        try {
            await apiService.register(dataToSend);
            alert("Inscription réussie ! Veuillez attendre la validation d'un administrateur.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-900">OptiStage</h2>
                    <p className="text-gray-500 mt-2 text-sm">Initialisation des protocoles</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-bold text-center border border-red-200 animate-in fade-in">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <input name="firstname" placeholder="Prénom" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition" />
                        <input name="lastname" placeholder="Nom" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date de naissance</label>
                        <input type="date" name="birthdate" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition" />
                    </div>

                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition" />

                    <div>
                        <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none transition" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Profil</label>
                            <select name="roleId" onChange={handleChange} required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600">
                                <option value="">Choisir</option>
                                {roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Sécurité</label>
                            <select name="questionId" onChange={handleChange} required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600">
                                <option value="">Question</option>
                                {questions.map((q) => <option key={q.id} value={q.id}>{q.libelle}</option>)}
                            </select>
                        </div>
                    </div>

                    <input name="response" placeholder="Réponse à la question secrète" onChange={handleChange} required
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600 transition" />

                    {/* --- NOUVEAU : Bloc dynamique conditionnel pour l'Entreprise --- */}
                    {formData.role.name === 'Entreprise' && (
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-3 animate-in zoom-in-95 duration-200">
                            <h3 className="text-xs font-bold text-blue-900 uppercase flex items-center gap-2">
                                <i className="fa-solid fa-building"></i> Informations Société
                            </h3>
                            <input name="name" placeholder="Nom de l'entreprise" onChange={handleEnterpriseChange} required
                                   className="w-full px-4 py-2.5 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-600 transition text-sm" />
                            <div className="grid grid-cols-2 gap-3">
                                <input name="siret" placeholder="SIRET (14 chiffres)" maxLength="14" onChange={handleEnterpriseChange} required
                                       className="w-full px-4 py-2.5 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-600 transition text-sm font-mono" />
                                <input name="sector" placeholder="Secteur d'activité" onChange={handleEnterpriseChange}
                                       className="w-full px-4 py-2.5 rounded-xl border border-blue-200 outline-none focus:ring-2 focus:ring-blue-600 transition text-sm" />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all mt-2">
                        Démarrer l'inscription
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Déjà membre ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Connexion</Link>
                </p>
            </div>
        </div>
    );
}