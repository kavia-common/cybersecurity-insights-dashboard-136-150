import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationsRead, connectNotificationsWS } from "../api";

function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let ws;
    async function load() {
      setLoading(true);
      const resp = await fetchNotifications();
      setNotifications(resp.notifications);
      setLoading(false);
      setUnread(resp.notifications.filter((n) => !n.read).length);
      ws = connectNotificationsWS((notif) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnread(u => u + 1);
      });
    }
    load();
    return () => ws && ws.close();
  }, []);

  const markRead = async () => {
    const ids = notifications.filter((n) => !n.read).map((n) => n.id);
    await markNotificationsRead(ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  return (
    <div className="notifications-panel">
      <div className="notif-header">
        <span>Notifications ({unread} unread)</span>
        <button onClick={markRead}>Mark all as read</button>
        <button onClick={onClose} className="notif-close">
          ×
        </button>
      </div>
      <ul>
        {loading
          ? <li>Loading...</li>
          : notifications.length === 0
          ? <li>No notifications</li>
          : notifications.map((n) => (
              <li key={n.id} className={n.read ? "read" : "unread"}>
                <span className={`notif-severity ${n.severity}`}>{n.severity}</span>
                <span className="notif-time">{new Date(n.timestamp).toLocaleString()}</span>
                <div className="notif-message">{n.message}</div>
              </li>
            ))}
      </ul>
    </div>
  );
}

export default NotificationsPanel;
