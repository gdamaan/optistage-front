import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* HERO SECTION */}
            <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-brand-900 text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-600 to-transparent"></div>
                <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col items-start max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        Gérez vos stages avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-100 to-accent-400">simplicité</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-brand-100 mb-8 max-w-2xl leading-relaxed">
                        La plateforme centralisée qui connecte étudiants, enseignants et tuteurs pour un suivi de stage fluide.
                    </p>
                    {/* Transformation du button en Link vers /offers */}
                    <Link to="/offers" className="w-fit bg-accent-500 hover:bg-accent-600 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2">
                        Trouver un stage <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </div>
            </section>

            {/* FONCTIONNALITÉS */}
            <section>
                <div className="flex items-center gap-2 mb-8">
                    <span className="w-1 h-8 bg-accent-500 rounded-full"></span>
                    <h2 className="text-2xl font-bold text-gray-800">Fonctionnalités Clés</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon="fa-user-graduate"
                        colorClasses="bg-brand-50 text-brand-600"
                        title="Pour l'Étudiant"
                        desc="Accédez à des milliers d'offres et suivez vos validations."
                        linkTo="/student-dashboard"
                    />
                    <FeatureCard
                        icon="fa-chalkboard-user"
                        colorClasses="bg-accent-50 text-accent-600"
                        title="Pour l'Enseignant"
                        desc="Validez les sujets et notez les rapports en ligne."
                        linkTo="/teacher-dashboard"
                    />
                    <FeatureCard
                        icon="fa-briefcase"
                        colorClasses="bg-tech-50 text-tech-500"
                        title="Pour le Tuteur"
                        desc="Signez électroniquement et évaluez les soft-skills."
                        linkTo="/tutor-dashboard"
                    />
                </div>
            </section>
        </div>
    );
}

// Le sous-composant intègre désormais un lien (Link) et une animation au survol
function FeatureCard({ icon, colorClasses, title, desc, linkTo }) {
    return (
        <Link to={linkTo} className="block group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${colorClasses}`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-accent-500 transition-colors">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            <div className="mt-4 text-sm font-bold text-gray-400 group-hover:text-accent-500 transition-colors flex items-center gap-2">
                Accéder à l'espace <i className="fa-solid fa-arrow-right"></i>
            </div>
        </Link>
    );
}