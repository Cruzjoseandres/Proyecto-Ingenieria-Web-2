import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLugarById } from '../../../../services/LugarService';
import { createInscripcion, subirComprobante } from '../../../../services/InscripcionService';
import { getUserInfo, getAccessToken } from '../../../../utils/TokenUtilities';

export const useEventoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [evento, setEvento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inscribiendo, setInscribiendo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('success');

    // Estados para modal de comprobante
    const [showComprobanteModal, setShowComprobanteModal] = useState(false);
    const [comprobanteFile, setComprobanteFile] = useState(null);
    const [comprobantePreview, setComprobantePreview] = useState(null);

    const userInfo = getUserInfo();
    const isLoggedIn = !!getAccessToken();

    const loadEvento = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getLugarById(id);
            setEvento(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar evento:', err);
            setError('Error al cargar el evento');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadEvento();
    }, [loadEvento]);

    // Iniciar inscripción - verificar si necesita comprobante
    const handleInscribirse = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        // Si el evento tiene precio, mostrar modal para comprobante
        if (evento && evento.precio > 0) {
            setShowComprobanteModal(true);
        } else {
            // Evento gratuito - inscribir directamente
            procesarInscripcion();
        }
    };

    // Procesar la inscripción (sin comprobante - evento gratuito)
    const procesarInscripcion = async () => {
        try {
            setInscribiendo(true);
            await createInscripcion(id);
            setModalType('success');
            setModalMessage('¡Inscripción exitosa! Puedes ver tu QR en "Mis Inscripciones"');
            setShowModal(true);
        } catch (err) {
            console.error('Error al inscribirse:', err);
            setModalType('danger');
            setModalMessage(err.response?.data?.message || 'Error al inscribirse al evento');
            setShowModal(true);
        } finally {
            setInscribiendo(false);
        }
    };

    // Procesar inscripción con comprobante (evento de pago)
    const handleConfirmarInscripcion = async () => {
        if (!comprobanteFile) {
            alert('Por favor, selecciona una imagen del comprobante de pago');
            return;
        }

        try {
            setInscribiendo(true);

            // 1. Crear inscripción
            await createInscripcion(id);

            // 2. Subir comprobante
            const formData = new FormData();
            formData.append('comprobante', comprobanteFile);
            await subirComprobante(id, formData);

            setShowComprobanteModal(false);
            setComprobanteFile(null);
            setComprobantePreview(null);

            setModalType('success');
            setModalMessage('¡Inscripción exitosa! Tu comprobante será verificado por el organizador. Puedes ver el estado en "Mis Inscripciones"');
            setShowModal(true);
        } catch (err) {
            console.error('Error al inscribirse:', err);
            setModalType('danger');
            setModalMessage(err.response?.data?.message || 'Error al inscribirse al evento');
            setShowModal(true);
            setShowComprobanteModal(false);
        } finally {
            setInscribiendo(false);
        }
    };

    const handleComprobanteChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setComprobanteFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setComprobantePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleCloseComprobanteModal = () => {
        setShowComprobanteModal(false);
        setComprobanteFile(null);
        setComprobantePreview(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (modalType === 'success') {
            navigate('/participante/mis-inscripciones');
        }
    };

    const handleVolver = () => navigate(-1);
    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPosition = () => {
        if (!evento) return [0, 0];
        return [parseFloat(evento.latitude), parseFloat(evento.longitude)];
    };

    return {
        evento,
        loading,
        error,
        inscribiendo,
        showModal,
        modalMessage,
        modalType,
        userInfo,
        isLoggedIn,
        // Comprobante
        showComprobanteModal,
        comprobantePreview,
        handleComprobanteChange,
        handleConfirmarInscripcion,
        handleCloseComprobanteModal,
        // Acciones
        handleInscribirse,
        handleCloseModal,
        handleVolver,
        handleLogin,
        handleRegister,
        formatFecha,
        getPosition
    };
};
