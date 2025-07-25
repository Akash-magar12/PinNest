import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../utils/const";
import toast from "react-hot-toast";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/auth/change-password`, form, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="min-h-screen bg-[whitesmoke] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <span onClick={()=>navigate(-1)} className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="text-center mb-8">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-black mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
              Change Password
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Update your password to keep your account secure
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-black mb-2"
                htmlFor="oldPassword"
              >
                Current Password
              </label>
              <input
                id="oldPassword"
                name="oldPassword"
                type="password"
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your current password"
                value={form.oldPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-black mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your new password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-4 cursor-pointer rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
