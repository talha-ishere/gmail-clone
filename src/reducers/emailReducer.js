import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const token = JSON.parse(localStorage.getItem("token"));
const userId = JSON.parse(localStorage.getItem("userId"));

// const userId = localStorage.getItem("userId");

/////// Get All Emails Function ////////////////////////////////////////
export const getEmails = createAsyncThunk("emails/getEmails", async (payload) => {
  let params = {
    maxResults: payload.maxResults,
    key: process.env.REACT_APP_API_KEY,
    pageToken: payload.pageToken,
  };

  if (payload.labelIds) {
    params.labelIds = payload.labelIds;
  }
  if (payload.maxResults) {
    params.maxResults = payload.maxResults;
  }

  try {
    // Get All Emails Ids
    const token = JSON.parse(localStorage.getItem("token"));
    const userId = JSON.parse(localStorage.getItem("userId"));

    const allMessagesId = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const messages = allMessagesId.data.messages;

    // Fetch every Message with Detail
    if (messages) {
      const emailsPromises = messages.map(async (message) => {
        const myMessage = await axios.get(
          `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${message.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(myMessage);
        return myMessage;
      });

      // Wait for all promises to resolve
      const emails = await Promise.all(emailsPromises);

      return { emails, allMessagesId };
    }

    // If there are no messages, return an empty array
    return [];
  } catch (err) {
    console.log(err);
    throw err; // Re-throw the error to let Redux Toolkit handle it
  }
});
//////////////////// Get All Emails end ///////////////////

//////////////////// Start send Email ////////////////
export const sendEmail = createAsyncThunk("users/sendEmail", async (payload, thunkAPI) => {
  try {
    let email = await axios.post(
      `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send?key=${process.env.REACT_APP_API_KEY}`,
      {
        raw: payload.raw,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return email;
  } catch (err) {
    console.log(err);
    throw err;
  }
});
//////////////////  Send Email End //////////////////

//////////////// Get Stats ///////////////////
export const getEmailsStats = createAsyncThunk("emails/getEmailsStats", async (payload) => {
  let params = {
    // maxResults: payload.maxResults,
    // key: process.env.REACT_APP_API_KEY,
    // pageToken: payload.pageToken,
  };
  params.labelIds = payload;
  try {
    // Get All Emails Ids
    const localToken = JSON.parse(localStorage.getItem("token"));
    const allMessagesId = await axios.get(`https://gmail.googleapis.com/gmail/v1/users/${userId}/messages`, {
      params: params,
      headers: {
        Authorization: `Bearer ${localToken}`,
      },
    });
    const messages = allMessagesId.data.messages;
  } catch (err) {
    console.log(err);
  }
});

///////////////
const initialState = {
  emails: [],
  nextPageToken: [],
  isLoading: false,
  error: null,
  sendErr: null,
  emailListEnded: false,
};

export const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    prevPage: (state, action) => {
      // console.log("Reducer Prev Page:", action.payload);
      if (state.nextPageToken.length > 0) {
        state.nextPageToken = state.nextPageToken.slice(0, -2);
        // state.nextPageToken.pop();
        // state.nextPageToken.pop();
      }
    },
    removeEmails: (state, action) => {
      console.log("Remove Called");
      state.emails = [];
      state.nextPageToken = [];
    },
    removePageTokens: (state, actio) => {
      state.nextPageToken = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getEmails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getEmails.fulfilled, (state, action) => {
      state.isLoading = false;
      // if (state.nextPageToken.includes(action.payload.allMessagesId.data.nextPageToken)) {
      //   state.emailListEnded = true;
      // } else {
      //   state.emailListEnded = false;
      // }

      if (action.payload.allMessagesId?.data) {
        let payloadToken = action.payload.allMessagesId.data.nextPageToken;
        if (state.nextPageToken?.includes(payloadToken)) {
          console.log("Already Included Or Undefine Token");
        } else {
          state.emails = action.payload.emails;
          state.nextPageToken = [...state.nextPageToken, action.payload.allMessagesId.data.nextPageToken];
        }
      }
    });
    builder.addCase(getEmails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(sendEmail.rejected, (state, action) => {
      state.sendErr = action.error.message;
    });
  },
});

export const { prevPage, removeEmails } = emailSlice.actions;

export default emailSlice.reducer;
