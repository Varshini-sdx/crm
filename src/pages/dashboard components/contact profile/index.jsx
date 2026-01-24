import styles from "./contactProfile.module.css";

export default function ContactProfile({ contact, onClose }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.profileCard}>

        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.avatarBig}>{contact.name[0]}</div>

          <div className={styles.headerInfo}>
            <h2>{contact.name}</h2>
            <p>{contact.company}</p>

            <span className={`${styles.status} ${styles[contact.status.toLowerCase()]}`}>
              {contact.status}
            </span>
          </div>

          <button onClick={onClose} className={styles.closeBtn}>✕</button>
        </div>

        {/* BODY */}
        <div className={styles.grid}>

          {/* CONTACT INFO */}
          <div className={styles.section}>
            <h4>Contact Information</h4>
            <p><b>Email:</b> {contact.email}</p>
            <p><b>Phone:</b> {contact.phone}</p>
            <p><b>Owner:</b> {contact.owner}</p>
          </div>

          {/* ACTIVITY */}
          <div className={styles.section}>
            <h4>Recent Activity</h4>
            <ul className={styles.timeline}>
              <li>📞 Call made — {contact.lastContact}</li>
              <li>✉️ Email sent — 3 days ago</li>
              <li>➕ Contact added to CRM</li>
            </ul>
          </div>

          {/* ACTIONS */}
          <div className={styles.section}>
            <h4>Quick Actions</h4>
            <div className={styles.actions}>
              <button>Call</button>
              <button>Email</button>
              <button>Edit</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
