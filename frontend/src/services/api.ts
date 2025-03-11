import { Candidate, Status } from "../types";
import { withRetry } from "../utils/retry";

const API_URL = "http://localhost:3010/api";

export const api = {
  async getAllCandidates(): Promise<Candidate[]> {
    return withRetry(async () => {
      const response = await fetch(`${API_URL}/candidates`);
      if (!response.ok) throw new Error("Failed to fetch candidates");
      return response.json();
    });
  },

  async getStatistics() {
    return withRetry(async () => {
      const response = await fetch(`${API_URL}/candidates/statistics`);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      return response.json();
    });
  },

  async updateCandidateStatus(id: number, status: Status) {
    return withRetry(async () => {
      const response = await fetch(`${API_URL}/candidates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update candidate status");
      return response.json();
    });
  },

  async deleteCandidate(id: number) {
    return withRetry(async () => {
      const response = await fetch(`${API_URL}/candidates/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete candidate");
    });
  },

  async downloadCV(id: number) {
    return withRetry(async () => {
      const response = await fetch(`${API_URL}/candidates/${id}/cv`);
      if (!response.ok) throw new Error("Failed to download CV");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `candidate-${id}-cv.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  },

  async createCandidate(formData: FormData): Promise<Candidate> {
    return withRetry(async () => {
      // Create a regular object for the candidate data
      const candidateData = {
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone")),
        education: String(formData.get("education")),
        experience: String(formData.get("experience")),
        status: "WAITING" as const,
      };

      // Create the candidate first
      const response = await fetch(`${API_URL}/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(candidateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create candidate");
      }

      const candidate = await response.json();

      // Handle CV upload separately if a file was provided
      const cvFile = formData.get("cv") as File | null;
      if (cvFile) {
        const cvFormData = new FormData();
        cvFormData.append("cv", cvFile);

        const cvResponse = await fetch(
          `${API_URL}/candidates/${candidate.id}/cv`,
          {
            method: "POST",
            body: cvFormData,
          }
        );

        if (!cvResponse.ok) {
          console.error("Failed to upload CV");
        }
      }

      return candidate;
    });
  },
};
