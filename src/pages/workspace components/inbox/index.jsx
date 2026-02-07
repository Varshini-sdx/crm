import React, { useState } from 'react';
import styles from './inbox.module.css';
import { Send, Search } from "lucide-react";

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

export const Inbox = ({ branch }) => {

    const [activeChat, setActiveChat] = useState(chatsMock[0]);
    const [message, setMessage] = useState("");

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
            <div className={styles.inboxWrap}>

                {/* LEFT – CHAT LIST  <div className={styles.inboxWrap}>*/}
                <div className={styles.chatList}>
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
                </div>

                {/* RIGHT – CHAT WINDOW */}
                <div className={styles.chatWindow}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div>
                            <strong>{activeChat.name}</strong>
                            <span>{activeChat.phone}</span>
                        </div>
                    </div>

                    {/* Messages */}
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

                    {/* Input */}
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
                </div>
            </div>
        </div>





    );
};