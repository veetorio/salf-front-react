import axios from "axios";
import { toast } from "react-toastify";
import { URL } from "../config/api-config";
export const getRegioes = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}regions?limit=300`, { headers });
    const { data } = await toast.promise(response, {
        success: "avaliações carregadas",
        error: "não foi possivel carregar avaliações",
        pending: "carregando avaliações ..."
    });
    return data.data;
};
