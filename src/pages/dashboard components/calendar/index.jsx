import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./calendar.module.css";

export default function Calendar({ branch }) {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "Call",
    start_datetime: "",
    end_datetime: "",
    related_type: "deal",
    related_id: "",
    assigned_to: "",
    remind_before_minutes: 15,
  });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://192.168.1.15:5000/api/calendar/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://192.168.1.15:5000/api/reminders/today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders(res.data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchReminders();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = "http://192.168.1.15:5000/api/calendar/events";

      const payload = {
        ...formData,
        related_id: Number(formData.related_id),
        assigned_to: Number(formData.assigned_to),
        remind_before_minutes: Number(formData.remind_before_minutes),
      };

      await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        event_type: "Call",
        start_datetime: "",
        end_datetime: "",
        related_type: "deal",
        related_id: "",
        assigned_to: "",
        remind_before_minutes: 15,
      });
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event.");
    }
  };

  const markReminderSent = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://192.168.1.15:5000/api/reminders/${id}/sent`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReminders();
    } catch (error) {
      console.error("Error marking reminder as sent:", error);
    }
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split('-').map(Number);
      setSelectedDay(new Date(y, m - 1, d));
    }
  };

  // Generate next 5 days for the header
  const getDays = () => {
    const days = [];
    const start = new Date(selectedDay);
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDays();

  const formatDay = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const isSameDay = (d1, d2) => {
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const filteredEvents = events.filter(e => {
    if (!e.start_datetime) return false;
    return isSameDay(new Date(e.start_datetime), selectedDay);
  });

  return (
    <div className={styles.calendarPage}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Events & Reminders</h2>
        <div className={styles.headerActions}>
          <div className={styles.datePickerWrapper} title="Jump to date">
            <span className={styles.calendarIcon} role="img" aria-label="calendar">📅</span>
            <input
              type="date"
              onChange={handleDateChange}
              className={styles.dateInput}
            />
          </div>
          <button className={styles.newEventBtn} onClick={() => setShowModal(true)}>＋ New Event</button>
        </div>
      </div>

      {/* Reminders Banner */}
      {reminders.length > 0 && (
        <div className={styles.remindersBanner}>
          <h4 className={styles.remindersTitle}>Today's Reminders</h4>
          {reminders.map(r => (
            <div key={r.id} className={styles.reminderItem}>
              <span>{r.title}</span>
              <button onClick={() => markReminderSent(r.id)} className={styles.dismissBtn}>Dismiss</button>
            </div>
          ))}
        </div>
      )}

      {/* Day Selector */}
      <div className={styles.dayRow}>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`${styles.day} ${isSameDay(selectedDay, day) ? styles.activeDay : ""
              }`}
            onClick={() => setSelectedDay(day)}
          >
            {formatDay(day)}
          </div>
        ))}
      </div>

      {/* Calendar Body */}
      <div className={styles.calendarBody}>
        {/* Time Column */}
        <div className={styles.timeColumn}>
          {["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"].map(
            (time) => (
              <div key={time} className={styles.timeSlot}>
                {time}
              </div>
            )
          )}
        </div>

        {/* Events Column */}
        <div className={styles.eventsColumn}>
          {filteredEvents.length === 0 && <div className={styles.noEvents}>No data here or empty</div>}
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`${styles.event} ${styles[event.event_type?.toLowerCase()] || styles.task}`}
            >
              <h4>{event.title}</h4>
              <span>
                {new Date(event.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Event</h3>
            <form onSubmit={handleCreateEvent} className={styles.form}>
              <input placeholder="Title" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className={styles.input} />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={styles.input} />

              <select value={formData.event_type} onChange={e => setFormData({ ...formData, event_type: e.target.value })} className={styles.input}>
                <option value="Call">Call</option>
                <option value="Meeting">Meeting</option>
                <option value="Task">Task</option>
              </select>

              <label className={styles.label}>Start Time</label>
              <input type="datetime-local" required value={formData.start_datetime} onChange={e => setFormData({ ...formData, start_datetime: e.target.value })} className={styles.input} />

              <label className={styles.label}>End Time</label>
              <input type="datetime-local" required value={formData.end_datetime} onChange={e => setFormData({ ...formData, end_datetime: e.target.value })} className={styles.input} />

              <select value={formData.related_type} onChange={e => setFormData({ ...formData, related_type: e.target.value })} className={styles.input}>
                <option value="deal">Deal</option>
                <option value="lead">Lead</option>
                <option value="contact">Contact</option>
              </select>

              <input placeholder="Related ID" type="number" value={formData.related_id} onChange={e => setFormData({ ...formData, related_id: e.target.value })} className={styles.input} />
              <input placeholder="Assigned To (User ID)" type="number" value={formData.assigned_to} onChange={e => setFormData({ ...formData, assigned_to: e.target.value })} className={styles.input} />
              <input placeholder="Remind Before (minutes)" type="number" value={formData.remind_before_minutes} onChange={e => setFormData({ ...formData, remind_before_minutes: e.target.value })} className={styles.input} />

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" className={styles.newEventBtn}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
