import axios from "axios";
import {} from "../contexts/login";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";
const mapCallback = (e) => {
    return {
        id: e.id,
        name: e.name,
        group: e.group.name,
        region: e.region.name,
        totalClasses: e.totalClasses,
        totalStudents: e.totalStudents
    };
};
const mapData = (array) => array?.map(mapCallback) ?? [];
export const escolas = async () => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = await axios.get(URL + "schools?limit=1000", {
        headers: header
    });
    return mapData(response.data.data);
};
export const escolasById = async (idRegion, idGroup) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = await axios.get(`${URL}schools?regionId=${idRegion}&groupId=${idGroup}&limit=1000`, {
        headers: header
    });
    return mapData(response.data.data);
};
export const escola = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = await axios.get(URL + "schools/" + id, {
        headers: header
    });
    return response.data;
};
export const postEscola = async (body) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = axios.post(URL + "schools", body, {
        headers: header
    });
    toast.promise(response, {
        success: "criado com sucesso",
        pending: "criando ...",
        "error": "não foi possivel criar"
    });
};
export const putEscola = async (body, id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = axios.put(URL + "schools/" + id, body, {
        headers: header
    });
    toast.promise(response, {
        success: "modificado com sucesso",
        pending: "modificando ...",
        "error": "não foi possivel modificar"
    });
};
export const deleteEscola = async (id) => {
    const token = JSON.parse(localStorage.getItem("user") ?? "").token;
    if (!token) {
        throw new Error("token expirado");
    }
    const header = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
    const response = axios.delete(URL + "schools/" + id, {
        headers: header
    });
    toast.promise(response, {
        success: "deletando com sucesso",
        pending: "deletando ...",
        error: "não foi possivel deletando"
    });
};
export const Mockschools = [
    {
        id: 1,
        name: "Escola Municipal São José",
        region: "Norte",
        group: "Grupo A",
        totalClasses: 12,
        totalStudents: 320,
    },
    {
        id: 2,
        name: "Colégio Estadual Tiradentes",
        region: "Sul",
        group: "Grupo B",
        totalClasses: 18,
        totalStudents: 540,
    },
    {
        id: 3,
        name: "Instituto Educacional Viver",
        region: "Leste",
        group: "Grupo A",
        totalClasses: 10,
        totalStudents: 275,
    },
    {
        id: 4,
        name: "Centro de Ensino Dom Pedro I",
        region: "Oeste",
        group: "Grupo C",
        totalClasses: 14,
        totalStudents: 410,
    },
    {
        id: 5,
        name: "Escola Técnica Maria Firmina",
        region: "Norte",
        group: "Grupo B",
        totalClasses: 16,
        totalStudents: 380,
    }
];
