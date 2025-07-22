"use client"

import Swal from "sweetalert2"
import axios from "axios"
import { BASE_URL } from "../utils/const" // Assuming BASE_URL is defined elsewhere or passed via context/env
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { removeUser } from "../reducers/userSlice"
import { Lock, AlertTriangle } from "lucide-react" // Import Lucide icons

const Setting = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Standard SweetAlert2 red
      cancelButtonColor: "#3085d6", // Standard SweetAlert2 blue
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal2-custom-font", // Assuming these are defined in your global CSS
        title: "swal2-custom-title",
        confirmButton: "swal2-custom-button",
        cancelButton: "swal2-custom-button",
      },
    })

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${BASE_URL}/user/delete`, {
          withCredentials: true,
        })
        dispatch(removeUser())
        Swal.fire("Deleted!", res.data.message, "success")
        navigate("/")
      } catch (error) {
        console.error(error)
        Swal.fire("Error", "Failed to delete account.", "error")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[whitesmoke] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-200 pb-4 text-black">
            Account Settings
          </h2>

          {/* Change Password Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-black mr-3" /> {/* Replaced emoji with Lucide Lock icon */}
              <h3 className="text-xl font-semibold text-black">Password Management</h3>
            </div>
            <p className="text-sm mb-4 text-gray-600">Update your password to keep your account secure</p>
            <Link to="/home/change-password">
              <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 w-full sm:w-auto">
                Change Password
              </button>
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />{" "}
              {/* Replaced emoji with Lucide AlertTriangle icon */}
              <h3 className="text-xl font-semibold text-black">Danger Zone</h3>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-medium mb-2 text-black">Delete Account</h4>
              <p className="text-sm mb-4 text-gray-600">
                Once you delete your account, there is no going back. This action cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Setting
