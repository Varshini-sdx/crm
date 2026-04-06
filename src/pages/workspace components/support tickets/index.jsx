import React, { useState, useEffect, useCallback } from "react";
import styles from "./supportTickets.module.css";
import { TicketDetail } from "./TicketDetail";
import {
    LifeBuoy,
    Search,
    Filter,
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    ChevronDown,
    MessageSquare,
    Tag,
    User,
    MoreVertical,
    TrendingUp,
    Loader2
} from "lucide-react";
import ticketService from "@/api/ticketService";


const priorityColors = {
    High: { bg: "#fef2f2", color: "#dc2626" },
    Medium: { bg: "#fff7ed", color: "#ea580c" },
    Low: { bg: "#f0fdf4", color: "#16a34a" }
};

const statusConfig = {
    Open: { bg: "#dbeafe", color: "#1d4ed8", icon: AlertCircle },
    "In Progress": { bg: "#fef9c3", color: "#d97706", icon: Clock },
    Resolved: { bg: "#dcfce7", color: "#16a34a", icon: CheckCircle },
    Closed: { bg: "#f1f5f9", color: "#64748b", icon: XCircle }
};

const categoryColors = {
    Bug: { bg: "#fce7f3", color: "#be185d" },
    Feature: { bg: "#ede9fe", color: "#7c3aed" },
    Support: { bg: "#e0f2fe", color: "#0369a1" }
};

