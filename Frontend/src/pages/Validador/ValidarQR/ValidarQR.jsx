import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useValidarQR } from './useValidarQR';
import './ValidarQR.css';

const ValidarQR = () => {
    const {
        token,
        validando,
        resultado,
        error,
        handleVolver,
        handleEscanear,
        formatFecha,
        getEstadoVisual
    } = useValidarQR();

    const estadoVisual = getEstadoVisual();

    if (validando) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Validando...</span>
                </Spinner>
                <p className="mt-3">Validando código QR...</p>
            </Container>
        );
    }

    return (
        <Container className="validar-qr-container mt-5">
            <h1 className="text-center mb-4">Validación de Ingreso</h1>

            {error && (
                <Alert variant="danger" className="text-center">
                    <h4>❌ Error de Validación</h4>
                    <p>{error}</p>
                </Alert>
            )}

            {resultado && estadoVisual && (
                <Card className={`resultado-card ${estadoVisual.tipo}`}>
                    <Card.Body className="text-center py-4">
                        <div className={`resultado-icon ${estadoVisual.tipo === 'danger' ? 'error' : ''}`}>
                            {estadoVisual.icono}
                        </div>
                        <h2 className={`text-${estadoVisual.tipo === 'success' ? 'success' : estadoVisual.tipo === 'warning' ? 'warning' : 'danger'}`}>
                            {estadoVisual.titulo}
                        </h2>

                        {/* Info del participante */}
                        {resultado.participante && (
                            <div className="resultado-info mt-4">
                                <p><strong>👤 Participante:</strong> {resultado.participante.fullName}</p>
                                <p><strong>📧 Email:</strong> {resultado.participante.email}</p>

                                {resultado.evento && (
                                    <>
                                        <p><strong>🎉 Evento:</strong> {resultado.evento.titulo}</p>
                                        <p><strong>📅 Fecha:</strong> {formatFecha(resultado.evento.fecha)}</p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Mensaje */}
                        <p className="mt-3 fs-5">{resultado.message}</p>

                        {/* Alerta de ya ingresado */}
                        {resultado.estado === 'ya_ingresado' && resultado.fechaIngreso && (
                            <Alert variant="warning" className="mt-3">
                                <strong>⚠ Atención:</strong> Esta persona ya ingresó el {formatFecha(resultado.fechaIngreso)}
                            </Alert>
                        )}

                        {/* Badge */}
                        <div className="mt-3">
                            <span className={`badge bg-${estadoVisual.badgeColor} p-3`} style={{ fontSize: '1.2rem' }}>
                                {estadoVisual.badge}
                            </span>
                        </div>
                    </Card.Body>
                </Card>
            )}

            {!token && (
                <Alert variant="info" className="text-center">
                    <p>Esperando código QR...</p>
                    <p>El participante debe mostrar su código QR para validar el ingreso</p>
                </Alert>
            )}

            <div className="text-center mt-4 d-flex gap-3 justify-content-center flex-wrap">
                <Button variant="primary" size="lg" onClick={handleEscanear}>
                    📷 Escanear Otro
                </Button>
                <Button variant="secondary" size="lg" onClick={handleVolver}>
                    ← Volver
                </Button>
            </div>
        </Container>
    );
};

export default ValidarQR;
