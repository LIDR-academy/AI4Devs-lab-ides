import axios from "axios";
import { Candidate } from "../types/candidate.types";

const API_URL = process.env.REACT_APP_API_URL;

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
  timestamp?: string;
  code?: string;
}

interface CreateCandidatePayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }>;
  experience?: Array<{
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
  }>;
  notes?: string;
}

export const createCandidate = async (
  data: CreateCandidatePayload,
  resume?: File
): Promise<ApiResponse<Candidate>> => {
  try {
    const formData = new FormData();
    const jsonData = JSON.stringify(data);

    formData.append("data", jsonData);
    if (resume) {
      formData.append("resume", resume);
    }

    // Log del FormData
    console.log("FormData entries:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(key, ":", value);
    });

    const response = await axios.post<ApiResponse<Candidate>>(
      `${API_URL}/candidates`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getCandidates = async (): Promise<ApiResponse<Candidate[]>> => {
  const response = await axios.get<ApiResponse<Candidate[]>>(
    `${API_URL}/candidates`
  );
  return response.data;
};

export const getCandidateById = async (
  id: string
): Promise<ApiResponse<Candidate>> => {
  const response = await axios.get<ApiResponse<Candidate>>(
    `${API_URL}/candidates/${id}`
  );
  return response.data;
};

export const updateCandidate = async (
  id: number,
  candidateData: FormData
): Promise<ApiResponse<Candidate>> => {
  const response = await axios.put<ApiResponse<Candidate>>(
    `${API_URL}/candidates/${id}`,
    candidateData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteCandidate = async (
  id: number
): Promise<ApiResponse<void>> => {
  const response = await axios.delete<ApiResponse<void>>(
    `${API_URL}/candidates/${id}`
  );
  return response.data;
};
