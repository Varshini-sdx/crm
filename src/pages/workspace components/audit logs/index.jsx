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
    ArrowRight
} from "lucide-react";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [moduleFilter, setModuleFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [selectedLog, setSelectedLog] = useState(null);

    const filteredLogs = DUMMY_LOGS.filter(log => {
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
        </div>
    );
};

export default AuditLogs;
