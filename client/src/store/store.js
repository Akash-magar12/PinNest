import { configureStore } from "@reduxjs/toolkit";
import isLoginSlice from "../reducers/islogin";
import userSlice from "../reducers/userSlice";
import PinSlice from "../reducers/pinSlice";
const store = configureStore({
  reducer: {
    isLogin: isLoginSlice,
    user: userSlice,
    pin: PinSlice,
  },
});

export default store;
