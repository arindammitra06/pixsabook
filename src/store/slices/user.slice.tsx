import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "@/utils/utils";
import { AppUser } from "@/model/user.model";


  export type UserState = {
    readonly loginStatus: boolean;
    readonly currentUser: AppUser | null;
    readonly isLoading: boolean;
    readonly error: string | null;
    readonly searchUser: AppUser[] | [];
  };

  export const USER_INITIAL_STATE : UserState = {
    loginStatus: false,
    currentUser: null,
    isLoading: false,
    error: null,
    searchUser:[]
  };
    

   export const fetchUserDropdownForSearch = createAsyncThunk(
    "user/fetchUserDropdownForSearch", 
    async ({ partialString}: { partialString: string}) => {
      try {
        const response = await axios({
          method: 'post',
          url:  baseUrl+`user/fetchUserDropdownForSearch`,
          data: {
            'partialString': partialString,
          },
      });;
        return response.data;
      } catch (error) {
        console.error(error);
      }
  });


  
  


  export const addUpdateEditor = createAsyncThunk<
  any, // You can replace this with your Album interface
  { form?: any , phone?: string, selectedPlan: number | null, currentUserId: number, id?: number},
  { rejectValue: string }
>(
  "user/addUpdateEditor",
  async ({ form,phone, selectedPlan, currentUserId, id }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${baseUrl}user/addUpdateEditor`, 
        {form,
        phone,  
        id,
        selectedPlan,
        currentUserId});

      return response.data;
    } catch (error: any) {
      console.error("User updation failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update User",
      );
    }
  },
);

  export const updateUserByField = createAsyncThunk<
  any, // You can replace this with your Album interface
  { id: any; fieldname: string ; fieldValue: any ,currentUserId: number},
  { rejectValue: string }
>(
  "user/updateUserByField",
  async ({ id, fieldname, fieldValue, currentUserId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${baseUrl}user/updateUserByField`, 
        {id,
        fieldname,
        fieldValue,
        currentUserId});

      return response.data;
    } catch (error: any) {
      console.error("User updation failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update User",
      );
    }
  },
);


  export const deactivateUser = createAsyncThunk(
    "user/deactivateUser", 
    async ({id, campusId, currentUserId }: { id: number, campusId: number , currentUserId: number}) => {
      try {
        const response = await axios.get(
          baseUrl+`user/deactivateUser/${id}/${campusId}/${currentUserId}`
        );
        return response.data;
      } catch (error) {
        console.error(error);
      }
  });

const userSlice = createSlice({
  name: "user",
  initialState: USER_INITIAL_STATE,
  reducers: {
      
    },
  extraReducers: (builder) => {
      builder
        
        
        .addCase(addUpdateEditor.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(addUpdateEditor.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(addUpdateEditor.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message != null ? action.error.message : "";
        })
        .addCase(deactivateUser.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(deactivateUser.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(deactivateUser.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message != null ? action.error.message : "";
        })
        .addCase(updateUserByField.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(updateUserByField.fulfilled, (state, action) => {
          state.isLoading = false;
          if(action.payload.data.updatedUser){
            state.currentUser = action.payload.data.updatedUser;
          }
        })
        .addCase(updateUserByField.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message != null ? action.error.message : "";
        })
        .addCase(fetchUserDropdownForSearch.pending, (state) => {
          state.isLoading = true;
          state.error = null;
          state.searchUser = [];
        })
        .addCase(fetchUserDropdownForSearch.fulfilled, (state, action) => {
          state.isLoading = false;
          state.searchUser = action.payload.data;
        })
        .addCase(fetchUserDropdownForSearch.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message != null ? action.error.message : "";
          state.searchUser = [];
        })
      },
});



export const userReducer = userSlice.reducer;
