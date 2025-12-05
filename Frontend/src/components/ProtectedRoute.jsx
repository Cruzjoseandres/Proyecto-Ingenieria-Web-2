import { Navigate } from "react-router-dom";
import { getAccessToken, getUserInfo } from "../../utils/TokenUtilities";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = getAccessToken();
    const userInfo = getUserInfo();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && userInfo && !allowedRoles.includes(userInfo.role)) {
        // Redirigir al dashboard correcto según el rol del usuario
        switch (userInfo.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'organizador':
                return <Navigate to="/organizador" replace />;
            case 'validator':
                return <Navigate to="/validador" replace />;
            case 'user':
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;

