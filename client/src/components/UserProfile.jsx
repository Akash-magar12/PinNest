/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { BASE_URL } from "../utils/const"
import toast from "react-hot-toast" // Assuming react-hot-toast is installed
import SavedPins from "./SavedPins" // Will create/modify this
import UserAllPins from "./UserAllPins" // Will create/modify this
import { Edit3, UserPlus, Mail, Users, UserCheck } from "lucide-react"

const UserProfile = () => {
  const { id } = useParams()
  const loggedInUser = useSelector((store) => store.user) // Assuming store.user exists
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("created")
  const isOwnProfile = !id || id === loggedInUser?._id

  // ✅ Fetch profile user data
  const fetchProfile = async () => {
    const endPoint = id ? `${BASE_URL}/user/user-profile/${id}` : `${BASE_URL}/user/me`
    try {
      setLoading(true)
      const response = await axios.get(endPoint, { withCredentials: true })
      setProfileUser(response.data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle Follow/Unfollow
  const handleFollow = async (userId) => {
    console.log("Follow clicked")
    try {
      const response = await axios.post(`${BASE_URL}/user/follow/${userId}`, {}, { withCredentials: true })
      toast.success(response.data.message)
      await fetchProfile() // 🔄 Refresh profile data
    } catch (error) {
      console.error("Follow error:", error.response || error.message)
      toast.error("Failed to follow/unfollow user")
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [id])

  if (loading) {
    // ⏳ Show loading skeleton (unchanged)
    return (
      <div className="min-h-screen bg-[whitesmoke] flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
        {/* You can replace this with a more elaborate skeleton UI */}
      </div>
    )
  }

  // ✅ Determine follow status from current profile data
  const isFollowing = profileUser?.followers?.includes(loggedInUser?._id)

  return (
    <div className="min-h-screen bg-[whitesmoke]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col items-center text-center">
            {/* Profile image and name */}
            <div className="mb-6">
              {profileUser?.profileImage ? (
                <img
                  src={profileUser?.profileImage?.url || "/placeholder.svg?height=128&width=128&query=user profile"}
                  alt={`${profileUser?.name}'s profile`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-100 shadow-sm">
                  <span className="text-white text-3xl font-semibold">
                    {profileUser?.name
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-black mb-3">{profileUser?.name}</h1>
            {profileUser?.bio && <p className="text-gray-700 mb-4 max-w-md">{profileUser?.bio}</p>}
            {profileUser?.email && (
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-8">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{profileUser.email}</span>
              </div>
            )}
            {/* Follower/Following counts */}
            <div className="flex gap-8 mb-8">
              <Link
                to={`/home/relations/${profileUser?._id}/followers`}
                className="text-center hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
              >
                <div className="text-2xl font-bold text-black mb-1">{profileUser?.followers?.length || 0}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Followers
                </div>
              </Link>
              <Link
                to={`/home/relations/${profileUser?._id}/following`}
                className="text-center hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
              >
                <div className="text-2xl font-bold text-black mb-1">{profileUser?.following?.length || 0}</div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <UserCheck className="w-4 h-4" />
                  Following
                </div>
              </Link>
            </div>
            {/* ✅ Follow / Edit Profile button */}
            {isOwnProfile ? (
              <Link to="/home/edit-profile">
                <button className="bg-black cursor-pointer text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => handleFollow(profileUser._id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  isFollowing
                    ? "bg-gray-100 text-black border-2 border-gray-300 hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
        {/* Created/Saved Pins tabs (only for own profile) */}
        {isOwnProfile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
            <div className="flex">
              <button
                onClick={() => setActiveTab("created")}
                className={`flex-1 py-4 px-6 font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === "created" ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Created Pins
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-4 px-6 font-medium cursor-pointer transition-all duration-200 ${
                  activeTab === "saved" ? "bg-black text-white" : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Saved Pins
              </button>
            </div>
          </div>
        )}
        {/* Render Pins */}
        {!isOwnProfile || activeTab === "created" ? (
          <UserAllPins userId={id || loggedInUser?._id} isOwnProfile={isOwnProfile} />
        ) : (
          <SavedPins userId={id || loggedInUser?._id} />
        )}
      </div>
    </div>
  )
}

export default UserProfile
