import { useState, useRef } from "react";
import styles from "./mainContacts.module.css";
import ContactProfile from "../contact profile";

import * as XLSX from "xlsx";

/* ------------------ INITIAL DATA ------------------ */

const initialContacts = [
    {
        name: "Riya Sharma",
        company: "Acme Corp",
        email: "riya@acme.com",
        phone: "+91 98765 43210",
        owner: "Varshini",
        lastContact: "2 days ago",
        status: "Active",
    },
    {
        name: "Aman Patel",
        company: "Zeta Labs",
        email: "aman@zeta.io",
        phone: "+91 99887 66554",
        owner: "Ravi",
        lastContact: "Today",
        status: "New",
    },
    {
        name: "Sneha Rao",
        company: "PixelWorks",
        email: "sneha@pixel.com",
        phone: "+91 91234 56789",
        owner: "Anu",
        lastContact: "1 week ago",
        status: "Inactive",
    },
];

export default function Contacts() {
    const [contacts, setContacts] = useState(initialContacts);
    const [selectedContact, setSelectedContact] = useState(null);
    const fileInputRef = useRef(null);


    const [searchQuery, setSearchQuery] = useState("");
    const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

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
                        lastContact: "Just now",
                        status: values[6]?.trim() || "New",
                    };
                })
                .filter(Boolean);

            setContacts((prev) => [...prev, ...importedContacts]);
        };

        reader.readAsText(file);
    };


    /*------- dedupe */

    const filteredContacts = contacts.filter((c) => {
        const query = searchQuery.toLowerCase();

        const matchesSearch =
            c.name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.phone.includes(query) ||
            c.company.toLowerCase().includes(query);

        const isDuplicate = duplicateMap[getDedupeKey(c)] > 1;

        if (showDuplicatesOnly) {
            return matchesSearch && isDuplicate;
        }

        return matchesSearch;
    });





    return (
        <div className={styles.contactsPage}>
            {/* KPI CARDS */}
            <div className={styles.contactStats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <span>Total Contacts</span>
                    <b>{contacts.length}</b>
                </div>

                <div className={`${styles.statCard} ${styles.active}`}>
                    <span>Active</span>
                    <b>{contacts.filter((c) => c.status === "Active").length}</b>
                </div>

                <div className={`${styles.statCard} ${styles.companies}`}>
                    <span>Companies</span>
                    <b>{new Set(contacts.map((c) => c.company)).size}</b>
                </div>

                <div className={`${styles.statCard} ${styles.recent}`}>
                    <span>Recently Added</span>
                    <b>24</b>
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
                        </tr>
                    </thead>

                    <tbody>
                        {filteredContacts.map((c, i) => {
                            const isDuplicate = duplicateMap[getDedupeKey(c)] > 1;
                            return (

                                <tr
                                    key={i}
                                    className={styles.rowClickable}
                                    onClick={() => setSelectedContact(c)}
                                >
                                    <td className={styles.contactCell}>
                                        <div className={styles.avatar}>{c.name[0]}</div>
                                        <span>{c.name}</span>
                                    </td>
                                    <td>{c.company}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.owner}</td>
                                    <td>{c.lastContact}</td>
                                    <td>
                                        <div className={styles.statusWrap}>
                                            <span
                                                className={`${styles.status} ${styles[c.status.toLowerCase()]}`}
                                            >
                                                {c.status}
                                            </span>

                                            {isDuplicate && (
                                                <span className={styles.duplicateBadge}>
                                                    Duplicate
                                                </span>
                                            )}
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
        </div>
    );
}

