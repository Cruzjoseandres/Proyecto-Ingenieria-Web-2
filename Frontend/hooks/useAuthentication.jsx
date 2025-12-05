import { useNavigate } from "react-router-dom";
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
  saveUserInfo,
  getUserInfo
} from "../utils/TokenUtilities";
import { useEffect, useState } from "react";
import { login, getMe } from "../services/AuthService";

const useAuthentication = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(getUserInfo());
  const [isLoading, setIsLoading] = useState(true);

  const validateLogin = () => {
    const token = getAccessToken();
    if (!token) {
      return false;
    }
    return true;
  };

  const fetchUserInfo = async () => {
    try {
      const userData = await getMe();
      saveUserInfo(userData);
      setUserInfo(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      removeAccessToken();
      return null;
    }
  };

  const doLogin = async (loginData) => {
    try {
      const response = await login(loginData);
      saveAccessToken(response.token);

      // Obtener información del usuario
      const userData = await fetchUserInfo();

      if (userData) {
        // Redirigir según el rol
        switch (userData.role) {
          case 'admin':
            navigate("/admin");
            break;
          case 'organizador':
            navigate("/organizador/eventos");
            break;
          case 'validador':
            navigate("/validador");
            break;
          case 'user':
          default:
            navigate("/");
            break;
        }
      }
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const doLogout = () => {
    removeAccessToken();
    setUserInfo(null);
    navigate("/");
  };

  useEffect(() => {
    const initAuth = async () => {
      if (validateLogin() && !userInfo) {
        await fetchUserInfo();
      }
      setIsLoading(false);
    };
    initAuth();
    // eslint-disable-next-line
  }, []);

  return {
    doLogin,
    doLogout,
    validateLogin,
    fetchUserInfo,
    userInfo,
    isLoading
  };
};

export default useAuthentication;

