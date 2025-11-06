import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/utils/utils";
import { AppUser } from "@/model/user.model";

export type UserState = {
  loginStatus: boolean;
  currentUser: AppUser | null;
  isLoading: boolean;
  error: string | null;
  searchUser: AppUser[];
};

export const USER_INITIAL_STATE: UserState = {
  loginStatus: false,
  currentUser: null,
  isLoading: false,
  error: null,
  searchUser: [],
};

// ✅ Fetch user dropdown for search
export const fetchUserDropdownForSearch = createAsyncThunk<
  AppUser[],
  { partialString: string },
  { rejectValue: string }
>("user/fetchUserDropdownForSearch", async ({ partialString }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}user`, {
      action: "fetchUserDropdownForSearch",
      partialString,
    });
    return response.data.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
  }
});

// ✅ Add or update editor
export const addUpdateEditor = createAsyncThunk<
  AppUser,
  { form?: any; phone?: string; selectedPlan: number; currentUserId: number; id?: number },
  { rejectValue: string }
>("user/addUpdateEditor", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}user`, { ...payload, action: "addUpdateEditor" });
    return response.data;
  } catch (err: any) {
    console.error("User updation failed:", err);
    return rejectWithValue(err.response?.data?.message || "Failed to update user");
  }
});






// ✅ Deactivate user
export const deactivateUser = createAsyncThunk<
  any,
  { id: number; campusId: number; currentUserId: number },
  { rejectValue: string }
>("user/deactivateUser", async ({ id, campusId, currentUserId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}user/deactivateUser/${id}/${campusId}/${currentUserId}`);
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to deactivate user");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // add/update editor
      .addCase(addUpdateEditor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUpdateEditor.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addUpdateEditor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })

      

      // fetch user dropdown
      .addCase(fetchUserDropdownForSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.searchUser = [];
      })
      .addCase(fetchUserDropdownForSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchUser = action.payload;
      })
      .addCase(fetchUserDropdownForSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.searchUser = [];
        state.error = action.payload || "";
      })

      // deactivate user
      .addCase(deactivateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deactivateUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      });
  },
});

export const userReducer = userSlice.reducer;
