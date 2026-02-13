import { useState, useEffect } from "react";
import axios from "axios";
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

const tasksData = [
  {
    title: "Follow up with Riya Sharma",
    related: "Lead · Instagram",
    priority: "High",
    due: "Today",
    owner: "Varshini",
    done: false,
  },
  {
    title: "Send proposal to Acme Corp",
    related: "Deal · CRM Setup",
    priority: "Medium",
    due: "Tomorrow",
    owner: "Ravi",
    done: false,
  },
  {
    title: "Demo call with Nova Labs",
    related: "Deal · Website Redesign",
    priority: "High",
    due: "Jan 26",
    owner: "Anu",
    done: false,
  },
  {
    title: "Internal review meeting",
    related: "Team Task",
    priority: "Low",
    due: "Completed",
    owner: "Varshini",
    done: true,
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Follow up with Riya Sharma", related: "Lead · Instagram", priority: "High", due: "Today", owner: "Varshini", done: false },
    { id: 2, title: "Send proposal to Acme Corp", related: "Deal · CRM Setup", priority: "Medium", due: "Tomorrow", owner: "Ravi", done: false },
    { id: 3, title: "Demo call with Nova Labs", related: "Deal · Website Redesign", priority: "High", due: "Jan 26", owner: "Anu", done: false },
    { id: 4, title: "Internal review meeting", related: "Team Task", priority: "Low", due: "Completed", owner: "Varshini", done: true },
  ]);

  const [filter, setFilter] = useState("All");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", related: "", priority: "Medium", due: "Today", owner: "Varshini" });

  const [activeTab, setActiveTab] = useState("tasks");
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [files, setFiles] = useState([]);

  /* TASK HANDLERS */
  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]);
    setShowTaskModal(false);
    setNewTask({ title: "", related: "Manual", priority: "Medium", due: "Today", owner: "Varshini" });
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
    try {
      const res = await axios.get(
        "http://192.168.1.15:5000/api/files",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            entity_type: "lead",
            entity_id: 1,
          },
        }
      );
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err.response?.data || err);
    }
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("entity_type", "lead");
      formData.append("entity_id", "1");

      try {
        const res = await axios.post(
          "http://192.168.1.15:5000/api/files",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setFiles((prev) => [res.data, ...prev]);
      } catch (err) {
        console.error("File upload failed", err.response?.data || err);
      }
    }
  };

  /* NOTES */
  const addNote = async () => {
    if (!noteText.trim()) return;
    try {
      await axios.post(
        "http://192.168.1.15:5000/api/notes",
        { note: noteText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setNoteText("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note", err);
    }
  };

  useEffect(() => {
    if (activeTab === "notes") {
      fetchNotes();
    }
  }, [activeTab]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://192.168.1.15:5000/api/notes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(res.data.notes || res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
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
            {filteredTasks.map((t) => (
              <div key={t.id} className={`${styles.taskRow} ${t.done ? styles.done : ""}`}>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTask(t.id)}
                  className={styles.taskCheckbox}
                />

                <div className={styles.taskInfo}>
                  <strong style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</strong>
                  <span>{t.related}</span>
                </div>

                <span className={`${styles.priority} ${styles[t.priority.toLowerCase()]}`}>
                  {t.priority}
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
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button onClick={addNote}>Post Note</button>
          </div>

          {notes.map((n, i) => (
            <div key={i} className={styles.noteCard}>
              {editingIndex === i ? (
                <>
                  <textarea
                    className={styles.editTextarea}
                    value={noteText}
                    style={{ width: '100%', marginBottom: '10px' }}
                    onChange={(e) => setNoteText(e.target.value)}
                  />
                  <div className={styles.noteActions}>
                    <button className={styles.actionBtn} style={{ background: '#6b5cff', color: '#fff' }}
                      onClick={async () => {
                        try {
                          const noteId = notes[i].id;
                          await axios.put(
                            `http://192.168.1.15:5000/api/notes/${noteId}`,
                            { note: noteText },
                            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                          );
                          const updatedNotes = [...notes];
                          updatedNotes[i] = { ...updatedNotes[i], note: noteText };
                          setNotes(updatedNotes);
                          setEditingIndex(null);
                          setNoteText("");
                        } catch (err) {
                          console.error("Failed to update note", err);
                        }
                      }}
                    >
                      Save
                    </button>
                    <button className={styles.actionBtn} onClick={() => setEditingIndex(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <p>{n.note}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> {n.created_at}</span>
                    <div className={styles.noteActions}>
                      <button className={styles.actionBtn}
                        onClick={() => {
                          setEditingIndex(i);
                          setNoteText(n.note);
                        }}
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button className={styles.actionBtn} style={{ color: '#ff6a88' }}
                        onClick={async () => {
                          try {
                            const noteId = notes[i].id;
                            await axios.delete(`http://192.168.1.15:5000/api/notes/${noteId}`, {
                              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                            });
                            setNotes(notes.filter((_, index) => index !== i));
                          } catch (err) {
                            console.error("Failed to delete note");
                          }
                        }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          {notes.length === 0 && <div style={{ textAlign: 'center', color: '#8a8fb2', padding: '2rem' }}>No notes found.</div>}
        </div>
      )}

      {/* FILES TAB */}
      {activeTab === "files" && (
        <div className={styles.panel}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
            <h3>Shared Files</h3>
            <label className={styles.actionBtn} style={{ background: '#6b5cff', color: '#fff', borderColor: '#6b5cff', cursor: 'pointer' }}>
              <UploadCloud size={14} /> Upload New
              <input type="file" multiple hidden onChange={handleFileUpload} />
            </label>
          </div>

          <div className={styles.filesList}>
            {files.map((f, i) => (
              <div key={i} className={styles.fileRow}>
                <div className={styles.fileInfo}>
                  <div className={styles.fileIcon}>
                    <FileText size={20} color="#6b5cff" />
                  </div>
                  <span className={styles.fileName}>{f.file_name}</span>
                </div>

                <div className={styles.fileActions}>
                  {f.id && (
                    <button className={styles.downloadBtn}
                      onClick={async () => {
                        try {
                          const res = await axios.get(
                            `http://192.168.1.15:5000/api/files/${f.id}/download`,
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
                      onClick={async () => {
                        try {
                          await axios.delete(`http://192.168.1.15:5000/api/files/${f.id}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                          });
                          setFiles(files.filter((_, index) => index !== i));
                        } catch (err) {
                          console.error("Failed to delete file", err);
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
