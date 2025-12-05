import { useState, useEffect, useCallback } from 'react';
import { getAllUsers, createUser, createValidator, createOrganizador, createAdmin, updateUser, deleteUser } from '../../../../services/UserService';

export const useAdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('crear');
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        role: '',
    });

    const loadUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsuarios(data);
            setError(null);
        } catch (err) {
            console.error('Error al cargar usuarios:', err);
            setError('Error al cargar los usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsuarios();
    }, [loadUsuarios]);

    const handleOpenModal = (type, user = null) => {
        setModalType(type);
        if (user) {
            setSelectedUser(user);
            setFormData({
                email: user.email,
                password: '',
                fullName: user.fullName,
                role: user.role
            });
        } else {
            setSelectedUser(null);
            setFormData({
                email: '',
                password: '',
                fullName: '',
                role: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalType === 'editar') {
                const updateData = {
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                    role: formData.role
                };
                if (!updateData.password) {
                    delete updateData.password;
                }
                await updateUser(selectedUser.id, updateData);
                alert('Usuario actualizado exitosamente');
            } else {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName
                };

                if (formData.role === 'validator') {
                    await createValidator(payload);
                } else if (formData.role === 'organizador') {
                    await createOrganizador(payload);
                } else if (formData.role === 'admin') {
                    await createAdmin(payload);
                } else {
                    await createUser(payload);
                }
                alert('Usuario creado exitosamente');
            }
            handleCloseModal();
            loadUsuarios();
        } catch (err) {
            console.error('Error:', err);
            alert(err.response?.data?.message || 'Error al guardar el usuario');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                await deleteUser(id);
                alert('Usuario eliminado exitosamente');
                loadUsuarios();
            } catch (err) {
                console.error('Error al eliminar:', err);
                alert('Error al eliminar el usuario');
            }
        }
    };

    const getRoleBadge = (role) => {
        const variants = {
            admin: 'danger',
            organizador: 'primary',
            validator: 'warning',
            user: 'secondary'
        };
        return variants[role] || 'secondary';
    };

    return {
        usuarios,
        loading,
        error,
        showModal,
        modalType,
        formData,
        handleOpenModal,
        handleCloseModal,
        handleChange,
        handleSubmit,
        handleDelete,
        getRoleBadge
    };
};
