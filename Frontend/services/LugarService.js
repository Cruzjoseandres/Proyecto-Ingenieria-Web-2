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

const getAllLugares = () => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/lugar`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getLugarById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${API_URL}/lugar/${id}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const createLugar = (formData) => {
    return new Promise((resolve, reject) => {
        axios.post(`${API_URL}/lugar`, formData, {
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

const updateLugar = (id, formData) => {
    return new Promise((resolve, reject) => {
        axios.patch(`${API_URL}/lugar/${id}`, formData, {
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

const deleteLugar = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`${API_URL}/lugar/${id}`, getAuthHeaders())
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getImageUrl = (filename) => {
    return `${API_URL}/lugar/image/${filename}`;
}

export { getAllLugares, getLugarById, createLugar, updateLugar, deleteLugar, getImageUrl };

