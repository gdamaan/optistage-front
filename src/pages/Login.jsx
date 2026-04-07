import { useState } from 'react';
import { apiService } from '../services/api';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await apiService.login(email, password);
            alert("Connexion réussie : " + result);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion OptiStage</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
}