import axios from "axios";
import { storeLogin, type LoginResponse } from "../contexts/login";
import { URL } from "./api.config";

// type ParamsForCreateAssement = {
//     studentId: number,
//     assessmentEventId: number,
//     assessmentId: number

// }

export const escolas = async () => {
    const token = storeLogin().user?.token ? storeLogin().user?.token : (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    const response = await axios.get(URL + "schools", {
        headers: header
    })

    return response.data
}