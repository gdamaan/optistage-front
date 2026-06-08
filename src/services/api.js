const API_BASE_URL = "http://localhost:9991/ws/rest";


export const apiService = {
    // Fonction utilitaire de Jarvis pour convertir un fichier en Base64
    // (À placer en dehors de l'objet apiService, juste au-dessus)
    toBase64: (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // On retire l'en-tête "data:application/pdf;base64," pour ne garder que le contenu brut
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    }),

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

    getStudentApplications: async (studentId) => {
        const response = await fetch(`${API_BASE_URL}/applications/student/${studentId}`, {
            credentials: 'include'
        });

        if (!response.ok) throw new Error("Impossible de récupérer les candidatures.");
        return await response.json();
    },

    getRoles: async () => {
        const response = await fetch(`${API_BASE_URL}/roles/all`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Impossible de récupérer les rôles.");
        return await response.json();
    },

    updateProfile: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/users/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error("Échec de la mise à jour du profil.");
        return await response.text();
    },

    // 4. Récupérer les candidatures d'une offre
    getApplicationsByOffer: async (offerId) => {
        const response = await fetch(`${API_BASE_URL}/applications/offer/${offerId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Impossible de récupérer les candidatures.");
        return await response.json();
    },

    // 5. Mise à jour du statut (Adapté pour votre @QueryParam)
    updateApplicationStatus: async (applicationId, status) => {
        // Le statut est passé directement dans l'URL avec ?status=
        const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status?status=${encodeURIComponent(status)}`, {
            method: 'PUT',
            credentials: 'include'
        });
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de la modification du statut.");
        }
        return await response.json();
    },

    getEnterpriseByManager: async (managerId) => {
        const response = await fetch(`${API_BASE_URL}/enterprises/manager/${managerId}`, {
            credentials: 'include'
        });
        if (response.status === 404) return null; // Pas encore d'entreprise liée
        if (!response.ok) throw new Error("Erreur lors de la récupération de l'entreprise.");
        return await response.json();
    },

    updateEnterprise: async (enterpriseData) => {
        const response = await fetch(`${API_BASE_URL}/enterprises/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(enterpriseData)
        });
        if (!response.ok) throw new Error("Échec de la mise à jour de l'entreprise.");
        return await response.json();
    },

    createEnterprise: async (enterpriseData) => {
        const response = await fetch(`${API_BASE_URL}/enterprises/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(enterpriseData)
        });
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de la création de l'entreprise.");
        }
        return await response.json();
    },

    applyToOffer: async (applicationData) => {
        const response = await fetch(`${API_BASE_URL}/applications/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(applicationData)
        });
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de l'envoi de la candidature.");
        }
        return await response.json();
    },

    getAllOffers: async () => {
        const response = await fetch(`${API_BASE_URL}/offers/all`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Impossible de récupérer les offres de stage.");
        return await response.json();
    },

    searchOffers: async (title) => {
        // Encodage du titre pour éviter les erreurs avec les espaces ou caractères spéciaux dans l'URL
        const response = await fetch(`${API_BASE_URL}/offers/search?title=${encodeURIComponent(title)}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Erreur lors de la recherche des offres.");
        return await response.json();
    },

    getOffersByEnterprise: async (enterpriseId) => {
        const response = await fetch(`${API_BASE_URL}/offers/enterprise/${enterpriseId}`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Erreur lors de la récupération de vos offres.");
        return await response.json();
    },

    createOffer: async (offerData) => {
        const response = await fetch(`${API_BASE_URL}/offers/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(offerData)
        });
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de la création de l'offre.");
        }
        return await response.json();
    },

// 1. Récupération du CV (On lit du JSON, on le transforme en Fichier)
    getCV: async (cvId) => { // <-- MODIFICATION ICI : On prend cvId
        // L'URL utilise maintenant cvId pour chercher directement dans la base NoSQL
        const response = await fetch(`${API_BASE_URL}/cv/${cvId}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("Impossible de charger le CV.");
        }

        // Le Back-end renvoie un JSON
        const data = await response.json();

        // On récupère la chaîne Base64 envoyée par le Java
        const base64Content = data.content;

        // Transformation de la chaîne Base64 en Blob binaire pour que le navigateur puisse l'afficher
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // On renvoie le Blob, exactement comme l'attendait OfferApplications.jsx
        return new Blob([byteArray], { type: 'application/pdf' });
    },

// 2. Envoi du CV (On transforme le fichier en Base64, on l'envoie en JSON)
    uploadCV: async (file) => {
        // On convertit le fichier binaire en texte Base64
        const base64Content = await apiService.toBase64(file);

        // On construit l'objet JSON qui correspond à votre CvUploadDto en Java
        const payload = {
            fileName: file.name,
            base64Content: base64Content
        };

        // L'URL est maintenant générique, exactement comme dans le CvController
        const response = await fetch(`${API_BASE_URL}/cv/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de l'envoi du CV vers la base NoSQL.");
        }

        const data = await response.json();
        // On récupère l'ID généré par MongoDB !
        return data.cvId;
    },

    // --- NOUVELLES MÉTHODES POUR LES STAGES (INTERNSHIPS) ---

    // 1. Récupérer TOUS les stages (Vue Professeur / Admin V1)
    getAllInternships: async () => {
        const response = await fetch(`${API_BASE_URL}/internships/all`, {
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Impossible de récupérer la liste des stages.");
        return await response.json();
    },

    // 2. Mettre à jour un stage (Statut convention, Note, Feedback)
    updateInternship: async (id, internshipData) => {
        const response = await fetch(`${API_BASE_URL}/internships/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            // On envoie les champs modifiés (ex: conventionStatus, note_finale)
            body: JSON.stringify(internshipData)
        });
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Échec de la mise à jour du stage.");
        }
        return await response.json();
    },

    /**
     * Méthode de validation de compte via token email
     */
    validateAccount: async (token) => {
        const response = await fetch(`${API_BASE_URL}/users/validate?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            // Pas besoin de 'credentials: include' ici, l'utilisateur n'est pas encore connecté
        });

        if (!response.ok) {
            // Le backend renvoie du JSON même pour les erreurs, on tente de le lire
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Le lien est expiré ou invalide.");
        }

        return await response.json();
    }
};