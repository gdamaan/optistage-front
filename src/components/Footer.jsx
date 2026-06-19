import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_test_nbg.png'; // Importation de notre nouveau logo

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 pt-12 pb-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Branding Section */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center mb-4 gap-3">
                            {/* NOUVEAU LOGO INTÉGRÉ ICI */}
                            <img src={logo} alt="Logo OptiStage" className="w-10 h-10 object-contain drop-shadow-sm" />
                            <span className="text-2xl font-bold text-brand-900 tracking-tight">
                                OptiStage
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Connecter les talents universitaires aux opportunités industrielles de demain.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">Plateforme</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">Accueil</Link></li>
                            <li><Link to="/offers" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">Offres de stage</Link></li>
                            <li><Link to="/login" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">Connexion</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">Contact</a></li>
                            <li><Link to="/cgu" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">CGU</Link></li>
                            <li><Link to="/mentions-legales" className="text-gray-600 hover:text-accent-500 text-sm transition-colors">Mentions Légales</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact rapide */}
                    <div>
                        <h3 className="text-sm font-semibold text-brand-900 uppercase tracking-wider mb-4">Contact</h3>
                        <p className="text-gray-600 text-sm mb-4">Des questions ? Contactez notre équipe support.</p>
                        <a href="mailto:support@optistage.com" className="text-sm font-medium text-accent-500 hover:text-accent-600 hover:underline transition-colors">
                            support@optistage.com
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-gray-400 text-xs">
                    <p>© {currentYear} OptiStage Solutions.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="hover:text-accent-500 transition-colors cursor-default">Status : Tous les systèmes sont en marche</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;