import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ticketDetail.module.css";
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    User,
    Building2,
    Tag,
    ShieldAlert,
    MessageSquare,
    Lock,
    Send,
    ChevronDown,
    UserCheck,
    Flag,
    X,
    Zap,
    Calendar,
    Timer,
    AlertTriangle,
    Circle,
    Edit3,
    Check,
    Loader2
} from "lucide-react";
import ticketService from "@/api/ticketService";

const statusConfig = {
    Open: { bg: "#dbeafe", color: "#1d4ed8", icon: AlertCircle },
    "In Progress": { bg: "#fef9c3", color: "#d97706", icon: Clock },
    Resolved: { bg: "#dcfce7", color: "#16a34a", icon: CheckCircle },
    Closed: { bg: "#f1f5f9", color: "#64748b", icon: XCircle }
};

const priorityColors = {
    High: { bg: "#fef2f2", color: "#dc2626" },
    Medium: { bg: "#fff7ed", color: "#ea580c" },
    Low: { bg: "#f0fdf4", color: "#16a34a" }
};


// SLA countdown helper
const useSlaTimer = (initialMinutes) => {
    const [remaining, setRemaining] = useState(initialMinutes * 60);

    useEffect(() => {
        if (remaining <= 0) return;
        const id = setInterval(() => setRemaining(r => r - 1), 1000);
        return () => clearInterval(id);
    }, [remaining]);

    const abs = Math.abs(remaining);
    const h = Math.floor(abs / 3600).toString().padStart(2, "0");
    const m = Math.floor((abs % 3600) / 60).toString().padStart(2, "0");
    const s = (abs % 60).toString().padStart(2, "0");
    const breached = remaining < 0;
    return { display: `${breached ? "-" : ""}${h}h ${m}m ${s}s`, breached };
};

