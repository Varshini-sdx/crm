import { useState, useEffect } from "react";
import api from "@/api/axios";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Plus,
  Filter,
  Search,
  ChevronRight,
  Download,
  Trash2,
  Calendar,
  User,
  Edit3,
  X,
  File,
  UploadCloud
} from "lucide-react";
import styles from "./tasks.module.css";


export default function Tasks() {
  const DUMMY_TASKS = [
    { id: "d1", title: "Review Q1 Marketing Plan", related: "Marketing Strategy", priority: "High", due: "Today", owner: "Varshini", done: false },
    { id: "d2", title: "Send Proposal to Alpha Corp", related: "Deal #1290", priority: "Medium", due: "Tomorrow", owner: "Anu", done: false },
    { id: "d3", title: "Schedule follow-up with Beta Tech", related: "Lead #892", priority: "High", due: "Today", owner: "Rohan", done: false },
    { id: "d4", title: "Prepare Monthly Sales Report", related: "Internal", priority: "Low", due: "Next Week", owner: "Admin", done: true },
    { id: "d5", title: "Finalize Vendor Contract", related: "Vendor Mgmt", priority: "Medium", due: "Today", owner: "Varshini", done: true },
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("crm_tasks_list");
    return saved ? JSON.parse(saved) : DUMMY_TASKS;
  });

  useEffect(() => {
    localStorage.setItem("crm_tasks_list", JSON.stringify(tasks));
  }, [tasks]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState("All");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", related: "", priority: "Medium", due: "Today", owner: "Varshini" });

  const [activeTab, setActiveTab] = useState("tasks");
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("crm_tasks_notes");
    return saved ? JSON.parse(saved) : [
      { id: "n1", note: "Remember to follow up with the marketing team about the Q1 plan.", created_at: new Date(Date.now() - 3600000).toLocaleString() },
      { id: "n2", note: "The contract for Alpha Corp needs legal review before Friday.", created_at: new Date(Date.now() - 86400000).toLocaleString() }
    ];
  });
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [noteActionLoading, setNoteActionLoading] = useState(null);

  useEffect(() => {
    localStorage.setItem("crm_tasks_notes", JSON.stringify(notes));
  }, [notes]);

  const getNoteId = (n) => n?.id || n?._id || n?.note_id;

  const DUMMY_FILES = [
    { id: "f1", file_name: "Project_Proposal.pdf", size: "2.4 MB", created_at: new Date().toISOString() },
    { id: "f2", file_name: "Brand_Asset_Pack.zip", size: "15.8 MB", created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: "f3", file_name: "Q4_Performance_Data.xlsx", size: "840 KB", created_at: new Date(Date.now() - 172800000).toISOString() }
  ];

  const [files, setFiles] = useState(() => {
    const saved = localStorage.getItem("crm_tasks_files");
    return saved ? JSON.parse(saved) : DUMMY_FILES;
  });

  useEffect(() => {
    localStorage.setItem("crm_tasks_files", JSON.stringify(files));
  }, [files]);

  /* TASK HANDLERS */
  const fetchTasks = () => {
    // Purely frontend for now as requested
    console.log("Tasks loaded from local state");
  };

  useEffect(() => {
    if (activeTab === "tasks") {
      fetchTasks();
    }
  }, [activeTab]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    const addedTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      related: newTask.related || "Manual",
      priority: newTask.priority,
      due: newTask.due || "Today",
      owner: "Varshini",
      done: false
    };
    setTasks(prev => [...prev, addedTask]);
    setShowTaskModal(false);
    setNewTask({ title: "", related: "", priority: "Medium", due: "Today", owner: "Varshini" });
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === "All") return true;
    if (filter === "Done") return t.done;
    if (filter === "Pending") return !t.done;
    return t.priority === filter;
  });

  /* FILES */
  useEffect(() => {
    if (activeTab === "files") {
      fetchFiles();
    }
  }, [activeTab]);

  const fetchFiles = async () => {
    // Purely frontend for now as requested
    console.log("Files loaded from localStorage/dummy data");
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    for (const file of selectedFiles) {
      const newFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file_name: file.name,
        size: (file.size / 1024).toFixed(1) > 1024 
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB" 
          : (file.size / 1024).toFixed(1) + " KB",
        created_at: new Date().toISOString()
      };
      setFiles((prev) => [newFile, ...prev]);
    }
  };

  /* NOTES */
  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      note: noteText,
      created_at: new Date().toLocaleString()
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteText("");
  };

  useEffect(() => {
    if (activeTab === "notes") {
      fetchNotes();
    }
  }, [activeTab]);

  const fetchNotes = () => {
    console.log("Notes loaded from local state");
  };

  return (
    <div className={styles.tasksPage}>

      {/* OVERVIEW */}
      <div className={styles.taskStats}>
        <div className={`${styles.statCard} ${styles.kpiToday}`}>
          <span><Clock size={16} /> Today</span>
          <b>{tasks.filter(t => t.due === 'Today' && !t.done).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiUpcoming}`}>
          <span><Calendar size={16} /> Upcoming</span>
          <b>{tasks.filter(t => !t.done).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiOverdue}`}>
          <span><AlertCircle size={16} /> Overdue</span>
          <b>{tasks.filter(t => t.priority === 'High' && !t.done).length}</b>
        </div>
        <div className={`${styles.statCard} ${styles.kpiCompleted}`}>
          <span><CheckCircle size={16} /> Completed</span>
          <b>{tasks.filter(t => t.done).length}</b>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button
          className={activeTab === "tasks" ? styles.activeTab : ""}
          onClick={() => setActiveTab("tasks")}
        >
          <CheckCircle size={16} /> Tasks
        </button>
        <button
          className={activeTab === "notes" ? styles.activeTab : ""}
          onClick={() => setActiveTab("notes")}
        >
          <FileText size={16} /> Notes
        </button>
        <button
          className={activeTab === "files" ? styles.activeTab : ""}
          onClick={() => setActiveTab("files")}
        >
          <File size={16} /> Files
        </button>
      </div>

      {/* TASKS TAB */}
      {activeTab === "tasks" && (
        <div className={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3>My Tasks ({filter})</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className={styles.actionBtn}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid #e4e6f0' }}
              >
                <option value="All">All Tasks</option>
                <option value="High">High Priority</option>
                <option value="Done">Completed</option>
                <option value="Pending">Pending</option>
              </select>
              <button
                className={styles.actionBtn}
                style={{ background: '#6b5cff', color: '#fff', borderColor: '#6b5cff' }}
                onClick={() => setShowTaskModal(true)}
              >
                <Plus size={14} /> Add Task
              </button>
            </div>
          </div>

          <div className={styles.taskList}>
            {filteredTasks.map((t, index) => (
              <div key={t.id || index} className={`${styles.taskRow} ${t.done ? styles.done : ""}`}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id, t.done)}
                  className={styles.taskCheckbox}
                />

                <div className={styles.taskInfo}>
                  <strong style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</strong>
                  <span>{t.related || ""}</span>
                </div>

                <span className={`${styles.priority} ${styles[(t.priority || "Medium").toLowerCase()]}`}>
                  {t.priority || "Medium"}
                </span>

                <span className={styles.due}><Clock size={14} /> {t.due}</span>
                <span className={styles.owner}><User size={14} /> {t.owner}</span>

                <ChevronRight size={18} color="#8a8fb2" style={{ marginLeft: 'auto' }} />
              </div>
            ))}
          </div>

          {/* TASK MODAL */}
          {showTaskModal && (
            <div className={styles.modalOverlay} onClick={() => setShowTaskModal(false)}>
              <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h3 className={styles.modalTitle}>Add New Task</h3>
                <form onSubmit={addTask} className={styles.form}>
                  <input
                    className={styles.input}
                    placeholder="Task Title"
                    required
                    value={newTask.title}
                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  />
                  <input
                    className={styles.input}
                    placeholder="Related To"
                    value={newTask.related}
                    onChange={e => setNewTask({ ...newTask, related: e.target.value })}
                  />
                  <select
                    className={styles.input}
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setShowTaskModal(false)} className={styles.cancelBtn}>Cancel</button>
                    <button type="submit" className={styles.saveBtn}>Create Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* NOTES TAB */}
      {activeTab === "notes" && (
        <div className={styles.panel}>
          <h3>Recent Notes</h3>

          <div className={styles.noteInput}>
            <textarea
              placeholder="Write a quick note…"
              value={noteText}
              disabled={noteActionLoading === 'adding'}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button 
              onClick={addNote} 
              disabled={noteActionLoading === 'adding'}
            >
              {noteActionLoading === 'adding' ? '...' : 'Add'}
            </button>
          </div>

          {notes.map((n, i) => {
            const currentNoteId = getNoteId(n);
            const isNoteLoading = noteActionLoading === currentNoteId;

            return (              <div key={currentNoteId || i} className={`${styles.noteCard} ${editingNoteId === currentNoteId ? styles.editing : ""}`}>
                {editingNoteId === currentNoteId ? (
                  <div className={styles.premiumEditor}>
                    <textarea
                      autoFocus
                      className={styles.editTextarea}
                      value={editingText}
                      disabled={isNoteLoading}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className={styles.noteActions}>
                      <button 
                        className={styles.saveActionBtn}
                        onClick={() => {
                          if (!editingText.trim()) return;
                          setNotes(prev => prev.map(n => (n.id === currentNoteId ? { ...n, note: editingText } : n)));
                          setEditingNoteId(null);
                          setEditingText("");
                        }}
                      >
                        Save Changes
                      </button>
                      <button 
                        className={styles.cancelActionBtn}
                        disabled={isNoteLoading}
                        onClick={() => {
                          setEditingNoteId(null);
                          setEditingText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p>{n.note}</p>
                    <div className={styles.noteMeta}>
                      <span>{n.created_at || "Just now"}</span>
                      <div className={styles.noteActions}>
                        <button className={styles.actionBtn}
                          disabled={isNoteLoading}
                          onClick={() => {
                            setEditingNoteId(currentNoteId);
                            setEditingText(n.note || "");
                          }}
                        >
                          Edit
                        </button>
                        <button className={styles.actionBtn}
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this note?")) {
                              setNotes(prev => prev.filter(n => n.id !== currentNoteId));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

            );
          })}
          {notes.length === 0 && <div style={{ textAlign: 'center', color: '#8a8fb2', padding: '2rem' }}>No notes found.</div>}
        </div>
      )}

      {/* FILES TAB */}
      {activeTab === "files" && (
        <div className={styles.panel}>
          <div className={styles.filesHeader}>
            <h3>Shared Files ({files.length})</h3>
          </div>

          <label className={styles.fileUpload}>
            <UploadCloud size={32} />
            <span>Click to upload or drag and drop</span>
            <p>PDF, DOC, PNG or JPG (max. 10MB)</p>
            <input type="file" multiple hidden onChange={handleFileUpload} />
          </label>

          <div className={styles.filesList}>
            {files.map((f, i) => (
              <div key={i} className={styles.fileRow}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>
                    <FileText size={22} color="#6b5cff" />
                  </div>
                  <div className={styles.fileName}>
                    {f.file_name || f.name}
                    <div className={styles.fileMeta}>
                      {f.size || "1.2 MB"} • {f.created_at ? new Date(f.created_at).toLocaleDateString() : "Today"}
                    </div>
                  </div>
                </div>

                <div className={styles.fileActions}>
                  {f.id && (
                    <button className={styles.downloadBtn}
                      onClick={async () => {
                        try {
                          const res = await api.get(
                            `/api/files/${f.id}/download`,
                            {
                              responseType: "blob",
                              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                            }
                          );
                          const url = window.URL.createObjectURL(res.data);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = f.file_name;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error("Failed to download file", err);
                        }
                      }}
                    >
                      <Download size={16} />
                    </button>
                  )}

                  {f.id && (
                    <button className={styles.deleteBtn}
                      onClick={() => {
                        if (window.confirm("Delete this file?")) {
                          setFiles(files.filter(file => file.id !== f.id));
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {files.length === 0 && <div style={{ textAlign: 'center', color: '#8a8fb2', padding: '2rem' }}>No files uploaded yet.</div>}
          </div>
        </div>
      )}

    </div>
  );
}
