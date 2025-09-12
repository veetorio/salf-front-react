import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../config/api-config";
const mapper = (array) => {
    return array.map(e => {
        return {
            id: e.id,
            name: e.name,
            grade: e.grade,
            school: e.school.name,
            totalStudents: e.totalStudents,
            turn: e.turn
        };
    });
};
export const getTurmas = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}class-groups?limit=1000`, { headers });
    const { data } = await toast.promise(response, {
        success: "turmas carregadas",
        error: "não foi possivel carregar turmas",
        pending: "carregando turmas ..."
    });
    return mapper(data.data);
};
export const getTurma = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}class-groups/${id}`, { headers });
    const { data } = await toast.promise(response, {
        success: "turma carregadas",
        error: "não foi possivel carregar turma",
        pending: "carregando turma ..."
    });
    return data;
};
export const deleteTurma = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.delete(`${URL}class-groups/${id}`, { headers });
    toast.promise(response, {
        success: "turma deletada",
        error: "não foi possivel deletar turma",
        pending: "deletando turma ..."
    });
};
export const postTurmas = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.post(`${URL}class-groups?limit=1000`, body, { headers });
    const { data } = await toast.promise(response, {
        success: "criando turma",
        error: "não foi possivel criar turma",
        pending: "criando turma ..."
    });
    return mapper(data.data);
};
export const putTurmas = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.put(`${URL}class-groups/${id}`, body, { headers });
    toast.promise(response, {
        success: "turma atualizada",
        error: "não foi possivel atualizar turma",
        pending: "atualizando turma ..."
    });
};
export const getTurmasBySchoolId = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    const response = axios.get(`${URL}class-groups?limit=300&schoolId=${id}`, { headers });
    const { data } = await response;
    return mapper(data.data);
};
