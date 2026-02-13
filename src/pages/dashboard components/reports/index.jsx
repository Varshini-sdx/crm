import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  PieChart,
  Zap,
  Calendar,
  ChevronRight
} from "lucide-react";
import styles from "./Reports.module.css";

export default function Reports() {

  const [summary, setSummary] = useState({
    total_leads: 0,
    conversion_rate: "0%",
    revenue: "₹0",
    active_deals: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [sources, setSources] = useState([]);
  const [insights, setInsights] = useState([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const BASE_URL = "http://192.168.1.15:5000";

        const [resSummary, resTrend, resSources, resInsights] =
          await Promise.all([
            axios.get(`${BASE_URL}/api/reports/summary`, { headers }).catch(() => ({ data: null })),
            axios.get(`${BASE_URL}/api/reports/leads-trend`, { headers }).catch(() => ({ data: null })),
            axios.get(`${BASE_URL}/api/reports/lead-sources`, { headers }).catch(() => ({ data: null })),
            axios.get(`${BASE_URL}/api/reports/insights`, { headers }).catch(() => ({ data: null }))
          ]);

        // 🌟 DUMMY DATA FALLBACKS 🌟
        setSummary(resSummary?.data || {
          total_leads: 1284,
          conversion_rate: "18.5%",
          revenue: "₹42,50,000",
          active_deals: 48
        });

        setTrendData(resTrend?.data || [
          { month: "Sep", leads: 150 },
          { month: "Oct", leads: 220 },
          { month: "Nov", leads: 180 },
          { month: "Dec", leads: 290 },
          { month: "Jan", leads: 340 },
          { month: "Feb", leads: 410 }
        ]);

        const rawSources = resSources?.data || [
          { source: "Google Ads", leads: 450 },
          { source: "LinkedIn", leads: 380 },
          { source: "Referrals", leads: 220 },
          { source: "Direct", leads: 150 },
          { source: "Organic", leads: 84 }
        ];

        setSources(rawSources.slice(0, 5).map(item => ({
          name: item.source || "Direct",
          value: item.leads
        })));

        setInsights(resInsights?.data || [
          "Leads from Google Ads have increased by 22% this month.",
          "Conversion rate is highest for referrals at 35%.",
          "Most deals are currently in the 'Proposal' stage.",
          "Expected revenue for Q1 is on track to exceed targets by 15%."
        ]);

      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchData();
  }, [mounted]);

  return (
    <div className={styles.reportsPage}>

      {/* KPI CARDS */}
      <div className={styles.reportStats}>
        <div className={`${styles.statCard} ${styles.kpiLeads}`}>
          <span>
            <Users size={16} /> Total Leads
          </span>
          <b>{summary.total_leads}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiConversion}`}>
          <span>
            <TrendingUp size={16} /> Conversion Rate
          </span>
          <b>{summary.conversion_rate}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiRevenue}`}>
          <span>
            <DollarSign size={16} /> Revenue
          </span>
          <b>{summary.revenue}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiDeals}`}>
          <span>
            <Briefcase size={16} /> Active Deals
          </span>
          <b>{summary.active_deals}</b>
        </div>
      </div>

      {/* CHARTS */}
      <div className={styles.chartsRow}>

        {/* LEADS TREND */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Leads Trend</h3>
              <p style={{ fontSize: '0.7rem', color: '#8a8fb2', marginTop: '0.2rem' }}>Performance over time</p>
            </div>
            <span><Calendar size={12} style={{ marginRight: '4px' }} /> Last 6 Months</span>
          </div>

          <div className={styles.trendGraph}>
            {mounted && trendData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b5cff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6b5cff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#6b5cff"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className={styles.months}>
            {trendData.map((item, index) => (
              <span key={index}>{item.month}</span>
            ))}
          </div>
        </div>

        {/* SOURCES */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Lead Sources</h3>
            <span><PieChart size={12} style={{ marginRight: '4px' }} /> Top Channels</span>
          </div>

          <div className={styles.sourcesList}>
            {sources.map((source, i) => (
              <div key={i} className={styles.sourceItem}>
                <div className={styles.sourceInfo}>
                  <span className={styles.dot} />
                  {source.name}
                </div>
                <b>{source.value}</b>
              </div>
            ))}
            {sources.length === 0 && <div style={{ textAlign: 'center', color: '#8a8fb2', fontSize: '0.8rem', padding: '1rem' }}>No data available</div>}
          </div>
        </div>

      </div>

      {/* INSIGHTS */}
      <div className={styles.insights}>
        <h3><Zap size={18} color="#6b5cff" /> Smart Insights</h3>

        <ul>
          {insights.map((insight, i) => (
            <li key={i} className={styles.insightItem}>
              <ChevronRight size={16} color="#6b5cff" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{typeof insight === 'string' ? insight : insight.text}</span>
            </li>
          ))}
          {insights.length === 0 && <li className={styles.insightItem}>No new insights at this time.</li>}
        </ul>
      </div>

    </div>
  );
}
