import React from "react";
import { useSelector } from "react-redux";
import Login from "../AuthPages/Login";
import SignUp from "../AuthPages/Signup";

const AuthLayout = () => {
  const isLogin = useSelector((state) => state.isLogin);
  return <div>{isLogin ? <Login /> : <SignUp />}</div>;
};

export default AuthLayout;
