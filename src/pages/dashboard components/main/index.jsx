import React, { useEffect, useState } from "react";
import styles from "./main.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


const leadTrend = [
    { week: "W1", all: 22, qualified: 12 },
    { week: "W2", all: 30, qualified: 18 },
    { week: "W3", all: 18, qualified: 28 },
    { week: "W4", all: 42, qualified: 34 },
    { week: "W5", all: 55, qualified: 40 },
    { week: "W6", all: 68, qualified: 52 },
];

const tempLeads = [
    {
        name: "Riya Sharma",
        email: "riya@gmail.com",
        company: "Pixel Labs",
        source: "Instagram",
        status: "Hot",
        owner: "Varshini",
        createdAt: "2 days ago",
        description: "Interested in website redesign",
    },
    {
        name: "Aman Patel",
        email: "aman@corp.com",
        company: "CorpEdge",
        source: "Campaign",
        status: "Follow-up",
        owner: "Ravi",
        createdAt: "Today",
        description: "Needs pricing details",
    },
    {
        name: "Neha Verma",
        email: "neha@mail.com",
        company: "Bloom Co",
        source: "Website",
        status: "Converted",
        owner: "Anu",
        createdAt: "5 days ago",
        description: "Closed premium plan",
    },
    {
        name: "Rahul Singh",
        email: "rahul@xyz.com",
        company: "XYZ Pvt Ltd",
        source: "Referral",
        status: "Lost",
        owner: "Varshini",
        createdAt: "1 week ago",
        description: "Budget mismatch",
    },
];


