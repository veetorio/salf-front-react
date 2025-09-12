import axios from "axios";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";
const mapper = (assementsResponse) => {
    return assementsResponse.map(e => {
        return {
            id: e.id,
            name: e.name,
            phrases: e.phrases.length,
            questions: e.questions.length,
            text: e.text.split(" ").length,
            totalPseudowords: e.totalPseudowords,
            totalWords: e.totalWords
        };
    });
};
export const getAvaliacoes = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}assessments?limit=1000`, { headers });
    const { data } = await response;
    return mapper(data.data);
};
export const getAvaliacao = async (id) => {
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
export const postAvaliacao = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}assessments`, body, { headers });
    await response;
};
export const putAvaliacao = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.put(`${URL}assessments/${id}`, body, { headers });
    toast.promise(async () => await response, {
        error: "Não foi possivel modificar avaliação",
        pending: "Modificando ...",
        success: "Modificado com sucesso",
    });
};
export const deleteAvaliacao = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.delete(`${URL}assessments/${id}`, { headers });
    toast.promise(async () => await response, {
        error: "Não foi possivel deletar",
        pending: "deletando ...",
        success: "deletado"
    });
};
