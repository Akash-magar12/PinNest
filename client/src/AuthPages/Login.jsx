import { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { signedUp } from "../reducers/islogin";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/const";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showModal, setShowModal] = useState(false);
  const [, setSelectedOption] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      return toast.error("Please fill in all the required fields.");
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, formData, {
        withCredentials: true,
      });
      const message = response?.data?.message || "Login successful!";
      toast.success(message, { duration: 1000 });

      setFormData({ email: "", password: "" });
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, { duration: 1000 });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Creative collage"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
            <div className="text-center text-white max-w-[90%]">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-['Poppins']">
                SnapNest
              </h1>
              <p className="text-lg lg:text-xl opacity-90">
                Discover and share amazing visuals
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black font-['Poppins']">
                SnapNest
              </h1>
              <p className="text-gray-700 mt-2 text-base sm:text-lg">
                Discover and share amazing visuals
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 font-['Poppins']">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email address"
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    onChange={handleChange}
                    name="password"
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-black" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-black" />
                    )}
                  </button>
                </div>

                {/* Forgot */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-sm cursor-pointer text-gray-600 hover:text-black font-medium transition"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button className="w-full cursor-pointer bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-md">
                  Sign In
                </button>

                {/* Redirect */}
                <div className="text-center text-sm sm:text-base">
                  <p className="text-gray-700">
                    Don’t have an account?
                    <button
                      onClick={() => dispatch(signedUp())}
                      type="button"
                      className="text-black ml-1 hover:text-gray-800 font-semibold transition"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
            <button
              className="absolute cursor-pointer top-2 right-3 text-gray-500 hover:text-black text-2xl"
              onClick={() => {
                setShowModal(false);
                setSelectedOption(null);
              }}
            >
              ×
            </button>

            <h2 className="text-xl font-semibold text-center mb-6">
              Choose Recovery Method
            </h2>

            <div className="space-y-4">
              <Link
                to="/forgot-password/otp"
                onClick={() => {
                  setSelectedOption("otp");
                  setShowModal(false);
                }}
                className="block text-center  w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
              >
                Recover with OTP
              </Link>
              <Link
                to="/forgot-password"
                onClick={() => {
                  setSelectedOption("link");
                  setShowModal(false);
                }}
                className="block text-center w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Recover with Link
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
