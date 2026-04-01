import React, { useState, useEffect, useRef, useCallback } from "react";
import api from "@/api/axios";
import landingPageService from "@/api/landingPageService";
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
    X,
    Globe,
    FileText,
} from "lucide-react";

const STORAGE_KEY = "crm_campaigns";
const LP_STORAGE_KEY = "crm_landing_pages";

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

    const [whatsappConfig, setWhatsappConfig] = useState({
        messageType: "Broadcast",
        audience: "all",
        message: "Hi {{name}}, thanks for your interest. Our team will contact you shortly.",
    });

    // ================= CAMPAIGN DETAILS DRAWER =================
    const [openCampaign, setOpenCampaign] = useState(null);

    const [campaignConfig, setCampaignConfig] = useState({
        // Social
        platform: "Instagram",
        postType: "Reel",
        contentStatus: "Pending",
        publishDate: "",

        // Email
        audience: [],
        template: "Default Template",
        subject: "",
        body: "",

        // Scheduler
        sendType: "now",
        scheduleDate: "",
        scheduleTime: "",
        recurring: "Weekly",

        notes: "",
    });

    /* ================= LANDING PAGES ================= */

    const [landingPages, setLandingPages] = useState([]);
    const [lpLoading, setLpLoading] = useState(false);
    const [lpError, setLpError] = useState(null);

    const fetchLandingPages = useCallback(async () => {
        try {
            setLpLoading(true);
            const data = await landingPageService.getLandingPages();
            setLandingPages(data);
        } catch (error) {
            console.error("Error fetching landing pages:", error);
            setLpError("Failed to load landing pages");
        } finally {
            setLpLoading(false);
        }
    }, []);

    const handleDeleteLanding = async (id) => {
        if (!window.confirm("Are you sure you want to delete this landing page?")) return;
        try {
            await landingPageService.deleteLandingPage(id);
            setLandingPages(prev => prev.filter((lp) => lp.id !== id));
            if (activeLanding?.id === id) {
                setActiveLanding(null);
            }
        } catch (error) {
            console.error("Error deleting landing page:", error);
            alert("Failed to delete landing page");
        }
    };


    // Load campaigns and stats from backend
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({ totalReach: 0, totalLeads: 0 });
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const branchId = branch?.id || 1;
            const response = await api.get(`/api/campaigns?branchId=${branchId}`, {
                headers: getAuthHeader()
            });

            const rawData = response.data;
            const campaignList = Array.isArray(rawData) ? rawData : (rawData?.campaigns || []);

            if (campaignList.length > 0) {
                const mapped = campaignList.map(c => ({
                    ...c,
                    // Map snake_case fields to camelCase
                    whatsappConfig: c.whatsappConfig || c.whatsapp_config,
                    month: Number(c.month) || currentMonth,
                    year: Number(c.year) || currentYear,
                    color: getColorForChannel(c.channel)
                }));
                setCampaigns(mapped);
                console.log("%c[CAMPAIGNS] Loaded:", "color: #3b82f6; font-weight: bold;", mapped);
            }
        } catch (error) {
            console.error("Error fetching campaigns:", error);
        } finally {
            setLoading(false);
        }
    }, [branch, currentMonth, currentYear]);

    const fetchDashboard = useCallback(async () => {
        try {
            const response = await api.get("/api/campaign/dashboard", {
                headers: getAuthHeader()
            });
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        }
    }, []);

    useEffect(() => {
        fetchCampaigns();
        fetchDashboard();
        fetchLandingPages();
    }, [fetchCampaigns, fetchDashboard, fetchLandingPages]);

    const [activeLanding, setActiveLanding] = useState(null);
    const [activeLPTab, setActiveLPTab] = useState("overview");
    const editorRef = useRef(null);

    const handleCreateLandingPage = async () => {
        const newPage = {
            name: "New Landing Page",
            slug: `page-${Date.now()}`,
            campaign: "Not Connected",
            status: "Draft",
            leads: 0,
            conversion: "0%",
        };
        try {
            const created = await landingPageService.createLandingPage(newPage);
            // Merge with newPage to ensure all fields are present even if backend omits some
            const merged = { ...newPage, ...created };
            setLandingPages(prev => [merged, ...prev]);
            setActiveLanding(merged);
            setTimeout(() => {
                editorRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (error) {
            console.error("Error creating landing page:", error);
            alert("Failed to create landing page");
        }
    };

    const handleSaveLandingChanges = async () => {
        if (!activeLanding) return;
        try {
            const updated = await landingPageService.updateLandingPage(activeLanding.id, activeLanding);
            setLandingPages(prev => prev.map((lp) => (lp.id === updated.id ? updated : lp)));
            alert("Landing page updated successfully!");
            setActiveLanding(null); // Close the editor after save
        } catch (error) {
            console.error("Error updating landing page:", error);
            alert("Failed to update landing page");
        }
    };

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
        setWhatsappConfig({
            messageType: "Broadcast",
            audience: "all",
            message: "Hi {{name}}, thanks for your interest. Our team will contact you shortly.",
        });
    };

    const handleCreateCampaign = async () => {
        if (!createFormData.name.trim()) {
            alert("Please enter a campaign name");
            return;
        }
        try {
            const payload = {
                name: createFormData.name,
                channel: createFormData.channel,
                status: createFormData.status,
                month: createFormData.month,
                year: createFormData.year,
                branch_id: branch?.id || 1,
                whatsapp_config: createFormData.channel === "WhatsApp" ? whatsappConfig : null,
                whatsappConfig: createFormData.channel === "WhatsApp" ? whatsappConfig : null,
            };

            await api.post("/api/campaign/create", payload, {
                headers: getAuthHeader()
            });

            await fetchCampaigns();
            setIsCreating(false);
        } catch (error) {
            console.error("Error creating campaign:", error);
            alert("Failed to create campaign");
        }
    };

    const handleCancelCreate = () => {
        setIsCreating(false);
        setCreateFormData({ name: "", channel: "Email", status: "Draft", month: currentMonth, year: currentYear });
    };

    /* ---------------- PLAY / PAUSE ---------------- */
    const startCampaign = async (id) => {
        try {
            await api.put(`/api/campaign/update/${id}`, { status: "Running" }, {
                headers: getAuthHeader()
            });
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "Running" } : c));
        } catch (error) {
            console.error("Error starting campaign:", error);
        }
    };

    const pauseCampaign = async (id) => {
        try {
            await api.put(`/api/campaign/update/${id}`, { status: "Paused" }, {
                headers: getAuthHeader()
            });
            setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: "Paused" } : c));
        } catch (error) {
            console.error("Error pausing campaign:", error);
        }
    };

    /*------- delete/edit ----------- */

    const handleDeleteCampaign = async (id) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                await api.delete(`/api/campaign/delete/${id}`, {
                    headers: getAuthHeader()
                });
                setCampaigns(prev => prev.filter(c => c.id !== id));
            } catch (error) {
                console.error("Error deleting campaign:", error);
                alert("Failed to delete campaign");
            }
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
        if (camp.channel === "WhatsApp" && camp.whatsappConfig) {
            setWhatsappConfig(camp.whatsappConfig);
        } else {
            setWhatsappConfig({
                messageType: "Broadcast",
                audience: "all",
                message: "Hi {{name}}, thanks for your interest. Our team will contact you shortly.",
            });
        }
    };

    const openCampaignDetails = (campaign) => {
        setOpenCampaign(campaign);
        if (campaign.config) {
            setCampaignConfig(campaign.config);
        } else {
            // Reset to defaults if no config exists
            setCampaignConfig({
                platform: "Instagram",
                postType: "Reel",
                contentStatus: "Pending",
                publishDate: "",
                audience: [],
                template: "Default Template",
                subject: "",
                body: "",
                sendType: "now",
                scheduleDate: "",
                scheduleTime: "",
                recurring: "Weekly",
                notes: "",
            });
        }
    };

    const handleActivateCampaign = () => {
        if (!openCampaign) return;

        // Update the campaign with the new configuration
        setCampaigns((prev) =>
            prev.map((c) =>
                c.id === openCampaign.id
                    ? {
                        ...c,
                        status: "Running",
                        // Store the campaign config
                        config: campaignConfig,
                    }
                    : c
            )
        );

        // Close the drawer
        setOpenCampaign(null);

        // Optional: Show success message
        alert(`Campaign "${openCampaign.name}" has been activated!`);
    };

    const handleOpenBuilder = (camp) => {
        setBuilderCampaign(camp);
        setEditingCampaign(null); // Close edit modal if opening builder
    };

    const handleSaveEdit = async () => {
        if (!editFormData.name.trim()) {
            alert("Please enter a campaign name");
            return;
        }
        try {
            const payload = {
                name: editFormData.name,
                channel: editFormData.channel,
                month: editFormData.month,
                year: editFormData.year,
                whatsapp_config: editFormData.channel === "WhatsApp" ? whatsappConfig : null,
                whatsappConfig: editFormData.channel === "WhatsApp" ? whatsappConfig : null,
                config: editFormData.channel !== "WhatsApp" ? campaignConfig : null,
            };

            await api.put(`/api/campaign/update/${editingCampaign.id}`, payload, {
                headers: getAuthHeader()
            });

            await fetchCampaigns();
            setEditingCampaign(null);
        } catch (error) {
            console.error("Error updating campaign:", error);
            alert("Failed to update campaign");
        }
    };

    const handleCancelEdit = () => {
        setEditingCampaign(null);
        setEditFormData({ name: "", channel: "", month: currentMonth, year: currentYear });
    };

    /* ---------------- FILTERING & PAGINATION ---------------- */
    // First filter by month and year (ensure numeric comparison)
    const monthYearFiltered = campaigns.filter(
        (c) => Number(c.month) === Number(selectedMonth) && Number(c.year) === Number(selectedYear)
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

                        {camp.channel === "WhatsApp" && camp.whatsappConfig && (
                            <div className={styles.whatsappMeta}>
                                <span>📤 {camp.whatsappConfig.messageType}</span>
                                <span>👥 {camp.whatsappConfig.audience === "hot" ? "Hot Leads" : "All Leads"}</span>
                            </div>
                        )}

                        <div className={styles.metaInfo}>
                            <div className={styles.metaItem}>
                                <Calendar size={14} className={styles.metaIcon} />
                                <span>
                                    {camp.config?.sendType
                                        ? (camp.config.sendType === "now" ? "Send Now" : camp.config.sendType === "later" ? `Scheduled: ${camp.config.scheduleDate || 'Soon'}` : "Recurring")
                                        : "Send Now"}
                                </span>
                            </div>
                            <div className={styles.metaItem}>
                                <Mail size={14} className={styles.metaIcon} />
                                <span>Target: {camp.config?.audience?.length > 0 ? camp.config.audience.join(", ") : "All Leads"}</span>
                            </div>
                            <div className={styles.metaItem}>
                                <Edit2 size={14} className={styles.metaIcon} />
                                <span>Content: {camp.config?.subject ? "Custom Content" : "Default Template"}</span>
                            </div>
                        </div>

                        <div className={styles.metrics}>
                            <span>📊 Reach: —</span>
                            <span>📩 Leads: —</span>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.controlGroup}>
                                <div className={styles.tooltipContainer} data-tooltip="Activate">
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => startCampaign(camp.id)}
                                    >
                                        <PlayCircle size={18} />
                                    </button>
                                </div>

                                <div className={styles.tooltipContainer} data-tooltip="Stop">
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => pauseCampaign(camp.id)}
                                    >
                                        <PauseCircle size={18} />
                                    </button>
                                </div>
                            </div>


                            <div className={styles.cardActions}>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => handleEditCampaign(camp)}
                                    title="Edit Campaign"
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

                        {/* ================= SOCIAL CONFIG ================= */}
                        {editFormData.channel === "Social" && (
                            <div className={styles.channelSection}>
                                <h3>Social Media Settings</h3>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Platform</label>
                                        <select
                                            value={campaignConfig.platform}
                                            onChange={(e) => setCampaignConfig({ ...campaignConfig, platform: e.target.value })}
                                        >
                                            <option>Instagram</option>
                                            <option>Facebook</option>
                                            <option>LinkedIn</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Post Type</label>
                                        <select
                                            value={campaignConfig.postType}
                                            onChange={(e) => setCampaignConfig({ ...campaignConfig, postType: e.target.value })}
                                        >
                                            <option>Reel</option>
                                            <option>Post</option>
                                            <option>Story</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= EMAIL CONFIG ================= */}
                        {editFormData.channel === "Email" && (
                            <div className={styles.channelSection}>
                                <h3>Email Quick Settings</h3>
                                <div className={styles.formGroup}>
                                    <label>Subject Line</label>
                                    <input
                                        type="text"
                                        value={campaignConfig.subject}
                                        onChange={(e) => setCampaignConfig({ ...campaignConfig, subject: e.target.value })}
                                        placeholder="Enter subject line"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Template</label>
                                    <select
                                        value={campaignConfig.template}
                                        onChange={(e) => setCampaignConfig({ ...campaignConfig, template: e.target.value })}
                                    >
                                        <option>Default Template</option>
                                        <option>Newsletter</option>
                                        <option>Promotion</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* ================= WHATSAPP CONFIG ================= */}
                        {editFormData.channel === "WhatsApp" && (
                            <div className={styles.channelSection}>
                                <h3>WhatsApp Campaign Settings</h3>

                                <div className={styles.formGroup}>
                                    <label>Message Type</label>
                                    <select
                                        value={whatsappConfig.messageType}
                                        onChange={(e) =>
                                            setWhatsappConfig({ ...whatsappConfig, messageType: e.target.value })
                                        }
                                    >
                                        <option value="Broadcast">Broadcast</option>
                                        <option value="Follow-up">Follow-up</option>
                                        <option value="Promotional">Promotional</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Audience</label>
                                    <select
                                        value={whatsappConfig.audience}
                                        onChange={(e) =>
                                            setWhatsappConfig({ ...whatsappConfig, audience: e.target.value })
                                        }
                                    >
                                        <option value="all">All Leads</option>
                                        <option value="hot">Hot Leads</option>
                                        <option value="custom">Custom Filter</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Message Preview</label>
                                    <textarea
                                        rows="4"
                                        value={whatsappConfig.message}
                                        onChange={(e) =>
                                            setWhatsappConfig({ ...whatsappConfig, message: e.target.value })
                                        }
                                        className={styles.pTextArea}
                                    />
                                    <small>Variables like {"{{name}}"} will be auto-filled</small>
                                </div>
                            </div>
                        )}

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

            {/* ================= CAMPAIGN DETAILS DRAWER ================= */}
            {openCampaign && (
                <div className={styles.drawerOverlay} onClick={() => setOpenCampaign(null)}>
                    <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>

                        {/* ===== HEADER ===== */}
                        <div className={styles.drawerHeader}>
                            <div>
                                <h2>{openCampaign.name}</h2>
                                <span>{openCampaign.channel} Campaign</span>
                            </div>
                            <button className={styles.closeDrawerBtn} onClick={() => setOpenCampaign(null)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* ===== OVERVIEW ===== */}
                        <section>
                            <h4>Overview</h4>
                            <p>Status: {openCampaign.status}</p>
                        </section>

                        {/* ===== SOCIAL CRM ===== */}
                        {openCampaign.channel === "Social" && (
                            <section>
                                <h4>Social Configuration</h4>

                                <select
                                    value={campaignConfig.platform}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, platform: e.target.value })
                                    }
                                >
                                    <option>Instagram</option>
                                    <option>Facebook</option>
                                    <option>LinkedIn</option>
                                </select>

                                <select
                                    value={campaignConfig.postType}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, postType: e.target.value })
                                    }
                                >
                                    <option>Reel</option>
                                    <option>Post</option>
                                    <option>Story</option>
                                </select>

                                <select
                                    value={campaignConfig.contentStatus}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, contentStatus: e.target.value })
                                    }
                                >
                                    <option>Pending</option>
                                    <option>Designed</option>
                                    <option>Approved</option>
                                    <option>Posted</option>
                                </select>

                                <input
                                    type="date"
                                    value={campaignConfig.publishDate}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, publishDate: e.target.value })
                                    }
                                />
                            </section>
                        )}

                        {/* ===== EMAIL CAMPAIGN ===== */}
                        {openCampaign.channel === "Email" && (
                            <section>
                                <h4>Audience</h4>

                                {["All Leads", "Hot Leads", "Custom Filter"].map((a) => (
                                    <label key={a} className={styles.checkbox}>
                                        <input
                                            type="checkbox"
                                            checked={campaignConfig.audience.includes(a)}
                                            onChange={() =>
                                                setCampaignConfig((prev) => ({
                                                    ...prev,
                                                    audience: prev.audience.includes(a)
                                                        ? prev.audience.filter((x) => x !== a)
                                                        : [...prev.audience, a],
                                                }))
                                            }
                                        />
                                        {a}
                                    </label>
                                ))}

                                <h4>Email Content</h4>

                                <input
                                    placeholder="Subject"
                                    value={campaignConfig.subject}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, subject: e.target.value })
                                    }
                                />

                                <textarea
                                    placeholder="Email body..."
                                    rows={5}
                                    value={campaignConfig.body}
                                    onChange={(e) =>
                                        setCampaignConfig({ ...campaignConfig, body: e.target.value })
                                    }
                                />
                            </section>
                        )}

                        {/* ===== SCHEDULER (ALL CHANNELS) ===== */}
                        <section>
                            <h4>Scheduler</h4>

                            {["now", "later", "recurring"].map((type) => (
                                <label key={type} className={styles.radio}>
                                    <input
                                        type="radio"
                                        checked={campaignConfig.sendType === type}
                                        onChange={() =>
                                            setCampaignConfig({ ...campaignConfig, sendType: type })
                                        }
                                    />
                                    {type === "now"
                                        ? "Send Now"
                                        : type === "later"
                                            ? "Schedule Later"
                                            : "Recurring"}
                                </label>
                            ))}

                            {campaignConfig.sendType === "later" && (
                                <>
                                    <input type="date" />
                                    <input type="time" />
                                </>
                            )}

                            {campaignConfig.sendType === "recurring" && (
                                <select>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            )}
                        </section>

                        {/* ===== NOTES ===== */}
                        <section>
                            <h4>Notes</h4>
                            <textarea
                                rows={3}
                                placeholder="Internal notes..."
                                value={campaignConfig.notes}
                                onChange={(e) =>
                                    setCampaignConfig({ ...campaignConfig, notes: e.target.value })
                                }
                            />
                        </section>

                        <button className={styles.activateBtn} onClick={handleActivateCampaign}>Activate Campaign</button>
                    </div>
                </div>
            )}
            {/* ================= LANDING PAGES SECTION ================= */}

            <div className={styles.landingHeader}>
                <h2>Landing Pages</h2>
                <button
                    className={styles.primaryBtn}
                    onClick={handleCreateLandingPage}
                >
                    + Create Landing Page
                </button>
            </div>

            <div className={styles.landingGrid}>
                {lpLoading ? (
                    <div className={styles.lpLoading}>Loading landing pages...</div>
                ) : lpError ? (
                    <div className={styles.lpError}>{lpError}</div>
                ) : landingPages.length === 0 ? (
                    <div className={styles.lpEmpty}>No landing pages found.</div>
                ) : (
                    landingPages.map((page) => (
                        <div
                            key={page.id}
                            className={styles.landingCard}
                            onClick={() => {
                                setActiveLanding(page);
                                setTimeout(() => {
                                    editorRef.current?.scrollIntoView({ behavior: "smooth" });
                                }, 100);
                            }}
                        >
                            <div className={styles.lpCardHeader}>
                                <h4>{page.name}</h4>
                                <div className={styles.lpCardActions}>
                                    <button
                                        className={styles.lpEditBtn}
                                        title="Edit Page"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        className={styles.lpDeleteBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteLanding(page.id);
                                        }}
                                        title="Delete Page"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p>/{page.slug}</p>
                            <span className={`${styles.status} ${page.status === "Published" ? styles.statusPublished : styles.statusDraft}`}>
                                {page.status}
                            </span>

                            <div className={styles.metrics}>
                                <span>Leads: {page.leads}</span>
                                <span>Conv: {page.conversion}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* FULL WIDTH EXPANDABLE EDITOR */}
            {activeLanding && (
                <div ref={editorRef} className={styles.editorWrapper}>
                    <div className={styles.editorHeader}>
                        <h3>{activeLanding.name}</h3>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setActiveLanding(null)}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className={styles.tabsEditor}>
                        {["overview", "content", "form", "analytics"].map((tab) => (
                            <div
                                key={tab}
                                className={`${styles.tabEditor} ${activeLPTab === tab ? styles.activeTabEditor : ""
                                    }`}
                                onClick={() => setActiveLPTab(tab)}
                            >
                                {tab.toUpperCase()}
                            </div>
                        ))}
                    </div>

                    <div className={styles.tabContent}>
                        {activeLPTab === "overview" && (
                            <>
                                <label>Page Name</label>
                                <input
                                    value={activeLanding.name}
                                    onChange={(e) =>
                                        setActiveLanding({
                                            ...activeLanding,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <label>URL Slug</label>
                                <input
                                    value={activeLanding.slug}
                                    onChange={(e) =>
                                        setActiveLanding({
                                            ...activeLanding,
                                            slug: e.target.value,
                                        })
                                    }
                                />

                                <label>Status</label>
                                <select
                                    value={activeLanding.status}
                                    onChange={(e) =>
                                        setActiveLanding({
                                            ...activeLanding,
                                            status: e.target.value,
                                        })
                                    }
                                >
                                    <option>Draft</option>
                                    <option>Published</option>
                                </select>
                            </>
                        )}

                        {activeLPTab === "content" && (
                            <>
                                <label>Headline</label>
                                <input placeholder="Big bold headline here" />

                                <label>Description</label>
                                <textarea placeholder="Write your landing content..." />
                            </>
                        )}

                        {activeLPTab === "form" && (
                            <>
                                <label>Select Fields</label>
                                <div className={styles.checkboxGroup}>
                                    <label><input type="checkbox" /> Name</label>
                                    <label><input type="checkbox" /> Email</label>
                                    <label><input type="checkbox" /> Phone</label>
                                    <label><input type="checkbox" /> Company</label>
                                </div>
                            </>
                        )}


                        {activeLPTab === "analytics" && (
                            <div className={styles.analyticsBox}>
                                <div>Visitors: —</div>
                                <div>Leads: {activeLanding.leads}</div>
                                <div>Conversion Rate: {activeLanding.conversion}</div>
                            </div>
                        )}
                    </div>

                    <div className={styles.editorActions}>
                        <button
                            className={styles.saveBtn}
                            onClick={handleSaveLandingChanges}
                        >
                            Save Changes
                        </button>

                        <button
                            className={styles.publishBtn}
                            onClick={async () => {
                                const updated = { ...activeLanding, status: "Published" };
                                setActiveLanding(updated);
                                try {
                                    const saved = await landingPageService.updateLandingPage(updated.id, updated);
                                    setLandingPages(prev => prev.map((lp) => (lp.id === saved.id ? saved : lp)));
                                    alert("Landing page published successfully!");
                                    setActiveLanding(null); // Close the editor after publish
                                } catch (error) {
                                    console.error("Error publishing landing page:", error);
                                    alert("Failed to publish landing page");
                                }
                            }}
                        >
                            Publish
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
