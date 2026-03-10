import React, { useState, useEffect, useCallback } from "react";
import { Team } from "../teams";
import { Inbox } from "../inbox";
import { Marketing } from "../marketing";
import { WebsiteConversion } from "../website conversion";
import { Campaigns } from "../campaigns";
import { Settings } from "../settings";
import { Profile } from "../profile";
import { States } from "../states";
import { SupportTickets } from "../support tickets";
import KnowledgeBase from "../../dashboard components/knowledge base";
import AuditLogs from "../audit logs";
import Billing from "../billing";
import RBAC from "../rbac";
import PerformanceScaling from "../performance scaling";
import styles from "./workspace.module.css";
import { Plus, Edit2, Trash2, X, ChevronRight, Zap, Filter, CheckCircle, ArrowRight, ShieldCheck, Layers, UserPlus } from "lucide-react";

const initialRules = [
  { id: 1, active: true, name: "Hot Leads Assignment", condition: "Lead Status = Hot", action: "Assign to Senior Sales" },
  { id: 2, active: false, name: "Archive Lost Leads", condition: "Lead Status = Lost", action: "Archive Lead" },
  { id: 3, active: true, name: "High Value Alert", condition: "Deal > $10k", action: "Notify Manager" },
];

import { motion, AnimatePresence } from "framer-motion";


const initialWorkflows = [
  { id: 1, name: "New Lead Onboarding", trigger: "Lead Created", steps: 4, status: "Active", theme: "cardBlue" },
  { id: 2, name: "Stalled Deal Follow-up", trigger: "Deal Stage Unchanged", steps: 3, status: "Draft", theme: "cardOrange" },
  { id: 3, name: "VIP Welcome Sequence", trigger: "Tag Added: VIP", steps: 5, status: "Active", theme: "cardGreen" },
];

const enterpriseRules = [
  {
    id: "deal-approval",
    title: "Deal Approval Rules",
    icon: <ShieldCheck size={24} />,
    description: "Multi-level authorization for high-value and high-discount deals.",
    rules: [
      { condition: "Discount > 20%", action: "Manager Approval Required" },
      { condition: "Value > ₹10 Lakh", action: "Director Approval Required" },
      { condition: "Contract > 3 Years", action: "Legal Approval Required" }
    ],
    theme: "enterprisePurple"
  },
  {
    id: "pipeline-control",
    title: "Sales Stage Rules",
    icon: <Layers size={24} />,
    description: "Control pipeline movement with mandatory field and state checks.",
    rules: [
      { condition: "Move to Proposal", action: "Budget + Decision Maker required" },
      { condition: "Move to Closed Won", action: "Contract + Payment terms required" }
    ],
    theme: "enterpriseBlue"
  },
  {
    id: "lead-qualification",
    title: "Lead Qualification Rules",
    icon: <UserPlus size={24} />,
    description: "Automated scoring logic to determine lead quality and sales priority.",
    rules: [
      { condition: "Corporate Email", action: "+15 Score & Direct Sales Call" },
      { condition: "Budget > ₹5 Lakh", action: "+30 Score" },
      { condition: "Gmail/Yahoo", action: "-10 Score & Nurture" }
    ],
    theme: "enterpriseGreen"
  }
];

import axios from "axios";



