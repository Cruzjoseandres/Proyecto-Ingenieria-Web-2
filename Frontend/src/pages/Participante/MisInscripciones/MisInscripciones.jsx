import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Badge, Form } from 'react-bootstrap';
import { QRCodeSVG } from 'qrcode.react';
import { useMisInscripciones } from './useMisInscripciones';
import './MisInscripciones.css';

const MisInscripciones = () => {
    const {
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
    } = useMisInscripciones();

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
        <Container className="mis-inscripciones-container mt-4">
            <h1 className="text-center mb-4">Mis Inscripciones</h1>

            {inscripciones.length === 0 ? (
                <Alert variant="info">No tienes inscripciones aún</Alert>
            ) : (
                <Row>
                    {inscripciones.map((inscripcion) => {
                        const estado = getEstadoVariant(inscripcion);
                        return (
                            <Col key={inscripcion.id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="inscripcion-card h-100">
                                    <Card.Img variant="top" src={inscripcion.evento.imagePath} alt={inscripcion.evento.titulo} className="inscripcion-card-img" />
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title>{inscripcion.evento.titulo}</Card.Title>
                                            <Badge bg={estado.bg}>{estado.text}</Badge>
                                        </div>
                                        <Card.Text className="inscripcion-info">
                                            <strong>Fecha:</strong> {new Date(inscripcion.evento.fecha).toLocaleDateString('es-ES', {
                                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </Card.Text>
                                        {inscripcion.evento.precio > 0 && (
                                            <Card.Text><strong>Precio:</strong> ${inscripcion.evento.precio}</Card.Text>
                                        )}
                                        {inscripcion.estadoMensaje && (
                                            <Card.Text className="text-muted small">{inscripcion.estadoMensaje}</Card.Text>
                                        )}
                                        <div className="mt-auto">
                                            {puedeVerQR(inscripcion) ? (
                                                <Button variant="primary" className="w-100 mb-2" onClick={() => handleShowQR(inscripcion)}>Ver QR</Button>
                                            ) : necesitaComprobante(inscripcion) && (
                                                <Button variant="success" className="w-100 mb-2" onClick={() => handleShowComprobanteModal(inscripcion)}>Subir Comprobante</Button>
                                            )}
                                            {puedeCancelar(inscripcion) && (
                                                <Button variant="danger" className="w-100" onClick={() => handleCancelar(inscripcion.id)}>Cancelar Inscripción</Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}

            {/* Modal QR */}
            <Modal show={showQRModal} onHide={handleCloseQRModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Código QR - {selectedInscripcion?.evento.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedInscripcion && (
                        <>
                            <QRCodeSVG value={`${window.location.origin}/validador/validar/${selectedInscripcion.qrToken}`} size={256} level="H" />
                            <p className="mt-3">Presenta este código QR en el evento</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseQRModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Comprobante */}
            <Modal show={showComprobanteModal} onHide={handleCloseComprobanteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Subir Comprobante de Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Selecciona el comprobante de pago</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleComprobanteChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseComprobanteModal}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubirComprobante} disabled={uploading || !comprobanteFile}>
                        {uploading ? 'Subiendo...' : 'Subir'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MisInscripciones;
