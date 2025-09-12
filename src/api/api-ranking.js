import axios from "axios";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";
const getHeaders = () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "")?.token;
    if (!token)
        throw new Error("token expirado");
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
    };
};
const fetchWithToast = async (endpoint, messages, params) => {
    const response = axios.get(`${URL}dashboard/${endpoint}`, { headers: getHeaders(), params });
    const { data } = await toast.promise(response, messages);
    return data.data;
};
const fetchWithToastNoData = async (endpoint, messages, params) => {
    const response = axios.get(`${URL}dashboard/${endpoint}?limit=1000`, { headers: getHeaders(), params });
    const { data } = await toast.promise(response, messages);
    return data;
};
export const getRankingStudents = (params) => fetchWithToast("student-ranking", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
}, params);
export const getRankingSchools = (params) => fetchWithToast("school-ranking", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
}, params);
export const getRankingRegions = (params) => fetchWithToastNoData("ranking-by-region", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
}, params);
