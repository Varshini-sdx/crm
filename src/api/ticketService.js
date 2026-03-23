import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const ticketService = {
    // Get all tickets
    getTickets: async () => {
        const response = await api.get("/api/support-tickets", {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Create a new ticket
    createTicket: async (ticket) => {
        const response = await api.post("/api/support-tickets", ticket, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Assign ticket to a user
    assignTicket: async (id, assignee) => {
        const response = await api.put(`/api/support-tickets/${id}/assign`, { assignee }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update ticket status
    updateStatus: async (id, status) => {
        const response = await api.put(`/api/support-tickets/${id}/status`, { status }, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default ticketService;
