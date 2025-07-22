import { createSlice } from "@reduxjs/toolkit";

const isLoginSlice = createSlice({
  name: "isLogin",
  initialState: true,
  reducers: {
    signedUp: () => false,
    loggedIn: () => true,
  },
});
export const { signedUp, loggedIn } = isLoginSlice.actions;
export default isLoginSlice.reducer;