const AutomationHome = ({ branch }) => {
  // Tabs
  const [activeWorkflow, setActiveWorkflow] = useState(null);

  // Rules State
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", condition: "", action: "", status: "active" });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Workflow Builder State
  const [workflowNodes, setWorkflowNodes] = useState([
    { id: 1, type: "trigger", title: "Lead Created", icon: <Zap size={18} /> },
    { id: 2, type: "action", title: "Assign to SDR", icon: <CheckCircle size={18} /> },
    { id: 3, type: "delay", title: "Wait 2 Days", icon: <div style={{ fontWeight: 'bold', fontSize: '14px' }}>2d</div> },
    { id: 4, type: "condition", title: "If No Reply", icon: <Filter size={18} /> },
    { id: 5, type: "action", title: "Escalate to Manager", icon: <ArrowRight size={18} /> },
  ]);

  // Helper for auth headers
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Rules
  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      const branchId = branch?.id || 1;
      const response = await axios.get(`http://192.168.1.61:5000/api/automation/rules?branchId=${branchId}`, {
        headers: getAuthHeader()
      });
      // Ensure rules is always an array
      const rulesData = Array.isArray(response.data)
        ? response.data
        : (response.data && Array.isArray(response.data.rules) ? response.data.rules : []);
      setRules(rulesData);
    } catch (error) {
      console.error("Error fetching rules:", error);
      setRules([]); // Fallback to empty array on error
    } finally {
      setLoading(false);
    }
  }, [branch]);

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  // Rule Handlers
  const toggleRule = async (rule) => {
    try {
      const newStatus = rule.status === "active" ? "paused" : "active";
      await axios.patch(`http://192.168.1.61:5000/api/automation/rules/${rule.id}/status`, {
        status: newStatus
      }, {
        headers: getAuthHeader()
      });
      setRules(rules.map(r => r.id === rule.id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error toggling rule:", error);
      alert("Failed to update rule status");
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rule?")) return;
    try {
      await axios.delete(`http://192.168.1.61:5000/api/automation/rules/${id}`, {
        headers: getAuthHeader()
      });
      setRules(rules.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting rule:", error);
      alert("Failed to delete rule");
    }
  };

  const handleCreateOpen = () => {
    setNewRule({ name: "", condition: "", action: "", status: "active" });
    setEditingId(null);
    setIsDrawerOpen(true);
  };

  const handleEditOpen = (rule) => {
    setNewRule({
      name: rule.name || "",
      condition: rule.conditions?.[0]?.value || rule.condition || "",
      action: rule.actions?.[0]?.type || rule.action || "",
      status: rule.status || "active"
    });
    setEditingId(rule.id);
    setIsDrawerOpen(true);
  };

  const handleSaveRule = async () => {
    if (!newRule.name.trim()) {
      alert("Please enter a rule name");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: newRule.name,
        trigger_event: "lead_created", // Default trigger since it's removed from UI
        conditions: newRule.condition ? [{ field: "lead_status", operator: "equals", value: newRule.condition }] : [],
        actions: [{
          type: newRule.action || "assign_to_branch",
          template_id: 1, // Required by backend
          delay_minutes: 0 // Required by backend
        }],
        branch_id: branch?.id || 1,
        organization_id: 1,
        status: newRule.status || "active"
      };

      if (editingId) {
        await axios.put(`http://192.168.1.61:5000/api/automation/rules/${editingId}`, payload, {
          headers: getAuthHeader()
        });
      } else {
        await axios.post(`http://192.168.1.61:5000/api/automation/rules`, payload, {
          headers: getAuthHeader()
        });
      }

      await fetchRules();
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving rule:", error);
      alert("Failed to save rule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenBuilder = (workflow) => {
    setActiveWorkflow(workflow);
  };

  const [showAddMenu, setShowAddMenu] = useState(null); // Tracks index where menu is open

  const handleAddNode = (index, type) => {
    const newNode = {
      id: Date.now(),
      type,
      title: type === "action" ? "New Action" : type === "delay" ? "Wait 1 Day" : "New Condition",
      icon: type === "action" ? <CheckCircle size={18} /> :
        type === "delay" ? <div style={{ fontWeight: 'bold', fontSize: '14px' }}>1d</div> :
          <Filter size={18} />
    };

    const updatedNodes = [...workflowNodes];
    updatedNodes.splice(index, 0, newNode);
    setWorkflowNodes(updatedNodes);
    setShowAddMenu(null);
  };

  const [editingNode, setEditingNode] = useState({ id: null, field: null }); // {id, field}

  const handleUpdateNode = (id, field, value) => {
    setWorkflowNodes(workflowNodes.map(node =>
      node.id === id ? { ...node, [field]: value } : node
    ));
  };

  const handleUpdateNodeIcon = (id, text) => {
    setWorkflowNodes(workflowNodes.map(node =>
      node.id === id ? { ...node, icon: <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{text}</div> } : node
    ));
  };

  const AddStepSection = ({ index }) => (
    <div className={styles.addStepWrapper}>
      <div className={styles.flowLine}></div>
      {showAddMenu === index ? (
        <div className={styles.addMenu}>
          <div className={`${styles.addOption}`} onClick={() => handleAddNode(index, "action")}>
            <div className={`${styles.addOptionIcon} ${styles.optAction}`}><CheckCircle size={16} /></div>
            <span className={styles.addOptionLabel}>Action</span>
          </div>
          <div className={`${styles.addOption}`} onClick={() => handleAddNode(index, "delay")}>
            <div className={`${styles.addOptionIcon} ${styles.optDelay}`}><div style={{ fontWeight: 800, fontSize: '10px' }}>1d</div></div>
            <span className={styles.addOptionLabel}>Delay</span>
          </div>
          <div className={`${styles.addOption}`} onClick={() => handleAddNode(index, "condition")}>
            <div className={`${styles.addOptionIcon} ${styles.optCondition}`}><Filter size={16} /></div>
            <span className={styles.addOptionLabel}>Condition</span>
          </div>
          <button className={styles.closeBtn} style={{ padding: '0.2rem' }} onClick={() => setShowAddMenu(null)}><X size={14} /></button>
        </div>
      ) : (
        <button className={styles.addStepBtn} onClick={() => setShowAddMenu(index)}>+</button>
      )}
      <div className={styles.flowLine}></div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>
            {activeWorkflow ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setActiveWorkflow(null)} className={styles.backBtn}><ArrowRight size={18} style={{ transform: 'rotate(180deg)' }} /></button>
                {activeWorkflow.name}
              </span>
            ) : "Workspace Automation"}
          </h1>
          <div className={styles.subtitle}>
            {activeWorkflow ? "Design your automation flow" : "Manage your automation brain center"}
          </div>
        </div>

        {!activeWorkflow && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className={styles.createBtn} onClick={handleCreateOpen}>
              <Plus size={18} /> Create Rule
            </button>
            <button className={styles.createBtn} style={{ background: 'white', color: '#7c3aed', border: '1px solid #7c3aed' }} onClick={() => handleOpenBuilder({ name: "New Workflow", theme: "cardBlue" })}>
              <Plus size={18} /> New Workflow
            </button>
          </div>
        )}
      </div>

      {!activeWorkflow ? (
        <>
          {/* Rules List */}
          <div className={styles.rulesContainer}>
            <div className={styles.rulesHeader}>
              <span>Status</span>
              <span>Rule Name</span>
              <span>Conditions</span>
              <span style={{ textAlign: "right" }}>Actions</span>
            </div>

            {loading ? (
              <div className={styles.emptyState}>Loading automation rules...</div>
            ) : rules.length === 0 ? (
              <div className={styles.emptyState}>No automation rules found. Create one to get started.</div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className={styles.ruleRow}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={rule.status === "active"}
                      onChange={() => toggleRule(rule)}
                    />
                    <span className={styles.slider}></span>
                  </label>

                  <div className={styles.ruleName}>{rule.name}</div>
                  <div className={styles.conditionPreview}>
                    <Filter size={14} /> {rule.conditions?.[0]?.value || rule.condition || "No conditions"}
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={() => handleEditOpen(rule)}><Edit2 size={16} /></button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => deleteRule(rule.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ----------- Workflow Templates Section ----------- */}
          <div className={styles.workflowSectionTitle}>Workflow Templates</div>
          <div className={styles.workflowGrid}>
            {initialWorkflows.map((wf) => (
              <div
                key={wf.id}
                className={`${styles.workflowCard} ${styles[wf.theme] || ''}`}
                onClick={() => handleOpenBuilder(wf)}
              >
                <div className={styles.workflowHeader}>
                  <div className={styles.workflowIcon}>
                    <Zap size={20} />
                  </div>
                  <span className={`${styles.workflowStatus} ${wf.status === "Active" ? styles.statusActive : styles.statusDraft}`}>
                    {wf.status}
                  </span>
                </div>
                <div>
                  <div className={styles.workflowName}>{wf.name}</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Trigger: {wf.trigger}</div>
                </div>
                <div className={styles.workflowMeta}>
                  <span>{wf.steps} Steps</span>
                  <span>Last edit: Today</span>
                </div>
              </div>
            ))}
          </div>

          {/* ----------- Enterprise Rules Section ----------- */}
          <div className={styles.workflowSectionTitle}>Enterprise Rules</div>
          <div className={styles.enterpriseGrid}>
            {enterpriseRules.map((rule) => (
              <div key={rule.id} className={`${styles.enterpriseCard} ${styles[rule.theme]}`}>
                <div className={styles.entHeader}>
                  <div className={styles.entIcon}>{rule.icon}</div>
                  <div className={styles.entTitleGroup}>
                    <div className={styles.entTitle}>{rule.title}</div>
                    <div className={styles.entDesc}>{rule.description}</div>
                  </div>
                </div>
                <div className={styles.entRulesList}>
                  {rule.rules.map((r, i) => (
                    <div key={i} className={styles.entRuleItem}>
                      <span className={styles.entCondition}>{r.condition}</span>
                      <span className={styles.entAction}>{r.action}</span>
                    </div>
                  ))}
                </div>
                <button className={styles.configureBtn}>Configure Logic</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        // Workflow Builder
        <div className={styles.builderContainer}>
          {workflowNodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className={styles.flowNodeWrapper}>
                <div className={`${styles.flowNode} ${node.type === "trigger" ? styles.triggerNode :
                  node.type === "action" ? styles.actionNode :
                    node.type === "delay" ? styles.delayNode : styles.conditionNode
                  }`}>

                  {/* Icon/Value Section - Editable for Delay */}
                  <div
                    className={`${styles.nodeIcon} ${node.type === "delay" ? styles.editableIcon : ""}`}
                    onClick={() => node.type === "delay" && setEditingNode({ id: node.id, field: "icon" })}
                  >
                    {editingNode.id === node.id && editingNode.field === "icon" ? (
                      <input
                        autoFocus
                        className={`${styles.inlineInput} ${styles.iconInput}`}
                        defaultValue={node.icon.props?.children?.props?.children || "1d"}
                        onBlur={(e) => {
                          handleUpdateNodeIcon(node.id, e.target.value);
                          setEditingNode({ id: null, field: null });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateNodeIcon(node.id, e.target.value);
                            setEditingNode({ id: null, field: null });
                          }
                        }}
                      />
                    ) : node.icon}
                  </div>

                  <div className={styles.nodeContent}>
                    <div className={styles.nodeLabel}>{node.type}</div>

                    {/* Title Section - Editable */}
                    <div
                      className={styles.editableText}
                      onClick={() => setEditingNode({ id: node.id, field: "title" })}
                    >
                      {editingNode.id === node.id && editingNode.field === "title" ? (
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          defaultValue={node.title}
                          onBlur={(e) => {
                            handleUpdateNode(node.id, "title", e.target.value);
                            setEditingNode({ id: null, field: null });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateNode(node.id, "title", e.target.value);
                              setEditingNode({ id: null, field: null });
                            }
                          }}
                        />
                      ) : (
                        <div className={styles.nodeTitle}>{node.title}</div>
                      )}
                    </div>
                  </div>

                  {node.type !== "trigger" && (
                    <button
                      className={styles.actionBtn}
                      style={{ padding: '0.2rem', marginLeft: 'auto' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setWorkflowNodes(workflowNodes.filter(n => n.id !== node.id));
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Add Button Section */}
              <AddStepSection index={index + 1} />
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Create / Edit Rule Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            <motion.div
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerHeader}>
                <div className={styles.drawerTitle}>{editingId ? "Edit Rule" : "Create Rule"}</div>
                <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
              </div>

              <div className={styles.drawerContent}>

                {/* Field 1: Status */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Status</label>
                  <select
                    className={styles.select}
                    value={newRule.status}
                    onChange={(e) => setNewRule({ ...newRule, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>

                {/* Field 2: Rule Name */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Rule Name</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Hot Leads Assignment"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>

                {/* Field 3: Conditions */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Conditions</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="e.g. Lead Status = Hot"
                    value={newRule.condition}
                    onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  />
                </div>

                {/* Field 4: Actions */}
                <div className={styles.formGroup}>
                  <label className={styles.label}>Actions</label>
                  <select
                    className={styles.select}
                    value={newRule.action}
                    onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  >
                    <option value="">Select Action</option>
                    <option value="assign_to_branch">Assign to Branch</option>
                    <option value="assign_to_team">Assign to Team</option>
                    <option value="send_email">Send Email</option>
                    <option value="archive">Archive Lead</option>
                    <option value="notify_manager">Notify Manager</option>
                  </select>
                </div>

              </div>

              <div className={styles.drawerFooter}>
                <button className={styles.secondaryBtn} onClick={() => setIsDrawerOpen(false)}>Cancel</button>
                <button className={styles.primaryBtn} onClick={handleSaveRule} disabled={submitting}>
                  {submitting ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Workspace({ active, branch, setActive }) {
  // Define tabs available in the Workspace section
  const workspaceTabs = ["Marketing", "Website Conversion", "Campaigns", "Workspace", "Team"];

  // Check if current active page is a workspace tab
  const isWorkspaceTab = workspaceTabs.includes(active);

  // If active page is NOT a workspace tab (e.g. Settings, Profile, States, Inbox), routing happens here
  if (!isWorkspaceTab) {
    switch (active) {
      case "Inbox":
        return <Inbox branch={branch} />;
      case "States":
        return <States branch={branch} />;
      case "Settings":
        return <Settings branch={branch} setActive={setActive} />;
      case "Profile":
        return <Profile branch={branch} />;
      case "SupportTickets":
        return <SupportTickets />;
      case "KnowledgeBase":
        return <KnowledgeBase />;
      case "AuditLogs":
        return <AuditLogs setActive={setActive} />;
      case "Billing":
        return <Billing setActive={setActive} />;
      case "RBAC":
        return <RBAC setActive={setActive} />;
      case "PerformanceScaling":
        return <PerformanceScaling setActive={setActive} />;

      default:
        return null;
    }
  }

  return (
    <div className={styles.workspaceLayout}>
      {/* Top Horizontal Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsNav}>
          {workspaceTabs.map((tab) => (
            <div
              key={tab}
              className={`${styles.tabItem} ${active === tab ? styles.activeTab : ""}`}
              onClick={() => setActive(tab)}
            >
              {tab === "Workspace" ? "Automation" : tab}
              {active === tab && (
                <motion.div
                  className={styles.activeIndicator}
                  layoutId="activeTabIndicator"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ width: "100%" }}
          >
            {active === "Marketing" && <Marketing branch={branch} />}
            {active === "Website Conversion" && <WebsiteConversion branch={branch} />}
            {active === "Campaigns" && <Campaigns branch={branch} />}
            {active === "Workspace" && <AutomationHome branch={branch} />}
            {active === "Team" && <Team branch={branch} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
