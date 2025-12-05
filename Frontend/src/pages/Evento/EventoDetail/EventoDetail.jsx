import { Container, Row, Col, Card, Button, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEventoDetail } from './useEventoDetail';
import './EventoDetail.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EventoDetail = () => {
  const {
    evento, loading, error, inscribiendo, showModal, modalMessage, modalType,
    userInfo, isLoggedIn, handleInscribirse, handleCloseModal, handleVolver,
    handleLogin, handleRegister, formatFecha, getPosition,
    // Comprobante
    showComprobanteModal, comprobantePreview, handleComprobanteChange,
    handleConfirmarInscripcion, handleCloseComprobanteModal
  } = useEventoDetail();

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status"><span className="visually-hidden">Cargando...</span></Spinner>
      </Container>
    );
  }

  if (error || !evento) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error || 'Evento no encontrado'}</Alert>
        <Button onClick={handleVolver}>Volver al listado</Button>
      </Container>
    );
  }

  const position = getPosition();

  return (
    <Container className="evento-detail-container mt-4">
      <Button variant="secondary" onClick={handleVolver} className="mb-3 btn-volver">← Volver</Button>

      <Card className="evento-detail-card">
        <Row className="g-0">
          <Col lg={5}>
            {evento.imagePath && <img src={evento.imagePath} alt={evento.titulo} className="evento-detail-img" />}
          </Col>
          <Col lg={7}>
            <Card.Body className="p-4">
              <h1 className="evento-titulo">{evento.titulo}</h1>
              <p className="evento-descripcion">{evento.descripcion}</p>

              <div className="evento-info-grid">
                <div className="info-item">
                  <span className="info-icon">📅</span>
                  <div><span className="info-label">Fecha y Hora</span><span className="info-value">{formatFecha(evento.fecha)}</span></div>
                </div>
                <div className="info-item">
                  <span className="info-icon">💰</span>
                  <div><span className="info-label">Precio</span><span className="info-value">{evento.precio > 0 ? `$${evento.precio}` : 'Gratis'}</span></div>
                </div>
                <div className="info-item">
                  <span className="info-icon">👥</span>
                  <div><span className="info-label">Capacidad</span><span className="info-value">{evento.maxPersonas} personas</span></div>
                </div>
              </div>

              <div className="map-section">
                <div className="map-header"><span className="info-icon">📍</span><span className="info-label">Ubicación</span></div>
                <div className="map-wrapper">
                  <MapContainer center={position} zoom={15} style={{ height: '180px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <Marker position={position}><Popup>{evento.titulo}</Popup></Marker>
                  </MapContainer>
                </div>
              </div>

              {isLoggedIn && userInfo?.role === 'user' && (
                <Button variant="success" size="lg" className="w-100 mt-4 btn-inscribirse" onClick={handleInscribirse} disabled={inscribiendo}>
                  {inscribiendo ? 'Inscribiendo...' : '✨ Inscribirse al Evento'}
                </Button>
              )}

              {!isLoggedIn && (
                <Alert variant="info" className="mt-4 alert-login">
                  <p className="mb-2">Para inscribirte debes iniciar sesión</p>
                  <div className="d-flex gap-2">
                    <Button variant="primary" onClick={handleLogin}>Iniciar Sesión</Button>
                    <Button variant="outline-primary" onClick={handleRegister}>Registrarse</Button>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Col>
        </Row>
      </Card>

      {/* Modal de resultado */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton><Modal.Title>{modalType === 'success' ? 'Éxito' : 'Error'}</Modal.Title></Modal.Header>
        <Modal.Body><Alert variant={modalType}>{modalMessage}</Alert></Modal.Body>
        <Modal.Footer><Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button></Modal.Footer>
      </Modal>

      {/* Modal de comprobante de pago */}
      <Modal show={showComprobanteModal} onHide={handleCloseComprobanteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>💳 Comprobante de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="mb-3">
            <strong>Precio del evento:</strong> ${evento?.precio}
            <p className="mb-0 mt-2 small">Realiza el pago y sube una imagen del comprobante para confirmar tu inscripción.</p>
          </Alert>

          <Form.Group>
            <Form.Label>Selecciona la imagen del comprobante *</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleComprobanteChange}
              className="mb-3"
            />
          </Form.Group>

          {comprobantePreview && (
            <div className="comprobante-preview text-center">
              <img src={comprobantePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseComprobanteModal}>Cancelar</Button>
          <Button
            variant="success"
            onClick={handleConfirmarInscripcion}
            disabled={inscribiendo || !comprobantePreview}
          >
            {inscribiendo ? 'Procesando...' : '✓ Confirmar Inscripción'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventoDetail;
