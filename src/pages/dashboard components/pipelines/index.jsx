import React, { useState, useMemo } from "react";
import { Plus, MoreHorizontal, Zap, TrendingUp, DollarSign, Target, Clock, ArrowUpRight, X, ClipboardList, FileText, Trash2, Download, Paperclip } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./pipelines.module.css";

const PIPELINE_TABS = [
    { label: "Deals Pipeline", type: "deals" },
    { label: "Sales Pipeline", type: "sales" },
    { label: "Partnership", type: "partnership" },
    { label: "Enterprise", type: "enterprise" }
];

const mockPipelinesData = {
    deals: [
        {
            id: "Proposal", title: "Proposal", count: 3,
            deals: [
                { id: 1, title: "Acme Corp Expansion", company: "Acme Corp", value: "₹2,50,000", date: "Mar 12" },
                { id: 2, title: "Global Tech Integration", company: "Global Tech", value: "₹4,80,000", date: "Mar 15" },
            ]
        },
        {
            id: "Negotiation", title: "Negotiation", count: 1,
            deals: [{ id: 3, title: "Nexus Software License", company: "Nexus Sw", value: "₹1,20,000", date: "Mar 10" }]
        },
        {
            id: "Won", title: "Won", count: 1,
            deals: [{ id: 5, title: "Infinite Loop R&D", company: "Apple", value: "₹12,00,000", date: "Feb 28" }]
        },
        {
            id: "Lost", title: "Lost", count: 1,
            deals: [{ id: 9, title: "Legacy System Sync", company: "Wayne Corp", value: "₹90,000", date: "Mar 05" }]
        }
    ],
    sales: [
        {
            id: "Proposal", title: "Proposal", count: 2,
            deals: [
                { id: 101, title: "Bulk Hardware Order", company: "Tech Flow", value: "₹1,50,000", date: "Mar 20" },
                { id: 102, title: "Retail Soft Launch", company: "Soft Mart", value: "₹80,000", date: "Mar 22" },
            ]
        },
        {
            id: "Negotiation", title: "Negotiation", count: 1,
            deals: [{ id: 103, title: "Distribution Deal", company: "Logi Co", value: "₹5,00,000", date: "Mar 18" }]
        },
        {
            id: "Won", title: "Won", count: 1,
            deals: [{ id: 104, title: "Annual Support", company: "Cloud X", value: "₹2,00,000", date: "Mar 05" }]
        },
        {
            id: "Lost", title: "Lost", count: 1,
            deals: [{ id: 105, title: "Prototype Phase", company: "Proto Inc", value: "₹45,000", date: "Feb 20" }]
        }
    ],
    partnership: [
        {
            id: "Proposal", title: "Proposal", count: 1,
            deals: [{ id: 201, title: "Affiliate Expansion", company: "Partner Pro", value: "₹1,00,000", date: "Mar 25" }]
        },
        {
            id: "Negotiation", title: "Negotiation", count: 1,
            deals: [{ id: 202, title: "Exclusive Rights", company: "Global Media", value: "₹25,00,000", date: "Mar 15" }]
        },
        {
            id: "Won", title: "Won", count: 1,
            deals: [{ id: 203, title: "Joint Venture Launch", company: "Venture Corp", value: "₹50,00,000", date: "Mar 01" }]
        },
        {
            id: "Lost", title: "Lost", count: 1,
            deals: [{ id: 204, title: "Content Licensing", company: "Stream Plus", value: "₹5,00,000", date: "Jan 15" }]
        }
    ],
    enterprise: [
        {
            id: "Proposal", title: "Proposal", count: 1,
            deals: [{ id: 301, title: "Govt Infrastructure", company: "National IT", value: "₹1,50,00,000", date: "Mar 30" }]
        },
        {
            id: "Negotiation", title: "Negotiation", count: 1,
            deals: [{ id: 302, title: "Global ERP Sync", company: "Mega Corp", value: "₹85,00,000", date: "Mar 12" }]
        },
        {
            id: "Won", title: "Won", count: 1,
            deals: [{ id: 303, title: "Mainframe Upgrade", company: "IBM Legacy", value: "₹2,00,00,000", date: "Feb 10" }]
        },
        {
            id: "Lost", title: "Lost", count: 1,
            deals: [{ id: 304, title: "Security Audit", company: "Safe Guard", value: "₹20,00,000", date: "Dec 05" }]
        }
    ]
};

