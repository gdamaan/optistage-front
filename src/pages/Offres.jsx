import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';

export default function Offers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams] = useSearchParams();

    // On récupère le paramètre 'title' de l'URL s'il existe
    const titleQuery = searchParams.get('title') || '';

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                setLoading(true);
                let data;
                if (titleQuery) {
                    // Si un titre est présent dans l'URL, on lance la recherche
                    data = await apiService.searchOffers(titleQuery);
                } else {
                    // Sinon, on affiche tout le catalogue
                    data = await apiService.getAllOffers();
                }
                setOffers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOffers();
    }, [titleQuery]); // Se déclenche à chaque fois que l'URL change

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            <header className="flex justify-between items-end border-b pb-6">
                <div>
                    <h1 className="text-3xl font-black text-blue-900 tracking-tight">
                        {titleQuery ? `Résultats pour "${titleQuery}"` : "Toutes les offres"}
                    </h1>
                    <p className="text-gray-500 mt-1">Trouvez le stage qui propulsera votre carrière.</p>
                </div>
                <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                    {offers.length} offre(s) trouvée(s)
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-100 text-center">
                    <i className="fa-solid fa-triangle-exclamation text-2xl mb-2 block"></i>
                    <p className="font-bold">{error}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer) => (
                        <div key={offer.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                                    {offer.enterpriseName}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <i className="fa-solid fa-location-dot"></i> {offer.location}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                                {offer.title}
                            </h3>

                            <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow italic">
                                "{offer.description}"
                            </p>

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <div className="text-green-600 font-bold text-sm">
                                    {offer.salary ? `${offer.salary}€ / mois` : 'Gratification à négocier'}
                                </div>
                                <button className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors">
                                    Voir plus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}