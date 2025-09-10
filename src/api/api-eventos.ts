import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";
export interface Event {
    id: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    // status do evento
}
export interface EventResponse {
    id: number;
    name: string;
    status: 'ACTIVE' | 'INACTIVE'; // status do evento
    assessments: EventAssessment[];
    createdAt: string,
    updateAt: string // avaliações que fazem parte do evento
}

export interface EventAssessment {
    id: number;
    name: string;
    gradeRange: string; // pode ser um enum como mostrado abaixo
}
const mapper: (assementsResponse: EventResponse[]) => Event[] = (assementsResponse: EventResponse[]) => {
    return assementsResponse.map(e => {
        return {
            id: e.id,
            name: e.name,
            status: e.status
        } as Event;
    });
};
export const getEventos = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}assessment-events?limit=1000`, { headers })
    const { data }: { data: EventResponse[] } = await response

    return mapper(data)
}
export const getEvento = async (id : number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}assessment-events/${id}`, { headers })
    const evento = (await response).data
    return evento as EventResponse
}
export const putEventos = async (body : { name : string}, id: number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.put(`${URL}assessment-events/${id}`, body ,{ headers })
    await response
}
export const deleteEventos = async (id: number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.delete(`${URL}assessment-events/${id}`, { headers })
    await response
}
export const postEventos = async (body: { name : string }) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.post(`${URL}assessment-events`,body, { headers })
    const { data }: { data: EventResponse[] } = await response

    return mapper(data)
}
