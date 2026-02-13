import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./deals.module.css";
import * as XLSX from "xlsx";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Deals({ branch }) {
  const [deals, setDeals] = useState([]);
  const [pipelineMap, setPipelineMap] = useState({});
  const [activePipeline, setActivePipeline] = useState("");
  {/* const [analytics, setAnalytics] = useState({
    winLoss: [],
    winReasons: [],
    lossReasons: []
  }); */}
  // ✅ SAFE DEFAULT ANALYTICS
  const DEFAULT_ANALYTICS = {
    winLoss: [
      { name: "Won", value: 0 },
      { name: "Lost", value: 0 },
      { name: "In Progress", value: 0 }
    ],
    winReasons: [],
    lossReasons: []
  };

  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);

  // Automation Rules State
  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      trigger: "When deal is marked as “Won”",
      actions: ["→ Move deal to Won stage", "→ Add amount to revenue forecast"],
      active: true
    },
    {
      id: 2,
      trigger: "If no activity for 7 days",
      actions: ["→ Mark deal as Stalled"],
      active: true
    },
    {
      id: 3,
      trigger: "When status = “Proposal Sent”",
      actions: ["→ Move deal to Proposal stage"],
      active: false
    }
  ]);

  // Rule Modal State
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [ruleForm, setRuleForm] = useState({
    trigger: "",
    actions: "",
    active: true
  });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDealId, setCurrentDealId] = useState(null);
  const [formData, setFormData] = useState({
    deal_name: "",
    company: "",
    stage: "Proposal",
    value: "",
    owner: "",
    close: "",
    pipeline: ""
  });

  // Fetch Data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Pipelines (Grouped Deals)
      const pipelineRes = await axios.get("http://192.168.1.15:5000/api/deals/pipelines", { headers });
      let pMap = pipelineRes.data || {};

      // 🌟 DUMMY DATA INJECTION 🌟
      if (Object.keys(pMap).length === 0) {
        pMap = {
          "Sales Pipeline": [
            { id: 101, deal_name: "Q1 CRM License", company: "Global Tech Inc", stage: "Proposal", value: "₹4,50,000", owner: "Varshini", close: "2026-03-15" },
            { id: 102, deal_name: "Annual Maintenance", company: "Cyberdyne", stage: "Negotiation", value: "₹1,20,000", owner: "Ravi", close: "2026-02-28" },
            { id: 103, deal_name: "Cloud Migration", company: "Wayne Corp", stage: "Won", value: "₹8,00,000", owner: "Anu", close: "2026-01-20" },
            { id: 104, deal_name: "Security Audit", company: "Stark Ind", stage: "Proposal", value: "₹2,50,000", owner: "Varshini", close: "2026-04-10" },
            { id: 105, deal_name: "Mobile App Dev", company: "Z-Telecom", stage: "Negotiation", value: "₹6,00,000", owner: "Anu", close: "2026-05-20" },
            { id: 106, deal_name: "Data Warehousing", company: "Omni Consumer Products", stage: "Proposal", value: "₹12,00,000", owner: "Ravi", close: "2026-06-15" }
          ],
          "Partnerships": [
            { id: 201, deal_name: "Referral Program", company: "Hooli", stage: "Negotiation", value: "₹50,000", owner: "Anu", close: "2026-05-01" },
            { id: 202, deal_name: "API Integration", company: "Pied Piper", stage: "Won", value: "₹3,00,000", owner: "Ravi", close: "2026-02-10" },
            { id: 203, deal_name: "Affiliate Marketing", company: "E-Corp", stage: "Proposal", value: "₹1,50,000", owner: "Varshini", close: "2026-04-05" },
            { id: 204, deal_name: "Sponsorship Deal", company: "Massive Dynamic", stage: "Won", value: "₹5,00,000", owner: "Anu", close: "2026-03-01" }
          ]
        };
      }

      setPipelineMap(pMap);

      // Set active pipeline to first key if not set
      const pipelineKeys = Object.keys(pMap);
      if (pipelineKeys.length > 0 && !activePipeline) {
        setActivePipeline(prev => prev || pipelineKeys[0]);
      }

      // 2. Fetch Analytics
      const analyticsRes = await axios.get("http://192.168.1.15:5000/api/deals/analytics", { headers });

      // ✅ MERGE analytics safely
      const a = analyticsRes.data || {};

      // Helper to map backend reasons to frontend structure
      const mapReasons = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
          // Fallback dummy reasons
          return [
            { label: "Product Features", value: 45 },
            { label: "Pricing", value: 30 },
            { label: "Brand Trust", value: 25 }
          ];
        }
        return items.map(item => ({
          label: item.label || item.reason || "Unknown",
          value: item.value || item.percentage || 0
        }));
      };

      setAnalytics({
        winLoss: Array.isArray(a.winLoss) && a.winLoss.length ? a.winLoss : [
          { name: "Won", value: 12 },
          { name: "Lost", value: 5 },
          { name: "In Progress", value: 8 }
        ],
        winReasons: mapReasons(a.winReasons || a.win_reasons),
        lossReasons: mapReasons(a.lossReasons || a.loss_reasons || [
          { label: "Too Expensive", value: 40 },
          { label: "Competitor Win", value: 35 },
          { label: "Budget Cut", value: 25 }
        ])
      });


    } catch (error) {
      console.error("Error fetching deals data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update deals list when active pipeline changes
  {/* useEffect(() => {
    if (activePipeline && pipelineMap[activePipeline]) {
      setDeals(pipelineMap[activePipeline]);
    } else {
      setDeals([]);
    }
  }, [activePipeline, pipelineMap]); */}

  useEffect(() => {
    if (!activePipeline) return;

    const pipelineDeals = pipelineMap[activePipeline];
    if (Array.isArray(pipelineDeals)) {
      setDeals(pipelineDeals);
    }
  }, [activePipeline, pipelineMap]);

  // Create a flat array of all deals from all pipelines, adding the pipeline name to each deal
  const allDeals = Object.entries(pipelineMap).flatMap(([pipelineName, dealsInPipeline]) =>
    (dealsInPipeline || []).map(deal => ({ ...deal, pipeline: pipelineName }))
  );



  // Handlers
  const handleSaveDeal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...formData };

      if (isEditing && currentDealId) {
        await axios.put(`http://192.168.1.15:5000/api/deals/${currentDealId}`, payload, { headers });
      } else {
        await axios.post("http://192.168.1.15:5000/api/deals", payload, { headers });
      }

      setShowModal(false);
      resetForm();
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Error saving deal:", error);
      alert("Failed to save deal");
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://192.168.1.15:5000/api/deals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting deal:", error);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (deal) => {
    setFormData({
      deal_name: deal.deal_name,
      company: deal.company,
      stage: deal.stage,
      value: deal.value,
      owner: deal.owner,
      close: deal.close,
      pipeline: deal.pipeline
    });
    setCurrentDealId(deal.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      deal_name: "",
      company: "",
      stage: "Proposal",
      value: "",
      owner: "",
      close: "",
      pipeline: activePipeline
    });
    setCurrentDealId(null);
  };

  const handleExportDeals = () => {
    const formattedData = allDeals.map((d) => ({
      Deal: d.deal_name,
      Company: d.company,
      Stage: d.stage,
      Value: d.value,
      Owner: d.owner,
      "Close Date": d.close,
      Pipeline: d.pipeline,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "deals.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleAddRule = () => {
    setEditingRuleId(null);
    setRuleForm({ trigger: "", actions: "", active: true });
    setShowRuleModal(true);
  };

  const handleEditRule = (rule) => {
    setEditingRuleId(rule.id);
    setRuleForm({
      trigger: rule.trigger,
      actions: rule.actions.join("\n"),
      active: rule.active
    });
    setShowRuleModal(true);
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    const actionsList = ruleForm.actions.split("\n").filter(a => a.trim());
    const newRuleData = {
      trigger: ruleForm.trigger,
      actions: actionsList,
      active: ruleForm.active
    };

    if (editingRuleId) {
      setAutomationRules(prev => prev.map(r => r.id === editingRuleId ? { ...r, ...newRuleData } : r));
    } else {
      setAutomationRules(prev => [...prev, { id: Date.now(), ...newRuleData }]);
    }
    setShowRuleModal(false);
  };

  const handleDeleteRule = (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      setAutomationRules(prev => prev.filter(r => r.id !== id));
    }
  };

  // ---------- Forecast logic ----------

  // convert ₹ strings to numbers
  const parseAmount = (value) =>
    Number(String(value).replace(/[₹,]/g, ""));

  // stage probabilities
  const STAGE_PROBABILITY = {
    proposal: 0.6,
    negotiation: 0.8,
    won: 1,
  };

  // total pipeline value
  const totalPipelineValue = allDeals.reduce(
    (sum, d) => sum + parseAmount(d.value),
    0
  );

  // expected (forecasted) revenue
  const expectedRevenue = allDeals.reduce((sum, d) => {
    const prob = STAGE_PROBABILITY[(d.stage || "").toLowerCase()] || 0;
    return sum + parseAmount(d.value) * prob;
  }, 0);

  // deals closing this month (simple, readable)
  const dealsClosingThisMonth = allDeals.filter((d) => {
    if (!d.close || typeof d.close !== 'string') return false;
    try {
      const closeDate = new Date(d.close);
      const today = new Date();
      return closeDate.getFullYear() === today.getFullYear() &&
        closeDate.getMonth() === today.getMonth();
    } catch (e) {
      return false;
    }
  }).length;

  // Top stats calculations
  const openDealsCount = allDeals.filter(d => d.stage !== 'Won' && d.stage !== 'Lost').length;
  const wonDealsCount = allDeals.filter(d => d.stage === 'Won').length;
  const lostDealsCount = allDeals.filter(d => d.stage === 'Lost').length;

  return (
    <div className={styles.dealsPage}>

      {/* Top Stats */}
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span>Total Value</span>
          <b>₹{totalPipelineValue.toLocaleString()}</b>
        </div>
        <div className={styles.statCard}>
          <span>Open Deals</span>
          <b>{openDealsCount}</b>
        </div>
        <div className={styles.statCard}>
          <span>Won</span>
          <b>{wonDealsCount}</b>
        </div>
        <div className={styles.statCard}>
          <span>Lost</span>
          <b>{lostDealsCount}</b>
        </div>
      </div>

      {/* Export Deals */}
      <div className={styles.exportSection}>
        <button className={styles.exportBtn} onClick={openCreateModal} style={{ marginRight: "1rem", background: "#1f2a44" }}>
          + Create Deal
        </button>
        <div className={styles.exportText}>
          <h3>Export Deals</h3>
          <p>
            Download your deals data to analyze updates or share with your team.
          </p>
        </div>

        <button className={styles.exportBtn} onClick={handleExportDeals}>
          Export Deals
        </button>
      </div>



      {/* Pipelines Section */}
      <div className={styles.pipelineSection}>

        {/* Pipeline Tabs */}
        <div className={styles.pipelineTabs}>
          {Object.keys(pipelineMap).map(key => (
            <button
              key={key}
              onClick={() => setActivePipeline(key)}
              className={`${styles.pipelineTab} ${activePipeline === key ? styles.activeTab : ""
                }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* SAME KANBAN – data swaps */}
        <div className={`${styles.pipelineBoardWrap} ${styles[activePipeline]}`}>
          <div className={styles.pipelineBoard}>
            {["Proposal", "Negotiation", "Won"].map(stage => (
              <div
                key={stage}
                className={`${styles.pipelineColumn} ${styles[stage]}`}

              >
                <div className={styles.pipelineHeader}>
                  <span>{stage}</span>
                  <b>{deals.filter(d => (d.stage || "").toLowerCase() === stage.toLowerCase()).length}</b>
                </div>

                <div className={styles.pipelineCards}>
                  {deals
                    .filter(d => (d.stage || "").toLowerCase() === stage.toLowerCase())
                    .map((deal, i) => (
                      <div key={deal.id || i} className={styles.pipelineCard}>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.cardActionBtn}
                            onClick={(e) => { e.stopPropagation(); openEditModal(deal); }}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className={styles.cardActionBtn}
                            onClick={(e) => { e.stopPropagation(); handleDeleteDeal(deal.id); }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                        <strong>{deal.deal_name}</strong>
                        <span className={styles.pipelineCompany}>{deal.company}</span>

                        <div className={styles.pipelineMeta}>
                          <span>{deal.value}</span>
                          <span>{deal.close}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* -------------- Win / Loss Analytics ----------------*/}
      <section className={styles.winLossSection}>
        <h3 className={styles.sectionTitle}>Win / Loss Analytics</h3>

        <div className={styles.winLossGrid}>

          {/* Donut Chart */}
          <div className={styles.chartBox}>

            <div className={styles.donutLegend}>
              <span>
                <i className={styles.wonDot}></i> Won
              </span>
              <span>
                <i className={styles.lostDot}></i> Lost
              </span>
              <span>
                <i className={styles.progressDot}></i> In Progress
              </span>
            </div>

            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>

                  {/* Gradient Definitions */}
                  <defs>
                    <linearGradient id="wonGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#43cea2" />
                      <stop offset="100%" stopColor="#185a9d" />
                    </linearGradient>

                    <linearGradient id="lostGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ff7e5f" />
                      <stop offset="100%" stopColor="#feb47b" />
                    </linearGradient>

                    <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6a11cb" />
                      <stop offset="100%" stopColor="#2575fc" />
                    </linearGradient>
                  </defs>

                  {/* <Pie
                  data={(analytics.winLoss || []).length > 0 ? analytics.winLoss : [{ name: "No Data", value: 1 }]}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  <Cell fill="url(#wonGradient)" />
                  <Cell fill="url(#lostGradient)" />
                  <Cell fill="url(#progressGradient)" />
                </Pie> */}

                  <Pie data={analytics.winLoss} innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">
                    {analytics.winLoss.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.name === "Won"
                            ? "url(#wonGradient)"
                            : entry.name === "Lost"
                              ? "url(#lostGradient)"
                              : "url(#progressGradient)"
                        }
                      />
                    ))}
                  </Pie>


                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>


            <div className={styles.chartCenter}>
              <span>Deal Outcomes</span>
            </div>
          </div>

          {/* Insights */}

          <div className={styles.insightGrid}>

            {/* Win Card */}
            <div className={styles.insightCard}>
              <h4 className={styles.winTitle}>Top Win Reasons</h4>

              <ul className={styles.reasonList}>
                {(analytics.winReasons || []).map((r, i) => (
                  <li key={i}>
                    <span className={styles.reasonLabel}>{r.label}</span>
                    <em className={styles.reasonValue}>{r.value}%</em>
                  </li>
                ))}
              </ul>
            </div>

            {/* Loss Card */}
            <div className={styles.insightCard}>
              <h4 className={styles.lossTitle}>Top Loss Reasons</h4>

              <ul className={styles.reasonList}>
                {(analytics.lossReasons || []).map((r, i) => (
                  <li key={i}>
                    <span className={styles.reasonLabel}>{r.label}</span>
                    <em className={styles.reasonValue}>{r.value}%</em>
                  </li>
                ))}
              </ul>
            </div>

          </div>


        </div>
      </section>




      {/* ---------- Forecast + Automation Row ---------- */}
      <div className={styles.insightsRow}>

        {/* ---------- Pipeline Automation ---------- */}
        <div className={styles.automationSection}>
          <div className={styles.automationHeader}>
            <div>
              <h3>Pipeline Automation</h3>
              <p>Automated rules that manage deal movement and revenue</p>
            </div>

            <button className={styles.addRuleBtn} onClick={handleAddRule}>
              + Add Rule
            </button>
          </div>

          <div className={styles.automationList}>
            {automationRules.map((rule) => (
              <div key={rule.id} className={styles.automationCard} style={{ position: "relative" }}>
                <div className={styles.ruleContent}>
                  <strong>{rule.trigger}</strong>
                  {rule.actions.map((action, idx) => (
                    <span key={idx}>{action}</span>
                  ))}
                </div>
                <span className={`${styles.ruleStatus} ${rule.active ? styles.active : styles.inactive}`} style={{ position: "absolute", top: "12px", right: "12px" }}>
                  {rule.active ? "Active" : "Inactive"}
                </span>
                <div className={styles.ruleActions}>
                  <button className={styles.ruleActionBtn} onClick={() => handleEditRule(rule)} title="Edit">✏️</button>
                  <button className={styles.ruleActionBtn} onClick={() => handleDeleteRule(rule.id)} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.automationNote}>
            Automation rules are UI-only for demo purposes.
          </p>
        </div>

        {/* ---------- Deal Forecast ---------- */}
        <div className={styles.forecastSection}>
          <div className={styles.forecastHeader}>
            <h3>Deal Forecast</h3>
            <p>Expected revenue based on deal progress</p>
          </div>

          <div className={styles.forecastGrid}>
            {/* KPI Cards */}
            <div className={styles.forecastCards}>
              <div className={styles.forecastCard}>
                <span>Total Pipeline</span>
                <b>₹{totalPipelineValue.toLocaleString()}</b>
              </div>

              <div className={styles.forecastCard}>
                <span>Closing This Month</span>
                <b>{dealsClosingThisMonth}</b>
              </div>

              <div className={`${styles.forecastCard} ${styles.primary}`}>
                <span>Expected Revenue</span>
                <b>₹{expectedRevenue.toLocaleString()}</b>
              </div>
            </div>

          </div>
        </div>


      </div>




      {/* Deals Table */}
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Company</th>
              <th>Stage</th>
              <th>Value</th>
              <th>Owner</th>
              <th>Close Date</th>
              <th>Pipeline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allDeals.map((d, i) => (
              <tr key={d.id || i}>
                <td>{d.deal_name}</td>
                <td>{d.company}</td>
                <td>
                  <span className={`${styles.stage} ${styles[(d.stage || "").toLowerCase()]}`}>
                    {d.stage}
                  </span>
                </td>
                <td>{d.value}</td>
                <td>{d.owner}</td>
                <td>{d.close}</td>
                <td>{d.pipeline}</td>
                <td>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => openEditModal(d)} style={{ border: "none", background: "none", cursor: "pointer" }}>✏️</button>
                    <button onClick={() => handleDeleteDeal(d.id)} style={{ border: "none", background: "none", cursor: "pointer" }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: "white", padding: "25px", borderRadius: "12px",
            width: "400px", maxWidth: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem", color: "#1f2a44" }}>{isEditing ? "Edit Deal" : "Create New Deal"}</h3>
            <form onSubmit={handleSaveDeal} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input placeholder="Deal Name" required value={formData.deal_name} onChange={e => setFormData({ ...formData, deal_name: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />
              <input placeholder="Company" required value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />

              <select value={formData.pipeline} onChange={e => setFormData({ ...formData, pipeline: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }}>
                <option value="" disabled>Select Pipeline</option>
                {Object.keys(pipelineMap).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }}>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>

              <input placeholder="Value (e.g. 120000)" required value={formData.value} onChange={e => setFormData({ ...formData, value: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />
              <input placeholder="Owner" required value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />
              <input placeholder="Close Date" type="date" value={formData.close} onChange={e => setFormData({ ...formData, close: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "0.6rem 1.2rem", border: "none", background: "#f6f7ff", color: "#7a7fa3", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "0.6rem 1.2rem", border: "none", background: "linear-gradient(135deg, #6b5cff, #9b8cff)", color: "white", borderRadius: "8px", cursor: "pointer" }}>
                  {isEditing ? "Save Changes" : "Create Deal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rule Modal */}
      {showRuleModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000
        }} onClick={() => setShowRuleModal(false)}>
          <div style={{
            backgroundColor: "white", padding: "25px", borderRadius: "12px",
            width: "400px", maxWidth: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1.5rem", color: "#1f2a44" }}>{editingRuleId ? "Edit Rule" : "Add Automation Rule"}</h3>
            <form onSubmit={handleSaveRule} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input placeholder="Trigger (e.g. When deal is Won)" required value={ruleForm.trigger} onChange={e => setRuleForm({ ...ruleForm, trigger: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px" }} />
              <textarea placeholder="Actions (one per line)" rows={3} required value={ruleForm.actions} onChange={e => setRuleForm({ ...ruleForm, actions: e.target.value })} style={{ padding: "0.8rem", border: "1px solid #e0e2e9", borderRadius: "8px", resize: "vertical" }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={ruleForm.active} onChange={e => setRuleForm({ ...ruleForm, active: e.target.checked })} id="ruleActive" style={{ width: "16px", height: "16px" }} />
                <label htmlFor="ruleActive" style={{ fontSize: '0.9rem', color: '#333', cursor: 'pointer' }}>Active</label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowRuleModal(false)} style={{ padding: "0.6rem 1.2rem", border: "none", background: "#f6f7ff", color: "#7a7fa3", borderRadius: "8px", cursor: "pointer" }}>Cancel</button>
                <button type="submit" style={{ padding: "0.6rem 1.2rem", border: "none", background: "linear-gradient(135deg, #6b5cff, #9b8cff)", color: "white", borderRadius: "8px", cursor: "pointer" }}>Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
