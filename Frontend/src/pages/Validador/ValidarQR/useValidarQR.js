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
    const handleEscanear = () => navigate('/validador/escanear');

    const formatFecha = (fecha) => {
        if (!fecha) return 'No disponible';
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Determinar estado visual basado en la respuesta del backend
    const getEstadoVisual = () => {
        if (!resultado) return null;

        switch (resultado.estado) {
            case 'valido':
                return {
                    tipo: 'success',
                    icono: '✓',
                    titulo: 'Ingreso Válido',
                    badge: 'ACCESO AUTORIZADO',
                    badgeColor: 'success'
                };
            case 'ya_ingresado':
                return {
                    tipo: 'warning',
                    icono: '⚠',
                    titulo: 'Ya Ingresado',
                    badge: 'ENTRADA DUPLICADA',
                    badgeColor: 'warning'
                };
            case 'no_confirmado':
                return {
                    tipo: 'danger',
                    icono: '✗',
                    titulo: 'No Confirmado',
                    badge: 'PAGO PENDIENTE',
                    badgeColor: 'danger'
                };
            case 'invalido':
            default:
                return {
                    tipo: 'danger',
                    icono: '✗',
                    titulo: 'Inválido',
                    badge: 'ACCESO DENEGADO',
                    badgeColor: 'danger'
                };
        }
    };

    return {
        token,
        validando,
        resultado,
        error,
        handleVolver,
        handleEscanear,
        formatFecha,
        getEstadoVisual
    };
};
