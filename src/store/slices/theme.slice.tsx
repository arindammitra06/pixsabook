import { defaultLight } from "@/utils/customThemes";
import { baseUrl } from "@/utils/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export type ThemeState = {
  readonly theme: any;
  readonly colorScheme: any;
  readonly temptheme: any | null;
  readonly themeLoading: boolean;
  readonly imageQuality?: string;
};

export const THEME_INITIAL_STATE: ThemeState = {
  theme: defaultLight.theme,
  colorScheme: 'dark',
  themeLoading: false,
  temptheme: null,
  imageQuality: "high",
};

export const getAllThemes = createAsyncThunk(
  "theme/getAllThemes",
  async ({ campusId, userId }: { campusId: number; userId: number }) => {
    try {
      const response = await axios.get(
        baseUrl + `master/getAllThemes/${campusId}/${userId}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const saveATheme = createAsyncThunk(
  "theme/saveATheme",
  async ({
    form,
    userId,
    campusId,
  }: {
    form: any;
    userId: number;
    campusId: number;
  }) => {
    try {
      const response = await axios({
        method: "post",
        url: baseUrl + `master/saveATheme`,
        data: { form: form, campusId: campusId, userId: userId },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const setImageQuality = createAsyncThunk(
  "theme/setImageQuality",
  async ({ quality }: { quality: string }) => {
    return { quality: quality };
  },
);

export const setColorSchemeLocal = createAsyncThunk(
  "theme/setColorSchemeLocal",
  async ({ colorScheme }: { colorScheme: string }) => {
    return { colorScheme: colorScheme };
  },
);

export const setCurrentTheme = createAsyncThunk(
  "theme/setCurrentTheme",
  async ({ theme, colorScheme }: { theme: any; colorScheme: string }) => {
    return { theme: theme, colorScheme: colorScheme };
  },
);

export const setTemporaryCurrentTheme = createAsyncThunk(
  "theme/setTemporaryCurrentTheme",
  async ({ theme, colorScheme }: { theme: any; colorScheme: string }) => {
    return { theme: theme, colorScheme: colorScheme };
  },
);

export const revertToOriginalTheme = createAsyncThunk(
  "theme/revertToOriginalTheme",
  async ({ doRevert }: { doRevert: boolean }) => {
    return doRevert;
  },
);

export const updateInstituteDefaultTheme = createAsyncThunk(
  "theme/updateInstituteDefaultTheme",
  async ({
    themeId,
    currentUserId,
  }: {
    themeId: number;
    currentUserId: number;
  }) => {
    try {
      const response = await axios({
        method: "post",
        url: baseUrl + `user/updateInstituteDefaultTheme`,
        data: {
          themeId: themeId,
          currentUserId: currentUserId,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

const themeSlice = createSlice({
  name: "theme",
  initialState: THEME_INITIAL_STATE,
  reducers: {
    getCurrentTheme(state: any, action: any) {
      const currentTheme = state.theme;

      return currentTheme;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setCurrentTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(setCurrentTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        state.theme = action.payload.theme;
        state.colorScheme = action.payload.colorScheme;
      })
      .addCase(setCurrentTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = defaultLight.theme;
        state.colorScheme = defaultLight.colorScheme;
      })
      .addCase(setColorSchemeLocal.fulfilled, (state, action) => {
        state.colorScheme = action.payload.colorScheme;
      })
      .addCase(setImageQuality.fulfilled, (state, action) => {
        state.imageQuality = action.payload.quality;
      })
      .addCase(setTemporaryCurrentTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(setTemporaryCurrentTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        const deepCopyOldTheme: any = Object.assign({}, state.theme);
        state.temptheme = deepCopyOldTheme;
        state.theme = action.payload.theme;
        state.colorScheme = action.payload.colorScheme;
      })
      .addCase(setTemporaryCurrentTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = defaultLight.theme;
        state.colorScheme = defaultLight.colorScheme;
      })
      .addCase(revertToOriginalTheme.pending, (state) => {
        state.themeLoading = true;
      })
      .addCase(revertToOriginalTheme.fulfilled, (state, action) => {
        state.themeLoading = false;
        state.theme = state.temptheme as any;
      })
      .addCase(revertToOriginalTheme.rejected, (state, action) => {
        state.themeLoading = false;
        state.theme = defaultLight.theme;
      });
  },
});

export const { getCurrentTheme } = themeSlice.actions;

export const themeReducer = themeSlice.reducer;
