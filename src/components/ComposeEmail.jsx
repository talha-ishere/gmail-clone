import { useState } from "react";
import "./ComposeEmail.css";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendEmail } from "../reducers/emailReducer";
import { useRef } from "react";
import Content from "./Content";
import { sendAttachment } from "../reducers/attachmentsReducer";

function ComposeEmail({ close }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [base64Att, setBase64Att] = useState("");
  const sendErr = useSelector((state) => state.email.sendErr);
  const fileInputRef = useRef(null);

  const [values, setValues] = useState({
    sendTo: "",
    subject: "",
    body: "",
    attachment: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    try {
      if (e.target.files[0].size > 5000000) {
        console.log(e.target.files[0]);
        return alert("5 MB is max size to upload");
      } else if (e.target.files.length > 1) {
        alert("Only One File can Send");
      } else {
        const file = e.target.files[0];
        console.log(file);
        setValues({
          ...values,
          attachment: file,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const payload = { userId, raw: "", token };
  function handlerSend() {
    if (values.sendTo !== "" && values.body !== "" && !values.subject !== "") {
      const emailTobeSend = `From: ${userId}\nTo: ${values.sendTo}\nSubject: ${values.subject}\n\n${values.body}`;
      const base64Email = btoa(emailTobeSend).replace(/-/g, "+").replace(/_/g, "/");
      console.log(base64Email);
      if (!values.attachment) {
        console.log("No attachment");
        payload.raw = base64Email;
        setValues({
          sendTo: "",
          subject: "",
          body: "",
        });
        dispatch(sendEmail(payload)).then(
          () => {
            // Handle success
            alert("Email Sent");
          },
          (sendErr) => {
            // Handle error
            if (sendErr) {
              alert("Email not Sent");
            }
          }
        );
      }
      if (values.attachment) {
        console.log(values.attachment.type);
        const mimeTypes = {
          txt: "text/plain",
          html: "text/html",
          css: "text/css",
          js: "text/javascript",
          json: "application/json",
          png: "image/png",
          jpeg: "image/jpeg",
          jpg: "image/jpeg",
          pdf: "application/pdf",
        };
        function getContentType(values) {
          const extension = values?.attachment?.name?.split(".").pop().toLowerCase();
          return mimeTypes[extension] || "application/octet-stream";
        }
        let ContentType;
        ContentType = getContentType(values);
        // if ((values.attachment.type = "")) {
        //   console.log(ContentType);
        // } else {
        //   ContentType = values.attachment.type;____
        //   console.log(ContentType);
        // }
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64Data = reader.result.split(",")[1];

          const emailtWithAtt = `Content-Type: multipart/mixed; boundary=foo_bar_baz\nMIME-Version: 1.0\nFrom: ${userId}\nTo: ${values.sendTo}\nSubject: ${values.subject}\n\n--foo_bar_baz\nContent-Type: text/plain; charset="UTF-8"\nMIME-Version: 1.0\nContent-Transfer-Encoding: 7bit\n\n${values.body}`;
          const attachment = `--foo_bar_baz\nContent-Type: ${ContentType};\nMIME-Version: 1.0\nContent-Transfer-Encoding: base64\nContent-Disposition: attachment; filename="${values.attachment.name}"\n\n${base64Data}`;
          const attEmailToBeSend = `${emailtWithAtt}\n${attachment}`;

          const base64AttEmail = btoa(attEmailToBeSend).replace(/-/g, "+").replace(/_/g, "/");
          const payload = {
            raw: base64AttEmail,
          };
          console.log(base64AttEmail);

          dispatch(sendAttachment(payload)).then(
            setValues({
              sendTo: "",
              subject: "",
              body: "",
              attachment: "",
            }),
            close(),
            alert("Email Sended")
          );
        };

        reader.readAsDataURL(values.attachment);
      }
    } else {
      alert("Fill All the Required field first");
    }
  }
  return (
    <div className="compose-wrapper">
      <div className="head-composeEmail">
        <p>New Messagge</p>
        <div className="composeEmail-close" onClick={() => close()}>
          <RxCross2 size={20} />
        </div>
      </div>
      <div className="composeEmail-body">
        <input placeholder="To" type="text" name="sendTo" onChange={handleChange} value={values.sendTo}></input>
        <hr className="composeEmail-lineBreak"></hr>
        <input placeholder="Subject" name="subject" type="text" onChange={handleChange} value={values.subject}></input>
        <hr className="composeEmail-lineBreak"></hr>
        <textarea name="body" onChange={handleChange} value={values.body}></textarea>
      </div>
      <div className="composeEmail-footer">
        <button onClick={() => fileInputRef.current.click()}>Choose File</button>
        <input
          type="file"
          ref={fileInputRef}
          name="attachment"
          onChange={(e) => handleFileChange(e)}
          style={{ display: "none" }}
        />
        <div className="filename">{values.attachment.name}</div>
        <button onClick={() => handlerSend()}>Send</button>
      </div>
    </div>
  );
}

export default ComposeEmail;
