import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const conversionService = {
    // 1. Get Conversion KPI Stats
    getStats: async () => {
        const response = await api.get("/api/conversion/stats", {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // 2. Get Lead Generation Trends (for charts)
    getTrends: async () => {
        const response = await api.get("/api/conversion/trends", {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // 3. Get Recent Form Submissions
    getSubmissions: async () => {
        const response = await api.get("/api/conversion/submissions", {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // 4. Update Chat Widget Settings
    updateChatSettings: async (settings) => {
        const response = await api.put("/api/conversion/chat-settings", settings, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default conversionService;
