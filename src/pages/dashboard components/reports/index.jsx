import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  TrendingUp,
  DollarSign,
  Briefcase,
  Zap,
  ChevronRight,
  Download,
  Target,
  UserCircle,
  Globe,
  Search,
  Filter,
  PieChart,
  Heart,
  TrendingUp as TrendingIcon,
  Activity,
  Sliders,
  Check,
  Plus,
  Share2,
  Mail,
  Link,
  Calendar,
  ChevronDown,
  Clock,
  X,
  BarChart3,
  XCircle,
  History,
  AlertTriangle,
  Trophy
} from "lucide-react";
import styles from "./reports.module.css";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("summary");
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [selectedExports, setSelectedExports] = useState([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareExpiry, setShareExpiry] = useState("7 Days");
  const [sharePage, setSharePage] = useState("all");

  // --- INITIAL VISIBLE TABS ---
  // --- INITIAL VISIBLE TABS ---
  // --- INITIAL VISIBLE TABS ---
  const DEFAULT_TABS = ["summary", "leads", "sales", "velocity", "reps", "customers", "health", "forecast"];
  const [visibleTabs, setVisibleTabs] = useState(() => {
    const saved = localStorage.getItem("crm_reports_visible_tabs");
    return saved ? JSON.parse(saved) : DEFAULT_TABS;
  });

  useEffect(() => {
    localStorage.setItem("crm_reports_visible_tabs", JSON.stringify(visibleTabs));
  }, [visibleTabs]);

  const toggleTabVisibility = (tabId) => {
    setVisibleTabs(prev =>
      prev.includes(tabId)
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  // --- DUMMY FALLBACKS ---
  const DUMMY_SUMMARY = {
    revenue: "₹42,50,000", leads: 1284, conversion: "18.5%", performer: "Ravi Teja",
    growth: "+12.4%", best_source: "Google Ads"
  };

  const DUMMY_LEADS = [
    { source: "Google Ads", leads: 450, location: "Hyderabad", growth: "+15%" },
    { source: "LinkedIn", leads: 380, location: "Bangalore", growth: "+10%" },
    { source: "Referrals", leads: 220, location: "Mumbai", growth: "+25%" },
    { source: "Organic", leads: 84, location: "Delhi", growth: "-5%" },
  ];

  const DUMMY_SALES = [
    { item: "Revenue Breakdown", value: "₹42,50,000", change: "+12%" },
    { item: "Won Deals", value: "32", change: "+8%" },
    { item: "Lost Deals", value: "16", change: "-2%" },
    { item: "Avg Deal Size", value: "₹1,32,000", change: "+5%" },
  ];

  const [summaryData, setSummaryData] = useState(DUMMY_SUMMARY);
  const [leadReport, setLeadReport] = useState(DUMMY_LEADS);
  const [salesReport, setSalesReport] = useState(DUMMY_SALES);

  const DUMMY_VELOCITY = {
    stages: [
      { stage: "Qualification", days: 5, color: "#0ea5e9" }, // Sky Blue
      { stage: "Proposal", days: 10, color: "#8b5cf6" },    // Violet
      { stage: "Negotiation", days: 15, color: "#f59e0b" },   // Orange
    ],
    industries: [
      { industry: "Pharma", cycle: "60 days", color: "#f59e0b" },
      { industry: "IT", cycle: "30 days", color: "#10b981" },
    ]
  };

  const DUMMY_LOST_DEALS = {
    reasons: [
      { reason: "Price too high", count: 12, percentage: "60%" },
      { reason: "Competitor won", count: 8, percentage: "40%" },
    ],
    competitors: [
      { competitor: "Zoho", lost: 5 },
      { competitor: "Salesforce", lost: 3 },
    ]
  };

  const tabs = [
    { id: "summary", label: "Executive Summary", icon: <Zap size={16} /> },
    { id: "leads", label: "Lead Report", icon: <Globe size={16} /> },
    { id: "sales", label: "Sales Report", icon: <Target size={16} /> },
    { id: "velocity", label: "Deal Performance", icon: <History size={16} /> },
    { id: "reps", label: "Sales Reps", icon: <UserCircle size={16} /> },
    { id: "customers", label: "Customer Stats", icon: <Users size={16} /> },
    { id: "health", label: "Customer Health", icon: <Heart size={16} /> },
    { id: "forecast", label: "Revenue Forecast", icon: <BarChart3 size={16} /> },
  ];

  const DUMMY_CUSTOMER_HEALTH = [
    { name: "Alpha Systems", score: 85, nps: 9, tickets: 2, sla: 0, trend: "+5%", plan: "Enterprise", status: "Healthy" },
    { name: "Beta Corp", score: 42, nps: 6, tickets: 12, sla: 4, trend: "-12%", plan: "Pro", status: "At Risk" },
    { name: "Gamma Tech", score: 28, nps: 4, tickets: 15, sla: 8, trend: "-20%", plan: "Enterprise", status: "Churn Risk" },
    { name: "Delta Solutions", score: 92, nps: 10, tickets: 0, sla: 0, trend: "+2%", plan: "Startup", status: "Healthy" },
    { name: "Epsilon Inc", score: 65, nps: 8, tickets: 5, sla: 1, trend: "+8%", plan: "Pro", status: "Healthy" },
  ];

  const [healthSearch, setHealthSearch] = useState("");
  const [healthFilter, setHealthFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");

  const filteredHealth = DUMMY_CUSTOMER_HEALTH.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(healthSearch.toLowerCase());
    const matchesStatus = healthFilter === "All" || c.status === healthFilter;
    const matchesPlan = planFilter === "All" || c.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const [insightsData, setInsightsData] = useState([
    { text: "Leads from Google Ads have increased by 22% this month.", type: "short" },
    { text: "Conversion rate is highest for referrals at 35% across all regions.", type: "short" },
    { text: "Performance Update: The organic channel is showing declining engagements.", type: "long" },
    { text: "Best Performer: Ravi Teja has closed ₹18.5L in revenue this month.", type: "short" }
  ]);

  const [repLeaderboard, setRepLeaderboard] = useState([
    { name: "Ravi Teja", closed: 14, revenue: "₹18,50,000", conv: "28%", target: "120%" },
    { name: "Anu S", closed: 10, revenue: "₹12,20,000", conv: "22%", target: "95%" },
    { name: "Varshini K", closed: 8, revenue: "₹11,80,000", conv: "24%", target: "105%" },
  ]);

  const [customerStats, setCustomerStats] = useState([
    { label: "New Customers", value: "124", color: "#3b82f6" },
    { label: "Repeat Customers", value: "88", color: "#3bbfa0" },
    { label: "Retention Rate", value: "72%", color: "#f59e0b" },
    { label: "Churn Rate", value: "4.5%", color: "#ef4444" },
  ]);

  const [topDeals, setTopDeals] = useState([
    { client: "Tech Corp", value: "₹5,00,000", rep: "Ravi", status: "Won" },
    { client: "Soft Systems", value: "₹3,20,000", rep: "Ravi", status: "Won" },
    { client: "Green Sol", value: "₹2,80,000", rep: "Anu", status: "Negotiation" },
  ]);

  // --- API FETCHING ---
  const BASE_URL = "http://192.168.1.61:5000/api/analytics";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [kpiRes, revenueRes, pipelineRes, leadsRes] = await Promise.all([
          axios.get(`${BASE_URL}/kpi`, { headers }).catch(() => null),
          axios.get(`${BASE_URL}/revenue`, { headers }).catch(() => null),
          axios.get(`${BASE_URL}/pipeline`, { headers }).catch(() => null),
          axios.get(`${BASE_URL}/leads`, { headers }).catch(() => null),
        ]);

        if (kpiRes?.data) setSummaryData({ ...DUMMY_SUMMARY, ...kpiRes.data });
        if (revenueRes?.data) setSalesReport(Array.isArray(revenueRes.data) ? revenueRes.data : DUMMY_SALES);
        if (pipelineRes?.data) setPipelineStats(Array.isArray(pipelineRes.data) ? pipelineRes.data : DUMMY_PIPELINE);
        if (leadsRes?.data) setLeadReport(Array.isArray(leadsRes.data) ? leadsRes.data : DUMMY_LEADS);

      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      }
    };

    fetchData();
  }, []);

  const DUMMY_FORECAST = {
    quarterly: [
      { month: "April", forecast: "₹40 L", color: "#8b94fe" },
      { month: "May", forecast: "₹55 L", color: "#6366f1" },
      { month: "June", forecast: "₹70 L", color: "#4f46e5" },
    ],
    probability: [
      { level: "90%", value: "₹20 L", color: "#10b981" },
      { level: "50%", value: "₹60 L", color: "#f59e0b" },
    ],
    monthly: [
      { month: "April", value: "₹40 L", deals: 12, growth: "+15%", status: "On Track" },
      { month: "May", value: "₹55 L", deals: 18, growth: "+20%", status: "Overachieving" },
      { month: "June", value: "₹70 L", deals: 24, growth: "+25%", status: "On Track" },
      { month: "July", value: "₹85 L", deals: 30, growth: "+10%", status: "High Potential" },
      { month: "August", value: "₹95 L", deals: 32, growth: "+8%", status: "Bullish" },
    ]
  };


  // --- EXPORT LOGIC ---
  const toggleExportSelection = (id) => {
    setSelectedExports(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleExport = () => {
    if (selectedExports.length === 0) {
      alert("Please select at least one section to export.");
      return;
    }

    let contentHTML = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Exported Report</title>
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h2 { color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; margin-top: 30px; }
      </style>
      </head><body>
      <h1>CRM Report Export</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <hr/>
    `;

    // 1. Executive Summary
    if (selectedExports.includes("summary")) {
      contentHTML += `
        <h2>Executive Summary</h2>
        <ul>
          <li><strong>Revenue:</strong> ${summaryData.revenue} (${summaryData.growth})</li>
          <li><strong>Leads:</strong> ${summaryData.leads}</li>
          <li><strong>Conversion:</strong> ${summaryData.conversion}</li>
          <li><strong>Top Performer:</strong> ${summaryData.performer}</li>
        </ul>
      `;
    }

    // 2. Lead Report
    if (selectedExports.includes("leads")) {
      contentHTML += `<h2>Lead Report</h2><table><thead><tr><th>Source</th><th>Leads</th><th>Location</th><th>Growth</th></tr></thead><tbody>`;
      leadReport.forEach(r => {
        contentHTML += `<tr><td>${r.source}</td><td>${r.leads}</td><td>${r.location}</td><td>${r.growth}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;
    }

    // 3. Sales Report
    if (selectedExports.includes("sales")) {
      contentHTML += `<h2>Sales Performance</h2><table><thead><tr><th>Metric</th><th>Value</th><th>Trend</th></tr></thead><tbody>`;
      salesReport.forEach(r => {
        contentHTML += `<tr><td>${r.item}</td><td>${r.value}</td><td>${r.change}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;

      contentHTML += `<h3>Top Deals</h3><table><thead><tr><th>Client</th><th>Value</th><th>Rep</th></tr></thead><tbody>`;
      topDeals.forEach(d => {
        contentHTML += `<tr><td>${d.client}</td><td>${d.value}</td><td>${d.rep}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;
    }

    // 4. Deal Velocity
    if (selectedExports.includes("velocity")) {
      contentHTML += `<h2>Deal Velocity Report</h2><table><thead><tr><th>Stage/Industry</th><th>Avg Time</th></tr></thead><tbody>`;
      DUMMY_VELOCITY.stages.forEach(r => {
        contentHTML += `<tr><td>${r.stage}</td><td>${r.days} days</td></tr>`;
      });
      DUMMY_VELOCITY.industries.forEach(r => {
        contentHTML += `<tr><td>${r.industry}</td><td>${r.cycle}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;
    }

    // 5. Lost Deals Analysis
    if (selectedExports.includes("lost_deals")) {
      contentHTML += `<h2>Lost Deals Analysis</h2><table><thead><tr><th>Reason/Competitor</th><th>Count/Lost</th></tr></thead><tbody>`;
      DUMMY_LOST_DEALS.reasons.forEach(r => {
        contentHTML += `<tr><td>${r.reason}</td><td>${r.count}</td></tr>`;
      });
      DUMMY_LOST_DEALS.competitors.forEach(r => {
        contentHTML += `<tr><td>${r.competitor}</td><td>${r.lost}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;
    }

    // 5. Sales Reps
    if (selectedExports.includes("reps")) {
      contentHTML += `<h2>Sales Rep Performance</h2><table><thead><tr><th>Rep</th><th>Won</th><th>Revenue</th><th>Target</th></tr></thead><tbody>`;
      repLeaderboard.forEach(r => {
        contentHTML += `<tr><td>${r.name}</td><td>${r.closed}</td><td>${r.revenue}</td><td>${r.target}</td></tr>`;
      });
      contentHTML += `</tbody></table>`;
    }

    // 6. Customer Stats
    if (selectedExports.includes("customers")) {
      contentHTML += `<h2>Customer Analytics</h2><ul>`;
      customerStats.forEach(s => {
        contentHTML += `<li><strong>${s.label}:</strong> ${s.value}</li>`;
      });
      contentHTML += `</ul>`;
    }

    contentHTML += `</body></html>`;

    // Download Blob
    const blob = new Blob(['\ufeff', contentHTML], {
      type: 'application/msword'
    });
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(contentHTML);
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, 'CRM_Report.doc');
    } else {
      downloadLink.href = url;
      downloadLink.download = 'CRM_Report.doc';
      downloadLink.click();
    }
    document.body.removeChild(downloadLink);
    setShowExportDropdown(false);
  };

  return (
    <div className={styles.reportsPage}>
      {/* REPORTS HEADER */}
      <div className={styles.reportsHeader}>
        <div className={styles.headerTitle}>
          <h1>Reports & Analytics</h1>
          <p>Monitor your business performance and customer health.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.dateFilter}>
            <Calendar size={16} />
            <span>Last 30 Days</span>
            <ChevronDown size={14} />
          </div>

          <div className={styles.actionGroup}>
            <button className={styles.headerExportBtn} onClick={() => setShowExportDropdown(!showExportDropdown)}>
              <Download size={16} />
              Export
            </button>
            <button className={styles.shareBtn} onClick={() => setShowShareModal(true)}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>


      {/* KPI CARDS */}
      <div className={styles.reportStats}>
        <div className={`${styles.statCard} ${styles.kpiLeads}`}>
          <span><Users size={16} /> Total Leads</span>
          <b>{summaryData.leads}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiConversion}`}>
          <span><TrendingUp size={16} /> Conversion Rate</span>
          <b>{summaryData.conversion}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiRevenue}`}>
          <span><DollarSign size={16} /> Revenue</span>
          <b>{summaryData.revenue}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiDeals}`}>
          <span><Briefcase size={16} /> Active Deals</span>
          <b>48</b>
        </div>
      </div>

      {/* SMART INSIGHTS CARD */}
      <div className={styles.insightsRow}>
        <div className={styles.insightsCard}>
          <div className={styles.insightsRowHeader}>
            <h3>Smart Insights</h3>
          </div>
          <div className={styles.insightsGrid}>
            {insightsData.map((insight, i) => (
              <div key={i} className={styles.insightItem}>
                <ChevronRight className={styles.chevronIcon} size={18} />
                <span>{insight.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Section sits right above the tabbed container */}
      <div className={styles.exportSection}>
        <div className={styles.exportText}>
          <h3>Export Custom Reports</h3>
          <p>Select specific sections and download a full professional summary for your team.</p>
        </div>
        <div className={styles.exportDropdownWrapper}>
          <button
            className={`${styles.exportBtn} ${showExportDropdown ? styles.active : ''}`}
            onClick={() => setShowExportDropdown(!showExportDropdown)}
          >
            <Download size={16} />
            Export Report
          </button>

          <button className={styles.shareBtnInline} onClick={() => setShowShareModal(true)}>
            <Share2 size={16} />
            Share
          </button>

          {showExportDropdown && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>Select Sections</div>
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={styles.dropdownItem}
                  onClick={() => toggleExportSelection(tab.id)}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedExports.includes(tab.id)}
                    readOnly
                  />
                  <span>{tab.label}</span>
                </div>
              ))}
              <div className={styles.dropdownFooter}>
                <button
                  className={styles.downloadBtn}
                  onClick={handleExport}
                  disabled={selectedExports.length === 0}
                  style={{ opacity: selectedExports.length === 0 ? 0.6 : 1 }}
                >
                  <Download size={14} />
                  Download .doc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABBED ANALYTICS SECTION */}
      <div className={styles.tabbedContainer}>
        <div className={styles.tabSidebar}>
          <div className={styles.sidebarLinks}>
            {tabs.filter(t => visibleTabs.includes(t.id)).map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabLink} ${activeTab === tab.id ? styles.activeTabLink : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <button
            className={`${styles.customizeBtn} ${isCustomizing ? styles.active : ''}`}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <Sliders size={16} />
            <span>Customize</span>
          </button>

          {isCustomizing && (
            <div className={styles.customizationOverlay}>
              <div className={styles.customizationMenu}>
                <div className={styles.dropdownHeader}>Toggle Components</div>
                {tabs.map(tab => (
                  <div
                    key={tab.id}
                    className={styles.customToggleItem}
                    onClick={() => toggleTabVisibility(tab.id)}
                  >
                    <div className={`${styles.customCheckbox} ${visibleTabs.includes(tab.id) ? styles.checked : ''}`}>
                      {visibleTabs.includes(tab.id) && <Check size={12} />}
                    </div>
                    <span>{tab.label}</span>
                  </div>
                ))}
                <div className={styles.dropdownFooter}>
                  <button className={styles.doneBtn} onClick={() => setIsCustomizing(false)}>Done</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.tabContent}>
          {/* ... content remains same, just ensuring wrapper closes ... */}
          {activeTab === "summary" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Executive Summary</h3>
              </div>
              <div className={styles.summaryGrid}>
                <div className={`${styles.summaryBox} ${styles.summaryRevenue}`}>
                  <span>Total Revenue</span>
                  <h4>{summaryData.revenue}</h4>
                  <small className={styles.positive}>{summaryData.growth} growth</small>
                </div>
                <div className={`${styles.summaryBox} ${styles.summaryLeads}`}>
                  <span>Total Leads</span>
                  <h4>{summaryData.leads}</h4>
                  <small>New this month</small>
                </div>
                <div className={`${styles.summaryBox} ${styles.summaryConv}`}>
                  <span>Goal Achievement</span>
                  <h4>{summaryData.conversion}</h4>
                  <small className={styles.positive}>Best: Referrals (35%)</small>
                </div>
                <div className={`${styles.summaryBox} ${styles.summaryPerf}`}>
                  <span>Top Performer</span>
                  <h4>{summaryData.performer}</h4>
                  <small>{summaryData.best_source} (Best Source)</small>
                </div>
              </div>
            </div>
          )}

          {activeTab === "leads" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Lead Report</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <thead>
                    <tr><th>Source</th><th>Leads</th><th>Location</th><th>Growth</th></tr>
                  </thead>
                  <tbody>
                    {leadReport.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.bold}>{row.source}</td>
                        <td>{row.leads}</td>
                        <td>{row.location}</td>
                        <td className={row.growth.startsWith('+') ? styles.positive : styles.negative}>{row.growth}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "sales" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Sales Performance</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <thead><tr><th>Metric</th><th>Value</th><th>Trend</th></tr></thead>
                  <tbody>
                    {salesReport.map((row, i) => (
                      <tr key={i}>
                        <td>{row.item}</td>
                        <td className={styles.bold}>{row.value}</td>
                        <td className={row.change.startsWith('+') ? styles.positive : styles.negative}>{row.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <h4 className={styles.subTitle}>Top Winning Deals</h4>
              <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <tbody>
                    {topDeals.map((deal, i) => (
                      <tr key={i}>
                        <td>{deal.client}</td>
                        <td className={styles.bold}>{deal.value}</td>
                        <td className={styles.muted}>{deal.rep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "velocity" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Deal Performance & Velocity</h3>
                <p className={styles.contentSubtitle}>Comprehensive analysis of sales cycle speed and lost deal insights.</p>
              </div>

              {/* SECTION: STAGE VELOCITY */}
              <div className={styles.reportSection}>
                <div className={styles.sectionHeading}>
                  <TrendingUp size={18} className={styles.sectionIcon} />
                  <h4>Stage-wise Deal Velocity</h4>
                </div>
                <div className={styles.velocityFlow}>
                  {DUMMY_VELOCITY.stages.map((v, i) => (
                    <div key={i} className={styles.stageFlowCard} style={{ '--accent-color': v.color }}>
                      <div className={styles.stageIndex}>{i + 1}</div>
                      <div className={styles.stageInfo}>
                        <span className={styles.stageName}>{v.stage}</span>
                        <div className={styles.daysValueGroup}>
                          <span className={styles.daysCount}>{v.days}</span>
                          <span className={styles.daysLabel}>Avg Days</span>
                        </div>
                      </div>
                      {i < DUMMY_VELOCITY.stages.length - 1 && (
                        <div className={styles.flowArrow}>
                          <ChevronRight size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.twoColumnGrid}>
                {/* SECTION: INDUSTRY VELOCITY */}
                <div className={styles.reportSection}>
                  <div className={styles.sectionHeading}>
                    <Globe size={18} className={styles.sectionIcon} />
                    <h4>Sales Cycle by Industry</h4>
                  </div>
                  <div className={styles.industryList}>
                    {DUMMY_VELOCITY.industries.map((v, i) => (
                      <div key={i} className={styles.industryCard}>
                        <span className={styles.industryName}>{v.industry}</span>
                        <span className={styles.cycleValue} style={{ color: v.color }}>{v.cycle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION: LOST DEAL REASONS */}
                <div className={styles.reportSection}>
                  <div className={styles.sectionHeading}>
                    <AlertTriangle size={18} className={styles.sectionIcon} />
                    <h4>Primary Reasons for Loss</h4>
                  </div>
                  <div className={styles.lossList}>
                    {DUMMY_LOST_DEALS.reasons.map((v, i) => (
                      <div key={i} className={styles.lossReasonCard}>
                        <div className={styles.lossHeader}>
                          <span className={styles.lossLabel}>{v.reason}</span>
                          <span className={styles.lossCount}>{v.count} deals</span>
                        </div>
                        <div className={styles.lossBarTrack}>
                          <div
                            className={styles.lossBarFill}
                            style={{ width: v.percentage }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: COMPETITOR ANALYSIS */}
              <div className={styles.reportSection}>
                <div className={styles.sectionHeading}>
                  <Trophy size={18} className={styles.sectionIcon} />
                  <h4>Lost to Competitors</h4>
                </div>
                <div className={styles.competitorGrid}>
                  {DUMMY_LOST_DEALS.competitors.map((v, i) => (
                    <div key={i} className={styles.compCard}>
                      <div className={styles.compBadge}>VS</div>
                      <div className={styles.compInfo}>
                        <span className={styles.compName}>{v.competitor}</span>
                        <span className={styles.compLostCount}>{v.lost} Deals Won by them</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reps" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Sales Rep Performance</h3>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <thead><tr><th>Rep</th><th>Won</th><th>Revenue</th><th>Target</th></tr></thead>
                  <tbody>
                    {repLeaderboard.map((row, i) => (
                      <tr key={i}>
                        <td className={styles.bold}>{row.name}</td>
                        <td>{row.closed}</td>
                        <td className={styles.accentText}>{row.revenue}</td>
                        <td>
                          <div className={styles.targetProgress}>
                            <div className={styles.progressFill} style={{ width: Math.min(parseInt(row.target), 100) + '%' }} />
                            <span>{row.target}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "customers" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Customer Analytics</h3>
              </div>
              <div className={styles.customerGrid}>
                {customerStats.map((stat, i) => (
                  <div key={i} className={styles.customerExecCard}>
                    <span style={{ color: stat.color }}>{stat.label}</span>
                    <h4 style={{ color: stat.color }}>{stat.value}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Customer Health & Retention</h3>
              </div>

              {/* Toolbar */}
              <div className={styles.healthToolbar}>
                <div className={styles.searchBox}>
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={healthSearch}
                    onChange={(e) => setHealthSearch(e.target.value)}
                  />
                </div>
                <div className={styles.filterGroup}>
                  <div className={styles.filterItem}>
                    <Filter size={14} />
                    <select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)}>
                      <option value="All">All Statuses</option>
                      <option value="Healthy">Healthy</option>
                      <option value="At Risk">At Risk</option>
                      <option value="Churn Risk">Churn Risk</option>
                    </select>
                  </div>
                  <div className={styles.filterItem}>
                    <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                      <option value="All">All Plans</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Pro">Pro</option>
                      <option value="Startup">Startup</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className={styles.tableWrapper}>
                <table className={styles.reportTable}>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Health Score</th>
                      <th>NPS</th>
                      <th>Open Tickets</th>
                      <th>SLA Breaches</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHealth.map((c, i) => (
                      <tr key={i}>
                        <td className={styles.bold}>{c.name} <small className={styles.planBadge}>{c.plan}</small></td>
                        <td>
                          <div className={styles.healthScoreCell}>
                            <div className={styles.circularProgress} style={{ '--progress': c.score + '%' }}>
                              <svg width="36" height="36">
                                <circle cx="18" cy="18" r="16" className={styles.progressBg} />
                                <circle cx="18" cy="18" r="16" className={`${styles.progressValue} ${styles[c.status.replace(' ', '').toLowerCase()]}`} />
                              </svg>
                              <span>{c.score}</span>
                            </div>
                            <span className={`${styles.statusBadge} ${styles[c.status.replace(' ', '').toLowerCase()]}`}>
                              {c.status}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.npsValue}>{c.nps}/10</div>
                        </td>
                        <td>{c.tickets}</td>
                        <td className={c.sla > 0 ? styles.negative : ''}>{c.sla}</td>
                        <td className={c.trend.startsWith('+') ? styles.positive : styles.negative}>
                          {c.trend}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Health Analytics Grid */}
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <h4>Health Distribution</h4>
                    <PieChart size={16} />
                  </div>
                  <div className={styles.pieContainer}>
                    <div className={styles.mockPie}>
                      <div className={styles.pieSegment} style={{ '--angle': '0deg', '--size': '60%', '--color': '#10b981' }}></div>
                      <div className={styles.pieSegment} style={{ '--angle': '216deg', '--size': '25%', '--color': '#f59e0b' }}></div>
                      <div className={styles.pieSegment} style={{ '--angle': '306deg', '--size': '15%', '--color': '#ef4444' }}></div>
                      <div className={styles.pieCenter}>
                        <span>{DUMMY_CUSTOMER_HEALTH.length}</span>
                        <small>Total Customers</small>
                      </div>
                    </div>
                    <div className={styles.pieLegend}>
                      <div><span style={{ backgroundColor: '#10b981' }}></span> Healthy (60%)</div>
                      <div><span style={{ backgroundColor: '#f59e0b' }}></span> At Risk (25%)</div>
                      <div><span style={{ backgroundColor: '#ef4444' }}></span> Churn Risk (15%)</div>
                    </div>
                  </div>
                </div>

                <div className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <h4>NPS Breakdown</h4>
                    <TrendingIcon size={16} />
                  </div>
                  <div className={styles.npsMetric}>
                    <div className={styles.bigNumber}>8.4</div>
                    <div className={styles.npsBar}>
                      <div className={styles.npsPromoters} style={{ width: '65%' }}></div>
                      <div className={styles.npsPassives} style={{ width: '20%' }}></div>
                      <div className={styles.npsDetractors} style={{ width: '15%' }}></div>
                    </div>
                    <div className={styles.npsLegend}>
                      <span>Promoters (65%)</span>
                      <span>Passives (20%)</span>
                      <span>Detractors (15%)</span>
                    </div>
                  </div>
                </div>

                <div className={styles.analyticsCard}>
                  <div className={styles.cardHeader}>
                    <h4>Potential Churn Risk</h4>
                    <Activity size={16} />
                  </div>
                  <div className={styles.churnMetric}>
                    <div className={styles.churnValue}>
                      12.5%
                      <small className={styles.negative}>+2.1% from last month</small>
                    </div>
                    <p className={styles.churnDesc}>3 customers requires immediate attention due to declining health scores and SLA breaches.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "forecast" && (
            <div className={styles.contentBlock}>
              <div className={styles.contentHeader}>
                <h3 className={styles.contentTitle}>Revenue Forecast</h3>
                <p className={styles.contentSubtitle}>Predictive analytics for future revenue streams.</p>
              </div>

              <div className={styles.forecastGrid}>
                {/* Quarterly Forecast */}
                <div className={styles.forecastCard}>
                  <div className={styles.cardHeader}>
                    <h4>Expected Revenue Next Quarter</h4>
                    <Calendar size={18} className={styles.cardIcon} />
                  </div>
                  <div className={styles.forecastBarContainer}>
                    {DUMMY_FORECAST.quarterly.map((item, i) => (
                      <div key={i} className={styles.forecastBarItem}>
                        <div className={styles.barLabelGroup}>
                          <span className={styles.barMonth}>{item.month}</span>
                          <span className={styles.barValue}>{item.forecast}</span>
                        </div>
                        <div className={styles.barTrack}>
                          <div
                            className={styles.barFill}
                            style={{
                              width: (parseInt(item.forecast.replace('₹', '').replace(' L', '')) / 70 * 100) + '%',
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Probability Forecast */}
                <div className={styles.forecastCard}>
                  <div className={styles.cardHeader}>
                    <h4>Forecast by Probability</h4>
                    <Target size={18} className={styles.cardIcon} />
                  </div>
                  <div className={styles.probabilityGrid}>
                    {DUMMY_FORECAST.probability.map((item, i) => (
                      <div key={i} className={styles.probCard} style={{ '--accent-color': item.color }}>
                        <div className={styles.probHeader}>
                          <span className={styles.probLevel}>{item.level}</span>
                          <span className={styles.probLabel}>Confidence</span>
                        </div>
                        <div className={styles.probValueGroup}>
                          <span className={styles.probValue}>{item.value}</span>
                          <span className={styles.probSub}>Deal Value</span>
                        </div>
                        <div className={styles.probIndicator}>
                          <div className={styles.probDot} />
                          <div className={styles.probLine} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Revenue Breakdown Table */}
              <div className={styles.monthlyRevenueSection}>
                <div className={styles.sectionHeader}>
                  <TrendingUp size={18} className={styles.sectionIcon} />
                  <h4>Monthly Revenue Breakdown</h4>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.reportTable}>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Forecasted Value</th>
                        <th>Projected Deals</th>
                        <th>Est. Growth</th>
                        <th>Market Sentiment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DUMMY_FORECAST.monthly.map((row, i) => (
                        <tr key={i}>
                          <td className={styles.bold}>{row.month}</td>
                          <td className={styles.accentText}>{row.value}</td>
                          <td>{row.deals}</td>
                          <td className={styles.positive}>{row.growth}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles.forecastBadge}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SHARE REPORT MODAL */}
      {showShareModal && (
        <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div className={styles.shareModal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowShareModal(false)}>
              <X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <h2>Share Dashboard</h2>
              <p>Generate a secure link to share your analytics.</p>
            </div>

            <div className={styles.shareSettings}>
              <div className={styles.settingField}>
                <label>Select Page to Share</label>
                <div className={styles.selectWrapper}>
                  <select
                    value={sharePage}
                    onChange={(e) => setSharePage(e.target.value)}
                    className={styles.pageSelect}
                  >
                    <option value="all">Full Dashboard</option>
                    {tabs.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className={styles.selectIcon} size={16} />
                </div>
              </div>

              <div className={styles.expirySection}>
                <div className={styles.expiryHeader}>
                  <Clock size={16} />
                  <span>Link Expiry</span>
                </div>
                <div className={styles.expiryToggle}>
                  {["1 Day", "7 Days", "30 Days", "Never"].map(time => (
                    <button
                      key={time}
                      className={`${styles.expiryBtn} ${shareExpiry === time ? styles.active : ''}`}
                      onClick={() => setShareExpiry(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.shareOptions}>
              <div className={styles.shareOption} onClick={() => {
                navigator.clipboard.writeText(`https://crm.acmecorp.com/reports/share/${sharePage}?exp=${shareExpiry.replace(' ', '')}`);
                alert("Shareable link copied to clipboard!");
              }}>
                <div className={styles.optionIcon}><Link size={20} /></div>
                <div className={styles.optionInfo}>
                  <h4>Copy Shareable Link</h4>
                  <p>Anyone with this link can view the selected page</p>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.doneBtnLarge} onClick={() => setShowShareModal(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

