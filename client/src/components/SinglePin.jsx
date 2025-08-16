/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import {
  Calendar,
  MoreHorizontal,
  Tag,
  ArrowLeft,
  Download,
  Share,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/const";
import { useDispatch, useSelector } from "react-redux";
import { setSinglePin } from "../reducers/pinSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser } from "../reducers/userSlice";

const SinglePin = () => {
  const { singlePin } = useSelector((store) => store.pin);
  const user = useSelector((store) => store.user);
  const [isSaved, setIsSaved] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const fetchAllPins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pin/single-pin/${id}`, {
        withCredentials: true,
      });
      dispatch(setSinglePin(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (comment) => {
    if (!comment.trim()) return;
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/pin/comment/${id}`,
        { comment },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      fetchAllPins();
      setInput("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/pin/comment/${commentId}`,
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message);
      fetchAllPins();
      setInput("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/pin/save/${id}`,
        {},
        {
          withCredentials: true,
        }
      );
      setIsSaved((prev) => !prev);
      let updatedPins = [...user.savedPins];

      if (isSaved) {
        updatedPins = updatedPins.filter((pid) => pid !== id);
      } else {
        updatedPins.push(id);
      }

      dispatch(addUser({ ...user, savedPins: updatedPins }));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchAllPins();
  }, []);

  useEffect(() => {
    if (user && singlePin?._id) {
      const saved = user?.savedPins?.includes(singlePin._id);
      setIsSaved(saved);
    }
  }, [user, singlePin]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <span
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 cursor-pointer  rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Image Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="sticky top-20 sm:top-24">
              <div className="relative group">
                <img
                  src={singlePin?.image?.url || "/placeholder.svg"}
                  alt={singlePin?.title}
                  className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-cover rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />

                {/* Category Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-black/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    <Tag className="w-3 h-3" />
                    {singlePin?.category}
                  </span>
                </div>

                {/* Action Buttons Overlay - Mobile */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 flex gap-2 lg:hidden">
                  <button
                    onClick={() => handleTogglePin(singlePin?._id)}
                    className={`px-4 py-2 text-white cursor-pointer font-semibold rounded-full text-sm transition-colors duration-200 ${
                      isSaved
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Action Buttons - Desktop */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleTogglePin(singlePin?._id)}
                className={`flex-1 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 ${
                  isSaved
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSaved ? "Unsaved" : "Save"}
              </button>
              {user?.name !== singlePin?.createdBy?.name && (
                <Link
                  to={`/home/profile/${singlePin?.createdBy?._id}`}
                  className="flex-1"
                >
                  <button className="w-full bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-200">
                    View Profile
                  </button>
                </Link>
              )}
            </div>

            {/* Pin Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                  {singlePin?.title}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                  {singlePin?.description}
                </p>
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-3 py-4 border-b border-gray-100">
                <img
                  src={
                    singlePin?.createdBy?.profileImage?.url ||
                    "/placeholder.svg"
                  }
                  alt={singlePin?.createdBy?.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 capitalize truncate">
                    {singlePin?.createdBy?.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {new Date(singlePin?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
                {user?.name !== singlePin?.createdBy?.name && (
                  <Link
                    to={`/home/profile/${singlePin?.createdBy?._id}`}
                    className="lg:hidden"
                  >
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-full text-sm transition-colors duration-200">
                      View
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Comments{" "}
                {singlePin?.comments?.length > 0 && (
                  <span className="text-gray-500 font-normal">
                    ({singlePin.comments.length})
                  </span>
                )}
              </h3>

              {/* Add Comment Form */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-xs sm:text-sm font-medium">
                      You
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all text-sm"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && input.trim() && !loading) {
                            handleComment(input);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(input)}
                        disabled={!input.trim() || loading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2.5 cursor-pointer rounded-full text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {loading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {singlePin?.comments?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                ) : (
                  singlePin?.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <img
                        src={
                          comment?.user?.profileImage?.url || "/placeholder.svg"
                        }
                        alt={comment?.user?.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3">
                          <Link to={`/home/profile/${comment?.user?._id}`}>
                            <h4 className="font-semibold cursor-pointer text-gray-900 text-sm capitalize mb-1">
                              {comment?.user?.name}
                            </h4>
                          </Link>
                          <p className="text-gray-700 text-sm leading-relaxed break-words">
                            {comment?.comment}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 ml-2 sm:ml-4">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                              Like
                            </button>
                            <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                              Reply
                            </button>
                            <span className="text-xs text-gray-400">
                              {new Date(
                                comment?.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          {(user?._id === comment?.user?._id ||
                            user?._id === singlePin?.createdBy?._id) && (
                            <button
                              onClick={() => deleteComment(comment?._id)}
                              className="text-xs text-red-500 cursor-pointer hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePin;
