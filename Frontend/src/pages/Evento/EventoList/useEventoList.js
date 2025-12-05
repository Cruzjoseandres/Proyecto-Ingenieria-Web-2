import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLugares } from '../../../../services/LugarService';

export const useEventoList = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadEventos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllLugares();
            // Filtrar solo eventos futuros
            const eventosFuturos = data.filter(evento => {
                const fechaEvento = new Date(evento.fecha);
                return fechaEvento >= new Date();
            });
            setEventos(eventosFuturos);
            setError(null);
        } catch (err) {
            console.error('Error al cargar eventos:', err);
            setError('Error al cargar los eventos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEventos();
    }, [loadEventos]);

    const handleVerDetalle = (id) => navigate(`/eventos/${id}`);

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
        eventos,
        loading,
        error,
        handleVerDetalle,
        formatFecha
    };
};
