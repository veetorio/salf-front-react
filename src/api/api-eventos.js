import axios from "axios";
import { URL } from "../config/api-config";
const mapper = (assementsResponse) => {
    return assementsResponse.map(e => {
        return {
            id: e.id,
            name: e.name,
            status: e.status
        };
    });
};
export const getEventos = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}assessment-events?limit=1000`, { headers });
    const { data } = await response;
    return mapper(data);
};
export const getEvento = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}assessment-events/${id}`, { headers });
    const evento = (await response).data;
    return evento;
};
export const putEventos = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.put(`${URL}assessment-events/${id}`, body, { headers });
    await response;
};
export const deleteEventos = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.delete(`${URL}assessment-events/${id}`, { headers });
    await response;
};
export const postEventos = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}assessment-events`, body, { headers });
    const { data } = await response;
    return mapper(data);
};
