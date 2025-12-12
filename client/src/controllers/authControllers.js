import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token) {
        localStorage.setItem("token", response.data.token);
    }
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
};

export const getLandlordId = async (username) => {
    const response = await axios.get(`${API_URL}/landlord/${username}`, getAuthHeaders());
    return response.data;
};

export const getTenantId = async (username) => {
    const response = await axios.get(`${API_URL}/tenant/${username}`, getAuthHeaders());
    return response.data;
};


export const getCurrentUser = async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
};