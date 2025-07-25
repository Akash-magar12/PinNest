/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/const";
import toast from "react-hot-toast";
import SavedPins from "./SavedPins";
import UserAllPins from "./UserAllPins";
import {
  Edit3,
  UserPlus,
  Mail,
  Users,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loggedInUser = useSelector((store) => store.user);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");
  const isOwnProfile = !id || id === loggedInUser?._id;

  const fetchProfile = async () => {
    const endPoint = id
      ? `${BASE_URL}/user/user-profile/${id}`
      : `${BASE_URL}/user/me`;
    try {
      setLoading(true);
      const response = await axios.get(endPoint, { withCredentials: true });
      setProfileUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      toast.success(response.data.message);
      await fetchProfile();
    } catch (error) {
      console.error("Follow error:", error.response || error.message);
      toast.error("Failed to follow/unfollow user");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[whitesmoke] flex items-center justify-center">
        <p className="text-gray-500 text-sm sm:text-base">Loading profile...</p>
      </div>
    );
  }

  const isFollowing = profileUser?.followers?.includes(loggedInUser?._id);

  return (
    <div className="min-h-screen bg-[whitesmoke]">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <span
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 sm:mb-6">
              {profileUser?.profileImage ? (
                <img
                  src={profileUser?.profileImage?.url || "/placeholder.svg"}
                  alt={`${profileUser?.name}'s profile`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-100 shadow-sm">
                  <span className="text-white text-2xl sm:text-3xl font-semibold">
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

            <h1 className="text-2xl sm:text-3xl capitalize font-bold text-black mb-2 sm:mb-3">
              {profileUser?.name}
            </h1>

            {profileUser?.bio && (
              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 max-w-md">
                {profileUser?.bio}
              </p>
            )}

            {profileUser?.email && (
              <div className="flex items-center justify-center gap-2 text-gray-600 text-xs sm:text-sm mb-6">
                <Mail className="w-4 h-4" />
                <span>{profileUser.email}</span>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <Link
                to={`/home/relations/${profileUser?._id}/followers`}
                className="text-center"
              >
                <div className="text-lg sm:text-2xl font-bold text-black">
                  {profileUser?.followers?.length || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1 justify-center">
                  <Users className="w-4 h-4" />
                  Followers
                </div>
              </Link>
              <Link
                to={`/home/relations/${profileUser?._id}/following`}
                className="text-center"
              >
                <div className="text-lg sm:text-2xl font-bold text-black">
                  {profileUser?.following?.length || 0}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1 justify-center">
                  <UserCheck className="w-4 h-4" />
                  Following
                </div>
              </Link>
            </div>

            {isOwnProfile ? (
              <Link to="/home/edit-profile">
                <button className="bg-black cursor-pointer text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => handleFollow(profileUser._id)}
                className={`px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-medium flex items-center gap-2 ${
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

        {isOwnProfile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 sm:mb-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => setActiveTab("created")}
                className={`flex-1 py-3 sm:py-4 px-4 cursor-pointer sm:px-6 font-medium ${
                  activeTab === "created"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Created Pins
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex-1 py-3 sm:py-4 px-4 cursor-pointer sm:px-6 font-medium ${
                  activeTab === "saved"
                    ? "bg-black text-white"
                    : "text-gray-600 hover:text-black hover:bg-gray-50"
                }`}
              >
                Saved Pins
              </button>
            </div>
          </div>
        )}

        {!isOwnProfile || activeTab === "created" ? (
          <UserAllPins
            userId={id || loggedInUser?._id}
            isOwnProfile={isOwnProfile}
          />
        ) : (
          <SavedPins userId={id || loggedInUser?._id} />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
