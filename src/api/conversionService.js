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
        const data = response.data || {};
        return {
            visitors: data.visitors || 0,
            visitorTrend: data.visitorTrend || data.visitor_trend || "—",
            leads: data.leads || 0,
            leadTrend: data.leadTrend || data.lead_trend || "—",
            conversion: data.conversion || 0,
            conversionTrend: data.conversionTrend || data.conversion_trend || "—"
        };
    },

    // 2. Get Lead Generation Trends (for charts)
    getTrends: async () => {
        const response = await api.get("/api/conversion/trends", {
            headers: getAuthHeader()
        });
        return (response.data || []).map(item => ({
            day: item.day || item.date || item.label || "—",
            visitors: item.visitors || 0,
            leads: item.leads || item.leads_captured || 0,
            conversion: item.conversion || 0
        }));
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
