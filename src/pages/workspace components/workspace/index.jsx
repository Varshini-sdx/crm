import React, { useState } from "react";
import { Team } from "../teams";
import { Inbox } from "../inbox";
import { Organization } from "../organization";
import { Campaigns } from "../campaigns";
import { Settings } from "../settings";
import styles from "./workspace.module.css";
import { Plus, Edit2, Trash2, X, ChevronRight, Zap, Filter, CheckCircle, ArrowRight } from "lucide-react";

const initialRules = [
  { id: 1, active: true, name: "Hot Leads Assignment", condition: "Lead Status = Hot", action: "Assign to Senior Sales" },
  { id: 2, active: false, name: "Archive Lost Leads", condition: "Lead Status = Lost", action: "Archive Lead" },
  { id: 3, active: true, name: "High Value Alert", condition: "Deal > $10k", action: "Notify Manager" },
];

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const initialWorkflows = [
  { id: 1, name: "New Lead Onboarding", trigger: "Lead Created", steps: 4, status: "Active", theme: "cardBlue" },
  { id: 2, name: "Stalled Deal Follow-up", trigger: "Deal Stage Unchanged", steps: 3, status: "Draft", theme: "cardOrange" },
  { id: 3, name: "VIP Welcome Sequence", trigger: "Tag Added: VIP", steps: 5, status: "Active", theme: "cardGreen" },
];

