import { useState, useEffect } from "react";
import api from "@/api/axios";
import styles from "./notes.module.css";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [noteActionLoading, setNoteActionLoading] = useState(null);
  const [errorHeader, setErrorHeader] = useState("");

  const getNoteId = (n) => n?.id || n?._id || n?.note_id;

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("NOTES API RESPONSE RAW:", res.data);
      let rawNotes = [];
      if (Array.isArray(res.data)) {
        rawNotes = res.data;
      } else if (res.data && typeof res.data === 'object') {
        const firstArray = Object.values(res.data).find(val => Array.isArray(val));
        rawNotes = firstArray || [];
      }
      const normalized = rawNotes.map(n => ({
        id: n.id,
        note: n.content || n.note,
        title: n.title || "Note",
        created_at: n.created_at || "Just now"
      }));

      if (normalized.length === 0) {
        setNotes([
          { id: 'dummy-1', title: 'Example Note', note: 'Welcome! This is a dummy note to get you started.', created_at: 'System' },
          { id: 'dummy-2', title: 'Task Tip', note: 'You can add notes here to keep track of important details.', created_at: 'System' }
        ]);
      } else {
        setNotes(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) {
      setErrorHeader("Please type something first!");
      setTimeout(() => setErrorHeader(""), 3000);
      return;
    }
    setErrorHeader("");
    try {
      setNoteActionLoading('adding');
      const token = localStorage.getItem("token");
      const payload = {
        title: noteText.slice(0, 30) + (noteText.length > 30 ? "..." : ""),
        content: noteText,
        note: noteText // Fallback for some backend versions
      };
      
      await api.post("/api/notes", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNoteText("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to add note", err.response?.data || err.message);
    } finally {
      setNoteActionLoading(null);
    }
  };

  const updateNote = async (id, updatedText) => {
    try {
      setNoteActionLoading(id);
      const token = localStorage.getItem("token");
      const payload = {
        title: updatedText.slice(0, 30) + (updatedText.length > 30 ? "..." : ""),
        content: updatedText,
        note: updatedText // Fallback
      };
      await api.put(`/api/notes/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingNoteId(null);
      setEditingText("");
      fetchNotes();
    } catch (err) {
      console.error("Failed to update note", err);
    } finally {
      setNoteActionLoading(null);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
    } catch (err) {
      console.error("Failed to delete note", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className={styles.panel}>
      <h3>Recent Notes</h3>

      <div className={styles.noteInput}>
        {errorHeader && <div style={{ color: '#ff4d4d', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>{errorHeader}</div>}
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

        return (
          <div key={currentNoteId || i} className={`${styles.noteCard} ${editingNoteId === currentNoteId ? styles.editing : ""}`}>
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
                      updateNote(currentNoteId, editingText);
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
                      onClick={() => deleteNote(currentNoteId)}
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
  );
}
