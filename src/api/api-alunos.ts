import { toast } from "react-toastify";
import { URL } from "../config/api-config";
import type { SchoolResponse } from "./api-escolas";
import type { ClassResponse } from "./api-turmas";
import axios from "axios";
import type { LoginResponse } from "../contexts/login";

interface Students {
    id: number,
    name: string,
    classGroup: string,
    school : string
}

export interface StudentResponse{
  id: number;
  name: string;
  registrationNumber: string;
  classGroupId: number;
  schoolId: number;
  classGroup: ClassResponse;
  school: SchoolResponse;
  createdAt: string;
  updatedAt: string;
}

const mapper = (array: StudentResponse[]) : Students[] => {
    return array.map(e => {
        return {
            id : e.id,
            name : e.name,
            classGroup : e.classGroup.name,
            school : e.school.name
        }
    })
}

export const getAlunos = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}students?limit=300`, { headers })

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
export const getAlunosBySchoolIdAndClassId = async (idS : number,idC : number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}students?limit=300&classGroupId=${idC}&schoolId=${idS}`, { headers })

    const { data } = await response
    return mapper(data.data)
}
