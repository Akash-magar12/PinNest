import Masonry from "react-masonry-css";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/const";
import { useEffect, useState } from "react";
import axios from "axios";
import { setUserAllPins } from "../reducers/pinSlice";
import toast from "react-hot-toast";
import { Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const UserAllPins = ({ userId, isOwnProfile }) => {
  const { userAllPins } = useSelector((store) => store.pin);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUserPins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/pin/user-pins/${userId}`, {
        withCredentials: true,
      });
      dispatch(setUserAllPins(response.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteButton = async (id) => {
    try {
      setDeletingId(id);
      const response = await axios.delete(`${BASE_URL}/pin/delete-pin/${id}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      fetchUserPins();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete pin");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (userId) fetchUserPins();
  }, [userId]);

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) {
    return (
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-zinc-300 rounded-xl animate-pulse aspect-[4/5] h-60"
          ></div>
        ))}
      </div>
    );
  }

  if (userAllPins.length === 0) {
    return (
      <div className="text-center py-20 mt-8">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-black/30" />
          </div>
          <h3 className="text-xl font-semibold text-black/70 mb-2">
            No pins created yet
          </h3>
          <p className="text-black/50">
            {isOwnProfile
              ? "Start creating and sharing your first pin!"
              : "This user hasn't shared any pins yet."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex gap-4"
        columnClassName="flex flex-col gap-4"
      >
        {userAllPins.map((pin) => (
          <div
            key={pin._id}
            className="group relative bg-white border border-black/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link to={`/home/single/${pin._id}`} className="block">
              <img
                src={pin?.image?.url || "/placeholder.svg"}
                alt={pin?.title}
                className="w-full object-cover"
              />
            </Link>

            {/* Delete button overlay on hover */}
            {isOwnProfile && (
              <div className="absolute top-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-10">
                <button
                  onClick={() => handleDeleteButton(pin._id)}
                  disabled={deletingId === pin._id}
                  className="bg-white/90 hover:bg-white text-red-600 border border-red-300 px-3 py-1 text-sm rounded-md flex items-center gap-2 shadow"
                >
                  {deletingId === pin._id ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default UserAllPins;
