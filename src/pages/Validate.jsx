import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const Validate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // La machine à états : loading, success, ou error
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Validation de votre compte en cours, veuillez patienter...');

    useEffect(() => {
        // On récupère le paramètre "?token=" dans l'URL
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Le lien de validation est invalide ou incomplet.');
            return;
        }

        // Appel propre via notre architecture de services centralisée
        apiService.validateAccount(token)
            .then((data) => {
                setStatus('success');
                setMessage(data.message || 'Votre compte a été activé avec succès !');
            })
            .catch((error) => {
                setStatus('error');
                setMessage(error.message || 'Les serveurs d\'OptiStage sont inaccessibles.');
            });
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white shadow-xl rounded-2xl max-w-md w-full text-center transition-all">
                <h2 className="text-2xl font-extrabold mb-6 text-gray-800">OptiStage</h2>

                {status === 'loading' && (
                    <div className="flex flex-col items-center animate-pulse">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500 font-medium">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="animate-fade-in-up">
                        <div className="text-green-500 mb-4 flex justify-center">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-gray-700 font-medium mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg w-full transition duration-300 shadow-md hover:shadow-lg"
                        >
                            Accéder à la connexion
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="animate-fade-in-up">
                        <div className="text-red-500 mb-4 flex justify-center">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <p className="text-red-600 font-medium mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg w-full transition duration-300 shadow-sm"
                        >
                            Retourner à l'accueil
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Validate;