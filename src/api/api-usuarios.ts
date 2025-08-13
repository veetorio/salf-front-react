import axios from "axios"
import { type LoginResponse } from "../contexts/login";
import type { UserPost } from "../pages/Usuarios";
import { URL } from "../config/api-config";

export const getUsuarios = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const request: { id: number, name: string, email: string, role: string, createdAt: string, updateAt: string }[] = (await axios.get(`${URL}users?limit=1000`, { headers })).data.data


    return request.map(e => {
        return {
            id: e.id,
            name: e.name,
            email: e.email,
            role: e.role
        }
    })
}

export const deleteUsuarios = async (id: number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    return (await axios.delete(`${URL}users/${id}`, { headers })).data.data
}
export const postUsuarios = async (data: UserPost) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    await axios.post(`${URL}users`, data, { headers })

}
export const updateUsuarios = async (id : number,data: UserPost) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    await axios.put(`${URL}users/${id}`, data, { headers })

}