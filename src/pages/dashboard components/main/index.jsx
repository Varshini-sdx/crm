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


                    {/* quick Actions  

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
                    </div> */}



                    {/* CHARTS SECTION */}

                    {/* GROWTH & TODAY SECTION */}
                    <section className={styles.growthSection}>
                        <div className={styles.growthHeader}>
                            <h2>Business Overview</h2>
                            <p>Your growth and today’s priorities at a glance</p>
                        </div>

                        <div className={styles.growthGrid}>
                            {/* Revenue Card */}
                            <div className={styles.revenueCard}>
                                <div className={styles.revenueTop}>
                                    <div>
                                        <h3>Revenue Growth</h3>
                                        <span>Last 12 Months</span>
                                    </div>
                                    <strong className={styles.revenueValue}>₹ 12.4L</strong>
                                </div>

                                <div className={styles.revenueChart}>
                                    {[
                                        18, 24, 30, 36, 44, 50,
                                        58, 64, 72, 80, 88, 96,
                                    ].map((h, i) => (
                                        <div key={i} className={styles.revenueBarWrap}>
                                            <div
                                                className={styles.revenueBar}
                                                style={{ height: `${h}%` }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.monthRow}>
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                                        .map((m, i) => <span key={`${m}-${i}`}>{m}</span>)}
                                </div>
                            </div>

                            {/* Today Card */}
                            <div className={styles.todayCard}>
                                <div className={styles.todayHeader}>
                                    <h3>Today</h3>
                                    <span>Tue, 16 Jan</span>
                                </div>

                                <div className={styles.todayList}>
                                    <div className={`${styles.todayItem} ${styles.call}`}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.time}>10:00</span>
                                        <p>Call with Acme Corp</p>
                                    </div>

                                    <div className={`${styles.todayItem} ${styles.follow}`}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.time}>12:30</span>
                                        <p>Follow up – Design Lead</p>
                                    </div>

                                    <div className={`${styles.todayItem} ${styles.meet}`}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.time}>3:00</span>
                                        <p>Team Sync</p>
                                    </div>

                                    <div className={`${styles.todayItem} ${styles.work}`}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.time}>5:30</span>
                                        <p>Prepare proposal</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>




                    {/* Mini Cards 
                            <div className={styles.miniInsights}>
                                <div className={styles.miniCard}>
                                    <h4>Lead Conversion</h4>
                                    <strong>32%</strong>
                                    <span>Up from last month</span>
                                </div>

                                <div className={styles.miniCardAlt}>
                                    <h4>Active Deals</h4>
                                    <strong>128</strong>
                                    <span>23 in closing stage</span>
                                </div>
                            </div> */}




                </>
            );


            {/* ------------   Leads   ---------------- */ }

        case "Leads":

            return (
                <>
                    <div className={styles.leadsHeader}>
                        <div>
                            <h2 className={styles.sectionTitle}>Leads</h2>
                            <p className={styles.leadsSub}>All incoming prospects for {branch.name}</p>
                        </div>

                        <div className={styles.leadsActions}>
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className={styles.leadsSearch}
                            />
                            <button className={styles.addLeadBtn}>+ Add Lead</button>
                        </div>
                    </div>

                    <div className={styles.leadsTableWrap}>
                        <div className={styles.leadsTable}>
                            <div className={styles.leadsRowHead}>
                                <span>Name</span>
                                <span>Email</span>
                                <span>Source</span>
                                <span>Status</span>
                                <span>Owner</span>
                            </div>

                            {[
                                { name: "Aarav Shah", email: "aarav@mail.com", source: "Website", status: "New", owner: "Varshini" },
                                { name: "Meera Iyer", email: "meera@mail.com", source: "Instagram", status: "Contacted", owner: "Ravi" },
                                { name: "Rahul Verma", email: "rahul@mail.com", source: "Referral", status: "Qualified", owner: "Anu" },
                            ].map((l, i) => (
                                <div key={i} className={styles.leadsRow}>
                                    <span>{l.name}</span>
                                    <span>{l.email}</span>
                                    <span className={styles.sourceTag}>{l.source}</span>
                                    <span className={`${styles.statusPill} ${styles[l.status.toLowerCase()]}`}>
                                        {l.status}
                                    </span>
                                    <span>{l.owner}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            );


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
