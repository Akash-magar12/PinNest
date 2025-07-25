import { useState } from "react";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/const";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordOtp = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/forgot-password/otp`,
        { email },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/verify-password/otp", { state: email });
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col lg:flex-row">
      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Creative collage"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-['Poppins']">
              SnapNest
            </h1>
            <p className="text-lg lg:text-xl opacity-90">
              Discover and share amazing visuals
            </p>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-4xl font-bold text-black font-['Poppins']">
              SnapNest
            </h1>
            <p className="text-gray-700 mt-2">
              Discover and share amazing visuals
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins']">
                Forgot Password via OTP
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Enter your email to receive an OTP
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full cursor-pointer flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-900 transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send OTP"
                )}
              </button>

              <div className="text-center">
                <Link to="/">
                  <button
                    type="button"
                    className="text-sm cursor-pointer text-black hover:underline transition-all"
                  >
                    Back to login
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;