export const SupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [showNewModal, setShowNewModal] = useState(false);
    const [newTicket, setNewTicket] = useState({ title: "", description: "", priority: "Medium", category: "Bug" });
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await ticketService.getTickets();
            const formatted = Array.isArray(data) ? data : (data?.tickets || data?.data || []);
            setTickets(formatted);
            setError(null);
        } catch (err) {
            console.error("❌ Support Tickets Fetch Error:", err);
            setTickets([]);
            setError("Couldn't sync with live server. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const filtered = tickets.filter(t => {
        const matchesSearch =
            t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || t.status === statusFilter;
        const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const counts = {
        total: tickets.length,
        open: tickets.filter(t => t.status === "Open").length,
        inProgress: tickets.filter(t => t.status === "In Progress").length,
        resolved: tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length
    };

    const handleSubmitTicket = async (e) => {
        e.preventDefault();
        try {
            const created = await ticketService.createTicket(newTicket);
            setTickets([created, ...tickets]);
            setShowNewModal(false);
            setNewTicket({ title: "", description: "", priority: "Medium", category: "Bug" });
        } catch (err) {
            alert("Failed to raise ticket. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={48} />
                <p>Retrieving tickets...</p>
            </div>
        );
    }

    return (
        <div className={styles.page}>

            {/* Ticket Detail Page (replaces list on click) */}
            {selectedTicket && (
                <TicketDetail ticket={selectedTicket} onBack={() => setSelectedTicket(null)} />
            )}

            {/* Main List Page */}
            {!selectedTicket && (<>

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>Support Tickets</h1>
                        <p className={styles.pageSubtitle}>Track, manage and resolve customer support requests</p>
                    </div>
                    <button className={styles.newBtn} onClick={() => setShowNewModal(true)}>
                        <Plus size={16} /> New Ticket
                    </button>
                </div>

                {/* KPI Cards */}
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.statBlue}`}>
                        <div className={styles.statIcon}><LifeBuoy size={22} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Total Tickets</span>
                            <span className={styles.statValue}>{counts.total}</span>
                        </div>
                        <TrendingUp size={16} className={styles.statTrend} />
                    </div>
                    <div className={`${styles.statCard} ${styles.statRed}`}>
                        <div className={styles.statIcon}><AlertCircle size={22} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Open</span>
                            <span className={styles.statValue}>{counts.open}</span>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statYellow}`}>
                        <div className={styles.statIcon}><Clock size={22} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>In Progress</span>
                            <span className={styles.statValue}>{counts.inProgress}</span>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.statGreen}`}>
                        <div className={styles.statIcon}><CheckCircle size={22} /></div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>Resolved</span>
                            <span className={styles.statValue}>{counts.resolved}</span>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className={styles.tableCard}>
                    {/* Filters */}
                    <div className={styles.tableHeader}>
                        <div className={styles.searchBar}>
                            <Search size={15} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search tickets, IDs or names..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.filters}>
                            <div className={styles.filterGroup}>
                                <Filter size={13} color="#64748b" />
                                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                                    <option value="All">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>
                            <div className={styles.filterGroup}>
                                <Tag size={13} color="#64748b" />
                                <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                                    <option value="All">All Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Ticket #</th>
                                <th>Ticket</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>SLA Status</th>
                                <th>Assignee</th>
                                <th>Submitted By</th>
                                <th>Last Updated</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className={styles.emptyRow}>No tickets match your filters.</td>
                                </tr>
                            ) : (
                                filtered.map(ticket => {
                                    const status = statusConfig[ticket.status] || statusConfig["Open"];
                                    const StatusIcon = status.icon;
                                    const priority = priorityColors[ticket.priority] || priorityColors["Medium"];
                                    return (
                                        <tr
                                            key={ticket.id}
                                            className={styles.tableRow}
                                            onClick={() => setSelectedTicket(ticket)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <td>
                                                <span className={styles.ticketId}>{ticket.id}</span>
                                            </td>
                                            <td>
                                                <div className={styles.ticketInfo}>
                                                    <span className={styles.ticketTitle}>{ticket.title}</span>
                                                    <div className={styles.responseCount}>
                                                        <MessageSquare size={12} />
                                                        {ticket.responses} replies
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.plainCategory}>{ticket.category}</span>
                                            </td>
                                            <td>
                                                <span
                                                    className={styles.badge}
                                                    style={{ background: priority.bg, color: priority.color }}
                                                >
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td>
                                                <div
                                                    className={styles.statusBadge}
                                                    style={{ background: status.bg, color: status.color }}
                                                >
                                                    <StatusIcon size={12} />
                                                    {ticket.status}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`${styles.slaBadge} ${ticket.slaStatus === "Breached" ? styles.slaBreached : styles.slaOnTrack}`}>
                                                    <span className={styles.slaDot}>{ticket.slaStatus === "Breached" ? "🔴" : "🟢"}</span>
                                                    {ticket.slaStatus}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.personCell}>
                                                    <div
                                                        className={styles.miniAvatar}
                                                        style={{ background: "#e0e7ff", color: "#4f46e5" }}
                                                    >
                                                        {ticket.assignee.split(" ").map(w => w[0]).join("").slice(0, 2)}
                                                    </div>
                                                    <span>{ticket.assignee}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className={styles.personCell}>
                                                    <User size={13} color="#94a3b8" />
                                                    <span>{ticket.submittedBy}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={styles.timeCell}>{ticket.updatedAt}</span>
                                            </td>
                                            <td>
                                                <button className={styles.moreBtn}>
                                                    <MoreVertical size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* New Ticket Modal */}
                {showNewModal && (
                    <div className={styles.overlay} onClick={() => setShowNewModal(false)}>
                        <div className={styles.modal} onClick={e => e.stopPropagation()}>
                            <h3 className={styles.modalTitle}>Raise a Support Ticket</h3>
                            <form onSubmit={handleSubmitTicket} className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label>Issue Title</label>
                                    <input
                                        type="text"
                                        placeholder="Briefly describe the issue..."
                                        required
                                        value={newTicket.title}
                                        onChange={e => setNewTicket({ ...newTicket, title: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea
                                        placeholder="Provide more details about the issue..."
                                        rows={4}
                                        value={newTicket.description}
                                        onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Priority</label>
                                        <select value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Category</label>
                                        <select value={newTicket.category} onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}>
                                            <option value="Bug">Bug</option>
                                            <option value="Feature">Feature Request</option>
                                            <option value="Support">Support</option>
                                        </select>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button type="button" className={styles.cancelBtn} onClick={() => setShowNewModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className={styles.submitBtn}>
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </>)}
        </div>
    );
};
