import React, { useState, useEffect, useRef } from 'react';
import styles from './EmailInbox.module.css';
import { Search, Reply, Forward, Paperclip, Send, MoreVertical, Star, Trash2, Pin, PinOff } from 'lucide-react';

const emailThreadsMock = [
    {
        id: 1,
        name: "Acme Corp - Marketing",
        email: "marketing@acme.com",
        subject: "Upcoming Campaign Strategy",
        time: "10:30 AM",
        unread: true,
        messages: [
            { id: 101, sender: "Sarah Jenkins", time: "Mar 22, 10:30 AM", body: "Hi team, I've attached the draft for our upcoming spring campaign. Looking forward to your feedback on the localized assets." },
            { id: 102, sender: "Me", time: "Mar 22, 11:15 AM", body: "Thanks Sarah! I'll review it by EOD and let you know if we need any adjustments for the APAC region." }
        ]
    },
    {
        id: 2,
        name: "David Wilson",
        email: "david.w@cloudscale.io",
        subject: "API Integration docs",
        time: "Yesterday",
        unread: false,
        messages: [
            { id: 201, sender: "David Wilson", time: "Mar 21, 04:45 PM", body: "Hey, can you send over the latest API documentation? We're ready to start the sandbox testing phase." }
        ]
    },
    {
        id: 3,
        name: "Invoice Support",
        email: "billing@stripe.com",
        subject: "Your monthly invoice is ready",
        time: "Mar 20",
        unread: false,
        messages: [
            { id: 301, sender: "Stripe Billing", time: "Mar 20, 09:00 AM", body: "Your invoice for the period of Feb 20 - Mar 20 is now available for download in your dashboard." }
        ]
    }
];

