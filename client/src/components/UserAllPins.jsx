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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-zinc-300  rounded-xl animate-pulse aspect-[4/5]"
          >
            <div className="w-full h-full bg-gray-200"></div>
          </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
      {userAllPins.map((pin) => (
        <div
          key={pin._id}
          className="bg-white border border-black/10 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
        >
          <Link to={`/home/single/${pin._id}`} className="block w-full">
            <div className="aspect-[5/4] overflow-hidden rounded-t-xl">
              <img
                src={pin?.image?.url || "/placeholder.svg"}
                alt={pin?.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </Link>

          <div className="px-4 py-3 flex-1 flex flex-col justify-between">
            {isOwnProfile && (
              <button
                onClick={() => handleDeleteButton(pin._id)}
                disabled={deletingId === pin._id}
                className="mt-auto bg-red-500 text-white w-full py-2 rounded-md hover:bg-red-600 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId === pin._id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserAllPins;
