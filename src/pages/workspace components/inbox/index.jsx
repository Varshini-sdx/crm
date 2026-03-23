import React, { useState } from "react";
import styles from "./inbox.module.css";
import { EmailInbox } from "./email/EmailInbox";
import {
    Send,
    Search,
    Phone,
    PhoneOff,
    Clock,
    User
} from "lucide-react";

const chatsMock = [
    {
        id: 1,
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        lastMessage: "Okay, sounds good",
        time: "12:45 PM",
        unread: 2,
        messages: [
            { from: "lead", text: "Hi, I’m interested in your service" },
            { from: "agent", text: "Sure! Can I know your requirement?" },
            { from: "lead", text: "Website development" },
        ],
    },
    {
        id: 2,
        name: "Ananya Verma",
        phone: "+91 91234 56789",
        lastMessage: "Thanks!",
        time: "11:10 AM",
        unread: 0,
        messages: [
            { from: "lead", text: "Can you share pricing?" },
            { from: "agent", text: "Yes, sending details now." },
        ],
    },
];

const callsMock = [
    {
        id: 1,
        name: "Riya Sharma",
        phone: "+91 99887 77665",
        status: "Missed",
        notes: "",
    },
    {
        id: 2,
        name: "Karan Mehta",
        phone: "+91 88776 55443",
        status: "Connected",
        notes: "Interested in demo",
    },
];

