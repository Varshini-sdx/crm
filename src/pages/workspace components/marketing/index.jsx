import React, { useState, useEffect, useCallback } from "react";
import {
    ArrowUpRight,
    ArrowRight,
    ArrowDown,
    Mail,
    MessageCircle,
    Share2
} from "lucide-react";
import styles from "./marketing.module.css";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import api from "@/api/axios";

const mockMarketingData = {
    kpis: {
        totalCampaigns: { value: 12, growth: "+15%" },
        leadsGenerated: { value: 2450, growth: "+12%" },
        conversionRate: { value: 3.2, growth: "+0.5%" },
        totalRevenue: { value: 850000, growth: "+18%" }
    },
    trendData: [
        { month: "Jan", leads: 300, revenue: 120000 },
        { month: "Feb", leads: 520, revenue: 150000 },
        { month: "Mar", leads: 480, revenue: 105000 },
        { month: "Apr", leads: 610, revenue: 190000 },
        { month: "May", leads: 550, revenue: 150000 },
        { month: "Jun", leads: 720, revenue: 140000 },
    ],
    funnelData: [
        { label: "Awareness", color: "#7b8cff", width: "100%", value: "10,000" },
        { label: "Interest", color: "rgb(163, 129, 255)", width: "80%", value: "4,500" },
        { label: "Consideration", color: "#3bbfa0", width: "60%", value: "2,100" },
        { label: "Intent", color: "#ffc56e", width: "40%", value: "850" },
        { label: "Evaluation", color: "#ff8fa3", width: "25%", value: "320" },
        { label: "Purchase", color: "#ff5c8a", width: "15%", value: "145" }
    ],
    channels: [
        { name: "Email", campaigns: 5, leads: 850, conversion: "4.2%", revenue: "₹3.2L" },
        { name: "WhatsApp", campaigns: 3, leads: 1200, conversion: "5.8%", revenue: "₹4.5L" },
        { name: "Social", campaigns: 4, leads: 400, conversion: "2.1%", revenue: "₹0.8L" },
    ],
    campaigns: [
        { name: "Summer Sale 2024", channel: "Email", status: "Active", leads: 450, conversion: "4.5%", revenue: "₹1.2L", date: "June 15" },
        { name: "Tech Webinar Series", channel: "WhatsApp", status: "Scheduled", leads: 800, conversion: "6.2%", revenue: "₹2.5L", date: "July 01" },
        { name: "Brand Awareness", channel: "Social", status: "Active", leads: 320, conversion: "2.5%", revenue: "₹0.5L", date: "June 10" },
        { name: "Referral Program", channel: "Email", status: "Draft", leads: 0, conversion: "0%", revenue: "₹0", date: "Not Started" },
    ]
};

const isValidMarketingData = (d) =>
    d && d.kpis && d.kpis.totalCampaigns && d.kpis.leadsGenerated &&
    d.kpis.conversionRate && d.kpis.totalRevenue &&
    Array.isArray(d.trendData) && Array.isArray(d.funnelData) &&
    Array.isArray(d.channels) && Array.isArray(d.campaigns);

