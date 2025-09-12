import { toast } from "react-toastify";
import { URL } from "../config/api-config";
import axios from "axios";
const mapper = (array) => {
    return array.map(e => {
        return {
            id: e.id,
            name: e.name,
            classGroup: e.classGroup.name,
            school: e.school.name
        };
    });
};
export const getAlunos = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}students?limit=300`, { headers });
    const { data } = await toast.promise(response, {
        success: "Alunos carregadas",
        error: "não foi possivel carregar Alunos",
        pending: "carregando Alunos ..."
    });
    return mapper(data.data);
};
export const getAluno = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}students/${id}`, { headers });
    const { data } = await toast.promise(response, {
        success: "Alunos carregadas",
        error: "não foi possivel carregar Alunos",
        pending: "carregando Alunos ..."
    });
    return data;
};
export const deleteAluno = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.delete(`${URL}students/${id}`, { headers });
    toast.promise(response, {
        success: "Aluno deletado",
        error: "não foi possivel deletar Alunos",
        pending: "deletando Alunos ..."
    });
};
export const postAlunos = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}students?limit=300`, body, { headers });
    toast.promise(response, {
        success: "Alunocriado",
        error: "não foi possivel criar Alunos",
        pending: "criando Alunos ..."
    });
};
export const putAlunos = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}students?limit=300`, body, { headers });
    toast.promise(response, {
        success: "Aluno modificado",
        error: "não foi possivel modificar Alunos",
        pending: "modificando Alunos ..."
    });
};
export const getAlunosBySchoolIdAndClassId = async (idS, idC) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}students?limit=300&classGroupId=${idC}&schoolId=${idS}`, { headers });
    const { data } = await response;
    return mapper(data.data);
};
