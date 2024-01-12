import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import emailReducer from "../reducers/emailReducer";
import attachmentsReducer from "../reducers/attachmentsReducer";
export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    auth: authReducer,
    email: emailReducer,
    attachments: attachmentsReducer,
  },
});
