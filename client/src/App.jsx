import { Provider } from "react-redux";
import store from "./store/store";
import AuthLayout from "./Pages/AuthLayout";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import CreatePin from "./components/CreatePin";
import MansoryGallery from "./components/MansoryGallery";
import SinglePin from "./components/SinglePin.jsx";
import FollowersFollowing from "./components/FollowersFollowing.jsx";
import UserProfile from "./components/UserProfile.jsx";
import EditProfile from "./components/EditProfile.jsx";
import Explore from "./components/Explore.jsx";
import Setting from "./components/Setting.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import ResetPassword from "./AuthPages/ResetPassword.jsx";
import ForgotPassword from "./AuthPages/ForgotPassword.jsx";
import ForgotPasswordOtp from "./AuthPages/ForgotPasswordOtp.jsx";
import VerifyOtp from "./AuthPages/VerifyOtp.jsx";
import ResetPasswordOtp from "./AuthPages/ResetPasswordOtp.jsx";
import SearchResults from "./components/SearchResults.jsx";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
    },
    {
      path: "forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "reset-password/:token",
      element: <ResetPassword />,
    },
    { path: "/forgot-password/otp", element: <ForgotPasswordOtp /> },
    { path: "/verify-password/otp", element: <VerifyOtp /> },
    { path: "/reset-password/otp/:token", element: <ResetPasswordOtp /> },

    {
      path: "/home",
      element: <Home />,
      children: [
        {
          index: true,
          element: <MansoryGallery />,
        },

        {
          path: "profile/:id?",
          element: <UserProfile />,
        },

        {
          path: "create",
          element: <CreatePin />,
        },
        {
          path: "single/:id",
          element: <SinglePin />,
        },
        {
          path: "relations/:id/:type",
          element: <FollowersFollowing />,
        },
        {
          path: "edit-profile",
          element: <EditProfile />,
        },
        {
          path: "explore",
          element: <Explore />,
        },
        {
          path: "setting",
          element: <Setting />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
        },
        {
          path: "search",
          element: <SearchResults />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />
    </Provider>
  );
};

export default App;
