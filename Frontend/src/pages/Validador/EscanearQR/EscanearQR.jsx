import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useEscanearQR } from './useEscanearQR';
import './EscanearQR.css';

const EscanearQR = () => {
    const {
        scanning,
        error,
        resultado,
        validando,
        cameraReady,
        iniciarEscaner,
        detenerEscaner,
        escanearOtro,
        handleVolver,
        formatFecha,
        getEstadoVisual
    } = useEscanearQR();

    const estadoVisual = getEstadoVisual();

    // Estado de validación en progreso
    if (validando) {
        return (
            <Container className="escanear-qr-container mt-4">
                <div className="scanner-wrapper">
                    <div className="validando-container">
                        <Spinner animation="border" variant="light" className="validando-spinner" />
                        <p className="text-light fs-5">Validando código QR...</p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="escanear-qr-container mt-4">
            {/* Scanner Section */}
            {!resultado && (
                <div className="scanner-wrapper">
                    <div className="scanner-header">
                        <h1 className="scanner-title">📷 Escáner de QR</h1>
                        <p className="scanner-subtitle">
                            Escanea el código QR del participante para validar su ingreso
                        </p>
                    </div>

                    {/* Camera Status */}
                    {scanning && (
                        <div className="camera-status">
                            <div className={`camera-indicator ${cameraReady ? 'ready' : 'not-ready'}`}></div>
                            <span className="text-light">
                                {cameraReady ? 'Cámara activa - Apunta al código QR' : 'Iniciando cámara...'}
                            </span>
                        </div>
                    )}

                    {/* QR Reader */}
                    <div className="qr-reader-container">
                        <div id="qr-reader"></div>

                        {!scanning && (
                            <div className="scanner-overlay">
                                <div className="scanner-placeholder">
                                    <div className="scanner-placeholder-icon">📱</div>
                                    <p>Presiona el botón para iniciar la cámara</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            <strong>Error:</strong> {error}
                        </Alert>
                    )}

                    {/* Controls */}
                    <div className="scanner-controls">
                        {!scanning ? (
                            <Button
                                className="btn-scan"
                                onClick={iniciarEscaner}
                            >
                                🎥 Iniciar Cámara
                            </Button>
                        ) : (
                            <Button
                                className="btn-scan btn-stop"
                                onClick={detenerEscaner}
                            >
                                ⏹ Detener Cámara
                            </Button>
                        )}
                        <Button variant="outline-light" onClick={handleVolver}>
                            ← Volver
                        </Button>
                    </div>
                </div>
            )}

            {/* Resultado Section */}
            {resultado && estadoVisual && (
                <div className="resultado-container">
                    <Card className={`resultado-card ${estadoVisual.tipo}`}>
                        <Card.Body className="text-center py-4">
                            <div className="resultado-icon">{estadoVisual.icono}</div>
                            <h2 className="resultado-titulo">{estadoVisual.titulo}</h2>

                            {/* Info del participante */}
                            {resultado.participante && (
                                <div className="resultado-info">
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
                                <Alert variant="warning" className="ya-ingreso-alert mt-3">
                                    <strong>⚠ Atención:</strong> Esta persona ya ingresó el {formatFecha(resultado.fechaIngreso)}
                                </Alert>
                            )}

                            {/* Badge de estado */}
                            <div>
                                <span className={`resultado-badge ${estadoVisual.badgeColor}`}>
                                    {estadoVisual.badge}
                                </span>
                            </div>

                            {/* Botones */}
                            <div className="mt-4 d-flex gap-3 justify-content-center flex-wrap">
                                <Button
                                    variant="light"
                                    size="lg"
                                    onClick={escanearOtro}
                                >
                                    📷 Escanear Otro
                                </Button>
                                <Button
                                    variant="outline-light"
                                    size="lg"
                                    onClick={handleVolver}
                                >
                                    ← Volver al Panel
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Container>
    );
};

export default EscanearQR;
