import React, { useState } from "react";
import styles from "./rbac.module.css";
import {
    Shield, Plus, Edit2, Trash2, X, ChevronRight, Users,
    Check, Search, ArrowLeft, ShieldCheck, AlertCircle
} from "lucide-react";

const MODULES = ["Leads", "Deals", "Contacts", "Reports", "Tasks", "Tickets", "Marketing", "Settings"];
const PERMISSIONS = ["view", "create", "edit", "delete", "export"];

const DEFAULT_ROLES = [
    {
        id: 1,
        name: "Super Admin",
        description: "Unrestricted access to everything — system-wide control",
        color: "#6366f1",
        usersAssigned: 1,
        permissions: Object.fromEntries(
            MODULES.map(m => [m, Object.fromEntries(PERMISSIONS.map(p => [p, true]))])
        ),
        assignedUsers: ["Varshini (Super Admin)"]
    },
    {
        id: 2,
        name: "Admin",
        description: "Full access across all modules, can manage users and settings",
        color: "#8b5cf6",
        usersAssigned: 2,
        permissions: Object.fromEntries(
            MODULES.map(m => [
                m,
                Object.fromEntries(
                    PERMISSIONS.map(p => [p, m === "Settings" ? ["view"].includes(p) : true])
                )
            ])
        ),
        assignedUsers: ["Ravi (Admin)", "Anu (Admin)"]
    },
    {
        id: 3,
        name: "Manager",
        description: "Leads, Deals, Contacts, Reports with full access; no system settings",
        color: "#10b981",
        usersAssigned: 5,
        permissions: Object.fromEntries(
            MODULES.map(m => [
                m,
                Object.fromEntries(
                    PERMISSIONS.map(p => [
                        p,
                        ["Leads", "Deals", "Contacts", "Tasks"].includes(m)
                            ? ["view", "create", "edit", "delete"].includes(p)
                            : ["Reports", "Marketing"].includes(m)
                                ? ["view", "export"].includes(p)
                                : m === "Tickets"
                                    ? ["view", "create", "edit"].includes(p)
                                    : false
                    ])
                )
            ])
        ),
        assignedUsers: ["Rohan (Mgr)", "Sneha (Mgr)", "Dev (Mgr)"]
    },
    {
        id: 4,
        name: "Employee",
        description: "View and create access to Leads, Contacts, Tasks, and Tickets only",
        color: "#f59e0b",
        usersAssigned: 8,
        permissions: Object.fromEntries(
            MODULES.map(m => [
                m,
                Object.fromEntries(
                    PERMISSIONS.map(p => [
                        p,
                        ["Leads", "Contacts", "Tasks", "Tickets"].includes(m)
                            ? ["view", "create"].includes(p)
                            : false
                    ])
                )
            ])
        ),
        assignedUsers: ["Kiran (Emp)", "Amit (Emp)", "Priya (Emp)"]
    }
];

const DUMMY_USERS = [
    "Varshini (Admin)", "Ravi (Manager)", "Anu (Manager)", "Rohan (Sales)",
    "Kiran (Rep)", "Amit (Rep)", "Sneha (Rep)", "Priya (Support)", "Dev (Support)", "Neha (Sales)"
];

const emptyPermissions = () =>
    Object.fromEntries(MODULES.map(m => [m, Object.fromEntries(PERMISSIONS.map(p => [p, false]))]));

