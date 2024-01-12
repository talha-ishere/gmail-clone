import { useLocation } from "react-router-dom";
import "./DisplayEmail.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmail } from "../reducers/emailReducer";
import { getAttachment } from "../reducers/attachmentsReducer";

function DisplayEmail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [showForwordBox, setShowForwordBox] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [forwordBody, setForwordBody] = useState("");
  const [forwordHtml, setForwordHtml] = useState("");
  const [forwordTo, setForwordTo] = useState("");
  const [attApiCalled, setAttApiCalled] = useState(false);

  const emailTypeSend = location.state.data?.labelIds?.includes("SENT") || "";
  // const base64Att = useSelector((state) => state.attachments.attachment);
  const parts = location?.state?.data?.payload?.parts || [];
  const attachmentArray = parts?.filter((item) => {
    return (item.body && item?.body?.attachmentId) || "";
  });

  console.log(attachmentArray);

  useEffect(() => {
    if (emailTypeSend) {
      setShowReplyBox(false);
    }
  }, []);

  const headers = location.state.data.payload.headers;
  const emailRegex = /<([^>]+)>/;

  /////////////////// Data Payload

  let payload = {
    date: headers.filter((header) => header.name === "Date")[0]?.value?.split("+")[0] || "",
    to: (location.state?.otherData?.from[0]?.value?.match(emailRegex) || [])[1] || "",
    from: localStorage.getItem("userId") || "",
    subject: headers.filter((header) => header.name === "Subject")[0]?.value || "",
    messageId: headers.filter((header) => header.name === "Message-ID")[0]?.value || "",
    findReplyTo: headers.filter((header) => header.name === "In-Reply-To") || [],
  };

  ////////////// Set Forword
  function setForword({ from, subject, to, date }) {
    const forwordedMessage = `---------- Forwarded message ---------\nFrom: ${from}\nDate: ${date}\nSubject: ${subject}\nTo: ${to}`;
    setForwordBody(forwordedMessage);
    setForwordHtml(decodedHtml);
  }
  ///////////////   Handler Send Forword
  function handleSendForword() {
    const userId = localStorage.getItem("userId");

    const forwordData = `${forwordBody}\n${forwordHtml}`;
    const emailToBeForword = `MIME-version: 1.0\nContent-type: text/html\nFrom: ${userId}\nTo: ${forwordTo}\nSubject: ${payload.subject}\n\n${forwordData}`;
    const base64ForwordEmail = btoa(emailToBeForword).replace(/-/g, "+").replace(/_/g, "/");
    payload.raw = base64ForwordEmail;

    dispatch(sendEmail(payload)).then(
      () => {
        // Handle success
        alert("Email Forworded");
        setForwordBody("");
        setForwordTo("");
        setForwordHtml("");
      },
      (sendErr) => {
        // Handle error
        if (sendErr) {
          alert("Email not Forworded");
        }
      }
    );
  }
  ///////////////////// Handler  Send  Reply
  function handleSendReply({ to, from, subject, messageId, findReplyTo }) {
    let replyTo;
    if (findReplyTo > 0) {
      replyTo = findReplyTo[0]?.value;
    } else {
      replyTo = messageId;
    }
    let refrences;
    let findReferences = headers.filter((header) => header.name === "References");
    if (findReferences > 0) {
      refrences = findReferences[0]?.value;
    } else {
      refrences = messageId;
    }
    const replyTobeSend = `From: ${from}\nTo: ${to}\nSubject: Re: ${subject}\nMessage-ID: ${messageId}\nIn-Reply-To: ${replyTo}\nRefrences:${refrences}\n${replyBody} `;
    const base64reply = btoa(replyTobeSend).replace(/-/g, "+").replace(/_/g, "/");
    console.log(base64reply);
    let payload = {};
    payload.raw = base64reply;

    dispatch(sendEmail(payload)).then(
      () => {
        // Handle success
        alert("Reply Sended");
        setReplyBody("");
      },
      (sendErr) => {
        // Handle error
        if (sendErr) {
          alert("Reply not Sended");
        }
      }
    );
  }
  //////////////////////////////// Handler Attachments
  async function handlerAttachment(item, messageId) {
    document.body.style.cursor = "wait";

    const attId = item.body.attachmentId;
    let attPayload = { attId, messageId };
    dispatch(getAttachment(attPayload)).then(({ payload }) => {
      // console.log(payload);
      handleNewTab(item.mimeType, payload);
    });
  }
  function handleNewTab(mimeType, payload) {
    try {
      let base64Data = payload;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `${mimeType}` });
      const dataUrl = URL.createObjectURL(blob);
      document.body.style.cursor = "auto";

      const newTab = window.open(dataUrl, "_blank");
    } catch (err) {
      console.log(err);
    }
  }
  //////////////////  Decode Base64 ///////////////////////////////
  let base64Html = "";
  let data = location?.state?.data || "";
  let emailMimeType = data?.payload?.mimeType || "";
  if (emailMimeType === "multipart/mixed") {
    base64Html = data?.payload?.parts[0].body.data || data?.payload?.parts[0]?.parts[1]?.body?.data || "";
  }
  // if (emailMimeType === "multipart/mixed") {
  //   base64Html = data?.payload?.parts[0]?.parts[0]?.body?.data || data?.payload?.parts[0].body.data || "";
  console.log(data);

  // }
  if (emailMimeType === "text/plain") {
    base64Html = data?.payload?.body?.data || "";
    // base64Html = data.payload?.parts[0].parts[0]?.body?.data || "";
  }
  if (emailMimeType === "multipart/alternative") {
    base64Html = data?.payload?.parts[1]?.body?.data;
  }

  // let type = location.state?.data?.payload?.parts[0]?.mimeType || "";

  // if (location.state.data?.payload?.parts) {
  //   base64Html = location.state.data.payload?.parts[1]?.body?.data;
  // } else {
  //   base64Html = location.state.data?.payload?.body.data;
  // }
  // if (type === "multipart/alternative") {
  //   if (location?.state?.data?.payload?.parts[0].parts[0].mimeType === "text/plain") {
  //     base64Html = location?.state?.data?.payload?.parts[0].parts[0].body.data;
  //   }
  // }
  // console.log(base64Html);
  let decodedHtml = "";
  if (base64Html) {
    decodedHtml = atob(base64Html.replace(/-/g, "+").replace(/_/g, "/"));
  }
  const renderEmailHtml = <div dangerouslySetInnerHTML={{ __html: decodedHtml }} />;

  ///////////////// Render Reply Box
  const renderReplyBox = () => {
    return (
      <>
        <div className="replyBox-container">
          <div className="replyBox-head">
            <p>Reply to: {payload.from}</p>
            <div className="replyBox-close" onClick={(e) => setShowReplyBox(false)}>
              <RxCross2 size={20} />
            </div>
          </div>
          <textarea
            placeholder="Type your reply"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
          ></textarea>
        </div>
        <div className="reply-footer">
          <button onClick={() => handleSendReply(payload)}>Send</button>
        </div>
      </>
    );
  };
  //////////////////// Render Forword Box ///////////////////////////
  const renderForwordBox = () => {
    return (
      <>
        <div className="forwordBox-container">
          <div className="replyBox-head">
            <h4>Forword Message</h4>
            <div className="replyBox-close" onClick={(e) => setShowForwordBox(false)}>
              <RxCross2 size={20} />
            </div>
          </div>
          <div className="forword-input-wrapper">
            <label>To :</label>
            <input
              className="forword-to-input"
              type="text"
              value={forwordTo}
              onChange={(e) => setForwordTo(e.target.value)}
            ></input>
          </div>
          <textarea
            placeholder={forwordBody}
            value={forwordBody}
            onChange={(e) => setForwordBody(e.target.value)}
          ></textarea>
          <div contentEditable="true" dangerouslySetInnerHTML={{ __html: forwordHtml }} />
          {/* <div className="forword-body" style={{ marginTop: "5rem" }}></div> */}
        </div>
        <div className="reply-footer">
          <button onClick={() => handleSendForword(payload)}>Send</button>
        </div>
      </>
    );
  };
  ////////// Component Render    /////////////////////////////////////////////
  return (
    <div className="display-email">
      <div className="head">
        <div className="options">
          <div className="back" onClick={() => navigate(-1)}>
            <FaArrowLeft size={20} style={{ color: "black" }} />
          </div>
        </div>
      </div>
      <div className="email-subject">
        <p>{payload.subject}</p>
      </div>
      <div className="email-body">{renderEmailHtml}</div>

      {attachmentArray.length > 0 ? (
        <>
          <h4 style={{ marginLeft: "2rem" }}>Attachments :</h4>
          <div className="email-att">
            {attachmentArray.map((item) => (
              <div className="att-box" key={item.partId} onClick={() => handlerAttachment(item, payload.messageId)}>
                {item.filename}
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div
        className="footer"
        style={{
          display: emailTypeSend || showReplyBox || showForwordBox ? "none" : "",
        }}
      >
        <button
          onClick={() => {
            setShowForwordBox(true);
            setForword(payload);
          }}
        >
          Forword
        </button>
        <button onClick={() => setShowReplyBox(true)}>Reply</button>
      </div>
      {showReplyBox ? renderReplyBox() : ""}
      {showForwordBox ? renderForwordBox() : ""}
    </div>
  );
}

export default DisplayEmail;
