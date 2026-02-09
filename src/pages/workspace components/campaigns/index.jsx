import React, { useState, useEffect } from "react";
import styles from "./campaigns.module.css";
import CampaignBuilder from "./builder/CampaignBuilder";
import {
    Plus,
    Mail,
    MessageCircle,
    Calendar,
    PlayCircle,
    PauseCircle,
    Edit2,
    Trash2,
} from "lucide-react";

const STORAGE_KEY = "crm_campaigns";

// Helper function to get color based on channel
const getColorForChannel = (channel) => {
    switch (channel) {
        case "Email":
            return "blue";
        case "WhatsApp":
            return "green";
        case "Social":
            return "pink";
        default:
            return "blue";
    }
};

export const Campaigns = ({ branch }) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    const [filter, setFilter] = useState("All");
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [showAll, setShowAll] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [builderCampaign, setBuilderCampaign] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: "",
        channel: "",
        month: currentMonth,
        year: currentYear,
    });
    const [createFormData, setCreateFormData] = useState({
        name: "",
        channel: "Email",
        status: "Draft",
        month: currentMonth,
        year: currentYear,
    });

    // Load campaigns from localStorage on mount
    const [campaigns, setCampaigns] = useState(() => {
        const defaultCampaigns = [
            {
                id: 1,
                name: "Diwali Email Blast",
                channel: "Email",
                status: "Running",
                color: "blue",
                month: 2, // February
                year: 2026,
            },
            {
                id: 2,
                name: "VIP WhatsApp Outreach",
                channel: "WhatsApp",
                status: "Scheduled",
                color: "green",
                month: 2, // February
                year: 2026,
            },
            {
                id: 3,
                name: "Instagram Promo",
                channel: "Social",
                status: "Draft",
                color: "pink",
                month: 2, // February
                year: 2026,
            },
        ];

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const savedCampaigns = JSON.parse(saved);
            // Check if defaults already exist in saved campaigns
            const hasDefaults = savedCampaigns.some(c => c.id === 1 || c.id === 2 || c.id === 3);
            if (hasDefaults) {
                return savedCampaigns;
            }
            // Merge defaults with saved campaigns
            return [...defaultCampaigns, ...savedCampaigns];
        }
        return defaultCampaigns;
    });

    // Save campaigns to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    }, [campaigns]);

    /* ---------------- CREATE CAMPAIGN ---------------- */
    const openCreateModal = () => {
        setIsCreating(true);
        setCreateFormData({
            name: "",
            channel: "Email",
            status: "Draft",
            month: currentMonth,
            year: currentYear,
        });
    };

    const handleCreateCampaign = () => {
        if (!createFormData.name.trim()) {
            alert("Please enter a campaign name");
            return;
        }
        const newCampaign = {
            id: Date.now(),
            name: createFormData.name,
            channel: createFormData.channel,
            status: createFormData.status,
            color: getColorForChannel(createFormData.channel),
            month: createFormData.month,
            year: createFormData.year,
        };
        setCampaigns([newCampaign, ...campaigns]);
        setIsCreating(false);
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setCreateFormData({ name: "", channel: "Email", status: "Draft", month: currentMonth, year: currentYear });
    };

    /* ---------------- PLAY / PAUSE ---------------- */
    const startCampaign = (id) => {
        setCampaigns((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: "Running" } : c
            )
        );
    };

    const pauseCampaign = (id) => {
        setCampaigns((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, status: "Draft" } : c
            )
        );
    };

    /*------- delete/edit ----------- */

    const handleDeleteCampaign = (id) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
        }
    };

    const handleEditCampaign = (camp) => {
        setEditingCampaign(camp);
        setEditFormData({
            id: camp.id,
            name: camp.name,
            channel: camp.channel,
            month: camp.month || currentMonth,
            year: camp.year || currentYear,
        });
    };

    const handleOpenBuilder = (camp) => {
        setBuilderCampaign(camp);
        setEditingCampaign(null); // Close edit modal if opening builder
    };

    const handleSaveEdit = () => {
        if (!editFormData.name.trim()) {
            alert("Please enter a campaign name");
            return;
        }
        setCampaigns(prev =>
            prev.map(c =>
                c.id === editingCampaign.id
                    ? {
                        ...c,
                        name: editFormData.name,
                        channel: editFormData.channel,
                        color: getColorForChannel(editFormData.channel),
                        month: editFormData.month,
                        year: editFormData.year,
                    }
                    : c
            )
        );
        setEditingCampaign(null);
    };

    const handleCancelEdit = () => {
        setEditingCampaign(null);
        setEditFormData({ name: "", channel: "", month: currentMonth, year: currentYear });
    };

    /* ---------------- FILTERING & PAGINATION ---------------- */
    // First filter by month and year
    const monthYearFiltered = campaigns.filter(
        (c) => c.month === selectedMonth && c.year === selectedYear
    );

    // Then filter by channel
    const filteredCampaigns =
        filter === "All"
            ? monthYearFiltered
            : monthYearFiltered.filter((c) => c.channel === filter);

    // Pagination: limit to 6 campaigns (2 rows) unless showAll is true
    const ITEMS_PER_PAGE = 6;
    const displayedCampaigns = showAll
        ? filteredCampaigns
        : filteredCampaigns.slice(0, ITEMS_PER_PAGE);

    const hasMore = filteredCampaigns.length > ITEMS_PER_PAGE;
    const hiddenCount = filteredCampaigns.length - ITEMS_PER_PAGE;

    // Generate month and year options
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const years = [2024, 2025, 2026, 2027];



    return (

        <div className={styles.container}>

            {/* ================= HEADER ================= */}
            <div className={styles.header}>
                <div>
                    <h1>Marketing Campaigns</h1>
                    <p>Plan, launch and manage outreach campaigns</p>
                </div>
                <button className={styles.createBtn} onClick={openCreateModal}>
                    <Plus size={18} /> Create Campaign
                </button>
            </div>

            {/* ================= FILTERS ================= */}
            <div className={styles.filters}>
                {/* Month Filter */}
                <select
                    className={styles.monthYearSelect}
                    value={selectedMonth}
                    onChange={(e) => {
                        setSelectedMonth(Number(e.target.value));
                        setShowAll(false); // Reset pagination when filter changes
                    }}
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>

                {/* Year Filter */}
                <select
                    className={styles.monthYearSelect}
                    value={selectedYear}
                    onChange={(e) => {
                        setSelectedYear(Number(e.target.value));
                        setShowAll(false); // Reset pagination when filter changes
                    }}
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                {/* Channel Filters */}
                {["All", "Email", "WhatsApp", "Social"].map((item) => (
                    <button
                        key={item}
                        className={`${styles.filterBtn} ${filter === item ? styles.activeFilter : ""
                            }`}
                        onClick={() => {
                            setFilter(item);
                            setShowAll(false); // Reset pagination when filter changes
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* ================= CAMPAIGNS ================= */}
            <div className={styles.campaignGrid}>
                {displayedCampaigns.map((camp) => (
                    <div
                        key={camp.id}
                        className={`${styles.campaignCard} ${styles[camp.color]}`}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.icon}>
                                {camp.channel === "Email" && <Mail size={18} />}
                                {camp.channel === "WhatsApp" && <MessageCircle size={18} />}
                                {camp.channel === "Social" && <Calendar size={18} />}
                            </div>

                            <span
                                className={`${styles.status} ${styles[camp.status.toLowerCase()]}`}
                            >
                                {camp.status}
                            </span>
                        </div>

                        <h3>{camp.name}</h3>
                        <p className={styles.channel}>{camp.channel} Campaign</p>

                        <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                                <Calendar size={14} className={styles.metaIcon} />
                                <span>{camp.sendType === "later" ? `Scheduled: ${camp.schedule?.date || camp.month + '/' + camp.year}` : "Send Now"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <Mail size={14} className={styles.metaIcon} />
                                <span>Target: {camp.audience?.label || "All Leads"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <Edit2 size={14} className={styles.metaIcon} />
                                <span>Content: {camp.email?.isEdited ? "Custom Template" : "Default Template"}</span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={styles.iconBtn}
                                    onClick={() => handleOpenBuilder(camp)}
                                    title="Open Campaign Builder"
                                >
                                    <PlayCircle size={18} />
                                </button>

                                <button
                                    className={styles.iconBtn}
                                    onClick={() => pauseCampaign(camp.id)}
                                >
                                    <PauseCircle size={18} />
                                </button>
                            </div>


                            <div className={styles.cardActions}>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => handleEditCampaign(camp)}
                                    title="Edit basic info"
                                >
                                    <Edit2 size={16} />
                                </button>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDeleteCampaign(camp.id)}
                                    title="Delete campaign"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>



                    </div>
                ))}
            </div>

            {/* ================= SHOW MORE BUTTON ================= */}
            {hasMore && (
                <div className={styles.showMoreContainer}>
                    <button
                        className={styles.showMoreBtn}
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? "Show Less" : `Show ${hiddenCount} More`}
                    </button>
                </div>
            )}

            {/* ================= CREATE MODAL ================= */}
            {isCreating && (
                <div className={styles.modalOverlay} onClick={handleCancelCreate}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Create New Campaign</h2>

                        <div className={styles.formGroup}>
                            <label>Campaign Name</label>
                            <input
                                type="text"
                                value={createFormData.name}
                                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                placeholder="Enter campaign name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Channel</label>
                            <select
                                value={createFormData.channel}
                                onChange={(e) => setCreateFormData({ ...createFormData, channel: e.target.value })}
                            >
                                <option value="Email">Email</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Social">Social</option>
                            </select>
                            <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                Color theme will be auto-assigned based on channel
                            </small>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Status</label>
                            <select
                                value={createFormData.status}
                                onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                            >
                                <option value="Draft">Draft</option>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Running">Running</option>
                            </select>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Month</label>
                                <select
                                    value={createFormData.month}
                                    onChange={(e) => setCreateFormData({ ...createFormData, month: Number(e.target.value) })}
                                >
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Year</label>
                                <select
                                    value={createFormData.year}
                                    onChange={(e) => setCreateFormData({ ...createFormData, year: Number(e.target.value) })}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={handleCancelCreate}>
                                Cancel
                            </button>
                            <button className={styles.saveBtn} onClick={handleCreateCampaign}>
                                Create Campaign
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {editingCampaign && (
                <div className={styles.modalOverlay} onClick={handleCancelEdit}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>Edit Campaign</h2>

                        <div className={styles.formGroup}>
                            <label>Campaign Name</label>
                            <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                placeholder="Enter campaign name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Channel</label>
                            <select
                                value={editFormData.channel}
                                onChange={(e) => setEditFormData({ ...editFormData, channel: e.target.value })}
                            >
                                <option value="Email">Email</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Social">Social</option>
                            </select>
                            <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                Color theme will be auto-assigned based on channel
                            </small>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Month</label>
                                <select
                                    value={editFormData.month}
                                    onChange={(e) => setEditFormData({ ...editFormData, month: Number(e.target.value) })}
                                >
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Year</label>
                                <select
                                    value={editFormData.year}
                                    onChange={(e) => setEditFormData({ ...editFormData, year: Number(e.target.value) })}
                                >
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={handleCancelEdit}>
                                Cancel
                            </button>
                            <button
                                className={styles.saveBtn}
                                style={{ background: '#7c3aed', marginRight: 'auto' }}
                                onClick={() => handleOpenBuilder(editingCampaign)}
                            >
                                Open Advanced Builder
                            </button>
                            <button className={styles.saveBtn} onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= CAMPAIGN BUILDER (Email Only) ================= */}
            {builderCampaign && (
                <CampaignBuilder
                    campaignName={builderCampaign.name}
                    onClose={() => setBuilderCampaign(null)}
                />
            )}
        </div>
    );
};
