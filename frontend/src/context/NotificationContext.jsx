import { createContext, useCallback, useContext, useState } from "react";
import { MOCK_NOTIFICATIONS } from "@constants/mockData";

const NotificationContext = createContext(null);

let toastId = 0;

export function NotificationProvider({ children }) {
  const [toasts, setToasts]   = useState([]);
  const [notifs, setNotifs]   = useState(MOCK_NOTIFICATIONS);

  // ─── Toast API ──────────────────────────────────────────────────────────────
  const toast = useCallback((msg, type = "info", duration = 3500) => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // ─── In-app Notification API ─────────────────────────────────────────────
  const markRead    = (id) => setNotifs((n) => n.map((x) => x.id === id ? { ...x, read: true } : x));
  const markAllRead = ()   => setNotifs((n) => n.map((x) => ({ ...x, read: true })));
  const addNotif    = (notif) => setNotifs((n) => [{ id: Date.now(), read: false, ...notif }, ...n]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ toast, removeToast, toasts, notifs, markRead, markAllRead, addNotif, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};

export default NotificationContext;
