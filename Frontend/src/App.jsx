import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Páginas públicas
import EventoList from './pages/Evento/EventoList/EventoList.jsx';
import EventoDetail from './pages/Evento/EventoDetail/EventoDetail.jsx';
import FormLogin from './pages/auth/Login/FormLogin.jsx';
import FormRegister from './pages/auth/Register/FormRegister.jsx';

// Páginas de Participante
import MisInscripciones from './pages/Participante/MisInscripciones/MisInscripciones.jsx';

// Páginas de Organizador
import EventosOrganizador from './pages/Organizador/EventosOrganizador/EventosOrganizador.jsx';
import EventoCreate from './pages/Evento/EventoCreate/EventoCreate.jsx';
import EventoEdit from './pages/Evento/EventoEdit/EventoEdit.jsx';
import VerificarComprobantes from './pages/Organizador/VerificarComprobantes/VerificarComprobantes.jsx';
import ReportesEvento from './pages/Organizador/ReportesEvento/ReportesEvento.jsx';

// Páginas de Validador
import ValidadorHome from './pages/Validador/ValidadorHome/ValidadorHome.jsx';
import ValidarQR from './pages/Validador/ValidarQR/ValidarQR.jsx';
import EscanearQR from './pages/Validador/EscanearQR/EscanearQR.jsx';

// Páginas de Admin
import AdminUsuarios from './pages/Admin/AdminUsuarios/AdminUsuarios.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<EventoList />} />
        <Route path="/eventos/:id" element={<EventoDetail />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} />

        {/* Rutas de Participante (user) */}
        <Route
          path="/participante/mis-inscripciones"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MisInscripciones />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Organizador */}
        <Route
          path="/organizador/eventos"
          element={
            <ProtectedRoute allowedRoles={['organizador']}>
              <EventosOrganizador />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/crear"
          element={
            <ProtectedRoute allowedRoles={['organizador']}>
              <EventoCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/eventos/editar/:id"
          element={
            <ProtectedRoute allowedRoles={['organizador']}>
              <EventoEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/comprobantes/:eventoId"
          element={
            <ProtectedRoute allowedRoles={['organizador']}>
              <VerificarComprobantes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizador/reportes/:eventoId"
          element={
            <ProtectedRoute allowedRoles={['organizador']}>
              <ReportesEvento />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Validador */}
        <Route
          path="/validador"
          element={
            <ProtectedRoute allowedRoles={['validator']}>
              <ValidadorHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/validador/escanear"
          element={
            <ProtectedRoute allowedRoles={['validator']}>
              <EscanearQR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/validador/validar/:token"
          element={
            <ProtectedRoute allowedRoles={['validator']}>
              <ValidarQR />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
