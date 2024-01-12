import "../App.css";
import Content from "./Content";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { getEmails } from "../reducers/emailReducer";
import { render } from "@testing-library/react";
import { useState } from "react";
import ComposeEmail from "./ComposeEmail";
import { getAttachment } from "../reducers/attachmentsReducer";

function Gmail({ children }) {
  const [sendBox, setSendBox] = useState(false);
  function handleOpenSendBox() {
    setSendBox(true);
  }
  function handleCloseSendBox() {
    setSendBox(false);
  }
  return (
    <div>
      <Navbar />
      <div className="set-items">
        <Sidebar open={handleOpenSendBox} />
        <Content>{children}</Content>
      </div>
      {sendBox ? <ComposeEmail close={handleCloseSendBox} /> : ""}
    </div>
  );
}

export default Gmail;
