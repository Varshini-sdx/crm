import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const auditService = {
    // Get all audit logs
    getLogs: async (params = {}) => {
        const response = await api.get("/api/audit-logs", {
            params,
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Send Feedback
    sendFeedback: async (feedback) => {
        const response = await api.post("/api/feedback", feedback, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default auditService;
