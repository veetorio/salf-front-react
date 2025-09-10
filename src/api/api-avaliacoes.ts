import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";
import { toast } from "react-toastify";

export interface Assessment {
  id: number;
  name: string;
  text: number;
  totalWords: number;
  totalPseudowords: number;
  questions: number;
  phrases: number;
}

export interface AssessmentResponse {
  id: number;
  name: string;
  text: string;
  totalWords: number;
  totalPseudowords: number;
  gradeRange: string; // ou um enum, se quiser restringir valores possíveis
  words: string[];
  pseudowords: string[];
  questions: Question[];
  phrases: Phrase[];
  createdAt: string,
  updateAt: string
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  assessmentId: number;
}

export default interface AvaliacaoLeitura {
  name: string; // Nome da avaliação
  text: string; // Texto principal
  totalWords: number; // Total de palavras reais
  totalPseudowords: number; // Total de pseudopalavras
  gradeRange: "RANGE_1_2" | "RANGE_3_5" | "RANGE_6_9"; // Faixa de série/ano
  words: string[]; // Lista de palavras reais
  pseudowords: string[]; // Lista de pseudopalavras
  phrases: Phrase[]; // Frases para leitura
  questions: Question[]; // Questões de compreensão
}


export interface Phrase {
  id: number;
  text: string;
  assessmentId: number;
}

const mapper: (assementsResponse: AssessmentResponse[]) => Assessment[] = (assementsResponse) => {
  return assementsResponse.map(e => {
    return {
      id: e.id,
      name: e.name,
      phrases: e.phrases.length,
      questions: e.questions.length,
      text: e.text.split(" ").length,
      totalPseudowords: e.totalPseudowords,
      totalWords: e.totalWords
    } as Assessment;
  });
};
export const getAvaliacoes = async () => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

  if (!token) {
    throw new Error("token expirado")
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const response = axios.get(`${URL}assessments?limit=1000`, { headers })

  const { data } = await response

  return mapper(data.data)
}
export const getAvaliacao = async (id : number) => {
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

  return data as AvaliacaoLeitura
}

export const postAvaliacao = async (body: AvaliacaoLeitura) => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

  if (!token) {
    throw new Error("token expirado")
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const response = axios.post(`${URL}assessments`,body,{ headers })
  await response
}
export const putAvaliacao = async (body: AvaliacaoLeitura ,id : number ) => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

  if (!token) {
    throw new Error("token expirado")
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const response = axios.put(`${URL}assessments/${id}`,body,{ headers })
  toast.promise(
    async () =>   await response,
    {
      error : "Não foi possivel modificar avaliação",
      pending : "Modificando ...",
      success : "Modificado com sucesso",
    }
  )
}
export const deleteAvaliacao = async (id : number) => {
  const token = (JSON.parse(localStorage.getItem("user") ?? "") as LoginResponse).token;

  if (!token) {
    throw new Error("token expirado")
  }
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const response = axios.delete(`${URL}assessments/${id}`,{ headers })
  toast.promise(
    async () =>  await response,
    {
      error : "Não foi possivel deletar",
      pending : "deletando ...",
      success : "deletado"
    }

  )
}