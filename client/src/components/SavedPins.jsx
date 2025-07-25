import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeSavedPin, setSavedPins } from "../reducers/pinSlice";
import toast from "react-hot-toast";
import { addUser } from "../reducers/userSlice";
import { BookmarkIcon as BookmarkOff, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";

import { BASE_URL } from "../utils/const";

const SavedPins = ({ userId }) => {
  const { savedPins } = useSelector((store) => store.pin);
  const dispatch = useDispatch();

  const fetchSavedPins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pin/saved`, {
        withCredentials: true,
      });
      dispatch(setSavedPins(response.data.savedPins));
    } catch (error) {
      console.error("Error fetching saved pins:", error);
      toast.error("Failed to load saved pins");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSavedPins();
    }
  }, [userId]);

  const handleUnsave = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/pin/unsave/${id}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      dispatch(removeSavedPin(id));
      dispatch(addUser(response.data.updatedUser));
    } catch (error) {
      console.error("Unsave error:", error);
      toast.error("Failed to unsave pin");
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  return (
    <div className="p-4">
      {savedPins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-600">
          <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No saved pins yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Start saving pins to see them here!
          </p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex gap-4"
          columnClassName="flex flex-col gap-4"
        >
          {savedPins.map((pin) => (
            <div
              key={pin._id}
              className="group relative bg-white rounded-xl overflow-hidden border border-black/10 hover:shadow-md transition-all duration-300"
            >
              <Link to={`/home/single/${pin._id}`} className="block">
                {pin?.image?.url ? (
                  <img
                    src={pin.image.url}
                    alt={pin?.title || "Saved Pin"}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </Link>

              {/* Hover Overlay Button */}
              <div className="absolute top-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-10">
                <button
                  onClick={() => handleUnsave(pin?._id)}
                  className="bg-white/90 hover:bg-white text-red-600 border border-red-300 px-3 py-1 text-sm rounded-md flex items-center gap-1 shadow"
                >
                  <BookmarkOff className="w-4 h-4" />
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default SavedPins;
