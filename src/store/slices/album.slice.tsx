import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppUser } from "@/model/user.model";
import { baseUrl } from "@/utils/utils";
import { Album } from "@/model/album.model";

export type AlbumState = {
  readonly albums: Album[]; // You can replace 'any' with your Album interface
  readonly isLoading: boolean;
  readonly error: string | null;
};

export const ALBUM_INITIAL_STATE: AlbumState = {
  albums: [],
  isLoading: false,
  error: null,
};

export const getAlbumsByUserId = createAsyncThunk(
  "album/getAlbumsByUserId",
  async ({ userId, pageType }: { userId: number, pageType : string }) => {
    try {
      const response = await axios.get(
        baseUrl + `album/getAlbumsByUserId/${userId}/${pageType}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const updateAlbumByField = createAsyncThunk<
  any, // You can replace this with your Album interface
  { albumId: any; fieldname: string ; fieldValue: any ,currentUserId: number},
  { rejectValue: string }
>(
  "album/updateAlbumByField",
  async ({ albumId, fieldname, fieldValue, currentUserId }, { rejectWithValue }) => {
    try {
      
      const response = await axios.post(`${baseUrl}album/updateAlbumByField`, 
        {albumId,
        fieldname,
        fieldValue,
        currentUserId});

      return response.data;
    } catch (error: any) {
      console.error("Album updation failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create album",
      );
    }
  },
);


export const createAlbum = createAsyncThunk<
  any, // You can replace this with your Album interface
  { form: any; photoUrls: string[]; coverUrl: string; backUrl: string },
  { rejectValue: string }
>(
  "album/createAlbum",
  async ({ form, photoUrls, coverUrl, backUrl }, { rejectWithValue }) => {
    try {
      // Send as a proper POST body, not params
      const payload = {
        ...form,
        photoUrls,
        coverUrl,
        backUrl,
      };

      const response = await axios.post(`${baseUrl}album/createAlbum`, payload);

      return response.data;
    } catch (error: any) {
      console.error("Album creation failed:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create album",
      );
    }
  },
);

// ✅ Async thunk to toggle like
export const toggleLikeOptimistic = createAsyncThunk<
  { albumId: number; email: string },
  { albumId: number; email: string }
>("album/toggleLikeOptimistic", async ({ albumId, email }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${baseUrl}album/toggle-like`, {
        albumId,
        email,
      });
    return { albumId, email };
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});


const albumSlice = createSlice({
  name: "album",
  initialState: ALBUM_INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAlbum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
      .addCase(getAlbumsByUserId.pending, (state) => {
        state.isLoading = true;
        state.albums = [];
        state.error = null;
      })
      .addCase(getAlbumsByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.albums = action.payload;
      })
      .addCase(getAlbumsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message != null ? action.error.message : "";
      })
      .addCase(toggleLikeOptimistic.pending, (state, action) => {
        // 🔹 Optimistic toggle
        const { albumId, email } = action.meta.arg;
        const album = state.albums.find((a) => a.id === albumId);
        if (!album) return;
        album.likesByEmail = album.likesByEmail || [];
        if (album.likesByEmail.includes(email)) {
          album.likesByEmail = album.likesByEmail.filter((e) => e !== email);
          album.rating = Math.max(0, (album.rating ?? 1) - 1);
        } else {
          album.likesByEmail.push(email);
          album.rating = (album.rating ?? 0) + 1;
        }
      })
      .addCase(toggleLikeOptimistic.fulfilled, (state, action) => {
        // ✅ Do nothing. Local state already updated.
      })
      .addCase(toggleLikeOptimistic.rejected, (state, action) => {
        // 🔹 Rollback on failure
        const { albumId, email } = action.meta.arg;
        const album = state.albums.find((a) => a.id === albumId);
        if (!album) return;
        album.likesByEmail = album.likesByEmail || [];
        if (album.likesByEmail.includes(email)) {
          album.likesByEmail = album.likesByEmail.filter((e) => e !== email);
          album.rating = Math.max(0, (album.rating ?? 1) - 1);
        } else {
          album.likesByEmail.push(email);
          album.rating = (album.rating ?? 0) + 1;
        }
        state.error = action.payload as string;
      });;
  },
});

export const albumReducer = albumSlice.reducer;
