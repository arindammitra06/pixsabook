import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppUser } from "@/model/user.model";
import { baseUrl } from "@/utils/utils";

export type AuthState = {
  readonly loggedIn: boolean;
  readonly currentUser: AppUser | null;
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const AUTH_INITIAL_STATE: AuthState = {
  loggedIn: false,
  currentUser: null,
  isLoading: false,
  error: null,
};

export const getOTP = createAsyncThunk(
  "auth/getOTP",
  async ({ email }: { email: string }) => {
    try {
      const response = await axios.post(baseUrl + `auth/getOTP`, {
        params: {
          email,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async ({ id }: { id: number }) => {
    try {
      const response = await axios.get(baseUrl + `user/fetchUserById/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const resetMyPassword = createAsyncThunk(
  "auth/resetMyPassword",
  async ({ form, secretCode }: { form: any; secretCode: string }) => {
    try {
      const response = await axios.post(baseUrl + `auth/resetMyPassword`, {
        form: form,
        secretCode: secretCode,
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const setCurrentUser = createAsyncThunk(
  "auth/setCurrentUser",
  async ({ user, isLoggedIn }: { user: any; isLoggedIn: boolean }) => {
    console.log(user, isLoggedIn);
    return { user: user, isLoggedIn: isLoggedIn };
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    signOut: () => AUTH_INITIAL_STATE,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
      .addCase(setCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log(action.payload);
        state.currentUser = action.payload.user;
        state.loggedIn = action.payload.isLoggedIn;
      })
      .addCase(setCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.currentUser = null;
        state.loggedIn = false;
      })
      .addCase(getOTP.pending, (state) => {
        state.isLoading = true;
        state.loggedIn = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(getOTP.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.loggedIn = false;
        state.error = action.error.message != null ? action.error.message : "";
      });
  },
});

export const { signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
