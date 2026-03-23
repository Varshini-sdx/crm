import React, { useState, useEffect, useCallback } from "react";
import styles from "./teams.module.css";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    MoreVertical,
    Shield,
    Mail,
    Phone,
    Clock,
    UserCheck
} from "lucide-react";
import api from "@/api/axios";

const mockTeamData = [
    {
        id: "1",
        name: "Arjun Sharma",
        email: "arjun.sharma@company.com",
        role: "Admin",
        status: "Online",
        phone: "+91 98765 43210",
        lastActive: "Just now",
        initials: "AS",
        color: "#6366f1"
    },
    {
        id: "2",
        name: "Priya Mehta",
        email: "priya.mehta@company.com",
        role: "Manager",
        status: "Online",
        phone: "+91 91234 56789",
        lastActive: "5 mins ago",
        initials: "PM",
        color: "#10b981"
    },
    {
        id: "3",
        name: "Rohan Verma",
        email: "rohan.verma@company.com",
        role: "Employee",
        status: "Away",
        phone: "+91 99887 76655",
        lastActive: "32 mins ago",
        initials: "RV",
        color: "#f59e0b"
    },
    {
        id: "4",
        name: "Sneha Kapoor",
        email: "sneha.kapoor@company.com",
        role: "Agent",
        status: "Offline",
        phone: "+91 87654 32109",
        lastActive: "2 hours ago",
        initials: "SK",
        color: "#ec4899"
    },
    {
        id: "5",
        name: "Dev Nair",
        email: "dev.nair@company.com",
        role: "Employee",
        status: "Pending",
        phone: "+91 76543 21098",
        lastActive: "Not yet logged in",
        initials: "DN",
        color: "#3b82f6"
    }
];

export const Team = ({ branch, setActive }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    // Always start with mock data so the page renders immediately
    const [teamMembers, setTeamMembers] = useState(mockTeamData);
    const [loading, setLoading] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchTeam = useCallback(async () => {
        try {
            setLoading(true);
            const branchId = branch?.id || 1;
            const response = await api.get(`/api/team?branchId=${branchId}`, {
                headers: getAuthHeader()
            });
            const raw = response.data;
            const members = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.members)
                    ? raw.members
                    : Array.isArray(raw?.data)
                        ? raw.data
                        : null;

            if (members && members.length > 0) {
                // Map backend fields (id, name, city, state, country) to frontend expectations
                const mappedMembers = members.map((m, idx) => ({
                    ...m,
                    id: m.id || `team-${idx}`,
                    name: m.name || "Unknown Member",
                    email: m.email || "No email provided",
                    role: m.role || "Employee",
                    status: m.status || "Offline",
                    phone: m.phone || "No phone",
                    lastActive: m.lastActive || "Recently",
                    initials: (m.name || "??").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                    color: ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6"][idx % 5],
                    location: [m.city, m.state, m.country].filter(Boolean).join(", ") || "No location"
                }));
                setTeamMembers(mappedMembers);
                console.log("%c[TEAMS] Loaded live data:", "color: #10b981; font-weight: bold;", mappedMembers);
            } else {
                console.warn("⚠️ Teams: backend response empty - showing demo data.");
            }
        } catch (error) {
            console.error("❌ Teams Fetch Error:", error);
            // If it's a 500 error, we keep the mock data but log the details
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const filteredTeam = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "All" || member.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Online": return "#10b981";
            case "Away": return "#f59e0b";
            case "Offline": return "#6b7280";
            case "Pending": return "#3b82f6";
            default: return "#6b7280";
        }
    };

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({ name: "", email: "", password: "" });

    const handleGoToRolesPermissions = (e) => {
        e.preventDefault();
        if (!inviteForm.name.trim() || !inviteForm.email.trim() || !inviteForm.password.trim()) {
            alert("Please fill in Full Name, Email, and Password before proceeding.");
            return;
        }
        // Store the pending invite data so RBAC can pick it up
        sessionStorage.setItem("pendingInvite", JSON.stringify(inviteForm));
        setShowInviteModal(false);
        // Navigate to RBAC (Roles & Permissions) page
        if (typeof setActive === "function") {
            setActive("RBAC");
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading team members...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h2>Team Management</h2>
                    <div className={styles.branchTag}>{branch?.name || "Main"} Branch</div>
                </div>
                <button className={styles.inviteBtn} onClick={() => setShowInviteModal(true)}>
                    <UserPlus size={18} /> Invite Member
                </button>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "#e0f2fe", color: "#0ea5e9" }}>
                        <Users size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Total Members</span>
                        <span className={styles.statValue}>{teamMembers.length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "#dcfce7", color: "#10b981" }}>
                        <UserCheck size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Active Now</span>
                        <span className={styles.statValue}>{teamMembers.filter(m => m.status === "Online").length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "#fef3c7", color: "#d97706" }}>
                        <Clock size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Pending</span>
                        <span className={styles.statValue}>{teamMembers.filter(m => m.status === "Pending").length}</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                        <Shield size={20} />
                    </div>
                    <div className={styles.statInfo}>
                        <span className={styles.statLabel}>Admins</span>
                        <span className={styles.statValue}>{teamMembers.filter(m => m.role === "Admin").length}</span>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className={styles.modalOverlay} onClick={() => setShowInviteModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Add New Member</h3>
                        <form onSubmit={handleGoToRolesPermissions} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    required
                                    value={inviteForm.name}
                                    onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    required
                                    value={inviteForm.email}
                                    onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password <span style={{fontSize:'0.75rem', color:'#6b7280'}}>(will be sent to employee via email)</span></label>
                                <input
                                    type="text"
                                    placeholder="Set a temporary password"
                                    required
                                    value={inviteForm.password}
                                    onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowInviteModal(false)} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.saveBtn}>
                                    Roles &amp; Permissions →
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Directory Section */}
            <div className={styles.directoryCard}>
                <div className={styles.directoryHeader}>
                    <div className={styles.searchBar}>
                        <Search size={16} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.filters}>
                        <div className={styles.filterGroup}>
                            <Filter size={14} color="#64748b" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className={styles.roleSelect}
                            >
                                <option value="All">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Manager">Manager</option>
                                <option value="Employee">Employee</option>
                                <option value="Agent">Agent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Activity</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeam.map(member => (
                            <tr key={member.id} className={styles.tableRow}>
                                <td>
                                    <div className={styles.memberInfo}>
                                        <div
                                            className={styles.avatar}
                                            style={{ backgroundColor: `${member.color}15`, color: member.color }}
                                        >
                                            {member.initials}
                                        </div>
                                        <div className={styles.memberNameWrap}>
                                            <span className={styles.memberName}>{member.name}</span>
                                            <span className={styles.memberEmail}>{member.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.roleBadge} ${styles[member.role.toLowerCase()] || styles.agent}`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.statusWrap}>
                                        <div
                                            className={styles.statusDot}
                                            style={{ backgroundColor: getStatusColor(member.status) }}
                                        />
                                        <span className={styles.statusText}>{member.status}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.locationText}>
                                        {member.location}
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.lastActive}>{member.lastActive}</span>
                                </td>
                                <td>
                                    <button className={styles.moreBtn}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
