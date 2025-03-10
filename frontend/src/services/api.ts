import axios from "axios";
import { Candidate, CandidateFormData } from "../types";

const API_URL = "http://localhost:3010";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Candidate API services
export const candidateService = {
  // Get all candidates
  getAll: async (): Promise<Candidate[]> => {
    try {
      const response = await api.get("/candidates");
      return response.data;
    } catch (error) {
      console.error("Error fetching candidates:", error);
      throw error;
    }
  },

  // Get candidate by ID
  getById: async (id: number): Promise<Candidate> => {
    try {
      const response = await api.get(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching candidate ${id}:`, error);
      throw error;
    }
  },

  // Create a new candidate
  create: async (candidateData: CandidateFormData): Promise<Candidate> => {
    try {
      console.log("Starting candidate creation with data:", candidateData);

      // Use FormData for file uploads
      const formData = new FormData();

      // Add all text fields
      Object.entries(candidateData).forEach(([key, value]) => {
        // Skip file field and handle it separately
        if (key !== "cv" && value !== undefined && value !== "") {
          if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Add CV file if it exists
      if (candidateData.cv && candidateData.cv.length > 0) {
        const file = candidateData.cv[0];
        formData.append("cv", file);
        console.log(
          "Attaching CV file:",
          file.name,
          "Size:",
          file.size,
          "Type:",
          file.type
        );
      } else {
        console.log("No CV file to attach");
      }

      // Always set consent to true
      formData.append("consentGiven", "true");

      // Log the form data for debugging
      const formDataEntries: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          formDataEntries[key] = `File: ${value.name} (${value.size} bytes)`;
        } else {
          formDataEntries[key] = String(value);
        }
      });
      console.log("Submitting form data:", formDataEntries);

      // Use axios directly instead of the api instance to ensure proper content type
      const response = await axios.post(`${API_URL}/candidates`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Candidate created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating candidate:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create a candidate with direct FormData approach
  createWithFormData: async (
    file: File | null,
    textData: Omit<CandidateFormData, "cv">
  ): Promise<Candidate> => {
    try {
      console.log("Starting candidate creation with direct FormData approach");
      console.log("Text data:", textData);
      console.log(
        "File:",
        file ? `${file.name} (${file.size} bytes)` : "No file"
      );

      // Create a new FormData object
      const formData = new FormData();

      // Add all text fields
      Object.entries(textData).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          if (typeof value === "boolean") {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Add CV file if it exists
      if (file) {
        formData.append("cv", file);
        console.log("Attached file to FormData:", file.name);

        // Verify the file is in the FormData
        const testFile = formData.get("cv");
        console.log(
          "Verification - File in FormData:",
          testFile instanceof File
            ? `${(testFile as File).name} (${(testFile as File).size} bytes)`
            : "File not properly attached"
        );
      }

      // Always set consent to true
      formData.append("consentGiven", "true");

      // Log FormData entries for debugging
      console.log("FormData entries:");
      const entries: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (value instanceof File) {
          entries[key] = `File: ${value.name} (${value.size} bytes)`;
        } else {
          entries[key] = String(value);
        }
      });
      console.log(entries);

      // Use axios directly with multipart/form-data content type
      // IMPORTANT: Do not set Content-Type header manually, let the browser set it with the boundary
      const response = await axios.post(`${API_URL}/candidates`, formData, {
        headers: {
          // Let the browser set the Content-Type header with the correct boundary
        },
      });

      console.log("Candidate created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "Error creating candidate:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete a candidate
  delete: async (id: number): Promise<{ message: string; id: number }> => {
    try {
      const response = await api.delete(`/candidates/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(
        `Error deleting candidate ${id}:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

// Autocomplete API services
export const autocompleteService = {
  // Get education suggestions
  getEducationSuggestions: async (query: string): Promise<string[]> => {
    try {
      const response = await api.get("/autocomplete/education", {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching education suggestions:", error);
      return [];
    }
  },

  // Get work experience suggestions
  getExperienceSuggestions: async (query: string): Promise<string[]> => {
    try {
      const response = await api.get("/autocomplete/experience", {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching experience suggestions:", error);
      return [];
    }
  },
};
