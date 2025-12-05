import { Container, Card, Alert } from 'react-bootstrap';
import './ValidadorHome.css';

const ValidadorHome = () => {
    return (
        <Container className="validador-home-container mt-5">
            <h1 className="text-center mb-4">Panel de Validador</h1>

            <Card>
                <Card.Body>
                    <Alert variant="info">
                        <h4>Bienvenido, Validador</h4>
                        <p>Para validar el ingreso de un participante:</p>
                        <ol>
                            <li>El participante debe mostrar su código QR</li>
                            <li>El código QR contiene un enlace que abrirá automáticamente la página de validación</li>
                            <li>El sistema verificará si el participante puede ingresar al evento</li>
                        </ol>
                        <p className="mb-0">
                            <strong>Nota:</strong> Solo puedes validar códigos QR. No tienes acceso a otras funciones del sistema.
                        </p>
                    </Alert>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ValidadorHome;
