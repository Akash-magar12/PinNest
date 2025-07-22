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
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // ✅ Step 1: Check if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("Please fill in all the required fields.");
    }

    // ✅ Step 2: Check if passwords match
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    // ✅ Step 3: Check if terms checkbox is checked
    if (!isChecked) {
      return toast.error("Please agree to the Terms & Conditions");
    }

    try {
      let response = await axios.post(`${BASE_URL}/auth/signup`, formData, {
        withCredentials: true,
      });
      const message = response?.data?.message || "User created successfully";
      toast.success(message, {
        duration: 1000,
      });
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, {
        duration: 1000,
      });
    }
  };
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="flex min-h-screen">
        {/* Left Side - Image Section */}

        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
          <img
            src="https://images.unsplash.com/photo-1740448868355-0772ebaf9371?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Creative collage"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4 font-['Poppins']">
                SnapNest
              </h1>
              <p className="text-xl opacity-90">Join our creative community</p>
              <div className="mt-6 space-y-2 text-sm opacity-80">
                <p>✨ Share your amazing visuals</p>
                <p>🎨 Discover endless inspiration</p>
                <p>🤝 Connect with fellow creators</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold text-black font-['Poppins']">
                SnapNest
              </h1>
              <p className="text-gray-600 mt-2">Join our creative community</p>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 font-['Poppins']">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Start your creative journey with PixNest
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    type="text"
                    placeholder="Full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={formData.password}
                    onChange={handleChange}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                    type={confirmShowPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl  focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setConfirmShowPassword(!confirmShowPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {confirmShowPassword ? (
                      <FiEyeOff className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FiEye className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <input
                    checked={isChecked}
                    type="checkbox"
                    onChange={() => setIsChecked(!isChecked)}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-black underline hover:text-gray-900"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-black underline hover:text-gray-900"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>

                {/* Submit Button */}
                <button className="w-full cursor-pointer bg-black  text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-900 transform hover:scale-[1.02] transition-all duration-200 shadow-md">
                  Create Account
                </button>

                {/* Toggle to Login */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => dispatch(loggedIn())}
                      type="button"
                      className="text-black ml-1 cursor-pointer  hover:text-gray-900 font-semibold transition-colors duration-200"
                    >
                      Log In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
