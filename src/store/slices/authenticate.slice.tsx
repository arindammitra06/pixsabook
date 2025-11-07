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
      const response = await axios.post(baseUrl + `auth`, {
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

// ✅ Update user by field
export const updateUserByField = createAsyncThunk<
  any,
  { id: number; fieldname: string; fieldValue: any; currentUserId: number },
  { rejectValue: string }
>("user/updateUserByField", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}user`, {
      ...payload,
      action: "updateUserByField",
    });
    return response.data;
  } catch (err: any) {
    console.error("User updation failed:", err);
    return rejectWithValue(
      err.response?.data?.message || "Failed to update user",
    );
  }
});

// ✅ Fetch user by ID
export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(baseUrl + `user/fetchUserById`, {
        id,
        action: "fetchUserById",
      });
      return response.data;
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message || "Failed to fetch user");
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
      // update user by field
      .addCase(updateUserByField.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserByField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.data.updatedUser;
      })
      .addCase(updateUserByField.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
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
