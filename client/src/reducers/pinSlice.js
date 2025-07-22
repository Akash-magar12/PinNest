// reducers/pinSlice.js
import { createSlice } from "@reduxjs/toolkit";

const pinSlice = createSlice({
  name: "pins",
  initialState: {
    feeds: [],
    allPins: [],
    singlePin: null,
    userAllPins: [],
    followingFollowers: [],
    savedPins: [],
  },
  reducers: {
    addFeedPins: (state, action) => {
      state.feeds = action.payload;
    },
    setAllPins: (state, action) => {
      state.allPins = action.payload;
    },
    setSinglePin: (state, action) => {
      state.singlePin = action.payload;
    },
    clearSinglePin: (state) => {
      state.singlePin = null;
    },
    setUserAllPins: (state, action) => {
      state.userAllPins = action.payload;
    },
    setFollowersFollowing: (state, action) => {
      state.followingFollowers = action.payload;
    },
    setSavedPins: (state, action) => {
      state.savedPins = action.payload;
    },
    removeSavedPin: (state, action) => {
      state.savedPins = state.savedPins.filter(
        (pin) => pin._id !== action.payload
      );
    },
  },
});

export const {
  removeSavedPin,
  addFeedPins,
  setSinglePin,
  clearSinglePin,
  setUserAllPins,
  setFollowersFollowing,
  setAllPins,
  setSavedPins,
} = pinSlice.actions;
export default pinSlice.reducer;
