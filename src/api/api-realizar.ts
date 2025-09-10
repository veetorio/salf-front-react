import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";
import type { NiveisLeitores } from "../pages/Realizar";
import type { AssessmentResponse } from "./api-avaliacoes";

// Region
export interface Region {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// Group
export interface Group {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

// School
export interface School {
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

// ClassGroup
export interface ClassGroup {
    id: number;
    name: string;
    grade: string;
    turn: string;
    totalStudents: number;
    schoolId: number;
    school: School;
    createdAt: string;
    updatedAt: string;
}

// Student
export interface Student {
    id: number;
    name: string;
    registrationNumber: string;
    classGroupId: number;
    schoolId: number;
    classGroup: ClassGroup;
    school: School;
    createdAt: string;
    updatedAt: string;
}

// AssessmentQuestion
export interface AssessmentQuestion {
    id: number;
    text: string;
    options: string[];
    assessmentId: number;
}

// AssessmentPhrase
export interface AssessmentPhrase {
    id: number;
    text: string;
    assessmentId: number;
}
export interface BodyStage {
    studentId: number;
    assessmentEventId: number;
    assessmentId: number;
    wordsRead: number;
    wordsTotal: number;
    pseudowordsRead: number;
    pseudowordsTotal: number;
    phrasesRead: number;
    phrasesTotal: number;
    textLinesRead: number;
    textLinesTotal: number;
    readingLevel: NiveisLeitores;
    ppm: number;
    completed: boolean;
    completedStages: string[];
    correctAnswers: number;
}

// Assessment
export interface Assessment {
    id: number;
    name: string;
    text: string;
    totalWords: number;
    totalPseudowords: number;
    gradeRange: string;
    words: string[];
    pseudowords: string[];
    questions: AssessmentQuestion[];
    phrases: AssessmentPhrase[];
    createdAt: string;
    updatedAt: string;
}

// AssessmentSummary (usado no Event para evitar circularidade)
export interface AssessmentSummary {
    id: number;
    name: string;
    gradeRange: string;
}

// AssessmentEvent
export interface AssessmentEvent {
    id: number;
    name: string;
    status: string;
    assessments: AssessmentSummary[];
    createdAt: string;
    updatedAt: string;
}

// Resultado da Avaliação
export interface AssessmentResult {
    id: number;
    studentId: number;
    student: Student;
    assessmentEventId: number;
    assessmentEvent: AssessmentEvent;
    assessmentId: number;
    assessment: Assessment;
    date: string;
    readingLevel: string;
    ppm: number;
    createdAt: string;
    updatedAt: string;
}

export interface Info {
    id : number
    readingLevel: NiveisLeitores;
    ppm: number;
    completed: boolean;
    completedStages: string[];
    studentId: number;
    assessmentEventId: number;
    assessmentId: number;
}


export const postRealizarAvaliacao = async (body: {
    studentId: number,
    assessmentEventId: number,
    assessmentId: number
}
) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.post(`${URL}reading-assessments`, body, { headers })
    const { data } = await toast.promise(
        response,
        {
            success: "eventos carregadas",
            error: "não foi possivel carregar eventos",
            pending: "carregando eventos ..."
        }
    )

    return data as AssessmentResult
}
export const getRealizarAvaliacao = async (id: number) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.get(`${URL}assessments/${id}`, { headers })
    const { data } = await response

    return data as AssessmentResponse 
}

export const PassStage = async (body : BodyStage,id : Info) => {
    const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;
    
    if (!token) {
        throw new Error("token expirado")
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
    const response = axios.put(`${URL}reading-assessments/${id.id}`,body,{ headers })
    await response
}