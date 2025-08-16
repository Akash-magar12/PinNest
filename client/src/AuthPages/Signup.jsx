import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loggedIn } from "../reducers/islogin";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/const";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword)
      return toast.error("Please fill in all the required fields.");

    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    if (!isChecked)
      return toast.error("Please agree to the Terms & Conditions");
    setLoading(true);

    try {
      let response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
        withCredentials: true,
      });

      toast.success(response?.data?.message || "User created successfully", {
        duration: 1000,
      });

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong.";
      toast.error(msg, { duration: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side image (hidden on small screens) */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0"
            alt="Creative collage"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4 text-center">
            <div className="text-white max-w-md mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Poppins']">
                SnapNest
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Join our creative community
              </p>
              <div className="mt-6 space-y-2 text-sm md:text-base opacity-80">
                <p>✨ Share your amazing visuals</p>
                <p>🎨 Discover endless inspiration</p>
                <p>🤝 Connect with fellow creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12">
          <div className="w-full max-w-md">
            {/* Logo for mobile */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold font-['Poppins']">SnapNest</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Join our creative community
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200">
              <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 font-['Poppins']">
                  Create Your Account
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Start your creative journey with SnapNest
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="relative">
                  <FiUser className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <FiMail className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <FiLock className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    className="absolute top-3.5 right-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <FiLock className="absolute top-3.5 left-3 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={confirmShowPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="button"
                    className="absolute top-3.5 right-3 text-gray-400"
                    onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                  >
                    {confirmShowPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {/* Terms */}
                <div className="flex items-start text-sm">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                    className="mt-1 h-4 w-4 text-black border-gray-300"
                  />
                  <span className="ml-2 text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-black underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-black underline">
                      Privacy Policy
                    </a>
                  </span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                {/* Switch to Login */}
                <p className="text-center text-gray-600 text-sm sm:text-base">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => dispatch(loggedIn())}
                    className="text-black font-semibold cursor-pointer hover:text-gray-900 ml-1"
                  >
                    Log In
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
