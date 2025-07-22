import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: null, // no user logged in initially
  reducers: {
    addUser: (state, action) => {
      return action.payload; // sets the user
    },
    removeUser: () => null, // clears the user
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
