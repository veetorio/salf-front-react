import axios from "axios";
import {} from "../contexts/login";
import { URL } from "../config/api-config";
export const getUsuarios = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const request = (await axios.get(`${URL}users?limit=1000`, { headers })).data.data;
    return request.map(e => {
        return {
            id: e.id,
            name: e.name,
            email: e.email,
            role: e.role
        };
    });
};
export const deleteUsuarios = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    return (await axios.delete(`${URL}users/${id}`, { headers })).data.data;
};
export const postUsuarios = async (data) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    await axios.post(`${URL}users`, data, { headers });
};
export const updateUsuarios = async (id, data) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    await axios.put(`${URL}users/${id}`, data, { headers });
};