export default function Main({ active, branch }) {

    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sourceFilter, setSourceFilter] = useState("All");

    useEffect(() => {
        fetch("http://192.168.1.18:5000/api1/leads")
            .then(res => res.json())
            .then(data => setLeads(data))
            .catch(err => console.error(err));
    }, []);

    const filtered = leads.filter(l =>
        (statusFilter === "All" || l.status === statusFilter) &&
        (sourceFilter === "All" || l.source === sourceFilter) &&
        (
            l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.email?.toLowerCase().includes(search.toLowerCase()) ||
            l.company?.toLowerCase().includes(search.toLowerCase())
        )
    );

    const total = leads.length;
    const hot = leads.filter(l => l.status === "Hot").length;
    const converted = leads.filter(l => l.status === "Converted").length;
    const lost = leads.filter(l => l.status === "Lost").length;
    const newWeek = leads.filter(l => l.isNewThisWeek).length;

    const campaigns = {};
    leads.forEach(l => {
        campaigns[l.source] = (campaigns[l.source] || 0) + 1;
    });


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
                    <div className={styles.leadsWrap}>

                        {/* KPI CARDS */}
                        <div className={styles.leadsKpiGrid}>
                            <div className={`${styles.leadsKpi} ${styles.kpiTotal}`}>
                                <span>Total Leads</span>
                                <strong>{total}</strong>
                            </div>
                            <div className={`${styles.leadsKpi} ${styles.kpiNew}`}>
                                <span>New This Week</span>
                                <strong>{newWeek}</strong>
                            </div>
                            <div className={`${styles.leadsKpi} ${styles.kpiHot}`}>
                                <span>Hot Leads</span>
                                <strong>{hot}</strong>
                            </div>
                            <div className={`${styles.leadsKpi} ${styles.kpiConverted}`}>
                                <span>Converted</span>
                                <strong>{converted}</strong>
                            </div>
                            <div className={`${styles.leadsKpi} ${styles.kpiLost}`}>
                                <span>Lost</span>
                                <strong>{lost}</strong>
                            </div>
                        </div>


                        {/* TREND + CAMPAIGN ROW */}

                        <div className={styles.leadsInsightsRow}>
                            {/* Leads Over Time */}
                            <div className={styles.leadsTrendCard}>
                                <div className={styles.trendHeader}>
                                    <div>
                                        <h3>Leads Over Time</h3>
                                        <span>Last 6 Weeks</span>
                                    </div>
                                </div>

                                <div className={styles.trendGraphWrap}>
                                    <ResponsiveContainer width="100%" height={190}>
                                        <LineChart data={leadTrend}>
                                            <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                                            <YAxis hide />
                                            <Tooltip />

                                            <Line
                                                type="monotone"
                                                dataKey="all"
                                                stroke="#6b5cff"
                                                strokeWidth={2.5}
                                                dot={{ r: 3 }}
                                            />

                                            <Line
                                                type="monotone"
                                                dataKey="qualified"
                                                stroke="#3bbfa0"
                                                strokeWidth={2.5}
                                                dot={{ r: 3 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>



                            {/* Campaign Panel */}

                            <div className={styles.campaignPanel}>
                                <div className={styles.campaignHeader}>
                                    <h3>Top Campaigns</h3>
                                    <span>Last 30 days</span>
                                </div>

                                <div className={styles.campaignRow}>
                                    <div className={styles.campaignLeft}>
                                        <span className={styles.campaignDot}></span>
                                        <strong>Instagram Ad</strong>
                                    </div>
                                    <span className={styles.campaignMeta}>124 leads • 18%</span>
                                </div>

                                <div className={styles.campaignRow}>
                                    <div className={styles.campaignLeft}>
                                        <span className={styles.campaignDot}></span>
                                        <strong>Email Blast</strong>
                                    </div>
                                    <span className={styles.campaignMeta}>86 leads • 24%</span>
                                </div>

                                <div className={styles.campaignRow}>
                                    <div className={styles.campaignLeft}>
                                        <span className={styles.campaignDot}></span>
                                        <strong>Website Form</strong>
                                    </div>
                                    <span className={styles.campaignMeta}>310 leads • 32%</span>
                                </div>

                                <button className={styles.campaignBtn}>View All Campaigns</button>
                            </div>




                        </div>




                        {/* SEARCH & FILTERS */}
                        {/* CONTROLS BAR */}
                        <div className={styles.leadsTopBar}>
                            <div className={styles.leadsLeftControls}>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className={styles.leadsSelect}
                                >
                                    <option value="All">All Status</option>
                                    <option value="New">New</option>
                                    <option value="Hot">Hot</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Converted">Converted</option>
                                    <option value="Lost">Lost</option>
                                </select>

                                <select
                                    value={sourceFilter}
                                    onChange={e => setSourceFilter(e.target.value)}
                                    className={styles.leadsSelect}
                                >
                                    <option value="All">All Sources</option>
                                    <option value="Website">Website</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Campaign">Campaign</option>
                                    <option value="Referral">Referral</option>
                                </select>

                                <select className={styles.leadsSelect}>
                                    <option>Sort: Latest</option>
                                    <option>Sort: Name (A–Z)</option>
                                    <option>Sort: Name (Z–A)</option>
                                </select>
                            </div>

                            <div className={styles.leadsRightControls}>
                                <input
                                    className={styles.leadsSearch}
                                    placeholder="Search leads..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />

                                <button className={styles.createLeadBtn}>
                                    + Create Lead
                                </button>
                            </div>
                        </div>


                        {/* ---------- LEADS List TABLE */}
                        <div className={styles.leadsLayout}>
                            <div className={styles.leadsTableWrap}>
                                <table className={styles.leadsTable}>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Company</th>
                                            <th>Source</th>
                                            <th>Status</th>
                                            <th>Owner</th>
                                            <th>Created</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tempLeads.map((l, i) => (
                                            <tr key={i}>
                                                <td className={styles.muted}>{i + 1}</td>
                                                <td className={styles.leadName}>{l.name}</td>
                                                <td className={styles.muted}>{l.email}</td>
                                                <td>{l.company}</td>
                                                <td><span className={styles.sourceChip}>{l.source}</span></td>
                                                <td>
                                                    <span className={`${styles.status} ${styles[l.status.toLowerCase()]}`}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                                <td>{l.owner}</td>
                                                <td className={styles.muted}>{l.createdAt}</td>
                                                <td className={styles.desc}>{l.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
