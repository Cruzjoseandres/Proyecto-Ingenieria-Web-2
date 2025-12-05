import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAccessToken, getUserInfo } from "../../utils/TokenUtilities";
import useAuthentication from "../../hooks/useAuthentication";

const Header = () => {
    const { doLogout } = useAuthentication();
    const token = getAccessToken();
    const userInfo = getUserInfo();

    const onLogoutClick = () => {
        doLogout();
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link className="navbar-brand" to="/">Sistema de Eventos</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {!token && (
                            <>
                                <Link className="nav-link" to="/">Eventos</Link>
                                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                <Link className="nav-link" to="/register">Registrarse</Link>
                            </>
                        )}

                        {token && userInfo?.role === 'user' && (
                            <>
                                <Link className="nav-link" to="/">Eventos</Link>
                                <Link className="nav-link" to="/participante/mis-inscripciones">Mis Inscripciones</Link>
                            </>
                        )}

                        {token && userInfo?.role === 'organizador' && (
                            <>
                                <Link className="nav-link" to="/organizador/eventos">Mis Eventos</Link>
                                <Link className="nav-link" to="/organizador/eventos/crear">Crear Evento</Link>
                            </>
                        )}

                        {token && userInfo?.role === 'validator' && (
                            <>
                                <Link className="nav-link" to="/validador">Panel Validador</Link>
                            </>
                        )}

                        {token && userInfo?.role === 'admin' && (
                            <>
                                <Link className="nav-link" to="/">Eventos</Link>
                                <Link className="nav-link" to="/admin/usuarios">Gestión de Usuarios</Link>
                            </>
                        )}
                    </Nav>

                    {token && (
                        <Nav>
                            <NavDropdown title={userInfo?.fullName || "Usuario"} id="user-dropdown">
                                <NavDropdown.Item disabled>
                                    <small className="text-muted">Rol: {userInfo?.role}</small>
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <button className="dropdown-item" onClick={onLogoutClick}>
                                    Cerrar sesión
                                </button>
                            </NavDropdown>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

