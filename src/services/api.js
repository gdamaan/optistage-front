const API_BASE_URL = "http://localhost:9991/ws/rest";

export const apiService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // CRUCIAL : Autorise le transport des cookies (reception et envoi)
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Identifiants incorrects");
        }

        return await response.json();
    },

    /**
     * Méthode d'inscription
     */
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // On l'ajoute par défaut pour permettre au serveur de poser un cookie
            // de session dès l'inscription si besoin
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de l'inscription");
        }

        return await response.json();
    },

    getQuestions: async () => {
        const response = await fetch(`${API_BASE_URL}/questions/all`, {
            credentials: 'include' // Nécessaire si cette route devient protégée
        });
        if (!response.ok) throw new Error("Impossible de récupérer les questions.");
        return await response.json();
    },

    getRoles: async () => {
        const response = await fetch(`${API_BASE_URL}/roles/all`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Impossible de récupérer les rôles.");
        return await response.json();
    },
};