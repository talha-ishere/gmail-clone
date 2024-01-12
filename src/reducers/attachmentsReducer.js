import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useDispatch } from "react-redux";

const token = JSON.parse(localStorage.getItem("token"));
const userId = JSON.parse(localStorage.getItem("userId"));

export const getAttachment = createAsyncThunk("users/sendEmail", async (payload, thunkAPI) => {
  try {
    let attachment = await axios.get(
      `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/${payload.messageId}/attachments/${payload.attId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let rec = await attachment.data.data.replace(/-/g, "+").replace(/_/g, "/");
    thunkAPI.dispatch({ type: "GET_ATTACHMENT_SUCCESS", payload: rec });
    // return new Promise((resolve, reject) => {
    //   resolve(rec);
    // });
    return rec;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export const sendAttachment = createAsyncThunk("users/sendAtt", async (payload, thunkAPI) => {
  console.log(payload);
  try {
    const response = await axios.post(
      `https://www.googleapis.com/gmail/v1/users/${userId}/messages/send?uploadType=multipart`,
      {
        raw: payload.raw,
      },
      {
        headers: {
          "Content-Type": "message/rfc822",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Handle the response as needed
    console.log(response.data);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error sending attachment:", error);
    throw error;
  }
});
const initialState = {
  attachment: "",
};
export const attachmentsReducer = createSlice({
  name: "attachments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAttachment.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
    });
    builder.addCase(getAttachment.fulfilled, (state, action) => {
      //   state.isLoading = false;
      state.attachment = action.payload;
    });
    builder.addCase(getAttachment.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.error = action.error.message;
    });
  },
});

// export const {} = attachmentsSlice.actions;

export default attachmentsReducer.reducer;
