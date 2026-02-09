import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./leads.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Edit2, Trash2 } from "lucide-react";


const leadTrend = [
    { week: "W1", all: 22, qualified: 12 },
    { week: "W2", all: 30, qualified: 18 },
    { week: "W3", all: 18, qualified: 28 },
    { week: "W4", all: 42, qualified: 34 },
    { week: "W5", all: 55, qualified: 40 },
    { week: "W6", all: 68, qualified: 52 },
]; ''

export default function Leads({ branch }) {

    const [leads, setLeads] = useState([]);

    const fetchLeads = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://192.168.1.15:5000/api/leads", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Map backend data to frontend structure
            const mappedLeads = (res.data || []).map(lead => ({
                id: lead.id,
                name: lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                source: lead.source || lead.lead_source || 'Unknown',
                status: lead.status || 'New',
                score: lead.score || 'Medium',
                sla: lead.sla || 'On Track',
                owner: lead.owner || 'Unassigned',
                createdAt: lead.created_at || 'N/A',
                description: lead.description || '',
            }));
            setLeads(mappedLeads);
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sourceFilter, setSourceFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [showModal, setShowModal] = useState(false);
    const [newLead, setNewLead] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "Website",
        status: "New",
        score: "Medium",
        sla: "On Track",
        owner: "You",
        description: ""
    });

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
                company: newLead.company,
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

            await axios.post("http://192.168.1.15:5000/api/leads", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setShowModal(false);
            setNewLead({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", score: "Medium", sla: "On Track", owner: "You", description: "" });
            fetchLeads(); // Refresh list after adding
        } catch (error) {
            console.error("Failed to create lead:", error);
            alert("Could not create lead. Please check the console for more details.");
        }
    };

    const filtered = leads.filter(l =>
        (statusFilter === "All" || l.status === statusFilter) &&
        (sourceFilter === "All" || l.source === sourceFilter) &&
        (
            l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase()) ||
            l.company?.toLowerCase().includes(search.toLowerCase())
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
            company: lead.company,
            source: lead.source,
            status: lead.status,
            score: lead.score,
            sla: lead.sla,
            owner: lead.owner,
            description: lead.description
        });
        setShowModal(true);
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://192.168.1.15:5000/api/leads/${id}`, {
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

            await axios.put(`http://192.168.1.15:5000/api/leads/${editingLead.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setShowModal(false);
            setEditingLead(null);
            setNewLead({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", score: "Medium", sla: "On Track", owner: "You", description: "" });
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
            <div className={styles.leadsWrap}>

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


                {/* TREND + CAMPAIGN ROW */}

                <div className={styles.leadsInsightsRow}>
                    {/* Leads Over Time */}
                    <div className={styles.leadsTrendCard}>
                        <div className={styles.trendHeader}>
                            <div>
                                <h3>Leads Over Time</h3>
                                <span>Last 6 Weeks</span>
                            </div>
                        </div>

                        <div className={styles.trendGraphWrap}>
                            <ResponsiveContainer width="100%" height={190}>
                                <LineChart data={leadTrend}>
                                    <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                                    <YAxis hide />
                                    <Tooltip />

                                    <Line
                                        type="monotone"
                                        dataKey="all"
                                        stroke="#6b5cff"
                                        strokeWidth={2.5}
                                        dot={{ r: 3 }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="qualified"
                                        stroke="#3bbfa0"
                                        strokeWidth={2.5}
                                        dot={{ r: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>



                    {/* Campaign Panel */}

                    <div className={styles.campaignPanel}>
                        <div className={styles.campaignHeader}>
                            <h3>Top Campaigns</h3>
                            <span>Last 30 days</span>
                        </div>

                        <div className={styles.campaignRow}>
                            <div className={styles.campaignLeft}>
                                <span className={styles.campaignDot}></span>
                                <strong>Instagram Ad</strong>
                            </div>
                            <span className={styles.campaignMeta}>124 leads • 18%</span>
                        </div>

                        <div className={styles.campaignRow}>
                            <div className={styles.campaignLeft}>
                                <span className={styles.campaignDot}></span>
                                <strong>Email Blast</strong>
                            </div>
                            <span className={styles.campaignMeta}>86 leads • 24%</span>
                        </div>

                        <div className={styles.campaignRow}>
                            <div className={styles.campaignLeft}>
                                <span className={styles.campaignDot}></span>
                                <strong>Website Form</strong>
                            </div>
                            <span className={styles.campaignMeta}>310 leads • 32%</span>
                        </div>

                        <button className={styles.campaignBtn}>View All Campaigns</button>
                    </div>




                </div>




                {/* SEARCH & FILTERS */}
                {/* CONTROLS BAR */}
                <div className={styles.leadsTopBar}>
                    <div className={styles.leadsLeftControls}>
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className={styles.leadsSelect}
                        >
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="Hot">Hot</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Converted">Converted</option>
                            <option value="Lost">Lost</option>
                        </select>

                        <select
                            value={sourceFilter}
                            onChange={e => setSourceFilter(e.target.value)}
                            className={styles.leadsSelect}
                        >
                            <option value="All">All Sources</option>
                            <option value="Website">Website</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Campaign">Campaign</option>
                            <option value="Referral">Referral</option>
                        </select>

                        <select
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                            className={styles.leadsSelect}
                        >
                            <option value="latest">Sort: Latest</option>
                            <option value="name-asc">Sort: Name (A–Z)</option>
                            <option value="name-desc">Sort: Name (Z–A)</option>
                        </select>
                    </div>

                    <div className={styles.leadsRightControls}>
                        <input
                            className={styles.leadsSearch}
                            placeholder="Search leads..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
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
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Company</th>
                                    <th>Source</th>
                                    <th>Status</th>
                                    <th>Score</th>
                                    <th>SLA</th>
                                    <th>Owner</th>
                                    <th>Created</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedAndFiltered.length > 0 ? (
                                    sortedAndFiltered.map((l, i) => (
                                        <tr key={i}>
                                            <td className={styles.muted}>{i + 1}</td>
                                            <td className={styles.leadName}>{l.name}</td>
                                            <td className={styles.muted}>{l.email}</td>
                                            <td className={styles.muted}>{l.phone}</td>
                                            <td>{l.company}</td>
                                            <td><span className={styles.sourceChip}>{l.source}</span></td>
                                            <td>
                                                <span
                                                    className={`${styles.status} ${styles[l.status.toLowerCase()]}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`${styles.score} ${styles[l.score.toLowerCase()]}`}>
                                                    {l.score}
                                                </span>
                                            </td>

                                            <td>
                                                <span className={`${styles.sla} ${styles[l.sla.toLowerCase().replace(" ", "-")]}`}>
                                                    {l.sla}
                                                </span>
                                            </td>

                                            <td>{l.owner}</td>
                                            <td className={styles.muted}>{l.createdAt}</td>
                                            <td className={styles.desc}>{l.description}</td>
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
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                                            No leads found matching "{search}"
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
                                <input placeholder="Company" value={newLead.company} onChange={e => setNewLead({ ...newLead, company: e.target.value })} style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />

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
            </div>
        </>
    )
}