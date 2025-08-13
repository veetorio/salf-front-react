import axios from "axios";
import {  type LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";

// type ParamsForCreateAssement = {
//     studentId: number,
//     assessmentEventId: number,
//     assessmentId: number

// }
export interface Region {
    id: number;
    name: string;
    createdAt: string; // ou `Date`, se for convertido
    updatedAt: string;
}

export interface Group {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface SchoolResponse {
    id: number;
    name: string;
    regionId: number;
    groupId: number;
    region: Region;
    group: Group;
    totalClasses: number;
    totalStudents: number;
    createdAt: string;
    updatedAt: string;
}
export interface School {
    id: number;
    name: string;
    region: string;
    group: string;
    totalClasses: number;
    totalStudents: number;
}
const mapCallback = (e: SchoolResponse): School => {
    return {
        id: e.id,
        name: e.name,
        group: e.group.name,
        region: e.region.name,
        totalClasses: e.totalClasses,
        totalStudents: e.totalStudents
    }
}
const mapData = (array : SchoolResponse[]) : School[] => array?.map(mapCallback) ?? []


export const escolas = async () => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

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

    return mapData(response.data.data)
}

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
