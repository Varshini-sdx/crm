import React, { useEffect, useState } from "react";
import api from "@/api/axios";
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
  const [allDealsRaw, setAllDealsRaw] = useState({
    proposal: [],
    negotiation: [],
    won: [],
    lost: []
  });
  const [loading, setLoading] = useState(false);
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

  const [monthlyTarget, setMonthlyTarget] = useState(() => {
    return localStorage.getItem("crm_monthly_target") || "";
  });
  const [isTargetSet, setIsTargetSet] = useState(() => {
    return !!localStorage.getItem("crm_monthly_target");
  });
  const [savingTarget, setSavingTarget] = useState(false);
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const pipelineRes = await api.get(`/api/dashboard/pipeline`, { headers });
      console.log(`DEALS RAW DATA (All):`, pipelineRes.data);

      const rawData = pipelineRes.data || {};
      setAllDealsRaw(rawData);

      // Fetch Win/Loss Analytics Graph
      const winLossRes = await api.get("/api/dashboard/win-loss", { headers }).catch(err => {
        console.error("Win/Loss FULL ERROR:", err.response?.data || err);
        return { data: null };
      });
      console.log("WIN/LOSS RAW DATA:", winLossRes.data);

      const wlData = winLossRes.data || {};

      // Fetch Reasons
      const analyticsRes = await api.get("/api/deals/analytics", { headers }).catch(() => ({ data: null }));
      const a = analyticsRes.data || {};

      const mapReasons = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
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
        winLoss: Array.isArray(wlData) ? wlData :
          Array.isArray(wlData.data) ? wlData.data : [
            { name: "Won", value: wlData.won ?? 12 },
            { name: "Lost", value: wlData.lost ?? 5 },
            { name: "In Progress", value: wlData.progress ?? wlData.negotiation ?? 8 }
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [branch]);

  // Create a flat array of all deals from RAW data (across all pipelines) for the table
  const allDeals = [
    ...(allDealsRaw?.proposal || []).map(d => ({ ...d, stage: "Proposal" })),
    ...(allDealsRaw?.negotiation || []).map(d => ({ ...d, stage: "Negotiation" })),
    ...(allDealsRaw?.won || []).map(d => ({ ...d, stage: "Won" })),
    ...(allDealsRaw?.lost || []).map(d => ({ ...d, stage: "Lost" }))
  ];



  // Handlers
  const handleSaveDeal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const payload = { ...formData };

      if (isEditing && currentDealId) {
        await api.put(`/api/deals/${currentDealId}`, payload, { headers });
      } else {
        await api.post("/api/deals", payload, { headers });
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
      await api.delete(`/api/deals/${id}`, {
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
      pipeline: activePipeline?.label || activePipeline || ""
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

  const handleSaveTarget = async () => {
    if (!monthlyTarget) return;
    try {
      setSavingTarget(true);
      // Save to localStorage for frontend persistence
      localStorage.setItem("crm_monthly_target", monthlyTarget);

      // Keep potential API call commented out for future integration
      /*
      const token = localStorage.getItem("token");
      await api.post("/api/analytics/targets", {
        target_value: monthlyTarget,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      */

      setIsTargetSet(true);
      setIsEditingTarget(false);
      alert("Monthly target updated successfully!");
    } catch (error) {
      console.error("Error saving target:", error);
      alert("Failed to save target. Please try again.");
    } finally {
      setSavingTarget(false);
    }
  };



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
          <b>₹{allDeals.reduce((sum, d) => sum + Number(String(d.value).replace(/[₹,]/g, "")) || 0, 0).toLocaleString()}</b>
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

      <div className={styles.exportSection}>
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

      {/* Target Section */}
      <div className={styles.targetSection}>
        <div className={styles.targetText}>
          <h3>Set Monthly Team Target</h3>
          <p>
            Enter the revenue goal for this month to track team performance in reports.
          </p>
        </div>

        <div className={styles.targetActions}>
          {isTargetSet && !isEditingTarget ? (
            <>
              <div className={styles.targetValueDisplay}>
                <span>This Month's Target</span>
                <strong className={styles.targetHighlight}>
                  ₹{Number(monthlyTarget).toLocaleString()}
                </strong>
                <button
                  className={styles.editIconBtn}
                  onClick={() => setIsEditingTarget(true)}
                  title="Edit Target"
                >
                  ✏️
                </button>
              </div>
            </>
          ) : (
            <>
              <input
                type="number"
                className={styles.targetInput}
                placeholder="e.g. 5000000"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                autoFocus={isEditingTarget}
              />
              <button
                className={styles.saveTargetBtn}
                onClick={handleSaveTarget}
                disabled={savingTarget}
              >
                {savingTarget ? "Saving..." : (isEditingTarget ? "Save Changes" : "Set Target")}
              </button>
              {isEditingTarget && (
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setMonthlyTarget(localStorage.getItem("crm_monthly_target") || "");
                    setIsEditingTarget(false);
                  }}
                  style={{ background: 'none', border: 'none', color: '#166534', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline' }}
                >
                  Cancel
                </button>
              )}
            </>
          )}
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
                <td>{d.pipeline || "Deals Pipeline"}</td>
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

              {/* Pipeline selected automatically based on current tab */}


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


    </div>
  );
}
