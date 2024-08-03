import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appSettingsSlice from "./appSettingsSlice";
import apiStatus from "./apiStatusSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appModeSlice from "./appModeSlice";
import userMeSlice from "./userMeSlice";
import localPostsSlice from "./localPostsSlice";


const rootReducer = combineReducers({
  appSettings: appSettingsSlice,
  apiStatus: apiStatus,
  appMode: appModeSlice,
  userMe: userMeSlice,
  localPosts: localPostsSlice
});
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['appSettings', 'userMe', 'localPosts']

};
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store);
export default store;

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']