const leadsFunnelData = [
    { label: "Awareness", value: "1,250", color: "linear-gradient(135deg, #6366f1, #818cf8)", width: "100%" },
    { label: "Interest", value: "840", color: "linear-gradient(135deg, #8b5cf6, #a78bfa)", width: "85%" },
    { label: "Qualified", value: "520", color: "linear-gradient(135deg, #a855f7, #c084fc)", width: "70%" },
    { label: "Negotiation", value: "210", color: "linear-gradient(135deg, #d946ef, #e879f9)", width: "55%" },
    { label: "Customer", value: "95", color: "linear-gradient(135deg, #ec4899, #f472b6)", width: "40%" }
];

// --- Framer Motion Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function Pipelines() {
    const [activeTab, setActiveTab] = useState(PIPELINE_TABS[0]);
    const [stages, setStages] = useState(mockPipelinesData.deals);

    // Sync stages with active tab
    React.useEffect(() => {
        const data = mockPipelinesData[activeTab.type] || [];
        setStages(data);
        console.log(`%c[PIPELINES] Using dummy data for ${activeTab.label} (Backend integration pending)`, "color: #ff9800; font-weight: bold;");
    }, [activeTab]);

    // Automation Rules State
    const [automationRules, setAutomationRules] = useState([
        {
            id: 1,
            trigger: "When deal enters “Qualified”",
            actions: ["→ Assign to Sales Lead", "→ Send Welcome Email"],
            active: true
        },
        {
            id: 2,
            trigger: "If no activity for 3 days",
            actions: ["→ Flag as High Risk"],
            active: true
        },
        {
            id: 3,
            trigger: "When value > ₹5,00,000",
            actions: ["→ Notify VP of Sales"],
            active: false
        }
    ]);

    // Rule Modal State
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState(null);
    const [ruleForm, setRuleForm] = useState({
        trigger: "",
        actions: "",
        active: true
    });

    // Deal Detail Modal State
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [activeDetailTab, setActiveDetailTab] = useState("general");
    const [dealNotes, setDealNotes] = useState([
        { id: 1, text: "Follow up scheduled for next Tuesday regarding pricing.", time: "2 hours ago" },
        { id: 2, text: "Client interested in the enterprise tier with custom addons.", time: "Yesterday" }
    ]);
    const [dealFiles, setDealFiles] = useState([
        { id: 1, name: "Proposal_Draft_v1.pdf", size: "2.4 MB", type: "PDF" },
        { id: 2, name: "Requirements_Spec.docx", size: "1.1 MB", type: "DOCX" }
    ]);
    const [newNote, setNewNote] = useState("");

    // --- Forecast Logic ---
    const parseAmount = (value) =>
        typeof value === 'string' ? Number(value.replace(/[₹,]/g, "")) : value;

    const forecastMetrics = useMemo(() => {
        const allDeals = stages.flatMap(s => s.deals);
        const totalValue = allDeals.reduce((sum, d) => sum + parseAmount(d.value), 0);

        // Mock probabilities based on stage position
        const STAGE_PROBS = { "Proposal": 0.4, "Negotiation": 0.8, "Won": 1, "Lost": 0 };
        const expectedRevenue = stages.reduce((sum, stage) => {
            const prob = STAGE_PROBS[stage.title] || 0;
            const stageTotal = stage.deals.reduce((s, d) => s + parseAmount(d.value), 0);
            return sum + (stageTotal * prob);
        }, 0);

        return {
            totalValue,
            expectedRevenue,
            dealCount: allDeals.length
        };
    }, [stages]);

    // --- Rule Handlers ---
    const handleAddRule = () => {
        setEditingRuleId(null);
        setRuleForm({ trigger: "", actions: "", active: true });
        setShowRuleModal(true);
    };

    const handleEditRule = (rule) => {
        setEditingRuleId(rule.id);
        setRuleForm({
            trigger: rule.trigger,
            actions: rule.actions.join("\n"),
            active: rule.active
        });
        setShowRuleModal(true);
    };

    const handleSaveRule = (e) => {
        e.preventDefault();
        const actionsList = ruleForm.actions.split("\n").filter(a => a.trim());
        const newRuleData = {
            trigger: ruleForm.trigger,
            actions: actionsList,
            active: ruleForm.active
        };

        if (editingRuleId) {
            setAutomationRules(prev => prev.map(r => r.id === editingRuleId ? { ...r, ...newRuleData } : r));
        } else {
            setAutomationRules(prev => [...prev, { id: Date.now(), ...newRuleData }]);
        }
        setShowRuleModal(false);
    };

    const handleDeleteRule = (id) => {
        if (window.confirm("Are you sure you want to delete this rule?")) {
            setAutomationRules(prev => prev.filter(r => r.id !== id));
        }
    };

    // --- Detail Modal Handlers ---
    const handleCardClick = (deal) => {
        setSelectedDeal(deal);
        setActiveDetailTab("general");
    };

    const handleAddNote = (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        const note = {
            id: Date.now(),
            text: newNote,
            time: "Just now"
        };
        setDealNotes([note, ...dealNotes]);
        setNewNote("");
        console.log("%c[API] POST /api/notes", "color: #10b981", note);
    };

    const handleDeleteNote = (id) => {
        setDealNotes(dealNotes.filter(n => n.id !== id));
        console.log(`%c[API] DELETE /api/notes/${id}`, "color: #ef4444");
    };

    const handleDeleteFile = (id) => {
        setDealFiles(dealFiles.filter(f => f.id !== id));
        console.log(`%c[API] DELETE /api/files/${id}`, "color: #ef4444");
    };

    return (
        <motion.div
            className={styles.pipelinesPage}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >

            {/* ---------- Forecast + Automation Row ---------- */}
            <motion.div className={styles.insightsRow} variants={itemVariants}>

                {/* Automation Section */}
                <div className={styles.automationSection}>
                    <div className={styles.automationHeader}>
                        <div>
                            <h3><Zap size={18} color="#6b5cff" /> Pipeline Automation</h3>
                            <p>Smart rules for deal movement and notifications</p>
                        </div>
                        <button className={styles.addRuleBtn} onClick={handleAddRule}>
                            + Add Rule
                        </button>
                    </div>

                    <div className={styles.automationList}>
                        {automationRules.map((rule) => (
                            <div key={rule.id} className={styles.automationCard}>
                                <div className={styles.ruleContent}>
                                    <strong>{rule.trigger}</strong>
                                    {rule.actions.map((action, idx) => (
                                        <span key={idx}>{action}</span>
                                    ))}
                                </div>
                                <div className={styles.cardStatusActions}>
                                    <span className={`${styles.ruleStatus} ${rule.active ? styles.active : styles.inactive}`}>
                                        {rule.active ? "Active" : "Inactive"}
                                    </span>
                                    <div className={styles.ruleActions}>
                                        <button onClick={() => handleEditRule(rule)} title="Edit" className={styles.ruleActionBtn}>✏️</button>
                                        <button onClick={() => handleDeleteRule(rule.id)} title="Delete" className={styles.ruleActionBtn}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Forecast Section */}
                <div className={styles.forecastSection}>
                    <div className={styles.forecastHeader}>
                        <h3><TrendingUp size={18} color="#16a34a" /> Deal Forecast</h3>
                        <p>Expected outcomes based on current progress</p>
                    </div>

                    <div className={styles.forecastCards}>
                        <div className={`${styles.forecastCard} ${styles.pinkForecast}`}>
                            <span>Total Pipeline</span>
                            <b>₹{forecastMetrics.totalValue.toLocaleString()}</b>
                        </div>

                        <div className={`${styles.forecastCard} ${styles.pinkForecast}`}>
                            <span>Deals in Progress</span>
                            <b>{forecastMetrics.dealCount}</b>
                        </div>

                        <div className={`${styles.forecastCard} ${styles.skyForecast}`}>
                            <span>Expected Revenue</span>
                            <b>₹{Math.round(forecastMetrics.expectedRevenue).toLocaleString()}</b>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div className={styles.pipelineHeader} variants={itemVariants}>
                <h2>Pipelines</h2>
            </motion.div>

            {/* Pipeline Category Pills */}
            <motion.div className={styles.pipelineTabs} variants={itemVariants}>
                {PIPELINE_TABS.map(tab => (
                    <button
                        key={tab.type}
                        onClick={() => setActiveTab(tab)}
                        className={`${styles.pipelineTab} ${activeTab.type === tab.type ? styles.activeTab : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </motion.div>


            {/* Kanban Board Section */}
            <motion.div className={styles.kanbanBoard} variants={itemVariants}>
                {stages.map((stage) => (
                    <div key={stage.id} className={`${styles.kanbanColumn} ${styles[stage.id]}`}>
                        <div className={styles.columnHeader}>
                            <h3>{stage.title}</h3>
                            <span className={styles.countBadge}>{stage.deals.length}</span>
                        </div>
                        <div className={styles.cardContainer}>
                            {stage.deals.map((deal) => (
                                <motion.div
                                    key={deal.id}
                                    className={styles.card}
                                    whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
                                    onClick={() => handleCardClick(deal)}
                                >
                                    <div className={styles.cardTop}>
                                        <strong className={styles.cardTitle}>{deal.title}</strong>
                                        <button className={styles.moreBtn} onClick={(e) => { e.stopPropagation(); }}><MoreHorizontal size={14} /></button>
                                    </div>
                                    <span className={styles.pipelineCompany}>{deal.company}</span>
                                    <div className={styles.cardMeta}>
                                        <span className={styles.value}>{deal.value}</span>
                                        <span className={styles.contact}>{deal.date}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Leads Pipeline Funnel Section */}
            <motion.div className={styles.leadsFunnelSection} variants={itemVariants}>
                <div className={styles.funnelHeader}>
                    <div className={styles.funnelTitleGroup}>
                        <h3>Leads Pipeline Funnel</h3>
                        <p>Visualizing conversion flow from awareness to final customer</p>
                    </div>
                </div>

                <div className={styles.funnelContainer}>
                    {leadsFunnelData.map((stage, idx) => (
                        <div key={idx} className={styles.funnelStageRow}>
                            <div className={styles.stageDescriptionLeft}>
                                <strong>{stage.label}</strong>
                                <span>{stage.value}</span>
                            </div>
                            
                            <div className={styles.funnelShapeWrapper}>
                                <motion.div 
                                    className={styles.funnelTrapezoid}
                                    style={{ 
                                        width: stage.width,
                                        background: stage.color,
                                    }}
                                    whileHover={{ scale: 1.02, filter: "brightness(1.1)" }}
                                >
                                    <span className={styles.funnelValue}>Stage {idx + 1}</span>
                                </motion.div>
                            </div>

                            <div className={styles.stageMetaRight}>
                                {/* Conversion metadata placeholder for future use */}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Rule Modal */}
            {showRuleModal && (
                <div className={styles.modalOverlay} onClick={() => setShowRuleModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>{editingRuleId ? "Edit Rule" : "Add Automation Rule"}</h3>
                        <form onSubmit={handleSaveRule}>
                            <div className={styles.formGroup}>
                                <label>Trigger</label>
                                <input
                                    placeholder="e.g. When deal enters stage X"
                                    required
                                    value={ruleForm.trigger}
                                    onChange={e => setRuleForm({ ...ruleForm, trigger: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Actions (one per line)</label>
                                <textarea
                                    placeholder="e.g. Move to X"
                                    rows={3}
                                    required
                                    value={ruleForm.actions}
                                    onChange={e => setRuleForm({ ...ruleForm, actions: e.target.value })}
                                />
                            </div>
                            <div className={styles.checkboxGroup}>
                                <input
                                    type="checkbox"
                                    checked={ruleForm.active}
                                    onChange={e => setRuleForm({ ...ruleForm, active: e.target.checked })}
                                    id="ruleActive"
                                />
                                <label htmlFor="ruleActive">Active</label>
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setShowRuleModal(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Deal Detail Modal */}
            {selectedDeal && (
                <div className={styles.detailModalOverlay} onClick={() => setSelectedDeal(null)}>
                    <motion.div 
                        className={styles.detailModalContent} 
                        onClick={e => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                    >
                        <header className={styles.detailModalHeader}>
                            <div className={styles.headerTitle}>
                                <h2>{selectedDeal.title}</h2>
                                <span className={styles.companyBadge}>{selectedDeal.company}</span>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setSelectedDeal(null)}>
                                <X size={20} />
                            </button>
                        </header>

                        <div className={styles.detailModalBody}>
                            <aside className={styles.detailSidebar}>
                                <button 
                                    className={`${styles.detailTab} ${activeDetailTab === "general" ? styles.activeDetailTab : ""}`}
                                    onClick={() => setActiveDetailTab("general")}
                                >
                                    <TrendingUp size={18} /> General
                                </button>
                                <button 
                                    className={`${styles.detailTab} ${activeDetailTab === "notes" ? styles.activeDetailTab : ""}`}
                                    onClick={() => setActiveDetailTab("notes")}
                                >
                                    <ClipboardList size={18} /> Notes
                                </button>
                                <button 
                                    className={`${styles.detailTab} ${activeDetailTab === "files" ? styles.activeDetailTab : ""}`}
                                    onClick={() => setActiveDetailTab("files")}
                                >
                                    <FileText size={18} /> Files
                                </button>
                            </aside>

                            <main className={styles.detailContent}>
                                {activeDetailTab === "general" && (
                                    <div className={styles.generalTab}>
                                        <div className={styles.infoGrid}>
                                            <div className={styles.infoItem}>
                                                <label>Deal Value</label>
                                                <p className={styles.bigValue}>{selectedDeal.value}</p>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <label>Created Date</label>
                                                <p>{selectedDeal.date}</p>
                                            </div>
                                            <div className={styles.infoItem}>
                                                <label>Status</label>
                                                <span className={styles.statusBadge}>In Progress</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === "notes" && (
                                    <div className={styles.notesTab}>
                                        <form onSubmit={handleAddNote} className={styles.noteInputWrapper}>
                                            <textarea 
                                                placeholder="Write a new note..."
                                                value={newNote}
                                                onChange={(e) => setNewNote(e.target.value)}
                                            />
                                            <button type="submit" className={styles.saveNoteBtn}>Add Note</button>
                                        </form>
                                        <div className={styles.notesList}>
                                            {dealNotes.map(note => (
                                                <div key={note.id} className={styles.noteCard}>
                                                    <p>{note.text}</p>
                                                    <div className={styles.noteMeta}>
                                                        <span>{note.time}</span>
                                                        <button onClick={() => handleDeleteNote(note.id)}><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeDetailTab === "files" && (
                                    <div className={styles.filesTab}>
                                        <div className={styles.uploadArea}>
                                            <Paperclip size={20} />
                                            <p>Drop files here or click to upload</p>
                                            <input type="file" className={styles.hiddenInput} />
                                        </div>
                                        <div className={styles.filesList}>
                                            {dealFiles.map(file => (
                                                <div key={file.id} className={styles.fileCard}>
                                                    <div className={styles.fileInfo}>
                                                        <div className={styles.fileIcon}>{file.type}</div>
                                                        <div>
                                                            <strong>{file.name}</strong>
                                                            <span>{file.size}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.fileActions}>
                                                        <button className={styles.dlBtn} title="Download"><Download size={16} /></button>
                                                        <button className={styles.delBtn} onClick={() => handleDeleteFile(file.id)} title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </main>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
