import { Container, Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { useAdminUsuarios } from './useAdminUsuarios';
import './AdminUsuarios.css';

const AdminUsuarios = () => {
    const {
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
    } = useAdminUsuarios();

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="admin-usuarios-container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Gestión de Usuarios</h1>
                <Button variant="primary" onClick={() => handleOpenModal('crear')}>
                    + Crear Usuario
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.fullName}</td>
                            <td>{usuario.email}</td>
                            <td><Badge bg={getRoleBadge(usuario.role)}>{usuario.role}</Badge></td>
                            <td>
                                <div className="d-flex gap-2">
                                    <Button variant="warning" size="sm" onClick={() => handleOpenModal('editar', usuario)}>
                                        Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(usuario.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'editar' ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Completo *</Form.Label>
                            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña {modalType === 'editar' && '(dejar vacío para no cambiar)'}</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required={modalType === 'crear'} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required={modalType === 'crear'}
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="usuario">Usuario</option>
                                <option value="organizador">Organizador</option>
                                <option value="validator">Validador</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Cancelar</Button>
                        <Button variant="primary" type="submit">
                            {modalType === 'editar' ? 'Guardar Cambios' : 'Crear Usuario'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default AdminUsuarios;
