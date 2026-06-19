export default function MentionsLegales() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 my-12 animate-in fade-in duration-300">
            <header className="border-b pb-6">
                <h1 className="text-3xl font-black text-brand-900 tracking-tight">
                    Mentions Légales
                </h1>
                <p className="text-gray-500 mt-1">Informations obligatoires concernant l'éditeur et l'hébergeur.</p>
            </header>

            <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-user text-accent-500"></i> 1. Édition du site
                    </h2>
                    <p>
                        En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, il est précisé aux utilisateurs de la plateforme <strong>OptiStage</strong> l'identité de son responsable de publication :
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Propriétaire & Éditeur :</strong> Amaan GHULAM DIN</li>
                        <li><strong>Statut :</strong> Projet d'études – Académique</li>
                        <li><strong>Établissement :</strong> ENSITECH</li>
                    </ul>
                </section>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-server text-accent-500"></i> 2. Hébergement
                    </h2>
                    <p>
                        Le site est actuellement exécuté et hébergé en environnement de développement local (<code>localhost</code>).
                    </p>
                    <p className="mt-2 italic text-gray-400 text-xs">
                        Note technique : Pour la phase de production future, les infrastructures de stockage seront localisées au sein de l'Union Européenne conformément aux directives du RGPD.
                    </p>
                </section>

                <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-900 mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-copyright text-accent-500"></i> 3. Propriété intellectuelle
                    </h2>
                    <p>
                        L'ensemble des contenus (textes, graphismes, logos, architecture globale et code source) de la plateforme <strong>OptiStage</strong> sont la propriété exclusive de leur auteur, sauf mention contraire explicite. Toute reproduction ou distribution non autorisée est passible de poursuites.
                    </p>
                </section>
            </div>
        </div>
    );
}