/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { BASE_URL } from "../utils/const";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFollowersFollowing } from "../reducers/pinSlice";
import toast from "react-hot-toast";
import { ArrowLeft, Users, UserCheck } from "lucide-react";

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
      <div className="max-w-4xl mt-4 mx-auto px-4 py-4 sm:py-6 bg-white">
        {/* Header Skeleton */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-5 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="px-4 py-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=" max-w-4xl mt-4 mx-auto px-4 py-4 sm:py-6 bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 cursor-pointer text-black" />
          </button>
          <div className="flex items-center gap-2">
            {type === "followers" ? (
              <Users className="w-6 h-6 text-black" />
            ) : (
              <UserCheck className="w-6 h-6 text-black" />
            )}
            <h1 className="text-base font-semibold text-black">
              {type === "followers" ? "Followers" : "Following"}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {followingFollowers.length > 0 ? (
          <div className="space-y-0">
            {followingFollowers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user?.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt={user.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user?.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-black truncate block">
                      {user?.name || "Anonymous User"}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Link to={`/home/profile/${user._id}`}>
                    <button className="px-4 py-1.5 cursor-pointer bg-gray-100 text-black rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-xs mx-auto px-8">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  {type === "followers" ? (
                    <Users className="w-10 h-10 text-gray-400" />
                  ) : (
                    <UserCheck className="w-10 h-10 text-gray-400" />
                  )}
                </div>
              </div>
              <h3 className="text-xl font-light text-black mb-2">No {type}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {type === "followers"
                  ? "You'll see all the people who follow you here."
                  : "Once you follow people, you'll see them here."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersFollowing;
