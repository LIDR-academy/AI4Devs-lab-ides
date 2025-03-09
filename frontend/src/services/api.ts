import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3010/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const candidateService = {
  async createCandidate(formData: FormData) {
    const response = await apiClient.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getCandidates() {
    const response = await apiClient.get("/candidates");
    return response.data;
  },
};

export default apiClient;
