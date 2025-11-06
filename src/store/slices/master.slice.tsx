import { baseUrl } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface UploadProgress {
  name: string;
  progress: number; // 0–100
  url?: string;
}

export interface UploadedFile {
  url: string;
  thumbnailUrl: string;
  fileType: string;
}

interface MasterState {
  uploads: UploadProgress[];
  fileUploading: boolean;
  uploadedFile?: UploadedFile;
  subscriptionPlans: any[]; // you can type it more strictly if you have a plan interface
  error: string | null;
}

const initialState: MasterState = {
  uploads: [],
  fileUploading: false,
  uploadedFile: undefined,
  subscriptionPlans: [],
  error: null,
};

// Single file upload
export const uploadImageToImageKit = createAsyncThunk<
  UploadedFile,
  { file: File },
  { rejectValue: string }
>("master/uploadImageToImageKit", async ({ file }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setUploads([{ name: file.name, progress: 0 }]));

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(baseUrl + "master/uploadImageToImageKit", formData, {
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded * 100) / (event.total || 1));
        dispatch(setUploads([{ name: file.name, progress }]));
      },
    });

    if (response.data?.status && response.data?.url) {
      dispatch(setUploads([{ name: file.name, progress: 100, url: response.data.url }]));
      return {
        url: response.data.url,
        thumbnailUrl: response.data.thumbnailUrl,
        fileType: response.data.fileType,
      };
    }

    throw new Error("Upload failed for " + file.name);
  } catch (error: any) {
    console.error(error);
    return rejectWithValue(error.message || "Upload error");
  }
});

// Multiple files sequential upload
export const uploadImagesSequentially = createAsyncThunk<
  UploadProgress[],
  File[],
  { rejectValue: string }
>("master/uploadImagesSequentially", async (files, { dispatch, rejectWithValue }) => {
  let uploads: UploadProgress[] = [];

  try {
    for (const file of files) {
      const uploadData: UploadProgress = { name: file.name, progress: 0 };
      uploads = [...uploads, uploadData];
      dispatch(setUploads(uploads));

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(baseUrl + "master/uploadImageToImageKit", formData, {
        onUploadProgress: (event) => {
          const progress = Math.round((event.loaded * 100) / (event.total || 1));
          uploads = uploads.map((u) => (u.name === file.name ? { ...u, progress } : u));
          dispatch(setUploads(uploads));
        },
      });

      if (response.data?.status && response.data?.url) {
        uploads = uploads.map((u) =>
          u.name === file.name ? { ...u, progress: 100, url: response.data.url } : u
        );
        dispatch(setUploads(uploads));
      } else {
        throw new Error("Upload failed for " + file.name);
      }
    }

    return uploads;
  } catch (error: any) {
    console.error(error);
    return rejectWithValue(error.message || "Upload failed");
  }
});

// Fetch subscription plans
export const getSubscriptionPlans = createAsyncThunk<
  any[], // return type
  void,              // no arguments
  { rejectValue: string }
>("master/getSubscriptionPlans", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(baseUrl + `master`);
    return response.data; // array of plans
  } catch (error: any) {
    console.error(error);
    return rejectWithValue(error.message || "Failed to fetch subscription plans");
  }
});
const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    clearUploads(state) {
      state.uploads = [];
      state.uploadedFile = undefined;
      state.error = null;
    },
    setUploads(state, action: PayloadAction<UploadProgress[]>) {
      state.uploads = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Single upload
      .addCase(uploadImageToImageKit.pending, (state) => {
        state.fileUploading = true;
        state.error = null;
      })
      .addCase(uploadImageToImageKit.fulfilled, (state, action) => {
        state.fileUploading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(uploadImageToImageKit.rejected, (state, action) => {
        state.fileUploading = false;
        state.error = action.payload || "Upload failed";
      })
      // Multiple uploads
      .addCase(uploadImagesSequentially.pending, (state) => {
        state.fileUploading = true;
        state.error = null;
        state.uploads = [];
      })
      .addCase(uploadImagesSequentially.fulfilled, (state, action) => {
        state.fileUploading = false;
        state.uploads = action.payload;
      })
      .addCase(uploadImagesSequentially.rejected, (state, action) => {
        state.fileUploading = false;
        state.error = action.payload || "Upload failed";
      })
      // Subscription plans
      .addCase(getSubscriptionPlans.pending, (state) => {
        state.error = null;
      })
      .addCase(getSubscriptionPlans.fulfilled, (state, action) => {
        state.subscriptionPlans = action.payload;
      })
      .addCase(getSubscriptionPlans.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch subscription plans";
      });
  },
});

export const { clearUploads, setUploads } = masterSlice.actions;
export const masterReducer = masterSlice.reducer;
