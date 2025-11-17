import { baseUrl } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export interface UploadProgress {
  name: string;
  progress: number; // 0–100
  url?: string;
}

export interface UploadedFile {
  status: boolean,
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
>(
  "master/uploadImageToImageKit",
  async ({ file }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setUploads([{ name: file.name, progress: 0 }]));

      // 1. Get signature
      const sigRes = await fetch("/api/imagekit-auth");
      const { signature, expire, token } = await sigRes.json();
      
      // 2. Upload using v6 SDK
      const uploaded = (await imagekit.upload({
          file: file as any,
          fileName: file.name,
          signature,
          expire,
          token,
          folder: "/pixsabook",
        } as any)) as any;
        dispatch(
          setUploads([{ name: file.name, progress: 100, url: uploaded.url }]),
        );

        const result: UploadedFile = {
          status: uploaded.url!==null && uploaded.url!==undefined ? true : false,
          url: uploaded.url,
          thumbnailUrl: (uploaded.thumbnailUrl ??
            uploaded.thumbnail ??
            uploaded.url) as string,
          fileType: (uploaded.fileType ?? file.type ?? "") as string,
        };
        return result;


    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Multiple files sequential upload
export const uploadImagesSequentially = createAsyncThunk<
  UploadProgress[],
  File[],
  { rejectValue: string }
>(
  "master/uploadImagesSequentially",
  async (files, { dispatch, rejectWithValue }) => {
    let uploads: UploadProgress[] = [];

    try {
      for (const file of files) {
        uploads.push({ name: file.name, progress: 0 });
        dispatch(setUploads([...uploads]));

        // Get signature
        const sigRes = await fetch("/api/imagekit-auth");
        const { signature, expire, token } = await sigRes.json();

        // Upload
        const uploaded = (await imagekit.upload({
          file: file as any,
          fileName: file.name,
          signature,
          expire,
          token,
          folder: "/pixsabook",
        } as any)) as any;

        uploads = uploads.map((u) =>
          u.name === file.name ? { ...u, progress: 100, url: uploaded.url } : u,
        );
        dispatch(setUploads([...uploads]));
      }

      return uploads;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

// Fetch subscription plans
export const getSubscriptionPlans = createAsyncThunk<
  any[], // return type
  void, // no arguments
  { rejectValue: string }
>("master/getSubscriptionPlans", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(baseUrl + `master`);
    return response.data; // array of plans
  } catch (error: any) {
    console.error(error);
    return rejectWithValue(
      error.message || "Failed to fetch subscription plans",
    );
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
       // state.error = action.payload || "Upload failed";
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
