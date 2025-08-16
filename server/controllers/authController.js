import { userModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import transporter from "../utils/mailer.js";
// Signup Controller
export const authSignup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ message: "Please fill in all the required fields." });
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password do not match." });
    }

    // 3. Check if the email already exists in DB
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists." });
    }

    // 4. Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create and save the new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();

    // 6. Generate and send JWT token in cookie
    generateToken(res, user._id);

    // 7. Respond with success message
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // 8. Catch and return any server error
    res.status(500).json({ message: error.message });
  }
};

// Login Controller
export const authLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all the required fields." });
    }

    // 2. Check if user exists with given email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found with this email." });
    }

    // 3. Compare entered password with hashed password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "The password you entered is incorrect." });
    }

    // 4. Generate and send JWT token in cookie
    generateToken(res, user._id);

    // 5. Respond with success message
    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    // 6. Catch and return any server error
    res.status(500).json({ message: error.message });
  }
};

export const authLogout = async (req, res) => {
  try {
    res.clearCookie("snapNest-jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    // Get logged-in user's ID from the auth middleware
    const loggedUserId = req.user._id;
    // Destructure old and new password from request body
    const { oldPassword, newPassword } = req.body;

    // Check for empty fields first
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the user in the database
    const user = await userModel.findById(loggedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare old password with the current hashed password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    user.password = hashedPassword;
    await user.save();

    // Send success response
    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    // Catch and send server error
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: "Email field is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    try {
      await transporter.sendMail({
        from: `"SnapNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Reset your password",
        html: `
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 5 minutes.</p>
        `,
      });
    } catch (emailError) {
      return res.status(500).json({
        message: "Failed to send email.",
        error: emailError.message,
      });
    }
    await user.save();
    res.json({
      message: "Reset link sent to your email.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Both fields required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();
    res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const forgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(404).json({ message: "Email field is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otpCode = hashedOtp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins
    await user.save();
    try {
      await transporter.sendMail({
        from: `"SnapNest" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "SnapNest OTP Verification",
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
      });
      res.json({
        message: "OTP sent to your email.",
      });
    } catch (emailError) {
      return res.status(500).json({
        message: "Failed to send email.",
        error: emailError.message,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    // 1. Destructure otp and email from request body
    const { otp, email } = req.body;

    // 2. Validate input
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP required" });

    // 3. Find user by email
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // 4. Check if OTP is expired
    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "OTP has expired." });

    // 5. Compare OTP using bcrypt
    const isMatch = await bcrypt.compare(otp, user.otpCode);
    if (!isMatch) throw new Error("Invalid OTP");

    // 6. Clear OTP fields
    user.otpCode = null;
    user.otpExpires = null;

    // 7. Generate reset token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

    // 8. Save user
    await user.save();

    // 9. Create reset link (sent to frontend route)
    const resetLink = `${process.env.CLIENT_URL}/reset-password/otp/${token}`;

    // 10. Send mail
    await transporter.sendMail({
      from: `"SnapNest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your SnapNest password",
      html: `<p>Your OTP has been verified.</p>
             <p><a href="${resetLink}">Click here to reset your password</a>. Link expires in 5 minutes.</p>`,
    });

    // 11. Respond success
    res.json({
      message: "OTP verified. Reset link sent to your email.",
    });
  } catch (error) {
    // 12. Handle errors
    res.status(500).json({ message: error.message });
  }
};

export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { token, newPassword, newConfirmPassword } = req.body;
    if (!token || !newPassword || !newConfirmPassword)
      return res.status(400).json({ message: "Missing fields" });

    if (newConfirmPassword !== newPassword)
      return res.status(400).json({ message: "password does not match" });
    const user = await userModel.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear token fields
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