export default function RBAC({ setActive }) {
    const [view, setView] = useState("list"); // "list" | "editor"
    const [roles, setRoles] = useState(DEFAULT_ROLES);
    const [editingRole, setEditingRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const openCreate = () => {
        setEditingRole({
            id: Date.now(),
            name: "",
            description: "",
            color: "#6366f1",
            usersAssigned: 0,
            permissions: emptyPermissions(),
            assignedUsers: [],
            isNew: true
        });
        setView("editor");
    };

    const openEdit = (role) => {
        setEditingRole(JSON.parse(JSON.stringify(role)));
        setView("editor");
    };

    const handleDelete = (id) => {
        setRoles(prev => prev.filter(r => r.id !== id));
        setDeleteConfirm(null);
    };

    const handleSave = () => {
        if (!editingRole.name.trim()) return alert("Role name is required.");
        if (editingRole.isNew) {
            const { isNew, ...newRole } = editingRole;
            setRoles(prev => [...prev, { ...newRole, usersAssigned: newRole.assignedUsers.length }]);
        } else {
            setRoles(prev => prev.map(r => r.id === editingRole.id
                ? { ...editingRole, usersAssigned: editingRole.assignedUsers.length }
                : r
            ));
        }
        setView("list");
        setEditingRole(null);
    };

    const togglePermission = (module, perm) => {
        setEditingRole(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: {
                    ...prev.permissions[module],
                    [perm]: !prev.permissions[module][perm]
                }
            }
        }));
    };

    const toggleAllForModule = (module) => {
        const allOn = PERMISSIONS.every(p => editingRole.permissions[module][p]);
        setEditingRole(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: Object.fromEntries(PERMISSIONS.map(p => [p, !allOn]))
            }
        }));
    };

    const toggleUser = (user) => {
        setEditingRole(prev => ({
            ...prev,
            assignedUsers: prev.assignedUsers.includes(user)
                ? prev.assignedUsers.filter(u => u !== user)
                : [...prev.assignedUsers, user]
        }));
    };

    const roleColors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#8b5cf6"];

    const filteredRoles = roles.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredUsers = DUMMY_USERS.filter(u =>
        u.toLowerCase().includes(userSearch.toLowerCase())
    );

    if (view === "editor" && editingRole) {
        return (
            <div className={styles.page}>
                {/* Editor Header */}
                <div className={styles.editorHeader}>
                    <button className={styles.backBtn} onClick={() => { setView("list"); setEditingRole(null); }}>
                        <ArrowLeft size={18} />
                        Back to Roles
                    </button>
                    <div className={styles.editorTitle}>
                        <div className={styles.editorTitleIcon} style={{ background: editingRole.color + "20", color: editingRole.color }}>
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <h1>{editingRole.isNew ? "Create New Role" : `Edit: ${editingRole.name}`}</h1>
                            <p>Configure permissions and assign team members</p>
                        </div>
                    </div>
                    <button className={styles.saveBtn} onClick={handleSave}>
                        <Check size={16} /> Save Role
                    </button>
                </div>

                <div className={styles.editorLayout}>
                    {/* Left column — Role info + User assignment */}
                    <div className={styles.editorLeft}>
                        {/* Role Info */}
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <Shield size={18} />
                                <h3>Role Information</h3>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role Name <span className={styles.required}>*</span></label>
                                <select
                                    className={styles.input}
                                    value={editingRole.name}
                                    onChange={e => {
                                        const selectedRole = DEFAULT_ROLES.find(r => r.name === e.target.value);
                                        if (selectedRole) {
                                            setEditingRole(prev => ({
                                                ...prev,
                                                name: selectedRole.name,
                                                description: selectedRole.description,
                                                color: selectedRole.color
                                            }));
                                        } else {
                                            setEditingRole(prev => ({ ...prev, name: e.target.value }));
                                        }
                                    }}
                                >
                                    <option value="" disabled>Select a role</option>
                                    {DEFAULT_ROLES.map(r => (
                                        <option key={r.id} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Assign Users */}
                        <div className={`${styles.card} ${styles.assignUsersCard}`}>
                            <div className={styles.cardHeader}>
                                <Users size={18} />
                                <h3>Assign Team Members</h3>
                            </div>
                            <div className={styles.searchBox}>
                                <Search size={15} className={styles.searchIcon} />
                                <input
                                    className={styles.searchInput}
                                    placeholder="Search users..."
                                    value={userSearch}
                                    onChange={e => setUserSearch(e.target.value)}
                                />
                            </div>
                            <div className={styles.userList}>
                                {filteredUsers.map(user => (
                                    <div
                                        key={user}
                                        className={`${styles.userRow} ${editingRole.assignedUsers.includes(user) ? styles.userSelected : ""}`}
                                        onClick={() => toggleUser(user)}
                                    >
                                        <div className={styles.userAvatar} style={{ background: editingRole.color + "20", color: editingRole.color }}>
                                            {user.charAt(0)}
                                        </div>
                                        <span className={styles.userName}>{user}</span>
                                        {editingRole.assignedUsers.includes(user) && (
                                            <Check size={16} className={styles.userCheck} style={{ color: editingRole.color }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            {editingRole.assignedUsers.length > 0 && (
                                <div className={styles.assignedChips}>
                                    {editingRole.assignedUsers.map(u => (
                                        <span key={u} className={styles.chip} style={{ background: editingRole.color + "15", color: editingRole.color }}>
                                            {u.split(" ")[0]}
                                            <X size={12} onClick={() => toggleUser(u)} />
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right column — Permissions Matrix */}
                    <div className={styles.editorRight}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <ShieldCheck size={18} />
                                <h3>Permissions Matrix</h3>
                                <span className={styles.helperText}>Click on a row to toggle all, or individual cells</span>
                            </div>
                            <div className={styles.matrixWrapper}>
                                <table className={styles.permTable}>
                                    <thead>
                                        <tr>
                                            <th className={styles.moduleCol}>Module</th>
                                            {PERMISSIONS.map(p => (
                                                <th key={p} className={styles.permCol}>{p.charAt(0).toUpperCase() + p.slice(1)}</th>
                                            ))}
                                            <th className={styles.permCol}>All</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MODULES.map((mod, i) => {
                                            const allOn = PERMISSIONS.every(p => editingRole.permissions[mod]?.[p]);
                                            return (
                                                <tr key={mod} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                                                    <td className={styles.moduleCell}>
                                                        <span className={styles.moduleName}>{mod}</span>
                                                    </td>
                                                    {PERMISSIONS.map(perm => (
                                                        <td key={perm} className={styles.permCell}>
                                                            <button
                                                                className={`${styles.permToggle} ${editingRole.permissions[mod]?.[perm] ? styles.permOn : styles.permOff}`}
                                                                onClick={() => togglePermission(mod, perm)}
                                                                style={editingRole.permissions[mod]?.[perm] ? { background: editingRole.color + "20", color: editingRole.color, borderColor: editingRole.color + "40" } : {}}
                                                            >
                                                                {editingRole.permissions[mod]?.[perm] ? <Check size={14} /> : <X size={14} />}
                                                            </button>
                                                        </td>
                                                    ))}
                                                    <td className={styles.permCell}>
                                                        <button
                                                            className={`${styles.toggleAll} ${allOn ? styles.toggleAllOn : ""}`}
                                                            style={allOn ? { background: editingRole.color, borderColor: editingRole.color } : {}}
                                                            onClick={() => toggleAllForModule(mod)}
                                                        >
                                                            {allOn ? "All On" : "All Off"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Roles List View
    return (
        <div className={styles.page}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerIcon}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1>Roles & Permissions</h1>
                        <p>Control who can access what with role-based access control</p>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.searchBox}>
                        <Search size={15} className={styles.searchIcon} />
                        <input
                            className={styles.searchInput}
                            placeholder="Search roles..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className={styles.createRoleBtn} onClick={openCreate}>
                        <Plus size={18} /> Create Role
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <div className={styles.statPill}>
                    <Shield size={16} />
                    <span><strong>{roles.length}</strong> Roles Defined</span>
                </div>
                <div className={styles.statPill}>
                    <Users size={16} />
                    <span><strong>{roles.reduce((a, r) => a + r.usersAssigned, 0)}</strong> Users Assigned</span>
                </div>
                <div className={styles.statPill}>
                    <ShieldCheck size={16} />
                    <span><strong>{MODULES.length}</strong> Modules Protected</span>
                </div>
            </div>

            {/* Roles Table */}
            <div className={styles.tableCard}>
                <div className={styles.tableScroll}>
                    <div className={styles.tableHeader}>
                        <span className={styles.tableCell}>Role Name</span>
                        <span className={styles.tableCell}>Description</span>
                        <span className={styles.tableCellCenter}>Users</span>
                        <span className={styles.tableCellCenter}>Modules</span>
                        <span className={styles.tableCellRight}>Actions</span>
                    </div>
                    {filteredRoles.map(role => {
                        const activeModules = MODULES.filter(m => PERMISSIONS.some(p => role.permissions[m]?.[p]));
                        return (
                            <div key={role.id} className={styles.tableRow}>
                                <div className={styles.tableCell}>
                                    <div className={styles.roleNameCell}>
                                        <div className={styles.roleColorDot} style={{ background: role.color }} />
                                        <div>
                                            <div className={styles.roleName}>{role.name}</div>
                                            <div className={styles.roleUsers}>{role.assignedUsers?.slice(0, 2).join(", ")}{role.assignedUsers?.length > 2 ? ` +${role.assignedUsers.length - 2}` : ""}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.tableCell}>
                                    <span className={styles.roleDesc}>{role.description}</span>
                                </div>
                                <div className={styles.tableCellCenter}>
                                    <span className={styles.badge} style={{ background: role.color + "18", color: role.color }}>
                                        <Users size={13} /> {role.usersAssigned}
                                    </span>
                                </div>
                                <div className={styles.tableCellCenter}>
                                    <span className={styles.badge} style={{ background: "#f1f5f9", color: "#475569" }}>
                                        {activeModules.length} / {MODULES.length}
                                    </span>
                                </div>
                                <div className={styles.tableCellRight}>
                                    <button className={styles.actionBtn} onClick={() => openEdit(role)}>
                                        <Edit2 size={15} /> Edit
                                    </button>
                                    {role.name !== "Super Admin" && (
                                        <button className={styles.deleteBtn} onClick={() => setDeleteConfirm(role.id)}>
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Permission preview cards */}
            <div className={styles.roleCardsGrid}>
                {filteredRoles.map(role => {
                    const enabledCount = MODULES.reduce((acc, m) =>
                        acc + PERMISSIONS.filter(p => role.permissions[m]?.[p]).length, 0
                    );
                    const totalPerms = MODULES.length * PERMISSIONS.length;
                    const pct = Math.round((enabledCount / totalPerms) * 100);
                    return (
                        <div key={role.id} className={styles.roleCard} onClick={() => openEdit(role)}>
                            <div className={styles.roleCardTop} style={{ background: `linear-gradient(135deg, ${role.color}22, ${role.color}08)`, borderTopColor: role.color }}>
                                <div className={styles.roleCardIcon} style={{ background: role.color + "20", color: role.color }}>
                                    <ShieldCheck size={20} />
                                </div>
                                <div className={styles.roleCardInfo}>
                                    <h4 style={{ color: role.color }}>{role.name}</h4>
                                    <p>{role.description}</p>
                                </div>
                            </div>
                            <div className={styles.roleCardBody}>
                                <div className={styles.permBar}>
                                    <div className={styles.permBarLabel}>
                                        <span>Access Level</span>
                                        <span style={{ color: role.color }}>{pct}%</span>
                                    </div>
                                    <div className={styles.permBarTrack}>
                                        <div className={styles.permBarFill} style={{ width: `${pct}%`, background: role.color }} />
                                    </div>
                                </div>
                                <div className={styles.roleCardUsers}>
                                    <Users size={14} style={{ color: role.color }} />
                                    <span>{role.usersAssigned} members assigned</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirm Modal */}
            {deleteConfirm && (
                <div className={styles.modalOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}><AlertCircle size={32} color="#ef4444" /></div>
                        <h3>Delete Role?</h3>
                        <p>This action cannot be undone. All users assigned to this role will lose their permissions.</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className={styles.confirmDeleteBtn} onClick={() => handleDelete(deleteConfirm)}>Delete Role</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
