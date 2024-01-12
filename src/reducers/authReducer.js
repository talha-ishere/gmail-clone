import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getEmails } from "./emailReducer";

const initialState = {
  token: "",
  isLoading: false,
  userProfile: "",
  error: null,
};

export const getUserProfile = createAsyncThunk("users/getUserProfile", async (thunkAPI) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));
    let user = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.localStorage.setItem("userId", JSON.stringify(user.data.email));

    return user.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    saveToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userProfile = action.payload;
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});

export const { saveToken } = authSlice.actions;

export default authSlice.reducer;
