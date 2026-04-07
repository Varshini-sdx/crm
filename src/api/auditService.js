import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeLog = (log) => {
    if (!log) return log;
    return {
        ...log,
        id: log.id || log._id || Math.random().toString(36).substr(2, 9),
        date: log.date || log["Date"] || "Unknown Time",
        user: log.user || log["User"] || "System",
        module: log.module || log["Module"] || "General",
        action: log.action || log["Action"] || "Updated",
        record: log.record || log["Record"] || "-",
        ip: log.ip || log["IP Address"] || log["IP"] || "0.0.0.0",
        before: log.before || null,
        after: log.after || null
    };
};

export const auditService = {
    // Get all audit logs
    getLogs: async (params = {}) => {
        const response = await api.get("/api/audit-logs", {
            params,
            headers: getAuthHeader()
        });
        const data = response.data;
        const logs = Array.isArray(data) ? data : (data?.logs || data?.data || []);
        return logs.map(normalizeLog);
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
