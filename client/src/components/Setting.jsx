"use client";

import Swal from "sweetalert2";
import axios from "axios";
import { BASE_URL } from "../utils/const";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../reducers/userSlice";
import { Lock, AlertTriangle, ArrowLeft } from "lucide-react";

const Setting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal2-custom-font",
        title: "swal2-custom-title",
        confirmButton: "swal2-custom-button",
        cancelButton: "swal2-custom-button",
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${BASE_URL}/user/delete`, {
          withCredentials: true,
        });
        dispatch(removeUser());
        Swal.fire("Deleted!", res.data.message, "success");
        navigate("/");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to delete account.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[whitesmoke] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <span
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center border-b border-gray-200 pb-4 text-black">
            Account Settings
          </h2>

          {/* Change Password Section */}
          <div className="mb-8">
            <div className="flex items-center mb-3 sm:mb-4">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-black mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-black">
                Password Management
              </h3>
            </div>
            <p className="text-sm sm:text-base mb-4 text-gray-600">
              Update your password to keep your account secure
            </p>
            <Link to="/home/change-password">
              <button className="bg-black cursor-pointer text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base">
                Change Password
              </button>
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 pt-6 sm:pt-8">
            <div className="flex items-center mb-3 sm:mb-4">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-2 sm:mr-3" />
              <h3 className="text-lg sm:text-xl font-semibold text-black">
                Danger Zone
              </h3>
            </div>
            <div className="bg-red-50 p-4 sm:p-5 rounded-lg border border-red-200">
              <h4 className="font-medium mb-2 text-black text-base sm:text-lg">
                Delete Account
              </h4>
              <p className="text-sm sm:text-base mb-4 text-gray-600">
                Once you delete your account, there is no going back. This
                action cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                className="bg-red-600 cursor-pointer text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
