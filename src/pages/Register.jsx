import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        firstname: '',       // Aligné sur User.java
        lastname: '',        // Aligné sur User.java
        email: '',
        password: '',
        birthdate: '',       // Format temporaire yyyy-mm-dd (input date)
        response: '',        // Aligné sur User.java
        question: { id: "" },
        role: { name: "" }    // Requis par UserService.subscribe()
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
                setError("Erreur de connexion aux services système.");
            }
        };
        loadInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "roleId") {
            // On cherche le rôle sélectionné dans la liste pour récupérer son "label"
            const selectedRole = roles.find(r => r.id === parseInt(value));
            setFormData({
                ...formData,
                role: { name: selectedRole ? selectedRole.label : "" } // On utilise .label ici !
            });
        } else if (name === "questionId") {
            setFormData({ ...formData, question: { id: parseInt(value) } });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Conversion de la date yyyy-mm-dd vers dd/MM/yyyy pour satisfaire Jackson
        let formattedBirthdate = formData.birthdate;
        if (formData.birthdate.includes('-')) {
            const [year, month, day] = formData.birthdate.split('-');
            formattedBirthdate = `${day}/${month}/${year}`;
        }

        const dataToSend = {
            ...formData,
            birthdate: formattedBirthdate
        };

        try {
            await apiService.register(dataToSend);
            alert("Inscription à Optistage réussie ! Veuillez attendre qu'un administrateur valide votre compte.");
            navigate('/login');
        } catch (err) {
            // Affiche le message d'erreur précis (ex: rôle inexistant)
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/10">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-900">OptiStage</h2>
                    <p className="text-gray-500 mt-2 text-sm">Initialisation du compte</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-xs font-bold text-center whitespace-pre-wrap">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input name="firstname" placeholder="Prénom" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
                        <input name="lastname" placeholder="Nom" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Date de naissance</label>
                        <input type="date" name="birthdate" onChange={handleChange} required
                               className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>

                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />

                    <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" />

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Rôle</label>
                            <select name="roleId" onChange={handleChange} required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-600">
                                <option value="">Profil</option>
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

                    <input name="response" placeholder="Réponse secrète" onChange={handleChange} required
                           className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-600" />

                    <button type="submit" style={{ backgroundColor: '#2563eb' }}
                            className="w-full text-white font-bold py-3.5 rounded-xl shadow-lg hover:brightness-110 mt-2">
                        Lancer l'inscription
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    Déjà inscrit ? <Link to="/login" className="text-blue-600 font-bold hover:underline">Connexion</Link>
                </p>
            </div>
        </div>
    );
}