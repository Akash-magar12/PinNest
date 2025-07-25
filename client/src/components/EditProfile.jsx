"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { BASE_URL } from "../utils/const"
import toast from "react-hot-toast"
import { addUser } from "../reducers/userSlice"
import { Camera, User, FileText, Save, X } from "lucide-react"

const EditProfile = () => {
  const user = useSelector((store) => store.user)
  const [file, setFile] = useState(null)
  const [data, setData] = useState({
    name: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("bio", data.bio)
      if (file) formData.append("profileImage", file)

      const res = await axios.put(`${BASE_URL}/user/edit-profile/`, formData, {
        withCredentials: true,
      })

      toast.success(res.data.message)
      dispatch(addUser(res.data.user))
      setTimeout(() => navigate("/home/profile"), 1000)
    } catch (error) {
      console.error("❌ Error:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate("/home/profile")
  }

  return (
    <div className="min-h-screen bg-[whitesmoke] py-6 px-4 sm:py-8 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">Edit Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">Update your profile information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6 sm:space-y-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="relative">
                  {file || user?.profileImage?.url ? (
                    <img
                      className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-full border-4 border-gray-200 shadow-sm"
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : user?.profileImage?.url || "/placeholder.svg?height=128&width=128"
                      }
                      alt="Profile Preview"
                    />
                  ) : (
                    <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200 shadow-sm">
                      <span className="text-zinc-800 text-lg sm:text-2xl font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="profile-image"
                />
                <label
                  htmlFor="profile-image"
                  className="bg-gray-100 text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Change Photo
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={data.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all duration-200"
                ></textarea>
                <p className="text-sm text-gray-500 mt-1">{data.bio.length}/200 characters</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-2 sm:py-3 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2 sm:py-3 cursor-pointer bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">Your profile information will be visible to other users</p>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
