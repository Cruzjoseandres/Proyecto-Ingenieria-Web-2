import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useEventosOrganizador } from './useEventosOrganizador';
import './EventosOrganizador.css';

const EventosOrganizador = () => {
    const {
        eventos,
        loading,
        error,
        handleDelete,
        handleCrear,
        handleEditar,
        handleVerComprobantes,
        handleVerReportes,
        isEventoPasado
    } = useEventosOrganizador();

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
        <Container className="eventos-organizador-container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Mis Eventos</h1>
                <Button variant="primary" onClick={handleCrear}>
                    + Crear Nuevo Evento
                </Button>
            </div>

            {eventos.length === 0 ? (
                <Alert variant="info">No has creado eventos aún</Alert>
            ) : (
                <Row>
                    {eventos.map((evento) => {
                        const esPasado = isEventoPasado(evento.fecha);
                        return (
                            <Col key={evento.id} xs={12} md={6} lg={4} className="mb-4">
                                <Card className="evento-org-card h-100">
                                    {evento.imagePath && (
                                        <Card.Img variant="top" src={evento.imagePath} alt={evento.titulo} className="evento-org-card-img" />
                                    )}
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <Card.Title>{evento.titulo}</Card.Title>
                                            <Badge bg={esPasado ? 'secondary' : 'success'}>
                                                {esPasado ? 'Pasado' : 'Activo'}
                                            </Badge>
                                        </div>
                                        <Card.Text className="evento-org-descripcion">{evento.descripcion}</Card.Text>
                                        <div className="evento-org-info mt-2">
                                            <p><strong>Fecha:</strong> {new Date(evento.fecha).toLocaleDateString('es-ES')}</p>
                                            <p><strong>Precio:</strong> {evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}</p>
                                            <p><strong>Capacidad:</strong> {evento.maxPersonas} personas</p>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="d-flex gap-2 mb-2">
                                                <Button variant="warning" className="flex-fill" onClick={() => handleEditar(evento.id)}>Editar</Button>
                                                <Button variant="danger" className="flex-fill" onClick={() => handleDelete(evento.id)}>Eliminar</Button>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <Button variant="outline-primary" className="flex-fill" onClick={() => handleVerComprobantes(evento.id)}>
                                                    Comprobantes
                                                </Button>
                                                <Button variant="outline-info" className="flex-fill" onClick={() => handleVerReportes(evento.id)}>
                                                    Reportes
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default EventosOrganizador;
