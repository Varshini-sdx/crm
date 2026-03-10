import React, { useState, useEffect } from "react";
import styles from "./performanceScaling.module.css";
import {
    Users,
    Activity,
    Database,
    Cpu,
    HardDrive,
    ArrowLeft,
    TrendingUp,
    Zap,
    Save,
    Settings,
    BarChart3,
    LineChart as LineChartIcon,
    Gauge
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const DUMMY_RESPONSE_TIME = [
    { day: "Mon", time: 220 },
    { day: "Tue", time: 210 },
    { day: "Wed", time: 250 },
    { day: "Thu", time: 190 },
    { day: "Fri", time: 230 },
    { day: "Sat", time: 180 },
    { day: "Sun", time: 195 },
];

const DUMMY_API_REQUESTS = [
    { day: "Mon", count: 10000 },
    { day: "Tue", count: 12000 },
    { day: "Wed", count: 11000 },
    { day: "Thu", count: 15000 },
    { day: "Fri", count: 13000 },
    { day: "Sat", count: 8000 },
    { day: "Sun", count: 7500 },
];

export const PerformanceScaling = ({ setActive }) => {
    const [autoScaling, setAutoScaling] = useState(true);
    const [maxUsers, setMaxUsers] = useState(500);
    const [rateLimit, setRateLimit] = useState(1000);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial loading for smooth entrance
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const metrics = [
        { label: "Active Users", value: "42 / 100", trend: "High load", icon: <Users size={20} />, type: "usersIcon" },
        { label: "API Requests", value: "12,400 today", trend: "+12% vs yesterday", icon: <Activity size={20} />, type: "apiIcon" },
        { label: "Database Storage", value: "3.2 GB used", trend: "85% capacity", icon: <Database size={20} />, type: "dbIcon" },
        { label: "Automations Running", value: "18 workflows", trend: "Normal", icon: <Zap size={20} />, type: "uptimeIcon" },
    ];

    const resources = [
        { label: "CPU Usage", value: "65%", percent: 65, color: "progressOrange", sub: "Core 1-4 Balanced" },
        { label: "Memory Usage", value: "40%", percent: 40, color: "progressGreen", sub: "4.2 GB / 10 GB" },
        { label: "Database Load", value: "75%", percent: 75, color: "progressOrange", sub: "Optimized indexing" },
    ];

    const getProgressColor = (val) => {
        const num = typeof val === 'string' ? parseInt(val) : val;
        if (num > 80) return styles.progressRed;
        if (num > 60) return styles.progressOrange;
        return styles.progressGreen;
    };

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <button className={styles.backBtn} onClick={() => setActive("Settings")}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className={styles.titleInfo}>
                        <h1>Performance Scaling</h1>
                        <p>Monitor system health and manage infrastructure limits.</p>
                    </div>
                </div>
            </header>

            {/* System Usage Metrics */}
            <section>
                <div className={styles.sectionTitle}>
                    <Gauge size={20} />
                    System Metrics
                </div>
                <div className={styles.metricsGrid}>
                    {metrics.map((m, i) => (
                        <div key={i} className={styles.metricCard}>
                            <div className={styles.metricHeader}>
                                <div className={`${styles.iconBox} ${styles[m.type]}`}>
                                    {m.icon}
                                </div>
                                <div className={`${styles.trendText} ${m.trend.includes('+') ? styles.up : styles.neutral}`}>
                                    {m.trend.includes('+') ? <TrendingUp size={12} /> : null}
                                    {m.trend}
                                </div>
                            </div>
                            <div className={styles.metricLabel}>{m.label}</div>
                            <div className={styles.metricValue}>{m.value}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Resource Usage & Scaling Settings Row */}
            <div className={styles.settingsGrid}>
                {/* Resource Usage */}
                <div className={styles.resourceCard}>
                    <div className={styles.sectionTitle}>
                        <Cpu size={20} />
                        Resource Usage
                    </div>
                    <div className={styles.resourceGrid}>
                        {resources.map((r, i) => (
                            <div key={i} className={styles.resourceItem}>
                                <div className={styles.resourceInfo}>
                                    <span className={styles.resourceLabel}>{r.label}</span>
                                    <span className={styles.resourceValue}>{r.value}</span>
                                </div>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={`${styles.progressBar} ${getProgressColor(r.percent || parseInt(r.value))}`}
                                        style={{ width: `${r.percent || r.value}%` }}
                                    ></div>
                                </div>
                                <span className={styles.titleInfo} style={{ fontSize: '0.75rem', marginTop: '-4px' }}>{r.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scaling Controls */}
                <div className={styles.settingsCard}>
                    <div className={styles.sectionTitle}>
                        <Settings size={20} />
                        Scaling Controls
                    </div>
                    <div className={styles.formGroup}>
                        <div className={styles.inputField}>
                            <div className={styles.inputLabel}>
                                <strong>Max Concurrent Users</strong>
                                <span>Limit of simultaneous active sessions</span>
                            </div>
                            <input
                                type="number"
                                className={styles.numberInput}
                                value={maxUsers}
                                onChange={(e) => setMaxUsers(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputField}>
                            <div className={styles.inputLabel}>
                                <strong>API Rate Limit (Req/min)</strong>
                                <span>Requests per minute per workspace</span>
                            </div>
                            <input
                                type="number"
                                className={styles.numberInput}
                                value={rateLimit}
                                onChange={(e) => setRateLimit(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputField}>
                            <div className={styles.inputLabel}>
                                <strong>Automation Execution Limit</strong>
                                <span>Workflows running concurrently</span>
                            </div>
                            <input
                                type="number"
                                className={styles.numberInput}
                                defaultValue={50}
                            />
                        </div>
                        <div className={styles.inputField}>
                            <div className={styles.inputLabel}>
                                <strong>File Upload Limit (MB)</strong>
                                <span>Maximum size per single file upload</span>
                            </div>
                            <input
                                type="number"
                                className={styles.numberInput}
                                defaultValue={50}
                            />
                        </div>
                        <button className={styles.saveBtn} onClick={() => alert("Settings saved successfully!")}>
                            <Save size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance Trends */}
            <section>
                <div className={styles.sectionTitle}>
                    <BarChart3 size={20} />
                    Performance Trends
                </div>
                <div className={styles.chartsGrid}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>System Response Time (Last 7 Days)</h3>
                            <LineChartIcon size={16} color="#64748b" />
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <AreaChart data={DUMMY_RESPONSE_TIME}>
                                <defs>
                                    <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
                                        <stop offset="50%" stopColor="#f43f5e" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    unit="ms"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="time"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTime)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>API Request Volume</h3>
                            <BarChart3 size={16} color="#64748b" />
                        </div>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={DUMMY_API_REQUESTS}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc', radius: [6, 6, 0, 0] }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        fontSize: '12px'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[6, 6, 0, 0]}
                                    barSize={32}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PerformanceScaling;
