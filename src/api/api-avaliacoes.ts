import axios from "axios";
import type { LoginResponse } from "../contexts/login";
import { URL } from "../config/api-config";

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
  createdAt : string,
  updateAt : string
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  assessmentId: number;
}

export interface Phrase {
  id: number;
  text: string;
  assessmentId: number;
}

const mapper : (assementsResponse: AssessmentResponse[]) => Assessment[] = (assementsResponse) => {
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
    
    const { data }= await response

    return mapper(data.data)
}