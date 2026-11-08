import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import therapistReducer from "./therapistSlice";
import appointmentReducer from "./appointmentSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    therapists: therapistReducer,
    appointments: appointmentReducer,
    chat: chatReducer,
  },
});