const contactsMock = [
    { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", tag: "Hot Lead" },
    { id: 2, name: "Ananya Verma", phone: "+91 91234 56789", tag: "Warm Lead" },
];

export const Inbox = ({ branch }) => {

    const [activeChat, setActiveChat] = useState(chatsMock[0]);
    const [message, setMessage] = useState("");

    const [activeTab, setActiveTab] = useState("chats");
    const [callSubTab, setCallSubTab] = useState("logs"); // "logs" or "contacts"
    const [contactSearch, setContactSearch] = useState("");
    const [activeCall, setActiveCall] = useState(callsMock[0]);
    const [isCalling, setIsCalling] = useState(false);
    const [callNotes, setCallNotes] = useState("");
    const [dialNumber, setDialNumber] = useState("");

    const startCall = () => {
        setIsCalling(true);
    };

    const endCall = () => {
        setIsCalling(false);
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        setActiveChat({
            ...activeChat,
            messages: [...activeChat.messages, { from: "agent", text: message }],
        });

        setMessage("");
    };

    return (
        <div className={styles.inboxPage}>
            {/* ================= TABS ================= */}
            <div className={styles.tabs}>
                <button
                    className={activeTab === "chats" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("chats")}
                >
                    Chats
                </button>
                <button
                    className={activeTab === "calls" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("calls")}
                >
                    Calls & Dialer
                </button>
                <button
                    className={activeTab === "email" ? styles.activeTab : ""}
                    onClick={() => setActiveTab("email")}
                >
                    Email
                </button>
            </div>

            <div className={styles.inboxWrap}>
                {activeTab === "email" ? (
                    <EmailInbox />
                ) : (
                    <>
                        {/* LEFT PANEL — CONDITIONAL LIST */}
                        <div className={styles.chatList}>
                            {activeTab === "chats" && (
                                <>
                                    <div className={styles.chatListHeader}>WhatsApp Inbox</div>

                                    <div className={styles.searchBox}>
                                        <Search size={16} />
                                        <input placeholder="Search chats" />
                                    </div>

                                    {chatsMock.map((chat) => (
                                        <div
                                            key={chat.id}
                                            className={`${styles.chatItem} ${activeChat.id === chat.id ? styles.active : ""
                                                }`}
                                            onClick={() => setActiveChat(chat)}
                                        >
                                            <div className={styles.avatar}>{chat.name[0]}</div>
                                            <div className={styles.chatInfo}>
                                                <strong>{chat.name}</strong>
                                                <span>{chat.lastMessage}</span>
                                            </div>
                                            <div className={styles.chatMeta}>
                                                <span>{chat.time}</span>
                                                {chat.unread > 0 && (
                                                    <div className={styles.unread}>{chat.unread}</div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <a
                                        href="https://wa.me/919059430599"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.whatsappSupport}
                                        title="Chat with Support"
                                    >
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                            alt="WhatsApp Support"
                                        />
                                    </a>
                                </>
                            )}

                            {activeTab === "calls" && (
                                <>
                                    <div className={styles.chatListHeader}>Calls & Dialer</div>

                                    {/* SUB-TABS (LOGS vs CONTACTS) */}
                                    <div className={styles.subTabs}>
                                        <button
                                            className={callSubTab === "logs" ? styles.activeSubTab : ""}
                                            onClick={() => setCallSubTab("logs")}
                                        >
                                            Logs
                                        </button>
                                        <button
                                            className={callSubTab === "contacts" ? styles.activeSubTab : ""}
                                            onClick={() => setCallSubTab("contacts")}
                                        >
                                            Contacts
                                        </button>
                                    </div>

                                    <div className={styles.searchBox}>
                                        <Search size={16} />
                                        <input
                                            placeholder={callSubTab === "logs" ? "Search call logs" : "Search contacts"}
                                            value={contactSearch}
                                            onChange={(e) => setContactSearch(e.target.value)}
                                        />
                                    </div>

                                    <div className={styles.scrollList}>
                                        {callSubTab === "logs" ? (
                                            callsMock
                                                .filter(call =>
                                                    call.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                                    call.phone.includes(contactSearch)
                                                )
                                                .map((call) => (
                                                    <div
                                                        key={call.id}
                                                        className={`${styles.chatItem} ${activeCall.id === call.id ? styles.active : ""}`}
                                                        onClick={() => setActiveCall(call)}
                                                    >
                                                        <div className={styles.avatar}>
                                                            <User size={16} />
                                                        </div>
                                                        <div className={styles.chatInfo}>
                                                            <strong>{call.name}</strong>
                                                            <span>{call.phone}</span>
                                                        </div>
                                                        <span className={styles.callStatus}>{call.status}</span>
                                                    </div>
                                                ))
                                        ) : (
                                            contactsMock
                                                .filter(contact =>
                                                    contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
                                                    contact.phone.includes(contactSearch)
                                                )
                                                .map(contact => (
                                                    <div
                                                        key={contact.id}
                                                        className={`${styles.chatItem} ${activeCall.phone === contact.phone ? styles.active : ""}`}
                                                        onClick={() => setActiveCall({
                                                            ...contact,
                                                            status: "Ready",
                                                        })}
                                                    >
                                                        <div className={styles.avatar}>{contact.name[0]}</div>
                                                        <div className={styles.chatInfo}>
                                                            <strong>{contact.name}</strong>
                                                            <span>{contact.phone}</span>
                                                        </div>
                                                        <span className={styles.callStatus}>{contact.tag}</span>
                                                    </div>
                                                ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* RIGHT PANEL — CONDITIONAL WINDOW */}
                        <div className={styles.chatWindow}>
                            {activeTab === "chats" && (
                                <>
                                    <div className={styles.chatHeader}>
                                        <strong>{activeChat.name}</strong>
                                        <span>{activeChat.phone}</span>
                                    </div>

                                    <div className={styles.messages}>
                                        {activeChat.messages.map((msg, i) => (
                                            <div
                                                key={i}
                                                className={`${styles.message} ${msg.from === "agent" ? styles.sent : styles.received
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>
                                        ))}
                                    </div>

                                    <div className={styles.inputBar}>
                                        <input
                                            placeholder="Type a message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        />
                                        <button onClick={sendMessage}>
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </>
                            )}

                            {activeTab === "calls" && (
                                <div className={styles.callPanel}>
                                    <div className={styles.manualDialer}>
                                        <label>Dial a Number</label>
                                        <div className={styles.dialInput}>
                                            <input
                                                placeholder="+91 9XXXXXXXXX"
                                                value={dialNumber}
                                                onChange={(e) => setDialNumber(e.target.value)}
                                            />
                                            <button
                                                onClick={() => {
                                                    if (!dialNumber.trim()) return;
                                                    setActiveCall({
                                                        name: "Unknown Caller",
                                                        phone: dialNumber,
                                                    });
                                                    startCall();
                                                }}
                                            >
                                                <Phone size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3>{activeCall.name}</h3>
                                    <p>{activeCall.phone}</p>

                                    <div className={styles.dialerActions}>
                                        {!isCalling ? (
                                            <button className={styles.callBtn} onClick={startCall}>
                                                <Phone size={18} /> Call
                                            </button>
                                        ) : (
                                            <button className={styles.endBtn} onClick={endCall}>
                                                <PhoneOff size={18} /> End
                                            </button>
                                        )}
                                    </div>

                                    <div className={styles.callLog}>
                                        <label>Call Notes</label>
                                        <textarea
                                            placeholder="Add notes after call..."
                                            value={callNotes}
                                            onChange={(e) => setCallNotes(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
