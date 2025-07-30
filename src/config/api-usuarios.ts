import axios from "axios"
import { URL } from "./api.config"
import { storeLogin, type LoginResponse } from "../contexts/login";

export const getUsuarios = async () => {
    const token = storeLogin().user?.token ? storeLogin().user?.token : (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const request = (await axios.get(`${URL}users`, { headers }))
    if (request.status === 200) {
        console.log(request.data)
        if (request.data != undefined) {
            return request.data
        } else {
            throw new Error("indefinido")
        }
    } else {
        throw new Error("request falha")
    }
}