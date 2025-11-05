import { combineReducers } from '@reduxjs/toolkit';
import { userReducer } from './slices/user.slice';
import { authReducer } from './slices/authenticate.slice';
import { themeReducer } from './slices/theme.slice';
import { languageReducer } from './slices/language.slice';
import { masterReducer } from './slices/master.slice';
import { albumReducer } from './slices/album.slice';

const rootReducer = combineReducers({
  // Add your reducers here
  user: userReducer,
  auth: authReducer,
  theme: themeReducer,
  language: languageReducer,
  master: masterReducer,
  album: albumReducer,
});

export default rootReducer;