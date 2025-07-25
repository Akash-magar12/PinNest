import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/const";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { Mail, Loader2 } from "lucide-react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/password/verify-otp`,
        { otp, email: location.state },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f5f5f5]">
      {/* Left Illustration */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop"
          alt="Creative collage"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4 font-['Poppins']">SnapNest</h1>
            <p className="text-xl opacity-90">Discover and share amazing visuals</p>
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-6 md:px-12">
        <div className="w-full max-w-md sm:max-w-lg">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <h1 className="text-3xl font-bold text-black font-['Poppins']">SnapNest</h1>
            <p className="text-gray-600">Discover and share amazing visuals</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 font-['Poppins']">Verify OTP</h2>
              <p className="text-gray-600 mt-1 text-sm">Enter the OTP sent to your email</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Field */}
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm md:text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-gray-900 transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
