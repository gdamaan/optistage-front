export default function CGU() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 my-12 animate-in fade-in duration-300">
            <header className="border-b pb-6">
                <h1 className="text-3xl font-black text-brand-900 tracking-tight">
                    CGU & Politique de Confidentialité
                </h1>
                <p className="text-gray-500 mt-1">Conditions d'utilisation de la plateforme OptiStage et gestion de vos données.</p>
            </header>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">

                {/* PARTIE 1 : CGU */}
                <div className="border-l-4 border-accent-500 pl-4 my-6">
                    <h2 className="text-xl font-black text-brand-900 uppercase tracking-wide">
                        Conditions Générales d'Utilisation
                    </h2>
                </div>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-circle-info text-accent-500"></i> 1. Objet du service
                    </h3>
                    <p>
                        La plateforme <strong>OptiStage</strong> a pour but de centraliser et de faciliter la gestion des stages académiques pour les étudiants, les enseignants et les entreprises partenaires de l'école ENSITECH. L'accès au site implique l'acceptation pleine et entière des présentes conditions.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-user-shield text-accent-500"></i> 2. Accès et Sécurité des comptes
                    </h3>
                    <p>
                        Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion. Le système impose des critères de complexité stricts lors de la création du mot de passe et intègre une protection anti-robot (CAPTCHA) pour sécuriser l'accès aux tableaux de bord.
                    </p>
                </section>

                {/* PARTIE 2 : POLITIQUE DE CONFIDENTIALITÉ */}
                <div className="border-l-4 border-accent-500 pl-4 my-8pt-4">
                    <h2 className="text-xl font-black text-brand-900 uppercase tracking-wide">
                        Politique de Confidentialité (RGPD)
                    </h2>
                </div>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-database text-accent-500"></i> 3. Collecte et Finalité des données
                    </h3>
                    <p>
                        Dans le cadre de votre recherche de stage, <strong>OptiStage</strong> collecte et traite les données suivantes :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Profil :</strong> Nom, prénom, adresse email, date de naissance et rôle académique.</li>
                        <li><strong>Candidatures :</strong> Lettres de motivation et Curriculum Vitae (stockés au format PDF).</li>
                    </ul>
                    <p className="mt-2">
                        Ces informations sont exclusivement destinées au traitement des dossiers de candidature entre les étudiants et les recruteurs, sous la supervision du corps enseignant.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-hourglass-half text-accent-500"></i> 4. Conservation et Droits des utilisateurs
                    </h3>
                    <p>
                        Conformément à la réglementation RGPD, les données sont conservées pour la durée stricte du cycle universitaire de l'étudiant. En application de la loi informatique et libertés, vous disposez d'un droit d'accès, de rectification et de suppression de vos données, activable directement depuis votre espace profil ou sur demande.
                    </p>
                </section>

            </div>
        </div>
    );
}