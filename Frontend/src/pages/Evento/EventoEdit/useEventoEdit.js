import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLugarById, updateLugar } from '../../../../services/LugarService';

export const useEventoEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        fecha: '',
        precio: 0,
        maxPersonas: 50
    });
    const [position, setPosition] = useState([-17.3935, -66.1570]);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadEvento = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getLugarById(id);
            const fecha = new Date(data.fecha);
            const fechaLocal = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
                .toISOString().slice(0, 16);
            setFormData({
                titulo: data.titulo,
                descripcion: data.descripcion,
                fecha: fechaLocal,
                precio: data.precio,
                maxPersonas: data.maxPersonas
            });
            setPosition([parseFloat(data.latitude), parseFloat(data.longitude)]);
            setCurrentImage(data.imagePath);
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
        try {
            setSaving(true);
            setError(null);
            const submitData = new FormData();
            submitData.append('titulo', formData.titulo);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('fecha', formData.fecha);
            submitData.append('precio', formData.precio);
            submitData.append('maxPersonas', formData.maxPersonas);
            submitData.append('latitude', position[0].toString());
            submitData.append('longitude', position[1].toString());
            if (imageFile) submitData.append('image', imageFile);
            await updateLugar(id, submitData);
            alert('Evento actualizado exitosamente');
            navigate('/organizador/eventos');
        } catch (err) {
            console.error('Error al actualizar evento:', err);
            setError(err.response?.data?.message || 'Error al actualizar el evento');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => navigate(-1);

    return {
        formData,
        position,
        setPosition,
        imagePreview,
        currentImage,
        error,
        loading,
        saving,
        handleChange,
        handleImageChange,
        handleSubmit,
        handleCancel
    };
};
