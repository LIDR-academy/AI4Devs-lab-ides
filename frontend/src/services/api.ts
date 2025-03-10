import axios from "axios";
import { Candidate } from "../types";

const API_URL = "http://localhost:3010/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const candidateService = {
  getAll: async (): Promise<Candidate[]> => {
    const response = await api.get<Candidate[]>("/candidates");
    return response.data;
  },

  getById: async (id: number): Promise<Candidate> => {
    const response = await api.get<Candidate>(`/candidates/${id}`);
    return response.data;
  },

  create: async (candidate: Candidate): Promise<Candidate> => {
    const response = await api.post<Candidate>("/candidates", candidate);
    return response.data;
  },
};

export default api;