export const Marketing = () => {
    // Always start with mock data so the page renders immediately
    const [data, setData] = useState(mockMarketingData);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchMarketingData = useCallback(async () => {
        try {
            const response = await api.get("/api/marketing/analytics", {
                headers: getAuthHeader()
            });

            if (isValidMarketingData(response.data)) {
                setData(response.data);
                console.log("✅ Marketing: loaded live data from backend.");
            } else {
                console.warn("⚠️ Marketing: backend response missing expected fields – showing demo data.", response.data);
            }
        } catch (error) {
            console.warn("⚠️ Marketing: backend not connected – showing demo data.", error.message);
        }
    }, []);

    useEffect(() => {
        fetchMarketingData();
    }, [fetchMarketingData]);

    const { kpis = {}, trendData = [], campaigns = [], funnelData = [], channels = [] } = data;

    return (
        <div className={styles.marketingPage}>

            <h1 className={styles.pageTitle}>Marketing Analysis</h1>

            {/* KPI CARDS */}
            <div className={styles.kpiGrid}>
                <div className={`${styles.kpiCard} ${styles.blue}`}>
                    <h4>Total Campaigns</h4>
                    <h2>{kpis?.totalCampaigns?.value ?? 0}</h2>
                    <span>{kpis?.totalCampaigns?.growth ?? "0%"} growth</span>
                </div>

                <div className={`${styles.kpiCard} ${styles.green}`}>
                    <h4>Leads Generated</h4>
                    <h2>{(kpis?.leadsGenerated?.value ?? 0).toLocaleString()}</h2>
                    <span>{kpis?.leadsGenerated?.growth ?? "0%"} this month</span>
                </div>

                <div className={`${styles.kpiCard} ${styles.orange}`}>
                    <h4>Conversion Rate</h4>
                    <h2>{kpis?.conversionRate?.value ?? 0}%</h2>
                    <span>{kpis?.conversionRate?.growth ?? "0%"}</span>
                </div>

                <div className={`${styles.kpiCard} ${styles.pink}`}>
                    <h4>Total Revenue</h4>
                    <h2>₹{(kpis?.totalRevenue?.value ?? 0).toLocaleString()}</h2>
                    <span>{kpis?.totalRevenue?.growth ?? "0%"}</span>
                </div>
            </div>

            {/* GRAPH + FUNNEL */}
            <div className={styles.middleSection}>

                {/* LINE GRAPH */}
                <div className={styles.chartCard}>
                    <h3>Leads & Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300} style={{ marginTop: "30px" }}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                            />
                            <YAxis
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                hide={true}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="leads"
                                stroke="#0ea5e9"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                                animationDuration={1500}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                                animationDuration={1800}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* FUNNEL */}
                <div className={styles.funnelCardWide}>
                    <div className={styles.funnelHeader}>
                        <h3>Sales Funnel</h3>
                        <div className={styles.funnelLegend}>
                            <span>Flow</span>
                            <span>Conversion</span>
                        </div>
                    </div>
                    <div className={styles.salesFunnelContainer}>
                        <div className={styles.funnelIndicator}>
                            <div className={styles.arrowLine}></div>
                            <ArrowDown size={14} className={styles.arrowHead} />
                        </div>

                        <div className={styles.funnelStages}>
                            {(funnelData || []).map((stage, idx) => (
                                <div key={idx} className={styles.funnelRow}>
                                    <div
                                        className={styles.funnelBar}
                                        style={{
                                            backgroundColor: stage.color,
                                            width: stage.width,
                                            boxShadow: `0 4px 12px ${stage.color}40`
                                        }}
                                    >
                                        <span className={styles.stageLabel}>{stage.label}</span>
                                    </div>
                                    <div className={styles.funnelPercentageTrack}>
                                        <div className={styles.ghostBar}></div>
                                        <span className={styles.percentageValue}>{stage.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 📈 SECTION 3 — Channel Comparison */}
            <div className={styles.channelSection}>
                {(channels || []).map((chan, idx) => (
                    <div key={idx} className={styles.channelBox}>
                        <div className={styles.channelLabel}>
                            {chan.name === "Email" && <Mail size={18} color="#0ea5e9" />}
                            {chan.name === "WhatsApp" && <MessageCircle size={18} color="#10b981" />}
                            {chan.name === "Social" && <Share2 size={18} color="#f9a8d4" />}
                            {" "}{chan.name}
                        </div>
                        <div className={styles.channelStatsGrid}>
                            <div className={styles.channelStat}><span>Camp:</span> {chan.campaigns}</div>
                            <div className={styles.channelStat}><span>Leads:</span> {chan.leads}</div>
                            <div className={styles.channelStat}><span>Conv:</span> {chan.conversion}</div>
                            <div className={styles.channelStat}><span>Rev:</span> {chan.revenue}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PERFORMANCE TABLE */}
            <div className={styles.tableCard}>
                <h3>Campaign Performance</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Channel</th>
                            <th>Status</th>
                            <th>Leads</th>
                            <th>Conversion</th>
                            <th>Revenue</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(campaigns || []).map((c, index) => (
                            <tr key={index}>
                                <td>{c.name}</td>
                                <td>{c.channel}</td>
                                <td>
                                    <span className={`${styles.status} ${styles[c.status.toLowerCase()]}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td>{c.leads}</td>
                                <td>{c.conversion}</td>
                                <td>{c.revenue}</td>
                                <td>{c.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};
