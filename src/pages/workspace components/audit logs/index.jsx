import React, { useState } from "react";
import styles from "./auditLogs.module.css";
import {
    Activity,
    Calendar,
    ChevronDown,
    Filter,
    Search,
    X,
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    Lock,
    Clock,
    CheckCircle2,
    Loader2,
    MessageSquarePlus
} from "lucide-react";
import auditService from "@/api/auditService";

const DUMMY_LOGS = [
    { id: 1, date: "Mar 4, 10:30 AM", user: "Arjun", module: "Deals", action: "Updated", record: "Deal #124", ip: "192.168.1.45", before: { status: "Open" }, after: { status: "Closed" } },
    { id: 2, date: "Mar 4, 11:15 AM", user: "Priya", module: "Tickets", action: "Closed", record: "TKT-001", ip: "192.168.1.12", before: { status: "Open" }, after: { status: "Closed" } },
    { id: 3, date: "Mar 3, 09:00 AM", user: "Ravi", module: "Leads", action: "Created", record: "Lead #892", ip: "10.0.0.5", before: null, after: { name: "Acme Corp", source: "Website" } },
    { id: 4, date: "Mar 3, 02:45 PM", user: "Anu", module: "Settings", action: "Role changed", record: "User: Sneha", ip: "192.168.1.50", before: { role: "Employee" }, after: { role: "Manager" } },
    { id: 5, date: "Mar 2, 04:20 PM", user: "Admin", module: "Reports", action: "Exported", record: "Sales Q1", ip: "10.0.1.20", before: null, after: null },
    { id: 6, date: "Mar 2, 08:30 AM", user: "Rohan", module: "System", action: "Logged in", record: "-", ip: "192.168.1.100", before: null, after: null },
    { id: 7, date: "Mar 1, 11:00 AM", user: "Dev", module: "Contacts", action: "Deleted", record: "Contact #405", ip: "192.168.1.22", before: { name: "John Doe", email: "john@example.com" }, after: null },
];

const MODULE_OPTIONS = ["All", "Deals", "Tickets", "Leads", "Settings", "Reports", "System", "Contacts"];
const ACTION_OPTIONS = ["All", "Created", "Updated", "Deleted", "Closed", "Exported", "Logged in", "Role changed", "Permission updated"];

