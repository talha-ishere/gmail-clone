import { useEffect, useState } from "react";
import DisplayEmail from "./DisplayEmail";
import "./Inbox.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { getEmails, getEmailsStats, prevPage, removeEmails } from "../reducers/emailReducer";

function EmailList({ type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogo, setShowLogo] = useState(false);
  const pageToken = useSelector((state) => state.email.nextPageToken);
  const reduxPageArray = useSelector((state) => state.email.nextPageToken);

  // const emailListEnded = useSelector((state) => state.email.emailListEnded);
  // const emailArrayEnded = pageToken.length < 1;
  let emails = useSelector((state) => state.email.emails);
  console.log(pageToken);
  useEffect(() => {
    dispatch(removeEmails());
    payload.pageToken = "";
    dispatch(getEmails(payload));
  }, [type]);

  let payload = {
    pageToken,
    labelIds: type,
    maxResults: 10,
  };
  function handleNextPage() {
    let tokenArrayLength = pageToken?.length;
    payload.pageToken = pageToken[tokenArrayLength - 1];
    dispatch(getEmails(payload));
  }
  function handlePrevPage() {
    dispatch(prevPage());
    let tokenArrayLength = pageToken?.length;
    payload.pageToken = pageToken[tokenArrayLength - 3];
    dispatch(getEmails(payload));
  }

  function handleSpecificEmail(data, otherData) {
    navigate("/gmail/email", { state: { data, otherData } });
  }
  // console.log(emails);
  const renderAllEmails = () => {
    // console.log("emails", emails);
    // if (emails.length <= 0) {
    //   return <p>No Emails Found</p>;
    // } else {
    return (
      <ul>
        {emails.map((email, index) => {
          //// Get specific Headers
          if (email?.data) {
            const headerArray = email?.data?.payload?.headers || [];
            const subject = headerArray.filter((item) => item.name === "Subject");
            const from = headerArray.filter((item) => item.name === "From");

            const otherData = { subject, from };
            return (
              <li key={index}>
                <div className="row" onClick={() => handleSpecificEmail(email.data, otherData)}>
                  {/* Sender  Name*/}
                  <div className="sender-name">{from[0]?.value.split(" ")[0]}</div>
                  {/* Subject  */}
                  <div className="snippet">
                    {subject[0]?.value} {"    -    "}
                    {/* Snippt */}
                    {email?.data?.snippet || ""}
                  </div>
                </div>
              </li>
            );
          }
        })}
      </ul>
    );
    // }
  };

  const renderLogo = () => {
    return <img src="./logo.gif" alt="img" style={{ height: "30rem", width: "40rem", marginLeft: "10rem" }}></img>;
  };

  return (
    <>
      <div className="inbox-head">
        <div>Page Number: {reduxPageArray.length}</div>
        <div className="arrow-buttons" onClick={() => handlePrevPage()}>
          <FaArrowLeft size={15} style={{ color: "black" }} />
        </div>
        <div className="arrow-buttons" onClick={() => handleNextPage()}>
          <FaArrowRight size={15} style={{ color: "black" }} />
        </div>
      </div>
      {!!emails && emails.length > 0 ? renderAllEmails() : renderLogo()}
    </>
  );
}

export default EmailList;

{
  /* <div>No Emails Found</div>  */
}
