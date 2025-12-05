import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ValidadorHome.css';

const ValidadorHome = () => {
    const navigate = useNavigate();

    return (
        <Container className="validador-home-container mt-5">
            <h1 className="text-center mb-4">🎫 Panel de Validador</h1>

            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    {/* Card principal - Escanear QR */}
                    <Card className="scanner-card mb-4">
                        <Card.Body className="text-center py-5">
                            <div className="scanner-icon">📷</div>
                            <h2 className="mt-3 mb-3">Escanear Código QR</h2>
                            <p className="text-muted mb-4">
                                Usa la cámara de tu dispositivo para escanear el código QR
                                del participante y validar su ingreso al evento.
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                className="btn-escanear"
                                onClick={() => navigate('/validador/escanear')}
                            >
                                🎥 Iniciar Escáner
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Instrucciones */}
                    <Card className="info-card">
                        <Card.Header className="bg-info text-white">
                            <strong>📋 Instrucciones de Uso</strong>
                        </Card.Header>
                        <Card.Body>
                            <ol className="instructions-list">
                                <li>
                                    <strong>Inicia el escáner</strong>
                                    <p>Presiona el botón "Iniciar Escáner" para activar la cámara.</p>
                                </li>
                                <li>
                                    <strong>Escanea el QR</strong>
                                    <p>El participante debe mostrar su código QR en pantalla.</p>
                                </li>
                                <li>
                                    <strong>Verifica el resultado</strong>
                                    <p>El sistema mostrará si el ingreso es válido o no.</p>
                                </li>
                                <li>
                                    <strong>Continúa escaneando</strong>
                                    <p>Puedes escanear múltiples códigos sin reiniciar.</p>
                                </li>
                            </ol>

                            <hr />

                            <h6 className="mb-3">📊 Estados posibles:</h6>
                            <div className="estados-list">
                                <div className="estado-item">
                                    <span className="estado-badge bg-success">✓</span>
                                    <span><strong>Válido:</strong> El participante puede ingresar</span>
                                </div>
                                <div className="estado-item">
                                    <span className="estado-badge bg-warning">⚠</span>
                                    <span><strong>Ya ingresó:</strong> El QR ya fue usado anteriormente</span>
                                </div>
                                <div className="estado-item">
                                    <span className="estado-badge bg-danger">✗</span>
                                    <span><strong>Inválido:</strong> QR no reconocido o pago pendiente</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ValidadorHome;
