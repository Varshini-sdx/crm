import { useState, useRef, useEffect } from "react";
import api from "@/api/axios";
import styles from "./mainContacts.module.css";
import ContactProfile from "../contact profile";

import * as XLSX from "xlsx";

/* ------------------ INITIAL DATA ------------------ */

export default function Contacts() {
    const DUMMY_CONTACTS = [
        { id: 1, name: "Amit Patel", company: "Reliance Ind", email: "amit@reliance.com", phone: "+91 98765 43210", owner: "Varshini", lastContact: "2 hours ago", status: "Active" },
        { id: 2, name: "Sneha Reddy", company: "TCS", email: "sneha.r@tcs.com", phone: "+91 87654 32109", owner: "Ravi", lastContact: "Yesterday", status: "New" },
        { id: 3, name: "John Smith", company: "Z-Tech Solutions", email: "jsmith@ztech.io", phone: "+1 415 555 0199", owner: "Anu", lastContact: "3 days ago", status: "Active" },
        { id: 4, name: "Priya Sharma", company: "Infosys", email: "priya@infosys.com", phone: "+91 76543 21098", owner: "Varshini", lastContact: "1 week ago", status: "Inactive" },
    ];

    const [contacts, setContacts] = useState(DUMMY_CONTACTS);
    const [selectedContact, setSelectedContact] = useState(null);
    const fileInputRef = useRef(null);


    const [searchQuery, setSearchQuery] = useState("");
    const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // Track which contact is being edited
    const [newContact, setNewContact] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        owner: "",
        last_contact: "",
        status: "New",
    });

    /* ------------------ BACKEND FETCH ------------------ */
    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem("token");
            let url = "/api/contacts";

            if (showDuplicatesOnly) {
                url = "/api/contacts/duplicates";
            } else if (searchQuery) {
                url = `/api/contacts/search?q=${searchQuery}`;
            }

            console.log(`FETCHING CONTACTS FROM: ${url}`);
            const res = await api.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("CONTACTS LIST RAW RESPONSE:", res.data);

            let data = Array.isArray(res.data) ? res.data : (res.data?.contacts || res.data?.data || []);

            // Normalize data: backend uses snake_case last_contact, but console shows lastContact
            data = data.map(c => ({
                ...c,
                id: c.id ?? c._id,
                owner: (typeof c.owner === 'object' ? c.owner?.name : c.owner) || "Unassigned",
                last_contact: c.last_contact || c.lastContact || "Never"
            }));

            setContacts(data);
        } catch (err) {
            console.error("Failed to fetch contacts", err);
            // Fallback for network errors
            if (!searchQuery && !showDuplicatesOnly) {
                const dummyContacts = [
                    { id: 1, name: "Amit Patel", company: "Reliance Ind", email: "amit@reliance.com", phone: "+91 98765 43210", owner: "Varshini", lastContact: "2 hours ago", status: "Active" },
                    { id: 2, name: "Sneha Reddy", company: "TCS", email: "sneha.r@tcs.com", phone: "+91 87654 32109", owner: "Ravi", lastContact: "Yesterday", status: "New" },
                    { id: 3, name: "John Smith", company: "Z-Tech Solutions", email: "jsmith@ztech.io", phone: "+1 415 555 0199", owner: "Anu", lastContact: "3 days ago", status: "Active" },
                    { id: 4, name: "Priya Sharma", company: "Infosys", email: "priya@infosys.com", phone: "+91 76543 21098", owner: "Varshini", lastContact: "1 week ago", status: "Inactive" },
                ];
                setContacts(dummyContacts);
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchContacts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, showDuplicatesOnly]);

    /* ---------- DEDUPE HELPERS ---------- */
    const getDedupeKey = (c) =>
        `${c.email || ""}-${c.phone || ""}`.toLowerCase();

    const duplicateMap = contacts.reduce((acc, c) => {
        const key = getDedupeKey(c);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});


    /* ------------------ EXPORT CSV ------------------ */

    const handleExport = () => {
        const formattedData = contacts.map((c) => ({
            Name: c.name,
            Company: c.company,
            Email: c.email,
            Phone: c.phone,
            Owner: c.owner,
            "Last Contact": c.lastContact,
            Status: c.status,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
        XLSX.writeFile(workbook, "contacts.xlsx");
    };



    /* ------------------ IMPORT CSV ------------------ */

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split("\n");

            const importedContacts = lines
                .slice(1)
                .map((line) => {
                    const values = line.split(",");
                    if (!values[0]) return null;

                    return {
                        name: values[0]?.trim(),
                        company: values[1]?.trim(),
                        email: values[2]?.trim(),
                        phone: values[3]?.trim(),
                        owner: values[4]?.trim() || "Unassigned",
                        last_contact: "Just now",
                        status: values[6]?.trim() || "New",
                    };
                })
                .filter(Boolean);

            setContacts((prev) => [...prev, ...importedContacts]);
        };

        reader.readAsText(file);
    };


    /*------- dedupe */

    const handleSaveContact = async () => {
        if (!newContact.name) {
            alert("Name is required");
            return;
        }
        const token = localStorage.getItem("token");

        try {
            if (editIndex !== null) {
                // Update existing
                const contactId = contacts[editIndex].id;
                if (contactId) {
                    await api.put(`/api/contacts/${contactId}`, newContact, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchContacts();
                }
            } else {
                // Create new
                await api.post("/api/contacts", {
                    ...newContact,
                    owner: newContact.owner || "Unassigned",
                    last_contact: newContact.last_contact || "Just now",
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchContacts();
            }
        } catch (err) {
            console.error("Error saving contact", err);
        }

        setShowCreateModal(false);
        setNewContact({ name: "", company: "", email: "", phone: "", owner: "", last_contact: "", status: "New" });
        setEditIndex(null);
    };

    const handleEditClick = (contact, e) => {
        e.stopPropagation(); // Prevent row click
        const index = contacts.findIndex((c) => c === contact);
        setEditIndex(index);
        setNewContact(contact);
        setShowCreateModal(true);
    };

    const handleDeleteClick = async (contact, e) => {
        e.stopPropagation(); // Prevent row click
        if (window.confirm(`Are you sure you want to delete ${contact.name}?`)) {
            try {
                const token = localStorage.getItem("token");
                if (contact.id) {
                    await api.delete(`/api/contacts/${contact.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
                setContacts(contacts.filter((c) => c !== contact));
            } catch (err) {
                console.error("Error deleting contact", err);
            }
        }
    };

    const handleRowClick = async (c) => {
        if (c.id) {
            try {
                const token = localStorage.getItem("token");
                const res = await api.get(`/api/contacts/${c.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("SINGLE CONTACT RAW RESPONSE:", res.data);
                setSelectedContact(res.data);
            } catch (err) {
                console.error("Error fetching contact profile", err);
                setSelectedContact(c);
            }
        } else {
            setSelectedContact(c);
        }
    };

    return (
        <div className={styles.contactsPage}>
            {/* KPI CARDS */}
            <div className={styles.contactStats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <span>Total Contacts</span>
                    <b>{contacts.length}</b>
                </div>

                <div className={`${styles.statCard} ${styles.kpiActive}`}>
                    <span>Active</span>
                    <b>{contacts.filter((c) => c.status === "Active").length}</b>
                </div>

                <div className={`${styles.statCard} ${styles.companies}`}>
                    <span>Companies</span>
                    <b>{new Set(contacts.map((c) => c.company)).size}</b>
                </div>

                <div className={`${styles.statCard} ${styles.recent}`}>
                    <span>Recently Added</span>
                    <b>{contacts.length}</b>
                </div>
            </div>

            {/* ACTION BAR */}

            <div className={styles.tableHeader}>
                <h3 className={styles.tableTitle}>Contacts Lists</h3>

                <div className={styles.tableActions}>
                    <button
                        className={styles.importBtn}
                        onClick={() => fileInputRef.current.click()}
                    >
                        ⬆ Import
                    </button>

                    <button className={styles.exportBtn} onClick={handleExport}>
                        ⬇ Export
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        style={{ display: "none" }}
                        onChange={handleImport}
                    />
                </div>
            </div>


            {/* SEARCH & DEDUPE BAR 
            <div className={styles.searchBar}>
                <div className={styles.searchInputWrap}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search contacts by name, email, phone or company"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <button
                    className={`${styles.dedupeToggle} ${showDuplicatesOnly ? styles.activeToggle : ""
                        }`}
                    onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
                >
                    ♻️ Duplicates
                </button>
            </div> */}


            <div className={styles.searchBarRight}>
                <button
                    className={styles.createBtn}
                    onClick={() => {
                        setEditIndex(null);
                        setNewContact({ name: "", company: "", email: "", phone: "", owner: "", last_contact: "", status: "New" });
                        setShowCreateModal(true);
                    }}
                >
                    + Create
                </button>

                <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <button
                        className={`${styles.dedupeToggle} ${showDuplicatesOnly ? styles.activeToggle : ""
                            }`}
                        onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
                    >
                        ♻️ Duplicates
                    </button>

                    <div className={styles.searchInputWrap}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search contacts…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>



            {/* TABLE */}
            <div className={styles.contactsTableWrap}>
                <table className={styles.contactsTable}>
                    <thead>
                        <tr>
                            <th>Contact</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Owner</th>
                            <th>Last Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {contacts.map((c, i) => {
                            const isDuplicate = duplicateMap[getDedupeKey(c)] > 1;
                            return (

                                <tr
                                    key={i}
                                    className={styles.rowClickable}
                                    onClick={() => handleRowClick(c)}
                                >
                                    <td data-label="Contact" className={styles.contactCell}>
                                        <div className={styles.avatar}>{c.name?.[0] || "?"}</div>
                                        <span>{c.name || "Unknown"}</span>
                                    </td>
                                    <td data-label="Company">{c.company || "No Company"}</td>
                                    <td data-label="Email">{c.email || "No Email"}</td>
                                    <td data-label="Phone">{c.phone || "No Phone"}</td>
                                    <td data-label="Owner">{c.owner}</td>
                                    <td data-label="Last Contact">{c.last_contact}</td>
                                    <td data-label="Status">
                                        <div className={styles.statusWrap}>
                                            <span
                                                className={`${styles.status} ${styles[(c.status || "New").toLowerCase() + "_pill"]}`}
                                            >
                                                {c.status || "New"}
                                            </span>

                                            {isDuplicate && (
                                                <span className={styles.duplicateBadge}>
                                                    Duplicate
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td data-label="Actions">
                                        <div className={styles.actionCell}>
                                            <button
                                                className={styles.iconBtn}
                                                title="Edit"
                                                onClick={(e) => handleEditClick(c, e)}
                                            >✏️</button>
                                            <button
                                                className={styles.iconBtn}
                                                title="Delete"
                                                onClick={(e) => handleDeleteClick(c, e)}
                                            >🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedContact && (
                <ContactProfile
                    contact={selectedContact}
                    onClose={() => setSelectedContact(null)}
                />
            )}

            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={() => { setShowCreateModal(false); setEditIndex(null); }}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>
                            {editIndex !== null ? "Edit Contact" : "Create New Contact"}
                        </h3>

                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="e.g. John Doe"
                                value={newContact.name}
                                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Company</label>
                            <input
                                type="text"
                                placeholder="e.g. Acme Inc"
                                value={newContact.company}
                                onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                value={newContact.email}
                                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Phone</label>
                            <input
                                type="text"
                                placeholder="+1 234 567 890"
                                value={newContact.phone}
                                onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Owner</label>
                            <input
                                type="text"
                                placeholder="e.g. Varshini"
                                value={newContact.owner}
                                onChange={(e) => setNewContact({ ...newContact, owner: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Status</label>
                            <select
                                value={newContact.status}
                                onChange={(e) => setNewContact({ ...newContact, status: e.target.value })}
                            >
                                <option value="New">New</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Last Contact</label>
                            <input
                                type="text"
                                placeholder="e.g. 2 days ago"
                                value={newContact.last_contact}
                                onChange={(e) => setNewContact({ ...newContact, last_contact: e.target.value })}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => { setShowCreateModal(false); setEditIndex(null); }}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleSaveContact}>
                                {editIndex !== null ? "Save Changes" : "Create Contact"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
