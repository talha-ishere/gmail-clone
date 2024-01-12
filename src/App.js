import { useEffect } from "react";
import "./App.css";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { saveToken } from "./reducers/authReducer";
import { getEmails, removeEmails } from "./reducers/emailReducer";
import { getUserProfile } from "./reducers/authReducer";
import { useSelector } from "react-redux";
function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const userId = useSelector((state) => state.auth.userProfile.email);
  // const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    dispatch(removeEmails());
  }, []);

  const signIn = useGoogleLogin({
    scope: process.env.REACT_APP_SCOPES,
    onSuccess: async (tokenResponse) => {
      window.localStorage.setItem("token", JSON.stringify(tokenResponse.access_token));
      try {
        // dispatch(saveToken(tokenResponse.access_token));
        dispatch(getUserProfile(tokenResponse.access_token)).then((res) => {
          if (res.payload.email) {
            navigate(`/gmail`);
          }
          console.log(res.payload.email);
        });
      } catch (err) {
        console.log(err);
      }
      // let payload = { labelIds: "INBOX", maxResults: 10 };
      // await dispatch(getEmails(payload));
      // setTimeout(async () => {
      //   navigate(`/gmail`);
      // }, 700);
    },
    onError: () => {
      navigate("/");
    },
  });

  return (
    <div className="app-wrapper">
      <img src="./Gmail-Logo-home.png" alt="home-logo"></img>
      <div className="signin-button-wrapper">
        <button onClick={() => signIn()} className="signin-button">
          SignIn
        </button>
      </div>
    </div>
  );
}

export default App;
