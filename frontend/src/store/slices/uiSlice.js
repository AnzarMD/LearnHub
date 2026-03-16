import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    sidebarCollapsed: false,
    activePage:       "dashboard",
    modalOpen:        null,   // null | "createCourse" | "addUser" | ...
  },
  reducers: {
    toggleSidebar:    (state)       => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setSidebarState:  (state, a)    => { state.sidebarCollapsed = a.payload; },
    setActivePage:    (state, a)    => { state.activePage = a.payload; },
    openModal:        (state, a)    => { state.modalOpen  = a.payload; },
    closeModal:       (state)       => { state.modalOpen  = null; },
  },
});

export const { toggleSidebar, setSidebarState, setActivePage, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
