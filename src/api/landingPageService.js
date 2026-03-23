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
        return response.data;
    },

    createLandingPage: async (data) => {
        const response = await api.post("/api/landing-pages", data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    updateLandingPage: async (id, data) => {
        const response = await api.put(`/api/landing-pages/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    deleteLandingPage: async (id) => {
        const response = await api.delete(`/api/landing-pages/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default landingPageService;
