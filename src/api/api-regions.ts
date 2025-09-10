import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { toast } from "react-toastify";
import { URL } from "../config/api-config";
export interface Region {
    id: number;
    name: string;
    createdAt: string; // se quiser pode tipar como Date
    updatedAt: string; // se quiser pode tipar como Date
}
export const getRegioes = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}regions?limit=300`, { headers })

    const { data } = await toast.promise(
        response,
        {
            success: "avaliações carregadas",
            error: "não foi possivel carregar avaliações",
            pending: "carregando avaliações ..."
        }
    )

    return data.data as Region[]
}