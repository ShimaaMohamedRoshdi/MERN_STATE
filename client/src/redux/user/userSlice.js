import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

// create slice:
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // sign in start:
    signInStart: (state) => {
      state.loading = true;
    },

    // sign in success:
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    // sign in failure:
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // update start:
    updateUserStart: (state) => {
      state.loading = true;
    },
    // update success:
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    // update failure:
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // delete start:
    deleteUserStart: (state) => {
      state.loading = true;
    },
    // delete success:
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // delete failure:
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // sign out start:
    signOutUserStart: (state) => {
      state.loading = true;
    },
    // sign out success:
    signOutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // sign out failure:
    signOutUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;

export default userSlice.reducer;
