import styles from "./mainContacts.module.css";

const contacts = [
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
    return (
        <div className={styles.contactsPage}>

            {/* KPI */}
            {/* KPI */}
            <div className={styles.contactStats}>
                <div className={`${styles.statCard} ${styles.total}`}>
                    <span>Total Contacts</span>
                    <b>842</b>
                </div>

                <div className={`${styles.statCard} ${styles.active}`}>
                    <span>Active</span>
                    <b>512</b>
                </div>

                <div className={`${styles.statCard} ${styles.companies}`}>
                    <span>Companies</span>
                    <b>128</b>
                </div>

                <div className={`${styles.statCard} ${styles.recent}`}>
                    <span>Recently Added</span>
                    <b>24</b>
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
                        {contacts.map((c, i) => (
                            <tr key={i}>
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
                                    <span className={`${styles.status} ${styles[c.status.toLowerCase()]}`}>
                                        {c.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table> 
            </div>

        </div>
    );
}
