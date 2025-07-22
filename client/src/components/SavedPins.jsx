"use client"

import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeSavedPin, setSavedPins } from "../reducers/pinSlice"
import toast from "react-hot-toast"
import { addUser } from "../reducers/userSlice"
import { BookmarkIcon as BookmarkOff, ImageOff } from "lucide-react"
import { Link } from "react-router-dom" // Assuming Link is used for navigation to pin details

// Assuming BASE_URL is defined elsewhere or passed via context/env
import { BASE_URL } from "../utils/const"

const SavedPins = ({ userId }) => {
  const { savedPins } = useSelector((store) => store.pin)
  const dispatch = useDispatch()

  const fetchSavedPins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pin/saved`, {
        withCredentials: true,
      })
      dispatch(setSavedPins(response.data.savedPins))
    } catch (error) {
      console.error("Error fetching saved pins:", error)
      toast.error("Failed to load saved pins")
    }
  }

  useEffect(() => {
    if (userId) {
      fetchSavedPins()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleUnsave = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/pin/unsave/${id}`, {
        withCredentials: true,
      })
      toast.success(response.data.message)
      // Instantly remove pin from Redux store
      dispatch(removeSavedPin(id))
      dispatch(addUser(response.data.updatedUser)) // Update user's saved pins count
    } catch (error) {
      console.error("Unsave error:", error)
      toast.error("Failed to unsave pin")
    }
  }

  return (
    <div className="p-4">
      {savedPins.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-600">
          <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg font-medium">No saved pins yet.</p>
          <p className="text-sm text-gray-500 mt-2">Start saving pins to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {savedPins.map((pin) => (
            <div
              key={pin._id}
              className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <Link to={`/home/single/${pin._id}`} className="block">
                {pin?.image?.url ? (
                  <img
                    src={pin.image.url || "/placeholder.svg?height=160&width=240"}
                    alt={pin?.title || "Saved Pin"}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-t-lg">
                    <ImageOff className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </Link>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => handleUnsave(pin?._id)}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors duration-200"
                >
                  <BookmarkOff className="w-4 h-4" />
                  Unsave
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedPins
