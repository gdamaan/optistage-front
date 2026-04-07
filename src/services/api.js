const API_BASE_URL = "http://localhost:9991/ws/rest";

export const apiService = {
    // Exemple pour le login que vous avez codé dans UserController
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/users/login/${email}/${password}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Identifiants incorrects");
        return await response.text(); // Car votre UserController renvoie un String
    }
};