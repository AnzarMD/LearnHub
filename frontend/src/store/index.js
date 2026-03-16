import { configureStore } from "@reduxjs/toolkit";
import authReducer         from "./slices/authSlice";
import uiReducer           from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";
import courseReducer        from "./slices/courseSlice";

const store = configureStore({
  reducer: {
    auth:          authReducer,
    ui:            uiReducer,
    notifications: notificationReducer,
    courses:       courseReducer,
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;
