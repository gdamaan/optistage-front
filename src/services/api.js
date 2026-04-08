const API_BASE_URL = "http://localhost:9991/ws/rest";

export const apiService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login/${email}/${password}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Identifiants incorrects");
        return await response.text();
    },

    /**
     * Méthode d'inscription
     * Cible /users/create conformément au UserController
     */
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de l'inscription");
        }

        return await response.json();
    },

    getQuestions: async () => {
        const response = await fetch(`${API_BASE_URL}/questions/all`);
        if (!response.ok) throw new Error("Impossible de récupérer les questions.");
        return await response.json();
    },

    getRoles: async () => {
        const response = await fetch(`${API_BASE_URL}/roles/all`);
        if (!response.ok) throw new Error("Impossible de récupérer les rôles.");
        return await response.json();
    },
};