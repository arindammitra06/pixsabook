import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Album } from "@/model/album.model";
import { baseUrl } from "@/utils/utils";

export type AlbumState = {
  albums: Album[];
  isLoading: boolean;
  error: string | null;
};

export const ALBUM_INITIAL_STATE: AlbumState = {
  albums: [],
  isLoading: false,
  error: null,
};

// GET albums by userId
export const getAlbumsByUserId = createAsyncThunk<
  Album[],
  { userId: number; pageType: string },
  { rejectValue: string }
>("album/getAlbumsByUserId", async ({ userId, pageType }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}album`, {
      params: { method: "getAlbumsByUserId", userId, pageType },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to fetch albums");
  }
});

// GET album by id
export const getAlbumById = createAsyncThunk<
  Album,
  { id: number },
  { rejectValue: string }
>("album/getAlbumById", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${baseUrl}album`, {
      params: { method: "getAlbumById", id },
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to fetch album");
  }
});

// CREATE or UPDATE album
export const createOrUpdateAlbum = createAsyncThunk<
  any,
  {
    id?: number;
    form: any;
    photoUrls: string[];
    coverUrl: string;
    backUrl: string;
    creatorEmail?: string;
    clientEmail?: string;
    inviteeList?: string[];
  },
  { rejectValue: string }
>("album/createOrUpdateAlbum", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}album`, {
      ...payload,
      method: "createAlbum",
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to create/update album");
  }
});

// UPDATE album field (like isPublished or viewers)
export const updateAlbumByField = createAsyncThunk<
  any,
  { albumId: number; fieldname: string; fieldValue: any; currentUserId: number },
  { rejectValue: string }
>("album/updateAlbumByField", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}album`, {
      ...payload,
      method: "updateAlbumByField",
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to update album");
  }
});

// TOGGLE like on album
export const toggleLike = createAsyncThunk<
  any,
  { albumId: number; email: string },
  { rejectValue: string }
>("album/toggleLike", async (payload, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${baseUrl}album`, {
      ...payload,
      method: "toggleLike",
    });
    return response.data;
  } catch (err: any) {
    console.error(err);
    return rejectWithValue(err.response?.data?.message || "Failed to toggle like");
  }
});

const albumSlice = createSlice({
  name: "album",
  initialState: ALBUM_INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAlbumsByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlbumsByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.albums = action.payload;
      })
      .addCase(getAlbumsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(getAlbumById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAlbumById.fulfilled, (state, action) => {
        state.isLoading = false;
        const album = action.payload;
        if (album) {
          const index = state.albums.findIndex((a) => a.id === album.id);
          if (index >= 0) state.albums[index] = album;
          else state.albums.push(album);
        }
      })
      .addCase(getAlbumById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(createOrUpdateAlbum.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrUpdateAlbum.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrUpdateAlbum.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(updateAlbumByField.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAlbumByField.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateAlbumByField.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "";
      })
      .addCase(toggleLike.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { albumId, liked, likesByEmail } = action.payload;
        const album = state.albums.find((a) => a.id === albumId);
        if (album) {
          album.likesByEmail = likesByEmail;
          album.rating = likesByEmail.length;
        }
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.error = action.payload || "";
      });
  },
});

export const albumReducer = albumSlice.reducer;
