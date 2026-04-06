import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const TICKET_BASE_URL = "http://100.67.174.54:5000/api/support-tickets";

export const ticketService = {
    // Get all tickets
    getTickets: async () => {
        const response = await api.get(TICKET_BASE_URL, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Create a new ticket
    createTicket: async (ticket) => {
        const response = await api.post(TICKET_BASE_URL, ticket, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Assign ticket to a user
    assignTicket: async (id, assignee) => {
        const response = await api.put(`${TICKET_BASE_URL}/${id}/assign`, { assignee }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Update ticket status
    updateStatus: async (id, status) => {
        const response = await api.put(`${TICKET_BASE_URL}/${id}/status`, { status }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get messages for a ticket
    getMessages: async (id) => {
        const response = await api.get(`${TICKET_BASE_URL}/${id}/messages`, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Send a message for a ticket
    sendMessage: async (id, body) => {
        const response = await api.post(`${TICKET_BASE_URL}/${id}/messages`, { body }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Add an internal note to a ticket
    addNote: async (id, body) => {
        const response = await api.post(`${TICKET_BASE_URL}/${id}/notes`, { body }, {
            headers: getAuthHeader()
        });
        return response.data;
    },

    // Get activity log for a ticket
    getActivity: async (id) => {
        const response = await api.get(`${TICKET_BASE_URL}/${id}/activity`, {
            headers: getAuthHeader()
        });
        return response.data;
    }
};

export default ticketService;
