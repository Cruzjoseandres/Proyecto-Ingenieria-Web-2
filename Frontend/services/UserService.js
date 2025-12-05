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

const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/user`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/user/${id}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const createUser = (userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/user`, userData, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const createValidator = (userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/user/validator`, userData, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const createOrganizador = (userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/user/organizador`, userData, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const createAdmin = (userData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/user/admin`, userData, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const updateUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/user/${id}`, userData, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/user/${id}`, getAuthHeaders())
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
    getAllUsers,
    getUserById,
    createUser,
    createValidator,
    createOrganizador,
    createAdmin,
    updateUser,
    deleteUser
};

