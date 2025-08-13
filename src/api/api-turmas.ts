import { toast } from "react-toastify";
import type { SchoolResponse } from "./api-escolas";
import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";

export interface Class {
    id: number,
    name: string,
    grade: string,
    turn: string,
    totalStudents: number,
    school: string
}
export interface ClassResponse {
    id: number;
    name: string;
    grade: string;
    turn: string;
    totalStudents: number;
    schoolId: number;
    school: SchoolResponse;
    createdAt: string;
    updatedAt: string;
}
const mapper = (array: ClassResponse[]) : Class[] => {
    return array.map(e => {
        return {
            id: e.id,
            name: e.name,
            grade: e.grade,
            school: e.school.name as string,
            totalStudents: e.totalStudents,
            turn: e.turn
        }
    })
}

export const getTurmas = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}class-groups?limit=1000`, { headers })

    const { data } = await toast.promise(
        response,
        {
            success: "avaliações carregadas",
            error: "não foi possivel carregar avaliações",
            pending: "carregando avaliações ..."
        }
    )

    return mapper(data.data)
}

export const getTurmasBySchoolId = async (id : number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}class-groups?limit=300&schoolId=${id}`, { headers })

    const { data } = await response
    return mapper(data.data)
}