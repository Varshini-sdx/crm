import React from "react";
import styles from "./campaignBuilder.module.css";

export default function EmailStep({ data, setData, next, back }) {
    return (
        <div className={styles.body}>
            <h3 className={styles.stepTitle}>Craft your message</h3>

            <div className={styles.formGroup}>
                <label>Subject Line</label>
                <input
                    className={styles.input}
                    placeholder="e.g. Exclusive Diwali Offer Just For You! 🎉"
                    value={data.email.subject}
                    onChange={(e) =>
                        setData({
                            ...data,
                            email: { ...data.email, subject: e.target.value, isEdited: true },
                        })
                    }
                />
            </div>

            <div className={styles.formGroup}>
                <label>Email Body</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Hi {{name}}, we have something special for you..."
                    rows={10}
                    value={data.email.body}
                    onChange={(e) =>
                        setData({
                            ...data,
                            email: { ...data.email, body: e.target.value, isEdited: true },
                        })
                    }
                />
                <small style={{ color: "#6b7280", marginTop: "0.5rem", display: "block" }}>
                    You can use {"{{name}}"} and {"{{company}}"} as placeholders.
                </small>
            </div>

            <div className={styles.footer} style={{ padding: 0, background: "transparent", border: "none", marginTop: "2rem" }}>
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={back}>
                    Back
                </button>
                <button
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={next}
                    disabled={!data.email.subject || !data.email.body}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
