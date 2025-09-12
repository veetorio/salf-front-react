import axios from "axios";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";
export const postRealizarAvaliacao = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}reading-assessments`, body, { headers });
    const { data } = await toast.promise(response, {
        success: "eventos carregadas",
        error: "não foi possivel carregar eventos",
        pending: "carregando eventos ..."
    });
    return data;
};
export const getRealizarAvaliacao = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}assessments/${id}`, { headers });
    const { data } = await response;
    return data;
};
export const PassStage = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.put(`${URL}reading-assessments/${id.id}`, body, { headers });
    await response;
};
