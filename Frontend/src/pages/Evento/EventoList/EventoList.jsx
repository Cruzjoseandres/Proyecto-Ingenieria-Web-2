import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useEventoList } from './useEventoList';
import './EventoList.css';

const EventoList = () => {
  const { eventos, loading, error, handleVerDetalle, formatFecha } = useEventoList();

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
    <Container className="evento-list-container mt-4">
      <h1 className="text-center mb-4">Próximos Eventos</h1>

      {eventos.length === 0 ? (
        <Alert variant="info">No hay eventos próximos disponibles</Alert>
      ) : (
        <Row>
          {eventos.map((evento) => (
            <Col key={evento.id} xs={12} md={6} lg={4} className="mb-4">
              <Card className="evento-card h-100">
                {evento.imagePath && (
                  <Card.Img variant="top" src={evento.imagePath} alt={evento.titulo} className="evento-card-img" />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{evento.titulo}</Card.Title>
                  <Card.Text className="evento-descripcion">{evento.descripcion}</Card.Text>
                  <div className="evento-info mt-auto">
                    <p className="mb-1"><strong>Fecha:</strong> {formatFecha(evento.fecha)}</p>
                    <p className="mb-1"><strong>Precio:</strong> {evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}</p>
                    <p className="mb-3"><strong>Capacidad:</strong> {evento.maxPersonas} personas</p>
                    <Button variant="primary" onClick={() => handleVerDetalle(evento.id)} className="w-100">
                      Ver Detalles
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EventoList;
