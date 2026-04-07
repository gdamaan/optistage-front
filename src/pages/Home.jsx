export default function Home() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* HERO SECTION */}
            <section className="relative rounded-3xl overflow-hidden shadow-2xl bg-blue-900 text-white">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1523240795612-9a054b0db644')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-transparent"></div>
                <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col items-start max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                        Gérez vos stages avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">simplicité</span>.
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                        La plateforme centralisée qui connecte étudiants, enseignants et tuteurs pour un suivi de stage fluide.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-1 flex items-center gap-2">
                        Trouver un stage <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </section>

            {/* FONCTIONNALITÉS */}
            <section>
                <div className="flex items-center gap-2 mb-8">
                    <span className="w-1 h-8 bg-orange-500 rounded-full"></span>
                    <h2 className="text-2xl font-bold text-gray-800">Fonctionnalités Clés</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard icon="fa-user-graduate" color="blue" title="Pour l'Étudiant" desc="Accédez à des milliers d'offres et suivez vos validations." />
                    <FeatureCard icon="fa-chalkboard-user" color="green" title="Pour l'Enseignant" desc="Validez les sujets et notez les rapports en ligne." />
                    <FeatureCard icon="fa-briefcase" color="purple" title="Pour le Tuteur" desc="Signez électroniquement et évaluez les soft-skills." />
                </div>
            </section>
        </div>
    );
}

// Un sous-composant local pour éviter la répétition (DRY)
function FeatureCard({ icon, color, title, desc }) {
    return (
        <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className={`w-14 h-14 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}