const WorkspaceHome = ({ branch }) => {
  // Tabs
  const [activeWorkflow, setActiveWorkflow] = useState(null); // If null, show list. If set, show builder.

  // Rules State
  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem("automationRules");
    return saved ? JSON.parse(saved) : initialRules;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerStep, setDrawerStep] = useState(1);
  const [newRule, setNewRule] = useState({ name: "", trigger: "", condition: "", action: "" });
  const [editingId, setEditingId] = useState(null);

  // Workflow Builder State
  const [workflowNodes, setWorkflowNodes] = useState([
    { id: 1, type: "trigger", title: "Lead Created", icon: <Zap size={18} /> },
    { id: 2, type: "action", title: "Assign to SDR", icon: <CheckCircle size={18} /> },
    { id: 3, type: "delay", title: "Wait 2 Days", icon: <div style={{ fontWeight: 'bold', fontSize: '14px' }}>2d</div> },
    { id: 4, type: "condition", title: "If No Reply", icon: <Filter size={18} /> },
    { id: 5, type: "action", title: "Escalate to Manager", icon: <ArrowRight size={18} /> },
  ]);

  // Persistence
  useEffect(() => {
    localStorage.setItem("automationRules", JSON.stringify(rules));
  }, [rules]);

  // Rule Handlers
  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleCreateOpen = () => {
    setNewRule({ name: "", trigger: "", condition: "", action: "" });
    setEditingId(null);
    setDrawerStep(1);
    setIsDrawerOpen(true);
  };

  const handleEditOpen = (rule) => {
    setNewRule({
      name: rule.name,
      trigger: "Lead Created",
      condition: rule.condition,
      action: rule.action
    });
    setEditingId(rule.id);
    setDrawerStep(1);
    setIsDrawerOpen(true);
  };

  const handleNextStep = () => {
    if (drawerStep < 3) setDrawerStep(drawerStep + 1);
  };

  const handleSaveRule = () => {
    if (editingId) {
      setRules(rules.map(r => r.id === editingId ? {
        ...r,
        name: newRule.name || r.name,
        condition: newRule.condition || r.condition,
        action: newRule.action || r.action,
      } : r));
    } else {
      const rule = {
        id: Date.now(),
        active: true,
        name: newRule.name || "New Automation Rule",
        condition: newRule.condition || "Condition",
        action: newRule.action || "Action",
      };
      setRules([...rules, rule]);
    }
    setIsDrawerOpen(false);
  };

  const handleOpenBuilder = (workflow) => {
    setActiveWorkflow(workflow);
    // In a real app, we'd load the specific nodes for this workflow
  };

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

            {rules.length === 0 ? (
              <div className={styles.emptyState}>No automation rules found. Create one to get started.</div>
            ) : (
              rules.map((rule) => (
                <div key={rule.id} className={styles.ruleRow}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={rule.active}
                      onChange={() => toggleRule(rule.id)}
                    />
                    <span className={styles.slider}></span>
                  </label>

                  <div className={styles.ruleName}>{rule.name}</div>
                  <div className={styles.conditionPreview}>
                    <Filter size={14} /> {rule.condition}
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
        </>
      ) : (
        // Workflow Builder
        <div className={styles.builderContainer}>
          {workflowNodes.map((node, index) => (
            <div key={node.id} className={styles.flowNodeWrapper}>
              {/* Node */}
              <div className={`${styles.flowNode} ${node.type === "trigger" ? styles.triggerNode :
                node.type === "action" ? styles.actionNode :
                  node.type === "delay" ? styles.delayNode : styles.conditionNode
                }`}>
                <div className={styles.nodeIcon}>{node.icon}</div>
                <div className={styles.nodeContent}>
                  <div className={styles.nodeLabel}>{node.type}</div>
                  <div className={styles.nodeTitle}>{node.title}</div>
                </div>
              </div>

              {/* Connector & Add Button (except for last item) */}
              {index < workflowNodes.length - 1 && (
                <>
                  <div className={styles.flowLine}></div>
                  <button className={styles.addStepBtn}>+</button>
                  <div className={styles.flowLine}></div>
                </>
              )}
            </div>
          ))}

          {/* End Add Button */}
          <div className={styles.flowLine}></div>
          <button className={styles.addStepBtn}>+</button>
        </div>
      )}

      {/* Persistence Drawer (Only for Rules) */}
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
                <div className={styles.drawerTitle}>{editingId ? "Edit Automation Rule" : "Create Automation Rule"}</div>
                <button className={styles.closeBtn} onClick={() => setIsDrawerOpen(false)}><X size={24} /></button>
              </div>

              <div className={styles.drawerContent}>
                {/* Stepper */}
                <div className={styles.stepper}>
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`${styles.step} ${drawerStep >= step ? styles.active : ''} ${drawerStep > step ? styles.completed : ''}`}>
                      <div className={styles.stepNumber}>
                        {drawerStep > step ? <CheckCircle size={16} /> : step}
                      </div>
                      <div className={styles.stepLabel}>
                        {step === 1 ? "Trigger" : step === 2 ? "Conditions" : "Action"}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {drawerStep === 1 && (
                  <div className={styles.stepContent}>
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
                    <div className={styles.formGroup}>
                      <label className={styles.label}>When this happens...</label>
                      <select
                        className={styles.select}
                        value={newRule.trigger}
                        onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                      >
                        <option value="">Select Trigger</option>
                        <option value="Lead Created">Lead Created</option>
                        <option value="Lead Updated">Lead Updated</option>
                        <option value="Status Changed">Status Changed</option>
                      </select>
                    </div>
                  </div>
                )}

                {drawerStep === 2 && (
                  <div className={styles.stepContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>If these conditions are met...</label>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <select className={styles.select} style={{ flex: 1 }}>
                          <option>Lead Status</option>
                          <option>State</option>
                          <option>Source</option>
                        </select>
                        <select className={styles.select} style={{ flex: 1 }}>
                          <option>Equals</option>
                          <option>Contains</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        className={styles.input}
                        placeholder="Value (e.g. Hot)"
                        value={newRule.condition}
                        onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {drawerStep === 3 && (
                  <div className={styles.stepContent}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Then do this...</label>
                      <select
                        className={styles.select}
                        value={newRule.action}
                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                      >
                        <option value="">Select Action</option>
                        <option value="Assign to Branch">Assign to Branch</option>
                        <option value="Assign to Team">Assign to Team</option>
                        <option value="Send Email">Send Email</option>
                        <option value="Archive">Archive</option>
                      </select>
                    </div>
                  </div>
                )}

              </div>

              <div className={styles.drawerFooter}>
                {drawerStep > 1 ? (
                  <button className={styles.secondaryBtn} onClick={() => setDrawerStep(drawerStep - 1)}>Back</button>
                ) : (
                  <div></div> // Spacer
                )}

                {drawerStep < 3 ? (
                  <button className={styles.primaryBtn} onClick={handleNextStep}>Next Step <ArrowRight size={16} style={{ marginLeft: 8, verticalAlign: "middle" }} /></button>
                ) : (
                  <button className={styles.primaryBtn} onClick={handleSaveRule}>Save Rule</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Workspace({ active, branch }) {
  switch (active) {
    case "Workspace":
      return <WorkspaceHome branch={branch} />;

    case "Team":
      return <Team branch={branch} />;

    case "Inbox":
      return <Inbox branch={branch} />;

    case "Organization":
      return <Organization branch={branch} />;

    case "Inbox":
      return <Inbox branch={branch} />;

    case "Campaigns":
    case "States":
      return <Campaigns branch={branch} />;

    case "Settings":
      return <Settings branch={branch} />;

    default:
      return null;
  }
}
