import { Container, Row, Col, Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { useReportesEvento } from './useReportesEvento';
import './ReportesEvento.css';

const ReportesEvento = () => {
    const { evento, ingresados, noIngresados, loading, error, formatFecha } = useReportesEvento();

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
        <Container className="reportes-evento-container mt-4">
            <h1 className="text-center mb-2">Reportes del Evento</h1>
            {evento && <h4 className="text-center text-muted mb-4">{evento.titulo}</h4>}

            {/* Resumen */}
            <Row className="mb-4">
                <Col md={4}>
                    <Card className="text-center stats-card">
                        <Card.Body>
                            <h2>{ingresados.length + noIngresados.length}</h2>
                            <p className="mb-0">Total Inscritos</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center stats-card ingresados">
                        <Card.Body>
                            <h2>{ingresados.length}</h2>
                            <p className="mb-0">Ingresados</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="text-center stats-card pendientes">
                        <Card.Body>
                            <h2>{noIngresados.length}</h2>
                            <p className="mb-0">Pendientes</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Lista de Ingresados */}
                <Col lg={6} className="mb-4">
                    <Card>
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">✓ Ingresados ({ingresados.length})</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {ingresados.length === 0 ? (
                                <Alert variant="info" className="m-3">No hay participantes ingresados aún</Alert>
                            ) : (
                                <Table striped hover responsive className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Fecha Ingreso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingresados.map((insc) => (
                                            <tr key={insc.id}>
                                                <td>{insc.participante.fullName}</td>
                                                <td>{insc.participante.email}</td>
                                                <td>{formatFecha(insc.fechaIngreso)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Lista de No Ingresados */}
                <Col lg={6} className="mb-4">
                    <Card>
                        <Card.Header className="bg-warning">
                            <h5 className="mb-0">⏳ Pendientes de Ingreso ({noIngresados.length})</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            {noIngresados.length === 0 ? (
                                <Alert variant="info" className="m-3">Todos los participantes han ingresado</Alert>
                            ) : (
                                <Table striped hover responsive className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Email</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {noIngresados.map((insc) => (
                                            <tr key={insc.id}>
                                                <td>{insc.participante.fullName}</td>
                                                <td>{insc.participante.email}</td>
                                                <td>
                                                    <Badge bg={insc.comprobantePagoVerificado ? 'success' : 'secondary'}>
                                                        {insc.comprobantePagoVerificado ? 'Verificado' : 'Pendiente'}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ReportesEvento;