export const EmailInbox = () => {
    const [threads, setThreads] = useState(() => {
        const saved = localStorage.getItem('emailThreads');
        return saved ? JSON.parse(saved) : emailThreadsMock;
    });
    const [activeThread, setActiveThread] = useState(threads[0] || null);
    const [subTab, setSubTab] = useState("all"); // "all" or "unread"
    const [searchTerm, setSearchTerm] = useState("");
    const [replyText, setReplyText] = useState("");
    const [pendingFiles, setPendingFiles] = useState([]);
    const composerRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('emailThreads', JSON.stringify(threads));
    }, [threads]);

    const handleSend = () => {
        if (!replyText.trim() || !activeThread) return;
        
        const newMessage = {
            id: Date.now(),
            sender: "Me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            body: replyText
        };

        const updatedThread = {
            ...activeThread,
            messages: [...activeThread.messages, newMessage],
            time: "Just now",
            unread: false
        };

        setActiveThread(updatedThread);
        setThreads(prev => prev.map(t => t.id === activeThread.id ? updatedThread : t));
        setReplyText("");
        setPendingFiles([]);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setPendingFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB' }))]);
        }
    };

    const removeFile = (index) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index));
    };

    const togglePin = (e, id) => {
        e.stopPropagation();
        setThreads(prev => prev.map(t => 
            t.id === id ? { ...t, pinned: !t.pinned } : t
        ));
    };

    const toggleStar = (e, id) => {
        e.stopPropagation();
        setThreads(prev => prev.map(t => 
            t.id === id ? { ...t, starred: !t.starred } : t
        ));
    };

    const handleDelete = (e, id) => {
        if (e) e.stopPropagation();
        const updatedThreads = threads.filter(t => t.id !== id);
        setThreads(updatedThreads);
        if (activeThread?.id === id) {
            setActiveThread(updatedThreads[0] || null);
        }
    };

    const handleReply = () => {
        setReplyText(`Re: ${activeThread.subject}\n\n`);
        composerRef.current?.focus();
    };

    const handleForward = () => {
        const lastMsg = activeThread.messages[activeThread.messages.length - 1];
        setReplyText(`---------- Forwarded message ----------\nFrom: ${lastMsg.sender}\nSubject: ${activeThread.subject}\n\n${lastMsg.body}\n\n`);
        composerRef.current?.focus();
    };

    const sortedThreads = [...threads].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0; // Maintain original order otherwise
    });

    const filteredThreads = sortedThreads.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             t.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = subTab === "all" || (subTab === "unread" && t.unread);
        return matchesSearch && matchesTab;
    });

    return (
        <div className={styles.emailInbox}>
            <div className={styles.emailGrid}>
                {/* LEFT SIDEBAR */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <div className={styles.searchBox}>
                            <Search size={16} color="#94a3b8" />
                            <input 
                                placeholder="Search emails" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className={styles.subTabs}>
                            <button 
                                className={`${styles.subTab} ${subTab === "all" ? styles.activeSubTab : ""}`}
                                onClick={() => setSubTab("all")}
                            >
                                All
                            </button>
                            <button 
                                className={`${styles.subTab} ${subTab === "unread" ? styles.activeSubTab : ""}`}
                                onClick={() => setSubTab("unread")}
                            >
                                Unread
                            </button>
                        </div>
                    </div>

                    <div className={styles.threadList}>
                        {filteredThreads.map((thread) => (
                            <div 
                                key={thread.id} 
                                className={`${styles.threadItem} ${activeThread.id === thread.id ? styles.activeThreadItem : ""}`}
                                onClick={() => setActiveThread(thread)}
                            >
                                <div className={styles.threadTop}>
                                    <span className={styles.senderName}>
                                        {thread.pinned && <Pin size={10} className={styles.pinnedIcon} />}
                                        {thread.name}
                                    </span>
                                    <div className={styles.threadMetaRight}>
                                        {thread.starred && <Star size={12} fill="#fbbf24" color="#fbbf24" />}
                                        <span className={styles.time}>{thread.time}</span>
                                    </div>
                                </div>
                                <div className={styles.threadBottom}>
                                    <span className={styles.subjectLine}>{thread.subject}</span>
                                    <div className={styles.threadActions}>
                                        {thread.unread && <div className={styles.unreadDot} />}
                                        <button 
                                            className={`${styles.starBtn} ${thread.starred ? styles.starred : ""}`}
                                            onClick={(e) => toggleStar(e, thread.id)}
                                        >
                                            <Star size={14} fill={thread.starred ? "#fbbf24" : "none"} />
                                        </button>
                                        <button 
                                            className={styles.pinBtn}
                                            onClick={(e) => togglePin(e, thread.id)}
                                        >
                                            {thread.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className={styles.mainPanel}>
                    {activeThread ? (
                        <>
                            <div className={styles.panelHeader}>
                                <div className={styles.contactInfo}>
                                    <h3>{activeThread.name}</h3>
                                    <p>{activeThread.email}</p>
                                </div>
                                <div className={styles.headerActions}>
                                    <button className={styles.actionBtn} onClick={handleReply}><Reply size={16} /> Reply</button>
                                    <button className={styles.actionBtn} onClick={handleForward}><Forward size={16} /> Forward</button>
                                    <button className={styles.actionBtn} onClick={(e) => handleDelete(e, activeThread.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className={styles.conversation}>
                                {activeThread.messages.map((msg) => (
                                    <div key={msg.id} className={styles.emailCard}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.cardSender}>{msg.sender}</span>
                                            <span className={styles.cardTime}>{msg.time}</span>
                                        </div>
                                        <div className={styles.cardBody}>
                                            {msg.body}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.replyBox}>
                                <div className={styles.composerContainer}>
                                    <input 
                                        type="file" 
                                        multiple 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        onChange={handleFileChange} 
                                    />
                                    {pendingFiles.length > 0 && (
                                        <div className={styles.attachmentArea}>
                                            {pendingFiles.map((file, idx) => (
                                                <div key={idx} className={styles.attachmentChip}>
                                                    <Paperclip size={12} />
                                                    <span>{file.name}</span>
                                                    <button onClick={() => removeFile(idx)}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className={styles.composer}>
                                        <textarea 
                                            ref={composerRef}
                                            placeholder="Write your reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        />
                                        <div className={styles.composerActions}>
                                            <button 
                                                className={`${styles.iconBtn} ${pendingFiles.length > 0 ? styles.activeIcon : ""}`}
                                                onClick={handleFileClick}
                                                title="Attach files"
                                            >
                                                <Paperclip size={20} />
                                            </button>
                                            <button 
                                                className={`${styles.iconBtn} ${activeThread?.starred ? styles.activeStarIcon : ""}`}
                                                onClick={(e) => activeThread && toggleStar(e, activeThread.id)}
                                                title="Star thread"
                                            >
                                                <Star size={20} fill={activeThread?.starred ? "#fbbf24" : "none"} />
                                            </button>
                                            <button className={styles.sendBtn} onClick={handleSend} title="Send email">
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#8a8fb2' }}>
                            Select an email to read the conversation
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
