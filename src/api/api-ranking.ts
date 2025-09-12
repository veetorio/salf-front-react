import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";

const getHeaders = () => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse)?.token;
  if (!token) throw new Error("token expirado");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};
 
export interface StudentData {
  studentId: number;
  student: string;
  readingLevel: string; // se tiver um enum de níveis, pode tipar melhor
  eventId: number;
  regionId: number;
  groupId: number;
  schoolId: number;
  school: string;
  region: string;
  group: string;
}


export interface SchoolData {
  school : string
  count : number
}
const fetchWithToast = async <T>(
  endpoint: string,
  messages: { success: string; error: string; pending: string },
  params?: Record<string, any>
): Promise<T> => {
  const response = axios.get(`${URL}dashboard/${endpoint}`, { headers: getHeaders(), params });
  const { data } = await toast.promise(response, messages);
  return data.data as T;
};
const fetchWithToastNoData = async <T>(
  endpoint: string,
  messages: { success: string; error: string; pending: string },
  params?: Record<string, any>
): Promise<T> => {
  const response = axios.get(`${URL}dashboard/${endpoint}?limit=1000`, { headers: getHeaders(), params });
  const { data } = await toast.promise(response, messages);
  return data as T;
};

export const getRankingStudents = (params?: any) =>
  fetchWithToast<StudentData[]>("student-ranking", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
  }, params);
export const getRankingSchools = (params?: any) =>
  fetchWithToast<SchoolData[]>("school-ranking", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
  }, params);
export const getRankingRegions = (params?: any) =>
  fetchWithToastNoData<{
    percentage : number,
    region : string
  }[]>("ranking-by-region", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
  }, params);
