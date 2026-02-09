import React from "react";
import styles from "./campaignBuilder.module.css";

export default function SchedulerStep({ data, setData, next }) {
    return (
        <div className={styles.body}>
            <h3 className={styles.stepTitle}>When should this campaign go out?</h3>

            <div className={styles.radioGroup}>
                <label className={`${styles.radioLabel} ${data.sendType === "now" ? styles.active : ""}`}>
                    <input
                        type="radio"
                        className={styles.radioInput}
                        checked={data.sendType === "now"}
                        onChange={() => setData({ ...data, sendType: "now" })}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>Send Now</div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Broadcast immediately to selected audience</div>
                    </div>
                </label>

                <label className={`${styles.radioLabel} ${data.sendType === "later" ? styles.active : ""}`}>
                    <input
                        type="radio"
                        className={styles.radioInput}
                        checked={data.sendType === "later"}
                        onChange={() => setData({ ...data, sendType: "later" })}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>Schedule for Later</div>
                        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Pick a specific date and time</div>
                    </div>
                </label>
            </div>

            {data.sendType === "later" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div className={styles.formGroup}>
                        <label>Date</label>
                        <input
                            type="date"
                            className={styles.input}
                            value={data.date}
                            onChange={(e) => setData({ ...data, date: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Time</label>
                        <input
                            type="time"
                            className={styles.input}
                            value={data.time}
                            onChange={(e) => setData({ ...data, time: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                        <label>Timezone</label>
                        <input className={styles.input} value="IST (India Standard Type)" disabled />
                    </div>
                </div>
            )}

            <div className={styles.footer} style={{ padding: 0, background: "transparent", border: "none", marginTop: "2rem" }}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={next}>
                    Continue
                </button>
            </div>
        </div>
    );
}
