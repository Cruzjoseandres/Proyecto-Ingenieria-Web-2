import { Container, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useValidarQR } from './useValidarQR';
import './ValidarQR.css';

const ValidarQR = () => {
    const { token, validando, resultado, error, handleVolver, formatFecha } = useValidarQR();

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
                    <h4>❌ Código Inválido</h4>
                    <p>{error}</p>
                </Alert>
            )}

            {resultado && (
                <Card className={`resultado-card ${resultado.valido ? 'valido' : 'invalido'}`}>
                    <Card.Body className="text-center">
                        {resultado.valido ? (
                            <>
                                <div className="resultado-icon">✓</div>
                                <h2 className="text-success">Ingreso Válido</h2>
                                <div className="resultado-info mt-4">
                                    <p><strong>Participante:</strong> {resultado.inscripcion.user.fullName}</p>
                                    <p><strong>Email:</strong> {resultado.inscripcion.user.email}</p>
                                    <p><strong>Evento:</strong> {resultado.inscripcion.lugar.titulo}</p>
                                    <p><strong>Fecha del Evento:</strong> {formatFecha(resultado.inscripcion.lugar.fecha)}</p>
                                    {resultado.inscripcion.ingresado && (
                                        <Alert variant="warning" className="mt-3">
                                            <strong>Nota:</strong> Esta persona ya ingresó anteriormente el {new Date(resultado.inscripcion.fechaIngreso).toLocaleString('es-ES')}
                                        </Alert>
                                    )}
                                    <Badge bg="success" className="mt-3 p-3" style={{ fontSize: '1.2rem' }}>
                                        ACCESO AUTORIZADO
                                    </Badge>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="resultado-icon error">✗</div>
                                <h2 className="text-danger">Ingreso Inválido</h2>
                                <p className="mt-3">{resultado.mensaje}</p>
                                <Badge bg="danger" className="mt-3 p-3" style={{ fontSize: '1.2rem' }}>
                                    ACCESO DENEGADO
                                </Badge>
                            </>
                        )}
                    </Card.Body>
                </Card>
            )}

            {!token && (
                <Alert variant="info" className="text-center">
                    <p>Esperando código QR...</p>
                    <p>El participante debe mostrar su código QR para validar el ingreso</p>
                </Alert>
            )}

            <div className="text-center mt-4">
                <Button variant="secondary" onClick={handleVolver}>
                    Volver
                </Button>
            </div>
        </Container>
    );
};

export default ValidarQR;
