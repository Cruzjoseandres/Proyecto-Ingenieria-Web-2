import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComprobantesByEvento, verificarComprobante } from '../../../../services/InscripcionService';
import { getLugarById } from '../../../../services/LugarService';

const API_URL = 'http://localhost:3000';

export const useVerificarComprobantes = () => {
    const { eventoId } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [comprobantes, setComprobantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [eventoData, comprobantesData] = await Promise.all([
                getLugarById(eventoId),
                getComprobantesByEvento(eventoId)
            ]);
            setEvento(eventoData);
            console.log("comprobantes", comprobantesData)
            setComprobantes(comprobantesData);
            setError(null);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    }, [eventoId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleVerificar = async (inscripcionId, aprobar) => {
        try {
            await verificarComprobante(inscripcionId, aprobar);
            alert(aprobar ? 'Comprobante aprobado' : 'Comprobante rechazado');
            loadData();
        } catch (err) {
            console.error('Error al verificar:', err);
            alert('Error al verificar el comprobante');
        }
    };

    const handleVerImagen = (comprobantePath) => {
        setSelectedImage(comprobantePath);
        setShowImageModal(true);
    };

    const handleCloseModal = () => {
        setShowImageModal(false);
        setSelectedImage(null);
    };

    const handleVolver = () => {
        navigate(-1);
    };

    return {
        evento,
        comprobantes,
        loading,
        error,
        showImageModal,
        selectedImage,
        handleVerificar,
        handleVerImagen,
        handleCloseModal,
        handleVolver
    };
};
