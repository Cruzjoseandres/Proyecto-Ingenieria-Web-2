import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const API_URL = "http://localhost:3000";

const getAuthHeaders = () => {
    const token = getAccessToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

const createInscripcion = (lugarId) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/inscripcion/${lugarId}`, {}, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getMisInscripciones = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/mis-inscripciones`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getInscripcionDetail = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/detalle/${id}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const subirComprobante = (lugarId, formData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/inscripcion/lugar/${lugarId}/comprobante`, formData, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const cancelarInscripcion = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/inscripcion/${id}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const validarQr = (token) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/validar-qr/${token}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const verificarComprobante = (id, aprobar) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/inscripcion/${id}/verificar-comprobante`, { aprobar }, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getPendientesVerificacion = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/pendientes-verificacion`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getInscripcionesByEvento = (eventoId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/evento/${eventoId}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getComprobantesByEvento = (eventoId) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/inscripcion/comprobantesVerificar/evento/${eventoId}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export {
    createInscripcion,
    getMisInscripciones,
    getInscripcionDetail,
    subirComprobante,
    cancelarInscripcion,
    validarQr,
    verificarComprobante,
    getPendientesVerificacion,
    getInscripcionesByEvento,
    getComprobantesByEvento
};

