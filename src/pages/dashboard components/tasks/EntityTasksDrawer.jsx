import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { X, Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./tasks.module.css";

export default function EntityTasksDrawer({ isOpen, onClose, entityType, entityId, entityName }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        if (!entityId) return;
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // Use lead or deal endpoint based on entityType
            const endpoint = entityType === 'lead'
                ? "/api/leads/${entityId}/tasks"
                : "/api/deals/${entityId}/tasks";

            const res = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data.tasks || res.data);
        } catch (err) {
            console.error(`Failed to fetch ${entityType} tasks:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && entityId) {
            fetchTasks();
        }
    }, [isOpen, entityId]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        try {
            const token = localStorage.getItem("token");
            await api.post("/api/tasks", {
                title: newTaskTitle,
                entity_type: entityType,
                entity_id: entityId,
                priority: 'Medium',
                due_date: 'today'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewTaskTitle("");
            fetchTasks();
        } catch (err) {
            console.error("Failed to add task:", err);
        }
    };

    const toggleTask = async (taskId) => {
        try {
            const token = localStorage.getItem("token");
            await api.put(`/api/tasks/${taskId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            console.error("Failed to toggle task:", err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className={styles.modalOverlay}
                        style={{ zIndex: 2000 }}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className={styles.drawer}
                        style={{
                            position: 'fixed', top: 0, right: 0, height: '100%', width: '400px',
                            backgroundColor: 'white', zIndex: 2001, boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
                            padding: '20px', display: 'flex', flexDirection: 'column'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Tasks</h3>
                                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>For: {entityName}</span>
                            </div>
                            <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddTask} style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                            <input
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Add a new task..."
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e4e6f0' }}
                            />
                            <button type="submit" style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#6b5cff', color: 'white', cursor: 'pointer' }}>
                                <Plus size={20} />
                            </button>
                        </form>

                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading tasks...</div>
                            ) : tasks.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No tasks found for this {entityType}.</div>
                            ) : (
                                <div className={styles.taskList}>
                                    {tasks.map(task => (
                                        <div key={task.id} className={`${styles.taskRow} ${task.status === 'completed' ? styles.done : ""}`} style={{ padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                                            <input
                                                type="checkbox"
                                                checked={task.status === 'completed' || task.status === 'done'}
                                                onChange={() => toggleTask(task.id)}
                                                style={{ marginRight: '12px', cursor: 'pointer' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 500, fontSize: '0.9rem', textDecoration: (task.status === 'completed' || task.status === 'done') ? 'line-through' : 'none' }}>
                                                    {task.title}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#8a8fb2', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} /> {task.due_date || 'No date'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
