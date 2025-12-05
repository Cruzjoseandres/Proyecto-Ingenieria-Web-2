import { useState, useEffect, useCallback } from 'react';
import { getMisInscripciones, cancelarInscripcion, subirComprobante } from '../../../../services/InscripcionService';

export const useMisInscripciones = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showQRModal, setShowQRModal] = useState(false);
    const [selectedInscripcion, setSelectedInscripcion] = useState(null);
    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [comprobanteFile, setComprobanteFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const loadInscripciones = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMisInscripciones();
            setInscripciones(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar inscripciones:', err);
            setError('Error al cargar las inscripciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInscripciones();
    }, [loadInscripciones]);

    const handleShowQR = (inscripcion) => {
        setSelectedInscripcion(inscripcion);
        setShowQRModal(true);
    };

    const handleCloseQRModal = () => setShowQRModal(false);

    const handleCancelar = async (inscripcionId) => {
        if (window.confirm('¿Estás seguro de cancelar esta inscripción?')) {
            try {
                await cancelarInscripcion(inscripcionId);
                loadInscripciones();
                alert('Inscripción cancelada exitosamente');
            } catch (err) {
                console.error('Error al cancelar:', err);
                alert(err.response?.data?.message || 'Error al cancelar la inscripción');
            }
        }
    };

    const handleShowComprobanteModal = (inscripcion) => {
        setSelectedInscripcion(inscripcion);
        setShowComprobanteModal(true);
    };

    const handleCloseComprobanteModal = () => {
        setShowComprobanteModal(false);
        setComprobanteFile(null);
    };

    const handleComprobanteChange = (e) => {
        setComprobanteFile(e.target.files[0]);
    };

    const handleSubirComprobante = async () => {
        if (!comprobanteFile) {
            alert('Por favor selecciona un archivo');
            return;
        }
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('comprobante', comprobanteFile);
            await subirComprobante(selectedInscripcion.evento.id, formData);
            handleCloseComprobanteModal();
            loadInscripciones();
            alert('Comprobante subido exitosamente. Espera la verificación del organizador.');
        } catch (err) {
            console.error('Error al subir comprobante:', err);
            alert('Error al subir el comprobante');
        } finally {
            setUploading(false);
        }
    };

    // Determina el estado para el badge
    const getEstadoVariant = (inscripcion) => {
        if (inscripcion.ingresado) return { bg: 'success', text: 'Ingresado' };
        if (inscripcion.comprobantePagoVerificado) return { bg: 'success', text: 'Verificado' };
        if (inscripcion.comprobantePago) return { bg: 'warning', text: 'Pendiente Verificación' };
        if (inscripcion.evento.precio > 0) return { bg: 'danger', text: 'Pago Pendiente' };
        return { bg: 'info', text: 'Inscrito' };
    };

    // Puede ver QR si está verificado o si el evento es gratis
    const puedeVerQR = (inscripcion) => {
        if (inscripcion.evento.precio === 0) return true;
        return inscripcion.comprobantePagoVerificado;
    };

    // Puede cancelar si el evento no ha pasado y no ha subido comprobante
    const puedeCancelar = (inscripcion) => {
        const fechaEvento = new Date(inscripcion.evento.fecha);
        return fechaEvento > new Date() && !inscripcion.comprobantePago;
    };

    // Necesita subir comprobante si el evento tiene precio y no lo ha subido
    const necesitaComprobante = (inscripcion) => {
        return inscripcion.evento.precio > 0 && !inscripcion.comprobantePago;
    };

    return {
        inscripciones,
        loading,
        error,
        showQRModal,
        selectedInscripcion,
        showComprobanteModal,
        comprobanteFile,
        uploading,
        handleShowQR,
        handleCloseQRModal,
        handleCancelar,
        handleShowComprobanteModal,
        handleCloseComprobanteModal,
        handleComprobanteChange,
        handleSubirComprobante,
        getEstadoVariant,
        puedeVerQR,
        puedeCancelar,
        necesitaComprobante
    };
};
