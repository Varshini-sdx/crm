import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const landingPageService = {
    getLandingPages: async () => {
        const response = await api.get("/api/landing-pages", {
            headers: getAuthHeader()
        });
        return (response.data || []).map(lp => ({
            ...lp,
            id: lp.id || lp._id,
            leads: lp.leads || 0,
            conversion: lp.conversion || "0%",
            visitors: lp.visitors || 0
        }));
    },

    createLandingPage: async (data) => {
        const response = await api.post("/api/landing-pages", data, {
            headers: getAuthHeader()
        });
        const lp = response.data;
        return {
            ...lp,
            id: lp.id || lp._id,
            leads: lp.leads || 0,
            conversion: lp.conversion || "0%",
            visitors: lp.visitors || 0
        };
    },

    updateLandingPage: async (id, data) => {
        const response = await api.put(`/api/landing-pages/${id}`, data, {
            headers: getAuthHeader()
        });
        const lp = response.data;
        // Merge with 'data' sent to ensure all fields are preserved even if backend returns partial object
        return {
            ...data,
            ...(lp || {}),
            id: (lp && (lp.id || lp._id)) || id,
            leads: (lp && lp.leads) || data.leads || 0,
            conversion: (lp && lp.conversion) || data.conversion || "0%",
            visitors: (lp && lp.visitors) || data.visitors || 0
        };
    },

    deleteLandingPage: async (id) => {
        const response = await api.delete(`/api/landing-pages/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default landingPageService;
