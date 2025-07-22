/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { BASE_URL } from "../utils/const"; // Assuming BASE_URL is defined elsewhere or passed via context/env
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFollowersFollowing } from "../reducers/pinSlice";
import toast from "react-hot-toast";
import { ArrowLeft, Users, UserCheck, Eye } from "lucide-react";

const FollowersFollowing = () => {
  const { id, type } = useParams();

  const { followingFollowers } = useSelector((store) => store.pin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchFollowersFollowing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/${id}/${type}`, {
        withCredentials: true,
      });
      dispatch(setFollowersFollowing(response.data.data));
    } catch (error) {
      console.error("Error fetching:", error);
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowersFollowing();
  }, [id, type]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[whitesmoke] p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          {/* List Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[whitesmoke] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </button>
          <div className="flex items-center gap-3">
            {type === "followers" ? (
              <Users className="w-7 h-7 text-black" />
            ) : (
              <UserCheck className="w-7 h-7 text-black" />
            )}
            <h1 className="text-3xl font-bold text-black capitalize">
              {type === "followers" ? "Followers" : "Following"}
            </h1>
          </div>
        </div>
        {/* Users List */}
        {followingFollowers.length > 0 ? (
          <div className="space-y-4">
            {followingFollowers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Profile Image */}
                    {user?.profileImage?.url ? (
                      <img
                        src={
                          user.profileImage.url ||
                          "/placeholder.svg?height=48&width=48"
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-zinc-800 text-sm font-semibold">
                          {user?.name
                            ?.split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </span>
                      </div>
                    )}
                    {/* User Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        {user?.name || "Anonymous User"}
                      </h3>
                      {user?.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                    </div>
                  </div>
                  {/* View Profile Button */}
                  <Link to={`/home/profile/${user._id}`}>
                    <button className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="flex flex-col items-center gap-4">
                {type === "followers" ? (
                  <Users className="w-16 h-16 text-gray-400" />
                ) : (
                  <UserCheck className="w-16 h-16 text-gray-400" />
                )}
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    No {type} yet
                  </h3>
                  <p className="text-gray-600">
                    {type === "followers"
                      ? "This user doesn't have any followers yet."
                      : "This user isn't following anyone yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Count Info */}
        {followingFollowers.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Showing {followingFollowers.length}{" "}
              {type === "followers" ? "followers" : "following"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersFollowing;
