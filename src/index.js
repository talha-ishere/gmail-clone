import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Gmail from "./components/Gmail";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Content from "./components/Content";
import DisplayEmail from "./components/DisplayEmail";
import EmailList from "./components/EmailList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/gmail",
    element: (
      <Gmail>
        <EmailList type={"INBOX"} />
      </Gmail>
    ),
  },
  {
    path: "/gmail/email",
    element: (
      <Gmail>
        <DisplayEmail />
      </Gmail>
    ),
  },
  {
    path: "/gmail/unread",
    element: (
      <Gmail>
        <EmailList type={"UNREAD"} />
      </Gmail>
    ),
  },
  {
    path: "/gmail/sent",
    element: (
      <Gmail>
        <EmailList type={"SENT"} />
      </Gmail>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
    <Provider store={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </Provider>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
