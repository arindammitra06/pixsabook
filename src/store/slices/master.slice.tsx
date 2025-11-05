import { baseUrl } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface UploadProgress {
  name: string;
  progress: number; // 0–100
  url?: string;
}

interface MasterState {
  uploads: UploadProgress[];
  fileUploading: boolean;
  uploadedFile?: {
    url: string;
    thumbnailUrl: string;
    fileType: string;
  };
  error?: string | null;
}

const initialState: MasterState = {
  uploads: [],

  fileUploading: false,
};

export const uploadImageToImageKit = createAsyncThunk(
  "master/uploadImageToImageKit",
  async ({ file }: { file: File }, { dispatch, rejectWithValue }) => {
    try {
      // Initialize upload progress for this file
      const uploads: UploadProgress[] = [{ name: file.name, progress: 0 }];
      dispatch(setUploads([...uploads]));

      console.log("Uploading file:", file.name);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        baseUrl + `master/uploadImageToImageKit`,
        formData,
        {
          headers: {
            // Do NOT manually set Content-Type for multipart; Axios handles it
          },
          onUploadProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / (event.total || 1));

            // Create a new uploads array with updated progress
            const updatedUploads = uploads.map((u) =>
              u.name === file.name ? { ...u, progress } : u
            );
            dispatch(setUploads(updatedUploads));
          },
        }
      );

      if (response.data?.status && response.data?.url) {
        const updatedUploads = uploads.map((u) =>
          u.name === file.name ? { ...u, progress: 100 } : u
        );
        dispatch(setUploads(updatedUploads));
        return response.data;
      } else {
        throw new Error("Upload failed for " + file.name);
      }
    } catch (error: any) {
      console.error(error);
      return rejectWithValue(error.message || "Upload error");
    }
  }
);



export const getSubscriptionPlans = createAsyncThunk(
  "master/getSubscriptionPlans",
  async () => {
    try {
      const response = await axios.get(
        baseUrl + `master/getSubscriptionPlans`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

// ✅ Async thunk with progress tracking
export const uploadImagesSequentially = createAsyncThunk<
  UploadProgress[], // return type
  File[], // argument type
  { rejectValue: string }
>(
  "master/uploadSequentially",
  async (files: File[], { dispatch, rejectWithValue }) => {
    let uploads: UploadProgress[] = [];

    try {
      for (const file of files) {
        // Initialize upload entry
        const uploadData: UploadProgress = { name: file.name, progress: 0 };
        uploads = [...uploads, uploadData];
        dispatch(setUploads(uploads));

        // Prepare FormData
        const formData = new FormData();
        formData.append("file", file);

        // Upload
        const response = await axios.post(
          baseUrl + `master/uploadImageToImageKit`,
          formData,
          {
            // Do not manually set Content-Type; Axios handles multipart boundaries
            onUploadProgress: (event) => {
              const progress = Math.round(
                (event.loaded * 100) / (event.total || 1)
              );

              // Update the progress safely by mapping to a new array
              uploads = uploads.map((u) =>
                u.name === file.name ? { ...u, progress } : u
              );
              dispatch(setUploads(uploads));
            },
          }
        );

        if (response.data?.status && response.data?.url) {
          // Mark as complete and store URL
          uploads = uploads.map((u) =>
            u.name === file.name
              ? { ...u, progress: 100, url: response.data.url }
              : u
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
  }
);


const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {
    clearUploads(state) {
      state.uploads = [];
      state.error = null;
    },
    setUploads(state, action: PayloadAction<UploadProgress[]>) {
      state.uploads = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(uploadImageToImageKit.pending, (state) => {
        state.fileUploading = true;
        state.error = undefined;
      })
      .addCase(uploadImageToImageKit.fulfilled, (state, action) => {
        state.fileUploading = false;
        state.uploadedFile = action.payload;
      })
      .addCase(uploadImageToImageKit.rejected, (state, action) => {
        state.fileUploading = false;
        state.error = (action.payload as any)?.message || "Upload failed";
      });
  },
});

export const { clearUploads, setUploads,} =
  masterSlice.actions;
export const masterReducer = masterSlice.reducer;