export const TicketDetail = ({ ticket, onBack }) => {
    const [activeTab, setActiveTab] = useState("conversation");
    const [messages, setMessages] = useState([]);
    const [notes, setNotes] = useState([]);
    const [activity, setActivity] = useState([]);
    const [draft, setDraft] = useState("");
    const [noteDraft, setNoteDraft] = useState("");
    const [localStatus, setLocalStatus] = useState(ticket.status);
    const [localPriority, setLocalPriority] = useState(ticket.priority);
    const [localAssignee, setLocalAssignee] = useState(ticket.assignee);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingThread, setLoadingThread] = useState(true);
    const threadRef = useRef(null);

    // SLA timers (mock logic for now as it's UI intensive)
    const firstResp = useSlaTimer(ticket.sla_status === "Breached" ? -15 : 82);
    const resolution = useSlaTimer(ticket.sla_status === "Breached" ? -15 : 1210);

    const fetchData = useCallback(async () => {
        if (!ticket?.id) return;

        try {
            setLoadingThread(true);
            const [msgs, act] = await Promise.all([
                ticketService.getMessages(ticket.id).catch(() => []),
                ticketService.getActivity(ticket.id).catch(() => [])
            ]);
            setMessages(msgs);
            setActivity(act);
            
            const internalNotes = msgs.filter(m => m.isInternal || m.type === "note");
            setNotes(internalNotes);
            
        } catch (err) {
            console.error("❌ Failed to fetch ticket details:", err);
        } finally {
            setLoadingThread(false);
        }
    }, [ticket.id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (threadRef.current) {
            threadRef.current.scrollTop = threadRef.current.scrollHeight;
        }
    }, [messages, notes, activeTab]);

    const handleSaveUpdates = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        try {
            setIsSaving(true);
            const promises = [];
            if (localStatus !== ticket.status) {
                promises.push(ticketService.updateStatus(ticket.id, localStatus));
            }
            if (localAssignee !== ticket.assignee) {
                promises.push(ticketService.assignTicket(ticket.id, localAssignee));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
                alert("✅ Ticket updated successfully.");
            }
            setIsEditing(false);
        } catch (err) {
            console.error("❌ Ticket Detail Update Error:", err);
            alert("Failed to update ticket.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleQuickStatusUpdate = async (newStatus) => {
        try {
            setLocalStatus(newStatus);
            await ticketService.updateStatus(ticket.id, newStatus);
        } catch (err) {
            alert("Failed to update status.");
            setLocalStatus(ticket.status);
        }
    };

    const sendMessage = async () => {
        if (!draft.trim()) return;
        try {
            const newMsg = await ticketService.sendMessage(ticket.id, draft.trim());
            setMessages(prev => [...prev, newMsg]);
            setDraft("");
        } catch (err) {
            alert("Failed to send message.");
        }
    };

    const addNote = async () => {
        if (!noteDraft.trim()) return;
        try {
            const newNote = await ticketService.addNote(ticket.id, noteDraft.trim());
            setNotes(prev => [...prev, newNote]);
            setNoteDraft("");
        } catch (err) {
            alert("Failed to add note.");
        }
    };

    const currentStatus = statusConfig[localStatus] || statusConfig["Open"];
    const StatusIcon = currentStatus.icon;
    const currentPriority = priorityColors[localPriority] || priorityColors["Medium"];

    return (
        <div className={styles.detailPage}>

            {/* ─── Back Bar ─── */}
            <div className={styles.detailTopBar}>
                <button className={styles.backBtn} onClick={onBack}>
                    <ArrowLeft size={16} />
                    Back to Tickets
                </button>
                <div className={styles.detailBreadcrumb}>
                    Support Tickets &rsaquo; <span>{ticket.id}</span>
                </div>
            </div>

            {/* ─── Ticket Header ─── */}
            <div className={styles.detailHeader}>
                <div className={styles.detailHeaderLeft}>
                    <div className={styles.detailTitleRow}>
                        <h1 className={styles.detailTitle}>{ticket.title}</h1>
                        <span
                            className={styles.detailStatusBadge}
                            style={{ background: currentStatus.bg, color: currentStatus.color }}
                        >
                            <StatusIcon size={13} />
                            {localStatus}
                        </span>
                        <span
                            className={styles.detailPriorityBadge}
                            style={{ background: currentPriority.bg, color: currentPriority.color }}
                        >
                            <Flag size={11} />
                            {localPriority}
                        </span>
                    </div>
                    <p className={styles.detailDescription}>{ticket.description}</p>
                </div>

                {/* ─── SLA Block ─── */}
                <div className={styles.slaBlock}>
                    <div className={styles.slaBlockHeader}>
                        <ShieldAlert size={15} />
                        SLA Overview
                        <span className={`${styles.slaBadgeHeader} ${firstResp.breached ? styles.slaBreached : styles.slaOnTrack}`}>
                            {firstResp.breached ? "🔴 Breached" : "🟢 On Track"}
                        </span>
                    </div>
                    <div className={styles.slaTimers}>
                        <div className={`${styles.slaTimerCard} ${firstResp.breached ? styles.slaTimerBreached : ""}`}>
                            <div className={styles.slaTimerLabel}>
                                <Timer size={12} />
                                First Response Due In
                            </div>
                            <div className={styles.slaTimerValue}>{firstResp.display}</div>
                        </div>
                        <div className={`${styles.slaTimerCard} ${resolution.breached ? styles.slaTimerBreached : ""}`}>
                            <div className={styles.slaTimerLabel}>
                                <Clock size={12} />
                                Resolution Due In
                            </div>
                            <div className={styles.slaTimerValue}>{resolution.display}</div>
                        </div>
                        {ticket.status === "Resolved" || ticket.status === "Closed" ? (
                            <div className={styles.slaTimerCard}>
                                <div className={styles.slaTimerLabel}>
                                    <CheckCircle size={12} />
                                    Resolution Time
                                </div>
                                <div className={styles.slaTimerValue} style={{ color: "#16a34a" }}>04h 22m</div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* ─── 2-Column Body ─── */}
            <div className={styles.detailBody}>

                {/* ───────── LEFT PANEL ───────── */}
                <aside className={styles.detailLeft}>
                    <div className={styles.detailPanel}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelTitle}>Ticket Info</div>
                            <button
                                className={`${styles.editBtn} ${isEditing ? styles.saveBtnActive : ""}`}
                                onClick={handleSaveUpdates}
                                disabled={isSaving}
                            >
                                {isSaving ? <Check size={14} className={styles.spin} /> : (isEditing ? <Check size={14} /> : <Edit3 size={14} />)}
                                {isSaving ? "Saving..." : (isEditing ? "Save" : "Edit")}
                            </button>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Zap size={13} /> Ticket ID</span>
                            <span className={styles.infoValue} style={{ color: "#1d4ed8", fontFamily: "monospace", fontWeight: 700 }}>{ticket.id}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><User size={13} /> Contact</span>
                            <span className={styles.infoValue}>{ticket.submitted_by}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Building2 size={13} /> Company</span>
                            <span className={styles.infoValue}>Acme Corp</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Tag size={13} /> Category</span>
                            <span className={styles.infoValue}>{ticket.category}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><UserCheck size={13} /> Assigned To</span>
                            {isEditing ? (
                                <select className={styles.inlineSelect} value={localAssignee} onChange={e => setLocalAssignee(e.target.value)}>
                                    <option>Arjun Sharma</option>
                                    <option>Rohan Verma</option>
                                    <option>Sneha Kapoor</option>
                                    <option>Priya Mehta</option>
                                    <option>Dev Nair</option>
                                </select>
                            ) : (
                                <span className={styles.infoValue}>{localAssignee}</span>
                            )}
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Flag size={13} /> Priority</span>
                            {isEditing ? (
                                <select className={styles.inlineSelect} value={localPriority} onChange={e => setLocalPriority(e.target.value)}>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            ) : (
                                <span className={styles.badge} style={{ background: currentPriority.bg, color: currentPriority.color }}>{localPriority}</span>
                            )}
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Circle size={13} /> Status</span>
                            {isEditing ? (
                                <select className={styles.inlineSelect} value={localStatus} onChange={e => setLocalStatus(e.target.value)}>
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Resolved</option>
                                    <option>Closed</option>
                                </select>
                            ) : (
                                <span className={styles.badge} style={{ background: currentStatus.bg, color: currentStatus.color }}>{localStatus}</span>
                            )}
                        </div>
                        <div className={styles.infoDivider} />
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Calendar size={13} /> Created At</span>
                            <span className={styles.infoValue}>{ticket.created_at}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Clock size={13} /> Last Updated</span>
                            <span className={styles.infoValue}>{ticket.updated_at}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><Timer size={13} /> First Response</span>
                            <span className={styles.infoValue} style={{ color: firstResp.breached ? "#dc2626" : "#16a34a" }}>
                                {firstResp.breached ? "Breached" : firstResp.display}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}><AlertCircle size={13} /> SLA Status</span>
                            <span className={`${styles.slaBadge} ${firstResp.breached ? styles.slaBreached : styles.slaOnTrack}`}>
                                {firstResp.breached ? "🔴 Breached" : "🟢 On Track"}
                            </span>
                        </div>
                    </div>



                    {/* Activity Timeline */}
                    <div className={styles.detailPanel}>
                        <div className={styles.panelTitle}>Activity Timeline</div>
                        <div className={styles.activityList}>
                            {activity.length === 0 ? (
                                <p className={styles.emptyActivity}>No activity recorded yet.</p>
                            ) : (
                                activity.map((item, i) => (
                                    <div key={i} className={styles.activityItem}>
                                        <div className={styles.activityDot} style={{ background: item.color || "#3b82f6" }} />
                                        <div>
                                            <span className={styles.activityText}>{item.text || item.description || item.message}</span>
                                            <span className={styles.activityTime}>{item.time || item.createdAt}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div style={{ marginTop: "24px" }}>
                            <label className={styles.quickActionLabel}>Status Update</label>
                            <div className={styles.quickStatusRow}>
                                <select
                                    className={styles.quickStatusSelect}
                                    value={localStatus}
                                    onChange={e => handleQuickStatusUpdate(e.target.value)}
                                >
                                    <option>Open</option>
                                    <option>In Progress</option>
                                    <option>Resolved</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ───────── CENTER PANEL ───────── */}
                <main className={styles.detailCenter}>
                    <div className={styles.threadTabs}>
                        <button
                            className={`${styles.threadTab} ${activeTab === "conversation" ? styles.threadTabActive : ""}`}
                            onClick={() => setActiveTab("conversation")}
                        >
                            <MessageSquare size={14} /> Conversation
                            <span className={styles.threadCount}>{messages.length}</span>
                        </button>
                        <button
                            className={`${styles.threadTab} ${activeTab === "notes" ? styles.threadTabActive : ""}`}
                            onClick={() => setActiveTab("notes")}
                        >
                            <Lock size={14} /> Internal Notes
                            <span className={styles.threadCount}>{notes.length}</span>
                        </button>
                    </div>

                    {/* Thread */}
                    <div className={styles.threadBody} ref={threadRef}>
                        {loadingThread ? (
                            <div className={styles.threadLoading}>
                                <Loader2 className={styles.spin} size={32} />
                                <p>Loading conversation...</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === "conversation" && messages.length === 0 && (
                                    <p className={styles.emptyThread}>No messages in this conversation yet.</p>
                                )}
                                {activeTab === "conversation" && messages.map(msg => (
                                    <div key={msg.id} className={`${styles.msg} ${msg.type === "agent" ? styles.msgAgent : styles.msgCustomer}`}>
                                        <div className={styles.msgAvatar} style={{
                                            background: msg.type === "agent" ? "#e0e7ff" : "#fce7f3",
                                            color: msg.type === "agent" ? "#4f46e5" : "#be185d"
                                        }}>
                                            {(msg.author || "U").split(" ").map(w => w[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className={styles.msgBubbleWrap}>
                                            <div className={styles.msgMeta}>
                                                <strong>{msg.author || "User"}</strong>
                                                <span>{msg.time || msg.createdAt}</span>
                                            </div>
                                            <div className={`${styles.msgBubble} ${msg.type === "agent" ? styles.msgBubbleAgent : styles.msgBubbleCustomer}`}>
                                                {msg.body}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {activeTab === "notes" && notes.length === 0 && (
                                    <p className={styles.emptyThread}>No internal notes added yet.</p>
                                )}
                                {activeTab === "notes" && notes.map(note => (
                                    <div key={note.id} className={`${styles.msg} ${styles.msgNote}`}>
                                        <div className={styles.msgAvatar} style={{ background: "#fef9c3", color: "#d97706" }}>
                                            {(note.author || "A").split(" ").map(w => w[0]).join("").slice(0, 2)}
                                        </div>
                                        <div className={styles.msgBubbleWrap}>
                                            <div className={styles.msgMeta}>
                                                <strong>{note.author || "Agent"}</strong>
                                                <span>{note.time || note.createdAt}</span>
                                                <span className={styles.noteLabel}><Lock size={10} /> Internal</span>
                                            </div>
                                            <div className={`${styles.msgBubble} ${styles.msgBubbleNote}`}>
                                                {note.body}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Compose */}
                    <div className={styles.composeBar} style={{ background: activeTab === "notes" ? "#fffbeb" : "#fafafa" }}>
                        {activeTab === "conversation" ? (
                            <>
                                <textarea
                                    className={styles.composeInput}
                                    placeholder="Write a reply to the customer..."
                                    rows={3}
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) sendMessage(); }}
                                />
                                <div className={styles.composeActions}>
                                    <span className={styles.composeHint}>Ctrl+Enter to send</span>
                                    <button className={styles.sendBtn} onClick={sendMessage}>
                                        <Send size={14} /> Send Reply
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <textarea
                                    className={styles.composeInput}
                                    placeholder="Add an internal note (not visible to customer)..."
                                    rows={3}
                                    value={noteDraft}
                                    onChange={e => setNoteDraft(e.target.value)}
                                    onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) addNote(); }}
                                    style={{ borderColor: "#fbbf24" }}
                                />
                                <div className={styles.composeActions}>
                                    <span className={styles.composeHint}><Lock size={11} /> Only agents can see this</span>
                                    <button className={styles.sendBtn} style={{ background: "#d97706" }} onClick={addNote}>
                                        <Lock size={12} /> Add Note
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
