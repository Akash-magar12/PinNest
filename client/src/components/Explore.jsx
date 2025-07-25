import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/const"; // Corrected relative path for plain React setup
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MoreHorizontal, Tag } from "lucide-react";
import { Link } from "react-router-dom"; // Reverted to react-router-dom Link
import { setAllPins } from "../reducers/pinSlice"; // Using setAllPins as per new code
import Masonry from "react-masonry-css"; // Import react-masonry-css

// Define breakpoints for react-masonry-css
const breakpointCols = {
  default: 4, // 4 columns for large desktops
  1280: 4, // 4 columns for xl screens
  1024: 3, // 3 columns for lg screens
  768: 2, // 2 columns for md screens
  640: 1, // 1 column for sm screens and below
};

const Explore = () => {
  const dispatch = useDispatch();
  const { allPins } = useSelector((store) => store.pin); // Using allPins as per new code
  console.log(allPins);
  const fetchAllPins = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/pin/all-pins`, {
        // Updated API endpoint
        withCredentials: true,
      });
      dispatch(setAllPins(response.data)); // Using setAllPins as per new code
    } catch (error) {
      console.error("Failed to fetch pins:", error);
      // You might want to dispatch an error action or show a user-friendly message here
    }
  };

  useEffect(() => {
    fetchAllPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="text-center py-16 border-b border-black/10 mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 tracking-tight">
            EXPLORE <span className="text-black/40 font-light"> GALLERY</span>
          </h1>
          <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            Discover amazing creations from our community. Explore endless
            inspiration and creative possibilities.
          </p>
        </div>

        {/* Conditional Content */}
        {allPins.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-black/70">
              No pins found.
            </h2>
            <p className="text-black/50 mt-2">
              Check back later for new creative content!
              <br />
              (If you see this message, there might be an issue fetching data
              from your API.)
            </p>
          </div>
        ) : (
          /* Responsive Masonry Layout */
          <Masonry
            breakpointCols={breakpointCols}
            className="my-masonry-grid flex -ml-6 w-auto" // flex and negative margin for gutter
            columnClassName="my-masonry-grid_column pl-6 bg-clip-padding" // padding for gutter
          >
            {allPins.map((pin) => (
              <div
                key={pin._id}
                className="mb-6 bg-white border border-black/10 rounded-lg cursor-pointer transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-black/10 hover:border-black/20 hover:-translate-y-1"
              >
                {/* Clickable Image Link */}
                <Link to={`/home/single/${pin._id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        pin?.image?.url ||
                        "/placeholder.svg?height=400&width=400&query=abstract image"
                      }
                      alt={pin?.title || "Image"}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default Explore;
