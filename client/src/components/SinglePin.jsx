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
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addUser } from "../reducers/userSlice";

const SinglePin = () => {
  const { singlePin } = useSelector((store) => store.pin);
  const user = useSelector((store) => store.user);
  const [isSaved, setIsSaved] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // 🔄 New loading state

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
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/home"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="relative group">
                <img
                  src={singlePin?.image?.url || "/placeholder.svg"}
                  alt={singlePin?.title}
                  className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                />

                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    <Tag className="w-3 h-3" />
                    {singlePin?.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2 space-y-6">
            <div>
              <button
                onClick={() => handleTogglePin(singlePin?._id)}
                className={`flex-1 text-white font-semibold py-3 cursor-pointer px-6 rounded-full transition-colors duration-200 ${
                  isSaved
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isSaved ? "Unsave" : "Save"}
              </button>
              {user?.name !== singlePin?.createdBy?.name && (
                <Link to={`/home/profile/${singlePin?.createdBy?._id}`}>
                  <button className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-200">
                    View Profile
                  </button>
                </Link>
              )}
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                {singlePin?.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {singlePin?.description}
              </p>
            </div>

            <div className="flex items-center gap-3 py-4">
              <img
                src={
                  singlePin?.createdBy?.profileImage?.url || "/placeholder.svg"
                }
                alt={singlePin?.createdBy?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {singlePin?.createdBy?.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
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
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments{" "}
                {singlePin?.comments?.length > 0 &&
                  `(${singlePin.comments.length})`}
              </h3>

              {/* Add Comment Form */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-600 text-sm font-medium">
                      You
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Add a comment"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && input.trim() && !loading) {
                            handleComment(input);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(input)}
                        disabled={!input.trim() || loading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                      >
                        {loading ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {singlePin?.comments?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  singlePin?.comments?.map((comment) => (
                    <div key={comment._id} className="flex gap-3">
                      <img
                        src={
                          comment?.user?.profileImage?.url || "/placeholder.svg"
                        }
                        alt={comment?.user?.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-50 rounded-2xl px-4 py-3">
                          <h4 className="font-semibold text-gray-900 text-sm capitalize mb-1">
                            {comment?.user?.name}
                          </h4>
                          <p className="text-gray-700 text-sm leading-relaxed break-words">
                            {comment?.comment}
                          </p>
                          {(user?._id === comment?.user?._id ||
                            user?._id === singlePin?.createdBy?._id) && (
                            <button
                              onClick={() => deleteComment(comment?._id)}
                              className="text-xs text-red-500 hover:underline mt-1"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 ml-4">
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
