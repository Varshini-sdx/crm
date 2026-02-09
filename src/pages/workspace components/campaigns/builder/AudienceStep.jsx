import React from "react";
import styles from "./campaignBuilder.module.css";

export default function AudienceStep({ data, setData, next, back }) {
    const audienceOptions = [
        { id: "all_active", label: "All Active Leads", desc: "Everyone currently in your pipeline" },
        { id: "hot_leads", label: "Hot Leads Only", desc: "Leads with score: High" },
        { id: "telangana", label: "Telangana Region", desc: "Leads located in Telangana state" },
        { id: "custom", label: "Custom Filter", desc: "Select specific tags or criteria" },
    ];

    return (
        <div className={styles.body}>
            <h3 className={styles.stepTitle}>Who are we targeting?</h3>

            <div className={styles.radioGroup}>
                {audienceOptions.map((opt) => (
                    <label key={opt.id} className={`${styles.radioLabel} ${data.audience_type === opt.id ? styles.active : ""}`}>
                        <input
                            type="radio"
                            className={styles.radioInput}
                            checked={data.audience_type === opt.id}
                            onChange={() => setData({ ...data, audience_type: opt.id })}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{opt.label}</div>
                            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{opt.desc}</div>
                        </div>
                    </label>
                ))}
            </div>

            <div className={styles.footer} style={{ padding: 0, background: "transparent", border: "none", marginTop: "2rem" }}>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={back}>
                    Back
                </button>
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={next}
                    disabled={!data.audience_type}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