export const AuditLogs = ({ setActive }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [selectedLog, setSelectedLog] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackValue, setFeedbackValue] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);

    const fetchLogs = React.useCallback(async () => {
        try {
            setLoading(true);
            const data = await auditService.getLogs();
            setLogs(Array.isArray(data) ? data : (data?.logs || data?.data || []));
        } catch (err) {
            console.error("❌ Error fetching audit logs:", err);
            setError("Failed to load audit logs. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.record.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesModule = moduleFilter === "All" || log.module === moduleFilter;
        const matchesAction = actionFilter === "All" || log.action === actionFilter;
        return matchesSearch && matchesModule && matchesAction;
    });

    const getActionColor = (action) => {
        switch (action) {
            case "Created": return styles.badgeSuccess;
            case "Updated":
            case "Role changed":
            case "Permission updated": return styles.badgeWarning;
            case "Deleted": return styles.badgeDanger;
            case "Closed": return styles.badgeNeutral;
            default: return styles.badgeDefault;
        }
    };

    const handleSendFeedback = async () => {
        if (!feedbackValue.trim()) return;
        try {
            setSubmittingFeedback(true);
            await auditService.sendFeedback({
                message: feedbackValue,
                type: "audit-logs",
                timestamp: new Date().toISOString()
            });
            alert("✅ Thank you for your feedback!");
            setFeedbackValue("");
            setShowFeedbackModal(false);
        } catch (err) {
            console.error("❌ Error sending feedback:", err);
            alert("Failed to send feedback. Please try again later.");
        } finally {
            setSubmittingFeedback(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={48} />
                <p>Retrieving audit records...</p>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <button className={styles.backBtn} onClick={() => setActive && setActive("Settings")}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>Audit Logs</h1>
                        <p>Track user actions, changes, and security events across the workspace.</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.feedbackBtn} onClick={() => setShowFeedbackModal(true)}>
                        <MessageSquarePlus size={18} />
                        <span>Send Feedback</span>
                    </button>
                    <div className={styles.dateFilter}>
                        <Calendar size={16} />
                        <span>Last 7 Days</span>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>



            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Search by user or record..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <div className={styles.filterGroup}>
                        <Filter size={14} />
                        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                            {MODULE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <Activity size={14} />
                        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                            {ACTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.auditTable}>
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>User</th>
                                <th>Module</th>
                                <th>Action</th>
                                <th>Record</th>
                                <th>IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                <tr key={log.id} onClick={() => (log.before || log.after) && setSelectedLog(log)} className={(log.before || log.after) ? styles.clickableRow : ''}>
                                    <td className={styles.mutedText}>{log.date}</td>
                                    <td className={styles.boldText}>{log.user}</td>
                                    <td>{log.module}</td>
                                    <td>
                                        <span className={`${styles.badge} ${getActionColor(log.action)}`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className={styles.recordText}>{log.record}</td>
                                    <td className={styles.mutedText}>{log.ip}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className={styles.emptyState}>No audit logs found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compliance Module Section */}
            <div className={styles.complianceSection}>
                <div className={styles.complianceTitle}>
                    <h2>Compliance</h2>
                </div>
                <div className={styles.complianceGrid}>
                    {/* GDPR Status */}
                    <div className={styles.complianceCard}>
                        <div className={styles.complianceHeader}>
                            <ShieldCheck className={styles.complianceIconBlue} />
                            <div>
                                <h3>GDPR Status</h3>
                                <div className={styles.statusPill}>
                                    <CheckCircle2 size={12} /> Compliant
                                </div>
                            </div>
                        </div>
                        <ul className={styles.complianceList}>
                            <li><CheckCircle2 size={16} className={styles.checkIcon} /> Data Protection</li>
                            <li><CheckCircle2 size={16} className={styles.checkIcon} /> User Data Rights</li>
                        </ul>
                    </div>

                    {/* SOC2 Compliance */}
                    <div className={styles.complianceCard}>
                        <div className={styles.complianceHeader}>
                            <Lock className={styles.complianceIconPurple} />
                            <div>
                                <h3>SOC2 Compliance</h3>
                                <div className={styles.statusPill}>
                                    <CheckCircle2 size={12} /> Certified
                                </div>
                            </div>
                        </div>
                        <ul className={styles.complianceList}>
                            <li><CheckCircle2 size={16} className={styles.checkIcon} /> Security Controls</li>
                            <li><CheckCircle2 size={16} className={styles.checkIcon} /> Access Monitoring</li>
                        </ul>
                    </div>

                    {/* Data Retention */}
                    <div className={styles.complianceCard}>
                        <div className={styles.complianceHeader}>
                            <Clock className={styles.complianceIconOrange} />
                            <div>
                                <h3>Data Retention</h3>
                                <div className={styles.statusPillNeutral}>
                                    90 Days
                                </div>
                            </div>
                        </div>
                        <ul className={styles.complianceList}>
                            <li>Logs Auto Deleted</li>
                            <li>After 90 Days</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Side Drawer for Details */}
            {selectedLog && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setSelectedLog(null)} />
                    <div className={styles.drawer}>
                        <div className={styles.drawerHeader}>
                            <div>
                                <h2>Audit Event Details</h2>
                                <p>{selectedLog.date} • {selectedLog.user}</p>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedLog(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.drawerBody}>
                            <div className={styles.eventSummary}>
                                <div className={styles.summaryItem}>
                                    <span>Action</span>
                                    <strong>{selectedLog.action}</strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Module</span>
                                    <strong>{selectedLog.module}</strong>
                                </div>
                                <div className={styles.summaryItem}>
                                    <span>Record</span>
                                    <strong>{selectedLog.record}</strong>
                                </div>
                            </div>

                            <div className={styles.diffContainer}>
                                <h3>Changes</h3>
                                <div className={styles.diffSides}>
                                    <div className={styles.diffBox}>
                                        <div className={styles.diffBoxHeader}>Before</div>
                                        <div className={styles.diffContent}>
                                            {selectedLog.before ? (
                                                Object.entries(selectedLog.before).map(([key, val]) => (
                                                    <div key={key} className={styles.diffRow}>
                                                        <span className={styles.diffKey}>{key}:</span>
                                                        <span className={styles.diffVal}>{val}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.diffEmpty}>Not Applicable</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className={styles.diffArrow}>
                                        <ArrowRight size={20} />
                                    </div>

                                    <div className={styles.diffBox}>
                                        <div className={styles.diffBoxHeader}>After</div>
                                        <div className={styles.diffContent}>
                                            {selectedLog.after ? (
                                                Object.entries(selectedLog.after).map(([key, val]) => (
                                                    <div key={key} className={styles.diffRow}>
                                                        <span className={styles.diffKey}>{key}:</span>
                                                        <span className={styles.diffValSuccess}>{val}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className={styles.diffEmpty}>Deleted / N/A</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className={styles.modalOverlay} onClick={() => setShowFeedbackModal(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Share your Feedback</h3>
                            <button className={styles.closeBtn} onClick={() => setShowFeedbackModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>How can we improve the Audit Logs experience?</p>
                            <textarea 
                                className={styles.textarea}
                                placeholder="Tell us what you think..."
                                value={feedbackValue}
                                onChange={e => setFeedbackValue(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowFeedbackModal(false)}>Cancel</button>
                            <button 
                                className={styles.submitBtn} 
                                onClick={handleSendFeedback} 
                                disabled={submittingFeedback || !feedbackValue.trim()}
                            >
                                {submittingFeedback ? "Sending..." : "Submit Feedback"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;
