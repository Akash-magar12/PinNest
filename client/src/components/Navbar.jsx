import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Home,
  Compass,
  Upload,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../reducers/userSlice";
import { BASE_URL } from "../utils/const";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");

  const dropdownRef = useRef(null); // 🆕 Dropdown ref

  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogut = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUser());
      const message = response?.data?.message || "Logout successful!";
      toast.success(message, { duration: 1000 });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/home/search?q=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const handleMobileSearch = () => {
    if (mobileSearchTerm.trim()) {
      navigate(`/home/search?q=${mobileSearchTerm}`);
      setMobileSearchTerm("");
      setIsMenuOpen(false);
    }
  };

  const handleKeyPress = (e, isMobile = false) => {
    if (e.key === "Enter") {
      isMobile ? handleMobileSearch() : handleSearch();
    }
  };

  // 🆕 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="px-3 sm:px-6 md:px-8 lg:px-16 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <Link
              to="/home"
              className="text-lg sm:text-xl font-bold text-black"
            >
              SnapNest
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/home" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Home</span>
            </Link>
            <Link to="explore" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 group">
              <Compass className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Explore</span>
            </Link>
            <Link to="create" className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200 group">
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Upload</span>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
            {/* Desktop Search */}
            <div className="hidden md:block relative">
              <Search
                onClick={handleSearch}
                className="absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-gray-700"
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e)}
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-48 lg:w-56 xl:w-64 bg-white border border-gray-300 rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative cursor-pointer dropdown-container">
              {user?.profileImage ? (
                <img
                  onClick={toggleDropdown}
                  src={user?.profileImage?.url}
                  alt={`${user?.name || "User"}'s profile`}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <button
                  onClick={toggleDropdown}
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white font-medium hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                >
                  <span className="text-xs sm:text-sm md:text-base">
                    {user?.name?.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </button>
              )}

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="font-medium capitalize text-black text-sm sm:text-base">
                      {user?.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">
                      {user?.email}
                    </div>
                  </div>
                  <Link to="/home/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 text-sm sm:text-base">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link to="/home/setting" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-3 px-4 py-2 sm:py-3 text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200 text-sm sm:text-base">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button onClick={handleLogut} className="flex items-center space-x-3 px-4 py-2 sm:py-3 text-red-600 hover:bg-gray-100 hover:text-red-700 transition-colors cursor-pointer duration-200 text-sm sm:text-base w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button onClick={toggleMenu} className="lg:hidden text-black focus:outline-none p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 menu-button">
              {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 mobile-menu-container">
            <div className="mb-4 px-1">
              <div className="relative">
                <Search onClick={handleMobileSearch} className="absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-gray-700" />
                <input
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, true)}
                  type="text"
                  placeholder="Search photos, users..."
                  className="pl-10 pr-4 py-3 w-full bg-gray-50 border border-gray-300 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1">
              <Link to="/home" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3 px-3 py-3">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Home</span>
                </div>
              </Link>
              <Link to="/home/explore" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3 px-3 py-3">
                  <Compass className="w-5 h-5" />
                  <span className="font-medium">Explore</span>
                </div>
              </Link>
              <Link to="/home/create" onClick={() => setIsMenuOpen(false)} className="block text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-3 px-3 py-3">
                  <Upload className="w-5 h-5" />
                  <span className="font-medium">Upload</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
