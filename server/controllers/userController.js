import mongoose from "mongoose";
import { userModel } from "../models/userModel.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import { pinModel } from "../models/pinModel.js";

// ✅ Get the profile of the logged-in user
export const getMyProfile = async (req, res) => {
  try {
    const user = req.user; // 'req.user' is set by your authentication middleware
    res.status(200).json(user); // Send back the user data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");
    res.status(200).json(user); // Send back the user data
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✅ Follow or unfollow a user
export const followAndUnfollow = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // ID of the current logged-in user
    const targetUserId = req.params.id; // ID of the user to follow or unfollow

    // ❌ Prevent user from following themselves
    if (targetUserId.toString() === loggedInUserId.toString()) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    // 🔍 Find both users in the database
    const loggedUser = await userModel.findById(loggedInUserId);
    const targetUser = await userModel.findById(targetUserId);

    // ❌ If target user doesn't exist, return error
    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Check if loggedUser is already following targetUser
    const isFollowing = loggedUser.following.includes(targetUserId.toString());

    // 🔁 If already following → UNFOLLOW
    if (isFollowing) {
      // Remove target user from logged user's "following" list
      loggedUser.following = loggedUser.following.filter(
        (id) => id.toString() !== targetUserId.toString()
      );

      // Remove logged-in user from target user's "followers" list
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );

      // Save both user documents
      await loggedUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User unfollowed.",
      });
    }

    // ➕ If not following → FOLLOW
    else {
      // Add target user to logged user's "following" list
      loggedUser.following.push(targetUserId);

      // Add logged-in user to target user's "followers" list
      targetUser.followers.push(loggedInUserId);

      // Save both user documents
      await loggedUser.save();
      await targetUser.save();

      return res.status(200).json({
        message: "User followed.",
        loggedUser,
        targetUser,
      });
    }
  } catch (error) {
    // ⚠️ Catch and return any unexpected errors
    res.status(500).json({ message: error.message });
  }
};

export const getFollowersOrFollowing = async (req, res) => {
  try {
    const { id, type } = req.params; // :id is user ID, :type is either 'followers' or 'following'
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Validate type
    const validTypes = ["followers", "following"];
    if (!validTypes.includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Use 'followers' or 'following'." });
    }

    // Fetch user and populate followers/following
    const user = await userModel.findById(id).populate({
      path: type,
      select: "name profileImage",
      options: {
        skip,
        limit,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({
      data: user[type],
      page,
      limit,
      skip,
      total: user[type]?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching followers/following:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // ✅ Extract logged-in user's ID from auth middleware
    const file = req.file; // ✅ Multer middleware should handle this
    const { name, bio } = req.body; // ✅ Get name and bio from request body

    // 🔍 Fetch user from the database
    const user = await userModel.findById(loggedInUserId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Upload image only if a new file is provided
    if (file) {
      const fileUrl = getDataUri(file);
      const cloud = await cloudinary.uploader.upload(fileUrl.content, {
        folder: "snapNest",
      });
      user.profileImage = {
        url: cloud.secure_url,
        public_id: cloud.public_id,
      };
    }

    // ✏️ Update other fields
    user.name = name;
    user.bio = bio;

    // 💾 Save updated user in the DB
    await user.save();

    // 📤 Send response
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Edit profile error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getUserFeed = async (req, res) => {
  try {
    const loggedUserId = req.user?._id;
    if (!loggedUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User ID not found" });
    }

    const user = await userModel.findById(loggedUserId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // user.following should be array of ObjectIds
    const feedPins = await pinModel
      .find({
        createdBy: { $in: user.following },
      })
      .populate("createdBy", " name profileImage ");

    res.status(200).json({ feedPins });
  } catch (error) {
    console.error("❌ getUserFeed error:", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔹 Get the user's profile image public_id before deleting
    const user = await userModel.findById(userId);
    const profileImageId = user?.profileImage?.public_id;

    // 🔹 Get all pins created by the user
    const pins = await pinModel.find({ createdBy: userId });

    // 🔹 Delete all pin images from Cloudinary
    for (const pin of pins) {
      const publicId = pin?.image?.public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // 🔹 Delete all pins from DB
    await pinModel.deleteMany({ createdBy: userId });

    // 🔹 Remove user from followers/following
    await userModel.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await userModel.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // 🔹 Delete user's profile image from Cloudinary
    if (profileImageId) {
      await cloudinary.uploader.destroy(profileImageId);
    }

    // 🔹 Delete user
    await userModel.findByIdAndDelete(userId);

    // 🔹 Clear cookie
    res.clearCookie("snapNest-jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      message: "profile deleted successfully",
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
