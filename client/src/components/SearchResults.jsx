import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/const"; // Corrected relative path for plain React setup
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css"; // Import react-masonry-css

// Define breakpoints for react-masonry-css
const breakpointCols = {
  default: 4, // 4 columns for large desktops
  1280: 4, // 4 columns for xl screens
  1024: 3, // 3 columns for lg screens
  768: 2, // 2 columns for md screens
  640: 1, // 1 column for sm screens and below
};

const SearchResults = () => {
  const [searchQuery] = useSearchParams();
  const query = searchQuery.get("q");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/pin/search/?query=${query}`,
        { withCredentials: true }
      );
      console.log(response.data);
      setSearchResults(response.data.posts);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) fetchSearchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-6">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for: <span className="text-blue-500">{query}</span>
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : searchResults.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        /* Responsive Masonry Layout */
        <Masonry
          breakpointCols={breakpointCols}
          className="my-masonry-grid flex -ml-6 w-auto" // flex and negative margin for gutter
          columnClassName="my-masonry-grid_column pl-6 bg-clip-padding" // padding for gutter
        >
          {searchResults.map((post) => (
            <Link
              to={`/home/single/${post._id}`}
              key={post._id}
              className="mb-6 bg-white border border-black/10 rounded-lg cursor-pointer transition-all duration-300 group overflow-hidden hover:shadow-lg hover:shadow-black/10 hover:border-black/20 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={
                    post.image?.url ||
                    "/placeholder.svg?height=400&width=400&query=search result image"
                  }
                  alt={post.title || "Search Result"}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </Masonry>
      )}
    </div>
  );
};

export default SearchResults;
