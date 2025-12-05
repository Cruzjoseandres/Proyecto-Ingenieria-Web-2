import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validarQr } from '../../../../services/InscripcionService';

export const useValidarQR = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [validando, setValidando] = useState(false);
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState(null);

    const handleValidar = useCallback(async () => {
        try {
            setValidando(true);
            setError(null);
            const data = await validarQr(token);
            setResultado(data);
        } catch (err) {
            console.error('Error al validar:', err);
            setError(err.response?.data?.message || 'Error al validar el código QR');
        } finally {
            setValidando(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            handleValidar();
        }
    }, [token, handleValidar]);

    const handleVolver = () => navigate('/validador');

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return {
        token,
        validando,
        resultado,
        error,
        handleVolver,
        formatFecha
    };
};
