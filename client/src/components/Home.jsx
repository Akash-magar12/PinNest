/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../reducers/userSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/const";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";

const Home = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (user) return;
    try {
      const response = await axios.get(`${BASE_URL}/user/me`, {
        withCredentials: true,
      });
      dispatch(addUser(response.data));
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Home;
