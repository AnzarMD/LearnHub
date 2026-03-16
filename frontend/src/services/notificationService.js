import api from "./api";
import { MOCK_NOTIFICATIONS } from "@constants/mockData";

const MOCK  = import.meta.env.VITE_MOCK_API !== "false";
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const getNotifications = async () => {
  if (MOCK) { await delay(); return MOCK_NOTIFICATIONS; }
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationRead = async (id) => {
  if (MOCK) { await delay(); return { message: "Marked as read." }; }
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  if (MOCK) { await delay(); return { message: "All notifications marked as read." }; }
  const { data } = await api.put("/notifications/read-all");
  return data;
};

export const sendAnnouncement = async (payload) => {
  // payload: { title, message, targetRoles, courseId? }
  if (MOCK) { await delay(600); return { message: "Announcement sent." }; }
  const { data } = await api.post("/notifications/announce", payload);
  return data;
};

/**
 * Socket.io-based real-time subscription.
 * Returns a cleanup function.
 */
export const subscribeToNotifications = (socket, userId, onNotification) => {
  if (!socket) return () => {};
  socket.emit("subscribe:notifications", { userId });
  socket.on("notification:new", onNotification);
  return () => socket.off("notification:new", onNotification);
};
