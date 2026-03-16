import { createSlice } from "@reduxjs/toolkit";
import { MOCK_NOTIFICATIONS } from "@constants/mockData";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: MOCK_NOTIFICATIONS,
  },
  reducers: {
    addNotification:    (state, a) => { state.items.unshift({ ...a.payload, read: false, id: Date.now() }); },
    markRead:           (state, a) => { const n = state.items.find((x) => x.id === a.payload); if (n) n.read = true; },
    markAllRead:        (state)    => { state.items.forEach((n) => { n.read = true; }); },
    removeNotification: (state, a) => { state.items = state.items.filter((x) => x.id !== a.payload); },
  },
});

export const { addNotification, markRead, markAllRead, removeNotification } = notificationSlice.actions;
export const selectUnreadCount = (state) => state.notifications.items.filter((n) => !n.read).length;
export default notificationSlice.reducer;
