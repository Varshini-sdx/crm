import React from "react";
import styles from "./campaignBuilder.module.css";

export default function ReviewStep({ data, back, onActivate }) {
    return (
        <div className={styles.body}>
            <h3 className={styles.stepTitle}>Review & Activate</h3>

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Communication Channel</span>
                    <span className={styles.summaryValue}>Email</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Target Audience</span>
                    <span className={styles.summaryValue}>{data.audience_type.replace("_", " ")}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Delivery Type</span>
                    <span className={styles.summaryValue}>
                        {data.sendType === "now" ? "Immediate Broadcast" : "Scheduled"}
                    </span>
                </div>
                {data.sendType === "later" && (
                    <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Scheduled Time</span>
                        <span className={styles.summaryValue}>{data.date} at {data.time} (IST)</span>
                    </div>
                )}
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Subject Line</span>
                    <span className={styles.summaryValue}>{data.email.subject}</span>
                </div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1.2rem", background: "#f5f3ff", borderRadius: "14px", border: "1px solid #ddd6fe" }}>
                <div style={{ fontSize: "0.875rem", color: "#5b21b6", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Ready to launch?
                </div>
                <div style={{ fontSize: "0.8rem", color: "#6d28d9" }}>
                    Once activated, the campaign will move to the "Running" or "Scheduled" status and begin processing according to your settings.
                </div>
            </div>

            <div className={styles.footer} style={{ padding: 0, background: "transparent", border: "none", marginTop: "2rem" }}>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={back}>
                    Back
                </button>
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => {
                        console.log("Activating Campaign:", data);
                        alert("Campaign Activated Successfully!");
                        // Here we would typically call a backend API
                    }}
                >
                    Activate Campaign
                </button>
            </div>
        </div>
    );
}
