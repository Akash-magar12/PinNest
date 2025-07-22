import { useState } from "react";
import toast from "react-hot-toast";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { BASE_URL } from "../utils/const";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordOtp = () => {
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔁 loader state
  const { token } = useParams();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!newPassword || !newConfirmPassword) {
      return toast.error("Both fields required");
    }

    if (newPassword !== newConfirmPassword) {
      return toast.error("Password does not match");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/otp-reset-password`,
        { newPassword, newConfirmPassword, token },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex min-h-screen">
        {/* Left Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop"
            alt="Reset illustration"
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

        {/* Right Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-black font-['Poppins']">SnapNest</h1>
              <p className="text-gray-700 mt-2">Discover and share amazing visuals</p>
            </div>

            <form
              onSubmit={handleReset}
              className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins']">Reset Password</h2>
                <p className="text-gray-600">Enter your new password</p>
              </div>

              {/* New Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
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

              {/* Confirm Password */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={newConfirmPassword}
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-black" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-black" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex cursor-pointer items-center justify-center gap-2 bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                  loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-900 transform hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordOtp;
