import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// root reducer :
const rootReducer = combineReducers({
  user: userReducer, // add your other reducers here if needed.  // userReducer is the reducer for user slice.  // You can find it in user/userSlice.js file.  // This reducer handles user related actions.  // You can add other reducers here as per your application needs.  // This root reducer combines all reducers into one.  // The combineReducers function from reduxjs/toolkit library is used to combine all reducers.  // The configureStore function from reduxjs/toolkit library is used to create a Redux store.  // The middleware argument is used to add extra logic to the Redux store.  // In this case, we are disabling the serializableCheck to allow storing non-serializable actions.  // This is useful when working with async actions, as they can sometimes lead to unexpected behavior.  // The serializableCheck option is enabled by default.  // If you want to ensure that actions are serial
});

// persistConfig:
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Enable to store non-serializable actions
    }),
});

export const persistor = persistStore(store);
