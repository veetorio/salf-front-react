import { toast } from "react-toastify";
import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";
import type { YearlyProps } from "../components/graficos/Bar";

// Tipagens -----------------------

export interface ReadingLevel {
  level: number | string;
  name: string;
  count: number;
  percentage?: number;
  data?: number[];
}

export interface DashboardAnalytics {
  totalStudents: number;
  studentsAssessed: number;
  assessmentCompletion: number;
  averagePpm: number;
  participationRate: number;
  comprehensionScore: number;
  readingLevelDistribution: ReadingLevel[];
}

export interface ReadingLevelDistribution {
  distribution: ReadingLevel[];
}

// <- tipagem da rota reading-level-evolution
export interface DistributionItem {
  level: number;
  name: string;
  percentage: number;
}

export interface Evolution {
  eventId: number;
  eventName: string;
  distribution: DistributionItem[];
}

export interface ReadingLevelEvolution {
  evolution: Evolution[];
}
// ->

export interface GradePerformance {
  grade: string;
  distribution: DistributionItem[];
}

export interface GradesPerformanceRoot {
  gradePerformance: GradePerformance[];
}

export interface YearlyProgression {
  months: string[];
  ppm: number[];
  readingLevelScore: number[];
}

// Helpers ------------------------

const getHeaders = () => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse)?.token;
  if (!token) throw new Error("token expirado");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
};

const fetchWithToast = async <T>(
  endpoint: string,
  messages: { success: string; error: string; pending: string },
  params?: Record<string, any>
): Promise<T> => {
  const response = axios.get(`${URL}dashboard/${endpoint}`, { headers: getHeaders(), params });
  const { data } = await toast.promise(response, messages);
  return data as T;
};


export const getDashboardAnalytics = (params?: any) =>
  fetchWithToast<DashboardAnalytics>("analytics", {
    success: "Dados analíticos carregados",
    error: "Não foi possível carregar os dados analíticos",
    pending: "Carregando dados analíticos...",
  }, params);

export const getReadingLevelDistribution = (params?: any) =>
  fetchWithToast<ReadingLevelDistribution>("reading-level-distribution", {
    success: "Distribuição de níveis de leitura carregada",
    error: "Não foi possível carregar a distribuição de leitura",
    pending: "Carregando distribuição de leitura...",
  }, params);

export const getPerformanceByGrade = (params?: any) =>
  fetchWithToast<GradesPerformanceRoot>("performance-by-grade", {
    success: "Desempenho por série carregado",
    error: "Não foi possível carregar desempenho por série",
    pending: "Carregando desempenho por série...",
  }, params);

export const getReadingLevelEvolution = (params?: any) =>
  fetchWithToast<ReadingLevelEvolution>("reading-level-evolution", {
    success: "Evolução dos níveis de leitura carregada",
    error: "Não foi possível carregar evolução de leitura",
    pending: "Carregando evolução de leitura...",
  }, params);

export const getYearlyProgression = (params?: any) =>
  fetchWithToast<YearlyProps>("yearly-progression", {
    success: "Progressão anual carregada",
    error: "Não foi possível carregar progressão anual",
    pending: "Carregando progressão anual...",
  }, params);
