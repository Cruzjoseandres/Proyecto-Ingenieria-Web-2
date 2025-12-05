import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getInscripcionesByEvento } from '../../../../services/InscripcionService';
import { getLugarById } from '../../../../services/LugarService';

export const useReportesEvento = () => {
    const { eventoId } = useParams();
    const [inscripciones, setInscripciones] = useState([]);
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [inscData, eventoData] = await Promise.all([
                getInscripcionesByEvento(eventoId),
                getLugarById(eventoId)
            ]);
            setInscripciones(inscData);
            setEvento(eventoData);
            setError(null);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos del evento');
        } finally {
            setLoading(false);
        }
    }, [eventoId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Separar ingresados y no ingresados
    const ingresados = inscripciones.filter(i => i.ingresado);
    const noIngresados = inscripciones.filter(i => !i.ingresado);

    const formatFecha = (fecha) => {
        if (!fecha) return 'N/A';
        return new Date(fecha).toLocaleString('es-ES');
    };

    return {
        evento,
        inscripciones,
        ingresados,
        noIngresados,
        loading,
        error,
        formatFecha
    };
};
