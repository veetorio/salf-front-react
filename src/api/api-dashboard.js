import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../config/api-config";
// Helpers ------------------------
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
    return data;
};
export const getDashboardAnalytics = (params) => fetchWithToast("analytics", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
}, params);
export const getReadingLevelDistribution = (params) => fetchWithToast("reading-level-distribution", {
    success: "Distribuição de níveis de leitura carregada",
    error: "Não foi possível carregar a distribuição de leitura",
    pending: "Carregando distribuição de leitura...",
}, params);
export const getPerformanceByGrade = (params) => fetchWithToast("performance-by-grade", {
    success: "Desempenho por série carregado",
    error: "Não foi possível carregar desempenho por série",
    pending: "Carregando desempenho por série...",
}, params);
export const getReadingLevelEvolution = (params) => fetchWithToast("reading-level-evolution", {
    success: "Evolução dos níveis de leitura carregada",
    error: "Não foi possível carregar evolução de leitura",
    pending: "Carregando evolução de leitura...",
}, params);
export const getYearlyProgression = (params) => fetchWithToast("yearly-progression", {
    success: "Progressão anual carregada",
    error: "Não foi possível carregar progressão anual",
    pending: "Carregando progressão anual...",
}, params);
