import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEventoEdit } from './useEventoEdit';
import './EventoEdit.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position ? <Marker position={position} /> : null;
};

const EventoEdit = () => {
  const {
    formData, position, setPosition, imagePreview, currentImage, error, loading, saving,
    handleChange, handleImageChange, handleSubmit, handleCancel
  } = useEventoEdit();

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status"><span className="visually-hidden">Cargando...</span></Spinner>
      </Container>
    );
  }

  return (
    <Container className="evento-edit-container mt-4">
      <h1 className="text-center mb-4">Editar Evento</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h5>Información del Evento</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descripción *</Form.Label>
                  <Form.Control as="textarea" rows={4} name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha y Hora *</Form.Label>
                  <Form.Control type="datetime-local" name="fecha" value={formData.fecha} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange} min="0" step="0.01" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Capacidad Máxima *</Form.Label>
                  <Form.Control type="number" name="maxPersonas" value={formData.maxPersonas} onChange={handleChange} min="1" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Imagen (opcional)</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
                </Form.Group>
                {imagePreview ? (
                  <div className="image-preview mb-3"><img src={imagePreview} alt="Preview" /></div>
                ) : currentImage && (
                  <div className="image-preview mb-3"><p className="text-muted mb-2">Imagen actual:</p><img src={currentImage} alt="Current" /></div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h5>Ubicación del Evento</h5>
                <p className="text-muted">Haz clic en el mapa para cambiar la ubicación</p>
                <div className="map-container">
                  <MapContainer center={position} zoom={15} style={{ height: '350px', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                    <LocationMarker position={position} setPosition={setPosition} />
                  </MapContainer>
                </div>
                <p className="mt-2 text-muted small">Coordenadas: {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="d-flex gap-2 justify-content-center mb-4">
          <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</Button>
        </div>
      </Form>
    </Container>
  );
};

export default EventoEdit;
