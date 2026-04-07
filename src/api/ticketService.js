import api from "./axios";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const TICKET_BASE_URL = "http://100.67.174.54:5000/api/support-tickets";

const normalizeTicket = (t) => {
    if (!t) return t;
    return {
        ...t,
        id: t.id || t._id || t["Ticket #"],
        title: t.title || t["Ticket"] || "Untitled Ticket",
        status: t.status || t["Status"] || "Open",
        priority: t.priority || t["Priority"] || "Medium",
        category: t.category || t["Category"] || "Support",
        assignee: t.assignee || t["Assignee"] || "Unassigned",
        submitted_by: t.submitted_by || t.submittedBy || t["Submitted By"] || "Unknown",
        updated_at: t.updated_at || t.updatedAt || t["Last Updated"] || "Unknown",
        created_at: t.created_at || t.createdAt || t["Created At"] || "Unknown",
        sla_status: t.sla_status || t.slaStatus || t["SLA Status"] || "Normal",
        description: t.description || t["Description"] || ""
    };
};

export const ticketService = {
    // Get all tickets
    getTickets: async () => {
        const response = await api.get(TICKET_BASE_URL, {
            headers: getAuthHeader()
        });
        const data = response.data;
        const tickets = Array.isArray(data) ? data : (data?.tickets || data?.data || []);
        return tickets.map(normalizeTicket);
    },

    // Create a new ticket
    createTicket: async (ticket) => {
        const response = await api.post(TICKET_BASE_URL, ticket, {
            headers: getAuthHeader()
        });
        return normalizeTicket(response.data);
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
