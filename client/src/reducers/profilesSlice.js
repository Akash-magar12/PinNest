import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    setProfileUser: (state, action) => {
      state.profileUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.profileUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setProfileUser, setLoading, setError, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
