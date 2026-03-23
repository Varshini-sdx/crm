import styles from "./contactProfile.module.css";

export default function ContactProfile({ contact, onClose }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose}>✕</button>

        <div className={styles.header}>
          <div className={styles.avatarBig}>{contact.name?.[0] || "?"}</div>
          <div>
            <h2>{contact.name || "Unknown Contact"}</h2>
            <p>{contact.company || "No Company"}</p>
          </div>
        </div>

        <div className={styles.info}>
          <div><span>Email</span><p>{contact.email || "No Email"}</p></div>
          <div><span>Phone</span><p>{contact.phone || "No Phone"}</p></div>
          <div><span>Owner</span><p>{(typeof contact.owner === 'object' ? contact.owner?.name : contact.owner) || "Unassigned"}</p></div>
          <div><span>Status</span><p>{contact.status || "New"}</p></div>
          <div><span>Last Contact</span><p>{(contact.last_contact || contact.lastContact) || "Never contacted"}</p></div>
        </div>
      </div>
    </div>
  );
}

