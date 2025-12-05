import { Container, Card, Table, Button, Spinner, Alert, Modal, Image } from 'react-bootstrap';
import { useVerificarComprobantes } from './useVerificarComprobantes';
import './VerificarComprobantes.css';

const VerificarComprobantes = () => {
    const {
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
    } = useVerificarComprobantes();

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
                <Button onClick={handleVolver}>Volver</Button>
            </Container>
        );
    }

    return (
        <Container className="verificar-comprobantes-container mt-4">
            <Button variant="secondary" onClick={handleVolver} className="mb-3">
                ← Volver
            </Button>

            <h1 className="mb-4">Verificar Comprobantes de Pago</h1>

            {evento && (
                <Card className="evento-info-card mb-4">
                    <Card.Body>
                        <Card.Title>{evento.titulo}</Card.Title>
                        <div className="evento-meta">
                            <span>📅 {new Date(evento.fecha).toLocaleDateString('es-ES')}</span>
                            <span>💰 ${evento.precio}</span>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {comprobantes.length === 0 ? (
                <Alert variant="info" className="text-center">
                    <h5>✓ Sin pendientes</h5>
                    <p className="mb-0">No hay comprobantes pendientes de verificación</p>
                </Alert>
            ) : (
                <Card className="comprobantes-card">
                    <Card.Body>
                        <Table striped hover responsive className="comprobantes-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Participante</th>
                                    <th>Email</th>
                                    <th>Comprobante</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comprobantes.map((inscripcion) => (
                                    <tr key={inscripcion.id}>
                                        <td>{inscripcion.id}</td>
                                        <td>{inscripcion.participante.fullName}</td>
                                        <td>{inscripcion.participante.email}</td>
                                        <td>
                                            <Button
                                                variant="link"
                                                className="ver-comprobante-btn"
                                                onClick={() => handleVerImagen(inscripcion.comprobantePago)}
                                            >
                                                📄 Ver Comprobante
                                            </Button>
                                        </td>
                                        <td>
                                            <div className="acciones-btns">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => handleVerificar(inscripcion.id, true)}
                                                >
                                                    ✓ Aprobar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleVerificar(inscripcion.id, false)}
                                                >
                                                    ✗ Rechazar
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            <Modal show={showImageModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Comprobante de Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage && (
                        <Image src={selectedImage} alt="Comprobante" fluid className="comprobante-image" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default VerificarComprobantes;
