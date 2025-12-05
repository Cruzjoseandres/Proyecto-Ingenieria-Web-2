import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLugar } from '../../../../services/LugarService';

export const useEventoCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        precio: 0,
        maxPersonas: 50
    });
    const [position, setPosition] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(true);

    // Obtener ubicación real al cargar
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setGettingLocation(false);
                },
                (err) => {
                    console.log('Error obteniendo ubicación:', err);
                    setPosition([-17.3935, -66.1570]);
                    setGettingLocation(false);
                },
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            setPosition([-17.3935, -66.1570]);
            setGettingLocation(false);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile) {
            setError('Debes seleccionar una imagen para el evento');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const submitData = new FormData();
            submitData.append('titulo', formData.titulo);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('fecha', formData.fecha);
            submitData.append('precio', formData.precio);
            submitData.append('maxPersonas', formData.maxPersonas);
            submitData.append('latitude', position[0].toString());
            submitData.append('longitude', position[1].toString());
            submitData.append('image', imageFile);
            await createLugar(submitData);
            alert('Evento creado exitosamente');
            navigate('/organizador/eventos');
        } catch (err) {
            console.error('Error al crear evento:', err);
            setError(err.response?.data?.message || 'Error al crear el evento');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => navigate(-1);

    return {
        formData,
        position,
        setPosition,
        imagePreview,
        error,
        loading,
        gettingLocation,
        handleChange,
        handleImageChange,
        handleSubmit,
        handleCancel
    };
};
