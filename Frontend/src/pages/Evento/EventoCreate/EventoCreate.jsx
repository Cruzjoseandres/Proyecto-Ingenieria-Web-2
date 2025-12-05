import { useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEventoCreate } from './useEventoCreate';
import './EventoCreate.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar clics en el mapa
const LocationMarker = ({ position, setPosition }) => {
  const map = useMap();
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  useEffect(() => { if (position) map.flyTo(position, map.getZoom()); }, [position, map]);
  return position ? <Marker position={position} /> : null;
};

const EventoCreate = () => {
  const {
    formData, position, setPosition, imagePreview, error, loading, gettingLocation,
    handleChange, handleImageChange, handleSubmit, handleCancel
  } = useEventoCreate();

  if (gettingLocation) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" /><p className="mt-3">Obteniendo tu ubicación...</p>
      </Container>
    );
  }

  return (
    <Container className="evento-create-container mt-4">
      <h1 className="text-center mb-4">Crear Nuevo Evento</h1>
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
                  <Form.Label>Precio (0 para gratuito)</Form.Label>
                  <Form.Control type="number" name="precio" value={formData.precio} onChange={handleChange} min="0" step="0.01" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Capacidad Máxima *</Form.Label>
                  <Form.Control type="number" name="maxPersonas" value={formData.maxPersonas} onChange={handleChange} min="1" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Imagen del Evento *</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageChange} required />
                </Form.Group>
                {imagePreview && <div className="image-preview mb-3"><img src={imagePreview} alt="Preview" /></div>}
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="mb-4">
              <Card.Body>
                <h5>Ubicación del Evento</h5>
                <p className="text-muted">📍 Tu ubicación actual está marcada. Haz clic en el mapa para cambiarla.</p>
                <div className="map-container">
                  {position && (
                    <MapContainer center={position} zoom={15} style={{ height: '350px', width: '100%' }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                      <LocationMarker position={position} setPosition={setPosition} />
                    </MapContainer>
                  )}
                </div>
                <p className="mt-2 text-muted small">Coordenadas: {position?.[0].toFixed(6)}, {position?.[1].toFixed(6)}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="d-flex gap-2 justify-content-center mb-4">
          <Button variant="secondary" onClick={handleCancel}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear Evento'}</Button>
        </div>
      </Form>
    </Container>
  );
};

export default EventoCreate;
