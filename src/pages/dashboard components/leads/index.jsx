import React, { useEffect, useState } from "react";
import api from "@/api/axios";
import styles from "./leads.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Edit2, Trash2, Filter, Sliders, ChevronDown, Check, ChevronRight } from "lucide-react";


const leadTrend = [
    { week: "W1", all: 22, qualified: 12 },
    { week: "W2", all: 30, qualified: 18 },
    { week: "W3", all: 18, qualified: 28 },
    { week: "W4", all: 42, qualified: 34 },
    { week: "W5", all: 55, qualified: 40 },
    { week: "W6", all: 68, qualified: 52 },
];

export default function Leads({ branch }) {

    const DUMMY_LEADS = [
        { id: 101, name: "Anita Kumar", email: "anita@example.com", phone: "+91 91234 56789", source: "Website", status: "Hot", score: "High", sla: "On Track", owner: "Varshini", createdAt: "2026-02-23" },
        { id: 102, name: "Vikram Singh", email: "vikram@singh.in", phone: "+91 82345 67890", source: "Instagram", status: "New", score: "Medium", sla: "Delayed", owner: "Ravi", createdAt: "2026-02-22" },
        { id: 103, name: "Sarah Jones", email: "sarahj@tech.com", phone: "+1 555 0102", source: "Twitter", status: "Converted", score: "High", sla: "On Track", owner: "Anu", createdAt: "2026-02-20" },
        { id: 104, name: "Rajesh Iyer", email: "riyer@tcs.com", phone: "+91 73456 78901", source: "LinkedIn", status: "Lost", score: "Low", sla: "N/A", owner: "Varshini", createdAt: "2026-02-15" },
    ];

    const [leads, setLeads] = useState(DUMMY_LEADS);
    const [sentLeads, setSentLeads] = useState(new Set());

    const handleSendPayment = (leadId) => {
        setSentLeads(prev => new Set(prev).add(leadId));
    };

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Fetching leads from backend...");
            const res = await api.get("/api/leads/all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Raw Backend Leads Response:", res.data);

            // Handle both array and object responses (e.g. { leads: [...] })
            let data = Array.isArray(res.data)
                ? res.data
                : (res.data && Array.isArray(res.data.leads) ? res.data.leads : (res.data?.data || []));

            console.log("Extracted Leads Data Array:", data);

            // Map backend data to frontend structure
            const manualStatuses = JSON.parse(localStorage.getItem("crm_manual_lead_statuses") || "{}");
            const manualFollowUps = JSON.parse(localStorage.getItem("crm_manual_lead_followups") || "{}");
            const mappedLeads = data.map(lead => {
                const id = lead.id || lead._id || lead.lead_id || lead.uuid;
                return {
                    id,
                    name: lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'No Name',
                    email: lead.email || '',
                    phone: lead.phone || '',
                    source: (lead.source || lead.lead_source || 'Unknown').replace(/^./, c => c.toUpperCase()),
                    status: manualStatuses[id] || lead.status || 'New',
                    followUpDate: manualFollowUps[id] || null,
                    score: (lead.score || 'Medium').replace(/^./, c => c.toUpperCase()),
                    sla: (lead.sla || 'On Track').replace(/^./, c => c.toUpperCase()),
                    owner: lead.owner || lead.assigned_user_id || 'Unassigned',
                    createdAt: lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A',
                    description: lead.description || '',
                    city: lead.city || 'N/A',
                    state: lead.state || 'N/A',
                    country: lead.country || 'N/A',
                    isNewThisWeek: lead.isNewThisWeek || false
                };
            });

            console.log("Successfully Mapped Leads:", mappedLeads);

            if (mappedLeads.length === 0) {
                console.warn("Backend returned 0 leads. Falling back to DUMMY_LEADS.");
                const mappedDummy = DUMMY_LEADS.map(l => ({
                    ...l,
                    status: manualStatuses[l.id] || l.status
                }));
                setLeads(mappedDummy);
            } else {
                setLeads(mappedLeads);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
            setLeads(DUMMY_LEADS);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [branch]);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sourceFilter, setSourceFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [showModal, setShowModal] = useState(false);
    const [newLead, setNewLead] = useState({
        name: "",
        email: "",
        phone: "",
        source: "Website",
        status: "New",
        score: "Medium",
        sla: "On Track",
        owner: "You",
        description: ""
    });

    const ALL_COLUMNS = [
        { id: "id", label: "#" },
        { id: "name", label: "Name" },
        { id: "email", label: "Email" },
        { id: "phone", label: "Phone" },
        { id: "source", label: "Source" },
        { id: "status", label: "Status" },
        { id: "score", label: "Score" },
        { id: "sla", label: "SLA" },
        { id: "owner", label: "Owner" },
        { id: "location", label: "Location" },
        { id: "created", label: "Created" },
        { id: "payment", label: "Payment" },
        { id: "actions", label: "Actions" }
    ];

    const DEFAULT_COLUMNS = ALL_COLUMNS.map(c => c.id);
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem("crm_leads_visible_columns");
        return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    });

    useEffect(() => {
        localStorage.setItem("crm_leads_visible_columns", JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const toggleColumn = (colId) => {
        setVisibleColumns(prev =>
            prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
        );
    };

    const [isCustomizing, setIsCustomizing] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [activeFilterMenu, setActiveFilterMenu] = useState(null);
    const [activeStatusEdit, setActiveStatusEdit] = useState(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const [tempFollowUpDate, setTempFollowUpDate] = useState("");
    const [showFollowUpPicker, setShowFollowUpPicker] = useState(false);
    const leadsWrapRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('[data-dropdown="true"]')) {
                setShowFilterDropdown(false);
                setIsCustomizing(false);
                setActiveStatusEdit(null);
                setShowFollowUpPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusUpdate = (leadId, newStatus, followUpDate = null) => {
        // Update local state for immediate feedback
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, followUpDate: followUpDate || l.followUpDate } : l));

        // Persist to localStorage for "frontend-only" persistence across reloads
        try {
            const manualStatuses = JSON.parse(localStorage.getItem("crm_manual_lead_statuses") || "{}");
            manualStatuses[leadId] = newStatus;
            localStorage.setItem("crm_manual_lead_statuses", JSON.stringify(manualStatuses));

            if (followUpDate) {
                const manualFollowUps = JSON.parse(localStorage.getItem("crm_manual_lead_followups") || "{}");
                manualFollowUps[leadId] = followUpDate;
                localStorage.setItem("crm_manual_lead_followups", JSON.stringify(manualFollowUps));
            }

            console.log(`Status for lead ${leadId} updated to ${newStatus} in localStorage`);
        } catch (error) {
            console.error("Failed to save status to localStorage:", error);
        }

        setActiveStatusEdit(null);
        setShowFollowUpPicker(false);
        setTempFollowUpDate("");
    };

    const handleRemoveDuplicates = () => {
        const initialCount = leads.length;
        const seenEmails = new Set();
        const uniqueLeads = leads.filter(lead => {
            const email = (lead.email || "").toLowerCase().trim();
            if (!email) return true; // Keep leads without email
            if (seenEmails.has(email)) return false;
            seenEmails.add(email);
            return true;
        });

        const removedCount = initialCount - uniqueLeads.length;
        if (removedCount > 0) {
            setLeads(uniqueLeads);
            alert(`${removedCount} duplicate(s) removed successfully.`);
        } else {
            alert("No duplicates found.");
        }
    };

    const getLocation = async () => {
        try {
            const res = await fetch("https://ipinfo.io/json");
            const data = await res.json();
            return {
                ip_address: data.ip || null,
                city: data.city || null,
                state: data.region || null,
                country: data.country || null,
            };
        } catch (error) {
            return {
                ip_address: null,
                city: null,
                state: null,
                country: null,
            };
        }
    };

    const handleAddLead = async (e) => {
        e.preventDefault();
        try {
            const location = await getLocation();
            const token = localStorage.getItem("token");
            const payload = {
                name: newLead.name,
                email: newLead.email,
                phone: newLead.phone,
                source: newLead.source,
                status: newLead.status,
                score: newLead.score,
                sla: newLead.sla,
                owner: newLead.owner,
                description: newLead.description,
                // auto-attached location
                ip_address: location.ip_address,
                city: location.city,
                state: location.state,
                country: location.country,
            };

            const res = await api.post("/api/leads", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Capture lead ID from response if available, or fetchLeads will handle it
            const newLeadId = res.data?.id || res.data?.data?.id;
            if (newLeadId && newLead.status === "Follow-up" && newLead.followUpDate) {
                const manualFollowUps = JSON.parse(localStorage.getItem("crm_manual_lead_followups") || "{}");
                manualFollowUps[newLeadId] = newLead.followUpDate;
                localStorage.setItem("crm_manual_lead_followups", JSON.stringify(manualFollowUps));
            }

            setShowModal(false);
            setNewLead({ name: "", email: "", phone: "", source: "Website", status: "New", score: "Medium", sla: "On Track", owner: "You", description: "", followUpDate: "" });
            fetchLeads(); // Refresh list after adding
        } catch (error) {
            console.error("Failed to create lead:", error);
            alert("Could not create lead. Please check the console for more details.");
        }
    };

    const filtered = leads.filter(l =>
        (statusFilter === "All" || l.status?.toLowerCase() === statusFilter.toLowerCase()) &&
        (sourceFilter === "All" || l.source?.toLowerCase() === sourceFilter.toLowerCase()) &&
        (
            l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.email?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const sortedAndFiltered = [...filtered];
    if (sortOrder === 'name-asc') {
        sortedAndFiltered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOrder === 'name-desc') {
        sortedAndFiltered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }


    const total = leads.length;
    const hot = leads.filter(l => l.status === "Hot").length;
    const converted = leads.filter(l => l.status === "Converted").length;
    const lost = leads.filter(l => l.status === "Lost").length;
    const newWeek = leads.filter(l => l.isNewThisWeek).length;

    const [editingLead, setEditingLead] = useState(null);

    const handleEditClick = (lead) => {
        setEditingLead(lead);
        setNewLead({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            source: lead.source,
            status: lead.status,
            score: lead.score,
            sla: lead.sla,
            owner: lead.owner,
            description: lead.description,
            followUpDate: lead.followUpDate || ""
        });
        setShowModal(true);
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            const token = localStorage.getItem("token");
            await api.delete(`/api/leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchLeads();
        } catch (error) {
            console.error("Failed to delete lead:", error);
            alert("Could not delete lead.");
        }
    };

    const handleUpdateLead = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const payload = { ...newLead };

            await api.put(`/api/leads/${editingLead.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (newLead.status === "Follow-up" && newLead.followUpDate) {
                const manualFollowUps = JSON.parse(localStorage.getItem("crm_manual_lead_followups") || "{}");
                manualFollowUps[editingLead.id] = newLead.followUpDate;
                localStorage.setItem("crm_manual_lead_followups", JSON.stringify(manualFollowUps));
            }

            setShowModal(false);
            setEditingLead(null);
            setNewLead({ name: "", email: "", phone: "", source: "Website", status: "New", score: "Medium", sla: "On Track", owner: "You", description: "", followUpDate: "" });
            fetchLeads();
        } catch (error) {
            console.error("Failed to update lead:", error);
            alert("Could not update lead.");
        }
    };

    const campaigns = {};
    leads.forEach(l => {
        campaigns[l.source] = (campaigns[l.source] || 0) + 1;
    });


    return (
        <>
            <div className={styles.leadsWrap} ref={leadsWrapRef}>

                {/* KPI CARDS */}
                <div className={styles.leadsKpiGrid}>
                    <div className={`${styles.leadsKpi} ${styles.kpiTotal}`}>
                        <span>Total Leads</span>
                        <strong>{total}</strong>
                    </div>
                    <div className={`${styles.leadsKpi} ${styles.kpiNew}`}>
                        <span>New This Week</span>
                        <strong>{newWeek}</strong>
                    </div>
                    <div className={`${styles.leadsKpi} ${styles.kpiHot}`}>
                        <span>Hot Leads</span>
                        <strong>{hot}</strong>
                    </div>
                    <div className={`${styles.leadsKpi} ${styles.kpiConverted}`}>
                        <span>Converted</span>
                        <strong>{converted}</strong>
                    </div>
                    <div className={`${styles.leadsKpi} ${styles.kpiLost}`}>
                        <span>Lost</span>
                        <strong>{lost}</strong>
                    </div>
                </div>

                {/* EXPORT / IMPORT CTA SECTION */}
                <div className={styles.exportSection}>
                    <div className={styles.exportText}>
                        <h3>Import / Export Leads</h3>
                        <p>Import new leads or export existing data for analysis and backup.</p>
                    </div>
                    <div className={styles.exportActionArea}>
                        <button className={styles.importBtn} onClick={() => alert("Import Leads clicked")}>
                            Import
                        </button>
                        <button className={styles.exportBtn} onClick={() => alert("Export Leads clicked")}>
                            Export
                        </button>
                    </div>
                </div>


                {/* TREND + CAMPAIGN ROW */}





                {/* SEARCH & FILTERS */}
                {/* CONTROLS BAR */}
                <div className={styles.leadsTopBar}>
                    <div className={styles.leadsLeftControls}>
                        <div className={styles.filterWrapper} data-dropdown="true">
                            <button
                                className={`${styles.iconBtn} ${showFilterDropdown ? styles.active : ''}`}
                                onClick={() => { setShowFilterDropdown(!showFilterDropdown); setIsCustomizing(false); }}
                            >
                                <Filter size={16} />
                            </button>
                            {showFilterDropdown && (
                                <div className={styles.filterMenu}>
                                    <div
                                        className={styles.filterMenuItem}
                                        onMouseEnter={() => setActiveFilterMenu('status')}
                                        onMouseLeave={() => setActiveFilterMenu(null)}
                                    >
                                        <div className={styles.menuItemHeader}>
                                            <span>Status: {statusFilter}</span>
                                            <ChevronRight size={14} />
                                        </div>
                                        {activeFilterMenu === 'status' && (
                                            <div className={styles.subMenu}>
                                                {["All", "New", "Hot", "Follow-up", "Converted", "Lost"].map(s => (
                                                    <div key={s} className={`${styles.subMenuItem} ${statusFilter === s ? styles.selected : ''}`} onClick={() => { setStatusFilter(s); setShowFilterDropdown(false); setActiveFilterMenu(null); }}>
                                                        {statusFilter === s && <Check size={12} />}
                                                        <span style={{ marginLeft: statusFilter === s ? '0' : '16px' }}>{s === 'All' ? 'All Status' : s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={styles.filterMenuItem}
                                        onMouseEnter={() => setActiveFilterMenu('source')}
                                        onMouseLeave={() => setActiveFilterMenu(null)}
                                    >
                                        <div className={styles.menuItemHeader}>
                                            <span>Source: {sourceFilter}</span>
                                            <ChevronRight size={14} />
                                        </div>
                                        {activeFilterMenu === 'source' && (
                                            <div className={styles.subMenu}>
                                                {["All", "Website", "Instagram", "Campaign", "Referral", "Twitter", "LinkedIn"].map(s => (
                                                    <div key={s} className={`${styles.subMenuItem} ${sourceFilter === s ? styles.selected : ''}`} onClick={() => { setSourceFilter(s); setShowFilterDropdown(false); setActiveFilterMenu(null); }}>
                                                        {sourceFilter === s && <Check size={12} />}
                                                        <span style={{ marginLeft: sourceFilter === s ? '0' : '16px' }}>{s === 'All' ? 'All Sources' : s}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className={styles.filterMenuItem}
                                        onMouseEnter={() => setActiveFilterMenu('sort')}
                                        onMouseLeave={() => setActiveFilterMenu(null)}
                                    >
                                        <div className={styles.menuItemHeader}>
                                            <span>Sort By</span>
                                            <ChevronRight size={14} />
                                        </div>
                                        {activeFilterMenu === 'sort' && (
                                            <div className={styles.subMenu}>
                                                {[
                                                    { val: 'latest', label: 'Latest' },
                                                    { val: 'name-asc', label: 'Name (A–Z)' },
                                                    { val: 'name-desc', label: 'Name (Z–A)' }
                                                ].map(s => (
                                                    <div key={s.val} className={`${styles.subMenuItem} ${sortOrder === s.val ? styles.selected : ''}`} onClick={() => { setSortOrder(s.val); setShowFilterDropdown(false); setActiveFilterMenu(null); }}>
                                                        {sortOrder === s.val && <Check size={12} />}
                                                        <span style={{ marginLeft: sortOrder === s.val ? '0' : '16px' }}>{s.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.filterWrapper} data-dropdown="true">
                            <button
                                className={`${styles.iconBtn} ${isCustomizing ? styles.active : ''}`}
                                onClick={() => { setIsCustomizing(!isCustomizing); setShowFilterDropdown(false); }}
                            >
                                <Sliders size={16} /> Customize
                            </button>
                            {isCustomizing && (
                                <div className={styles.customizationMenu}>
                                    <div className={styles.dropdownHeader}>Toggle Columns</div>
                                    <div className={styles.columnList}>
                                        {ALL_COLUMNS.map(col => (
                                            <div
                                                key={col.id}
                                                className={styles.customToggleItem}
                                                onClick={() => toggleColumn(col.id)}
                                            >
                                                <div className={`${styles.customCheckbox} ${visibleColumns.includes(col.id) ? styles.checked : ''}`}>
                                                    {visibleColumns.includes(col.id) && <Check size={12} />}
                                                </div>
                                                <span>{col.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.dropdownFooter}>
                                        <button className={styles.doneBtn} onClick={() => setIsCustomizing(false)}>Done</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.leadsRightControls}>
                        <button className={styles.dedupeToggle} onClick={handleRemoveDuplicates}>
                            ♻️ Duplicates
                        </button>

                        <input
                            className={styles.leadsSearch}
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />

                        <button className={styles.createLeadBtn} onClick={() => setShowModal(true)}>
                            + Create Lead
                        </button>
                    </div>
                </div>


                {/* ---------- LEADS List TABLE */}
                <div className={styles.leadsLayout}>
                    <div className={styles.leadsTableWrap}>
                        <table className={styles.leadsTable}>
                            <thead>
                                <tr>
                                    {visibleColumns.includes("id") && <th>#</th>}
                                    {visibleColumns.includes("name") && <th>Name</th>}
                                    {visibleColumns.includes("email") && <th>Email</th>}
                                    {visibleColumns.includes("phone") && <th>Phone</th>}
                                    {visibleColumns.includes("source") && <th>Source</th>}
                                    {visibleColumns.includes("status") && <th>Status</th>}
                                    {visibleColumns.includes("score") && <th>Score</th>}
                                    {visibleColumns.includes("sla") && <th>SLA</th>}
                                    {visibleColumns.includes("owner") && <th>Owner</th>}
                                    {visibleColumns.includes("location") && <th>Location</th>}
                                    {visibleColumns.includes("created") && <th>Created</th>}
                                    {visibleColumns.includes("payment") && <th>Payment</th>}
                                    {visibleColumns.includes("actions") && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFiltered.length > 0 ? (
                                    sortedAndFiltered.map((l, i) => (
                                        <tr key={l.id}>
                                            {visibleColumns.includes("id") && <td className={styles.muted}>{i + 1}</td>}
                                            {visibleColumns.includes("name") && <td data-label="Name" className={styles.leadName}>{l.name}</td>}
                                            {visibleColumns.includes("email") && <td data-label="Email" className={styles.muted}>{l.email}</td>}
                                            {visibleColumns.includes("phone") && <td data-label="Phone" className={styles.muted}>{l.phone}</td>}
                                            {visibleColumns.includes("source") && <td data-label="Source"><span className={styles.sourceChip}>{l.source}</span></td>}
                                            {visibleColumns.includes("status") && (
                                                <td data-label="Status">
                                                    <div className={styles.inlineStatusEdit} data-dropdown="true">
                                                        <span
                                                            className={`${styles.status} ${styles[l.status?.toLowerCase() || "new"]} ${styles.clickableStatus}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (activeStatusEdit === l.id) {
                                                                    setActiveStatusEdit(null);
                                                                } else {
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    const parentRect = leadsWrapRef.current.getBoundingClientRect();
                                                                    setDropdownPos({
                                                                        top: rect.bottom - parentRect.top,
                                                                        left: rect.left - parentRect.left
                                                                    });
                                                                    setActiveStatusEdit(l.id);
                                                                }
                                                            }}
                                                        >
                                                            {l.status}
                                                            <ChevronDown size={12} style={{ marginLeft: '4px', opacity: 0.7 }} />
                                                        </span>
                                                        {l.status === "Follow-up" && l.followUpDate && (
                                                            <div className={styles.followUpBadge}>
                                                                {new Date(l.followUpDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.includes("score") && (
                                                <td data-label="Score">
                                                    <span className={`${styles.score} ${styles[l.score?.toLowerCase() || "medium"]}`}>
                                                        {l.score}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.includes("sla") && (
                                                <td data-label="SLA">
                                                    <span className={`${styles.sla} ${styles[l.sla?.toLowerCase()?.replace(" ", "-") || "on-track"]}`}>
                                                        {l.sla}
                                                    </span>
                                                </td>
                                            )}
                                            {visibleColumns.includes("owner") && <td data-label="Owner">{l.owner}</td>}
                                            {visibleColumns.includes("location") && (
                                                <td data-label="Location" className={styles.muted}>
                                                    {l.city !== 'N/A' || l.state !== 'N/A' || l.country !== 'N/A'
                                                        ? `${l.city}, ${l.state}, ${l.country}`
                                                        : 'N/A'}
                                                </td>
                                            )}
                                            {visibleColumns.includes("created") && <td data-label="Created" className={styles.muted}>{l.createdAt}</td>}
                                            {visibleColumns.includes("payment") && (
                                                <td data-label="Payment">
                                                    {sentLeads.has(l.id) ? (
                                                        <span className={styles.sentBtn}>Sent</span>
                                                    ) : (
                                                        <button
                                                            className={styles.paymentBtn}
                                                            onClick={() => handleSendPayment(l.id)}
                                                        >
                                                            Send
                                                        </button>
                                                    )}
                                                </td>
                                            )}
                                            {visibleColumns.includes("actions") && (
                                                <td>
                                                    <div style={{ display: "flex", gap: "10px" }}>
                                                        <button
                                                            onClick={() => handleEditClick(l)}
                                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#6b5cff" }}
                                                            title="Edit Lead"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteLead(l.id)}
                                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ff4d4f" }}
                                                            title="Delete Lead"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="14" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                            No leads found matching "{searchQuery}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CREATE LEAD MODAL */}
                {showModal && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
                        alignItems: "center", zIndex: 1000
                    }}>
                        <div style={{
                            backgroundColor: "white", padding: "25px", borderRadius: "8px",
                            width: "400px", maxWidth: "90%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}>
                            <h2 style={{ marginBottom: "20px", fontSize: "1.2rem", color: "#333" }}>
                                {editingLead ? "Edit Lead" : "Create New Lead"}
                            </h2>
                            <form onSubmit={editingLead ? handleUpdateLead : handleAddLead} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <input placeholder="Name" required value={newLead.name} onChange={e => setNewLead({ ...newLead, name: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
                                <input placeholder="Email" type="email" required value={newLead.email} onChange={e => setNewLead({ ...newLead, email: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
                                <input placeholder="Phone" type="tel" value={newLead.phone} onChange={e => setNewLead({ ...newLead, phone: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />

                                <select value={newLead.source} onChange={e => setNewLead({ ...newLead, source: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
                                    <option value="Website">Website</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Campaign">Campaign</option>
                                    <option value="Referral">Referral</option>
                                </select>

                                <select value={newLead.status} onChange={e => setNewLead({ ...newLead, status: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
                                    <option value="New">New</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>

                                {newLead.status === "Follow-up" && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <label style={{ fontSize: "0.8rem", color: "#666" }}>Follow-up Date & Time</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={newLead.followUpDate}
                                            onChange={e => setNewLead({ ...newLead, followUpDate: e.target.value })}
                                            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
                                        />
                                    </div>
                                )}

                                <textarea placeholder="Description" value={newLead.description} onChange={e => setNewLead({ ...newLead, description: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", minHeight: "60px" }} />

                                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                                    <button type="button" onClick={() => { setShowModal(false); setEditingLead(null); }} style={{ padding: "8px 16px", border: "none", background: "#f0f0f0", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                                    <button type="submit" style={{ padding: "8px 16px", border: "none", background: "#6b5cff", color: "white", borderRadius: "4px", cursor: "pointer" }}>
                                        {editingLead ? "Save Changes" : "Add Lead"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {/* STATUS DROPDOWN PORTAL-LIKE RENDERING (Outside scrollable container) */}
                {activeStatusEdit && (
                    <div
                        className={styles.statusDropdown}
                        style={{
                            position: 'absolute',
                            top: `${dropdownPos.top}px`,
                            left: `${dropdownPos.left}px`,
                            zIndex: 2000
                        }}
                        data-dropdown="true"
                    >
                        {showFollowUpPicker ? (
                            <div className={styles.followUpPickerWrap}>
                                <div className={styles.pickerTitle}>Set Follow-up Time</div>
                                <input
                                    type="datetime-local"
                                    className={styles.pickerInput}
                                    value={tempFollowUpDate}
                                    onChange={(e) => setTempFollowUpDate(e.target.value)}
                                />
                                <div className={styles.pickerActions}>
                                    <button
                                        className={styles.pickerCancel}
                                        onClick={() => setShowFollowUpPicker(false)}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className={styles.pickerConfirm}
                                        disabled={!tempFollowUpDate}
                                        onClick={() => handleStatusUpdate(activeStatusEdit, "Follow-up", tempFollowUpDate)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ["New", "Hot", "Follow-up", "Converted", "Lost"].map(s => {
                                const currentLead = leads.find(l => l.id === activeStatusEdit);
                                const isSelected = currentLead?.status === s;
                                return (
                                    <div
                                        key={s}
                                        className={`${styles.statusOption} ${isSelected ? styles.selectedOption : ''}`}
                                        onClick={() => {
                                            if (s === "Follow-up") {
                                                setShowFollowUpPicker(true);
                                            } else {
                                                handleStatusUpdate(activeStatusEdit, s);
                                            }
                                        }}
                                    >
                                        {isSelected && <Check size={12} />}
                                        <span style={{ marginLeft: isSelected ? '0' : '16px' }}>{s}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
