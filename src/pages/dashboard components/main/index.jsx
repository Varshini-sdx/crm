import React from "react";
import styles from "./main.module.css";

export default function Main({ active, branch }) {
    switch (active) {
        case "Dashboard":
            return (
                <>
                    <h2 className={styles.sectionTitle}>Overview</h2>

                    <div className={styles.kpiGrid}>
                        <div className={`${styles.kpiCard} ${styles.kpiLeads}`}>
                            <span className={styles.kpiTitle}>Total Leads</span>
                            <strong className={styles.kpiValue}>1,248</strong>
                            <span className={styles.kpiSub}>+12% this month</span>
                        </div>

                        <div className={`${styles.kpiCard} ${styles.kpiDeals}`}>
                            <span className={styles.kpiTitle}>Active Deals</span>
                            <strong className={styles.kpiValue}>86</strong>
                            <span className={styles.kpiSub}>24 in progress</span>
                        </div>

                        <div className={`${styles.kpiCard} ${styles.kpiRevenue}`}>
                            <span className={styles.kpiTitle}>Revenue</span>
                            <strong className={styles.kpiValue}>₹4.2L</strong>
                            <span className={styles.kpiSub}>This quarter</span>
                        </div>

                        <div className={`${styles.kpiCard} ${styles.kpiTasks}`}>
                            <span className={styles.kpiTitle}>Tasks Due</span>
                            <strong className={styles.kpiValue}>7</strong>
                            <span className={styles.kpiSub}>3 overdue</span>
                        </div>
                    </div>


                    {/* quick Actions  */}

                    <div className={styles.quickWrap}>
                        <span className={styles.quickLabel}>Quick Actions</span>

                        <div className={styles.quickGrid}>
                            <button className={`${styles.quickCard} ${styles.qaLead}`}>
                                + Add Lead
                            </button>

                            <button className={`${styles.quickCard} ${styles.qaTask}`}>
                                Create Task
                            </button>

                            <button className={`${styles.quickCard} ${styles.qaCall}`}>
                                Log Call
                            </button>

                            <button className={`${styles.quickCard} ${styles.qaContact}`}>
                                Add Contact
                            </button>
                        </div>
                    </div>

                </>
            );

        case "Leads":
            return <h2>All Leads – {branch.name}</h2>;

        case "Deals":
            return <h2>Active Deals</h2>;

        case "Tasks":
            return <h2>Your Tasks</h2>;

        case "Contacts":
            return <h2>Contacts</h2>;

        case "Reports":
            return <h2>Reports & Insights</h2>;

        default:
            return null;
    }
}
