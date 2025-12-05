import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLugares, deleteLugar } from '../../../../services/LugarService';

export const useEventosOrganizador = () => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const loadEventos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllLugares();
            setEventos(data);
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

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este evento?')) {
            try {
                await deleteLugar(id);
                loadEventos();
                alert('Evento eliminado exitosamente');
            } catch (err) {
                console.error('Error al eliminar:', err);
                alert(err.response?.data?.message || 'Error al eliminar el evento');
            }
        }
    };

    const handleCrear = () => navigate('/organizador/eventos/crear');
    const handleEditar = (id) => navigate(`/organizador/eventos/editar/${id}`);
    const handleVerComprobantes = (id) => navigate(`/organizador/comprobantes/${id}`);
    const handleVerReportes = (id) => navigate(`/organizador/reportes/${id}`);

    const isEventoPasado = (fecha) => new Date(fecha) < new Date();

    return {
        eventos,
        loading,
        error,
        handleDelete,
        handleCrear,
        handleEditar,
        handleVerComprobantes,
        handleVerReportes,
        isEventoPasado
    };
};
