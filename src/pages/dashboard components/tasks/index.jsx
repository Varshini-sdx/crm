import { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Calendar,
  Edit3,
  Trash2,
  ChevronRight,
  FileText,
  File
} from "lucide-react";
import styles from "./tasks.module.css";
import Notes from "../notes";
import Files from "../files";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", due: "" });
  const [activeTab, setActiveTab] = useState("tasks");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const rawTasks = Array.isArray(res.data) ? res.data : (Object.values(res.data).find(val => Array.isArray(val)) || []);

      const normalized = rawTasks.map(t => {
        const status = (t.status || "").toLowerCase();
        const priority = (t.priority || "medium").toLowerCase();
        return {
          ...t,
          id: t.id,
          title: t.title,
          description: t.description || "",
          status: status,
          priority: priority.charAt(0).toUpperCase() + priority.slice(1),
          due: t.due_date || "No date",
          done: status === "completed"
        };
      });
      setTasks(normalized);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [activeTab]);

  const toggleTask = async (id, currentDone) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, done: !currentDone, status: !currentDone ? "completed" : "pending" } : t
    ));
    try {
      const token = localStorage.getItem("token");
      const nextStatus = currentDone ? "pending" : "completed";
      await api.put(`/api/tasks/${id}`, { status: nextStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("TOGGLE FAILED (Check Backend!):", err.response?.data || err.message);
      fetchTasks();
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: newTask.title,
        description: newTask.description,
        due_date: newTask.due,
        status: newTask.done ? "completed" : "pending",
        priority: newTask.priority.toLowerCase()
      };
      if (isEditing && currentTaskId) {
        await api.put(`/api/tasks/${currentTaskId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await api.post("/api/tasks", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowTaskModal(false);
      setIsEditing(false);
      setCurrentTaskId(null);
      setNewTask({ title: "", description: "", priority: "Medium", due: "" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const openEditModal = (task) => {
    setIsEditing(true);
    setCurrentTaskId(task.id);
    setNewTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      due: task.due || "",
      done: task.done || false
    });
    setShowTaskModal(true);
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const isToday = (dateStr) => {
    if (!dateStr || dateStr === 'Today') return dateStr === 'Today';
    const today = new Date().toISOString().split('T')[0];
    return dateStr.startsWith(today);
  };

  const isOverdue = (task) => {
    if (task.done || !task.due || task.due === 'No date' || task.due === 'Today') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.due) < today;
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Done") return t.done;
    if (filter === "Pending") return !t.done;
    return t.priority === filter;
  });

  return (
    <div className={styles.tasksPage}>
      {/* OVERVIEW */}
      <div className={styles.taskStats}>
        <div className={`${styles.statCard} ${styles.kpiToday}`}>
          <span><Clock size={16} /> Today</span>
          <b>{tasks.filter(t => isToday(t.due) && !t.done).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiUpcoming}`}>
          <span><Calendar size={16} /> Upcoming</span>
          <b>{tasks.filter(t => !t.done).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiOverdue}`}>
          <span><AlertCircle size={16} /> Overdue</span>
          <b>{tasks.filter(t => isOverdue(t)).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiCompleted}`}>
          <span><CheckCircle size={16} /> Completed</span>
          <b>{tasks.filter(t => t.done).length}</b>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button className={activeTab === "tasks" ? styles.activeTab : ""} onClick={() => setActiveTab("tasks")}>
          <CheckCircle size={16} /> Tasks
        </button>
        <button className={activeTab === "notes" ? styles.activeTab : ""} onClick={() => setActiveTab("notes")}>
          <FileText size={16} /> Notes
        </button>
        <button className={activeTab === "files" ? styles.activeTab : ""} onClick={() => setActiveTab("files")}>
          <File size={16} /> Files
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === "tasks" && (
        <div className={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3>My Tasks ({filter})</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className={styles.actionBtn} value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid #e4e6f0' }}>
                <option value="All">All Tasks</option>
                <option value="High">High Priority</option>
                <option value="Done">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <button className={styles.actionBtn} style={{ background: '#6b5cff', color: '#fff', borderColor: '#6b5cff' }} onClick={() => setShowTaskModal(true)}>
                <Plus size={14} /> Add Task
              </button>
            </div>
          </div>

          <div className={styles.taskList}>
            <div className={styles.taskHeader}>
              <div /> <span>Task</span> <span>Priority</span> <span>Due Date</span> <span style={{ textAlign: 'right' }}>Actions</span>
            </div>
            {filteredTasks.map((t, index) => (
              <div key={t.id || index} className={`${styles.taskRow} ${t.done ? styles.done : ""}`}>
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id, t.done)} className={styles.taskCheckbox} />
                <div className={styles.taskInfo}>
                  <strong style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</strong>
                  <span className={styles.descriptionText}>{t.description || ""}</span>
                </div>
                <span className={`${styles.priority} ${styles[(t.priority || "Medium").toLowerCase()]}`}>{t.priority || "Medium"}</span>
                <span className={styles.due}><Clock size={14} /> {t.due}</span>
                <div className={styles.rowActions} style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button onClick={(e) => { e.stopPropagation(); openEditModal(t); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b5cff' }} title="Edit Task"><Edit3 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d' }} title="Delete Task"><Trash2 size={16} /></button>
                  <ChevronRight size={18} color="#8a8fb2" />
                </div>
              </div>
            ))}
            {!loading && filteredTasks.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: '#8a8fb2' }}>No tasks found.</div>}
            {loading && tasks.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: '#8a8fb2' }}>Loading...</div>}
          </div>

          {showTaskModal && (
            <div className={styles.modalOverlay} onClick={() => setShowTaskModal(false)}>
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>{isEditing ? "Edit Task" : "Add New Task"}</h3>
                <form onSubmit={addTask} className={styles.form}>
                  <input className={styles.input} placeholder="Task Title" required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                  <input className={styles.input} placeholder="Description" value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
                  <input type="date" className={styles.input} value={newTask.due} onChange={e => setNewTask({ ...newTask, due: e.target.value })} />
                  <select className={styles.input} value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => { setShowTaskModal(false); setIsEditing(false); }} className={styles.cancelBtn}>Cancel</button>
                    <button type="submit" className={styles.saveBtn}>{isEditing ? "Save" : "Create"}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "notes" && <Notes />}
      {activeTab === "files" && <Files />}
    </div>
  );
}
