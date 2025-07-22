import mongoose from "mongoose";
import { pinModel } from "../models/pinModel.js";
import { userModel } from "../models/userModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import getDataUri from "../utils/dataUri.js";

// ===============================
// CREATE A NEW PIN
// ===============================
export const createPin = async (req, res) => {
  try {
    const loggedUser = req.user;
    const { title, description, category } = req.body;
    const file = req.file;

    // Validate input
    if (!title || !description || !category || !file) {
      return res
        .status(400)
        .json({ message: "All fields including image are required." });
    }

    // Convert file buffer to base64 URI
    const fileUrl = getDataUri(file);

    // Upload image to Cloudinary
    const cloud = await cloudinary.uploader.upload(fileUrl.content, {
      folder: "snapNest",
    });

    // Create pin document
    const pins = new pinModel({
      title,
      description,
      image: {
        public_id: cloud.public_id,
        url: cloud.secure_url,
      },
      createdBy: loggedUser._id,
      category,
    });

    await pins.save();

    res.status(200).json({ message: "Uploaded successfully", pins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET ALL PINS
// ===============================
export const getAllPins = async (req, res) => {
  try {
    const allPins = await pinModel
      .find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name profileImage");

    res.status(200).json(allPins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// GET SINGLE PIN
// ===============================
export const getSinglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const singlePin = await pinModel
      .findById(id)
      .populate("createdBy", "name profileImage")
      .populate("comments.user", "name profileImage");

    if (!singlePin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    res.status(200).json(singlePin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADD COMMENT TO PIN
// ===============================
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedUser = req.user;
    const { comment } = req.body;

    // Validate comment
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty." });
    }

    const pin = await pinModel.findById(id);

    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    // Add comment to the pin
    pin.comments.push({
      user: loggedUser._id,
      comment,
    });

    await pin.save();

    // Populate after save to include user info in response
    const updatedPin = await pinModel
      .findById(id)
      .populate("comments.user", "name profileImage");

    res.status(200).json({ message: "Comment added", pin: updatedPin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const pin = await pinModel.findOne({ "comments._id": commentId });
    if (!pin) {
      return res.status(404).json({ message: "Comment not found in any pin" });
    }
    pin.comments.pull({ _id: commentId });
    await pin.save();

    res.status(200).json({ message: "Comment deleted successfully", pin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletedPin = async (req, res) => {
  try {
    const { id } = req.params; // Get pin ID from route params
    const loggedUserId = req.user._id; // Get logged-in user from middleware

    // 1. Find the pin in DB
    const pin = await pinModel.findById(id);
    if (!pin) {
      return res.status(404).json({ message: "Pin not found" });
    }

    // 2. Authorization check: Only creator can delete
    if (pin.createdBy.toString() !== loggedUserId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this pin" });
    }

    // 3. Delete the image from Cloudinary if exists
    if (pin?.image?.public_id) {
      await cloudinary.uploader.destroy(pin.image.public_id);
    }

    // 4. Delete the pin from the database
    await pinModel.findByIdAndDelete(id);

    // 5. Send response
    res.status(200).json({ message: "Pin deleted successfully" });
  } catch (error) {
    // 6. Handle server errors
    res.status(500).json({ message: error.message });
  }
};

// Controller to get all pins created by a specific user
export const getUserPins = async (req, res) => {
  try {
    // 1. Extract user ID from request parameters
    const { id } = req.params;

    // 2. Find all pins where 'createdBy' matches the given user ID
    const userPins = await pinModel.find({ createdBy: id });

    // 3. Return the found pins
    res.status(200).json(userPins);
  } catch (error) {
    // 4. Handle server errors
    res.status(500).json({
      message: "Server error while fetching pins",
      error: error.message,
    });
  }
};

export const toggleSavePin = async (req, res) => {
  try {
    const { pinId } = req.params; // Get the pin ID from the request params
    const userId = req.user._id; // Authenticated user ID (from middleware)
    if (!mongoose.Types.ObjectId.isValid(pinId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // 🧾 Find the user in the database
    const user = await userModel.findById(userId);
    // 🔍 Check if the pin exists
    const pins = await pinModel.findById(pinId);

    // ❌ If pin doesn't exist, return error
    if (!pins) return res.status(404).json({ message: "Pin not found" });

    // ❌ If user doesn't exist, return error
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Check if the pin is already saved by the user
    const alreadySaved = user.savedPins.includes(pinId);

    // 🔁 If already saved → UNSAVE
    if (alreadySaved) {
      user.savedPins = user.savedPins.filter((id) => id.toString() !== pinId);
    }
    // ➕ If not saved → SAVE
    else {
      user.savedPins.push(pinId);
    }

    // 💾 Save updated user document
    await user.save();

    // ✅ Send response back to frontend
    res.status(200).json({
      message: alreadySaved ? "Pin unsaved" : "Pin saved",
      savedPins: user.savedPins, // optional: can be excluded if not needed
    });
  } catch (error) {
    console.error("Toggle save error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getSavedPins = async (req, res) => {
  try {
    const id = req.user._id;
    // ✅ Fetch the user by ID
    // ✅ Select only the 'savedPins' and 'name' fields from user
    // ✅ Populate the 'savedPins' field to get full pin details (like title, image, category)
    const userWithSavedPins = await userModel.findById(id).populate({
      path: "savedPins",
      select: "title image category ",
    });

    // ❌ If user not found, return 404
    if (!userWithSavedPins) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Send populated pins
    res.status(200).json({
      savedPins: userWithSavedPins.savedPins,
    });
  } catch (error) {
    console.error("Error fetching saved pins:", error.message);
    res.status(500).json(error.message);
  }
};

export const unSavePin = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { pinId } = req.params;

    // Validate pinId format
    if (!mongoose.Types.ObjectId.isValid(pinId)) {
      return res.status(400).json({ message: "Invalid pin ID" });
    }

    const objectId = new mongoose.Types.ObjectId(pinId);

    // Get the user first to check if pinId is present
    const user = await userModel.findById(loggedInUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPinSaved = user.savedPins.some(
      (savedPinId) => savedPinId.toString() === objectId.toString()
    );

    // If the pin isn't saved, throw an error
    if (!isPinSaved) {
      return res.status(400).json({ message: "Pin is not saved by the user" });
    }

    // Proceed to remove the pin
    const updatedUser = await userModel.findByIdAndUpdate(
      loggedInUserId,
      { $pull: { savedPins: objectId } },
      { new: true }
    );

    res.status(200).json({ message: "Pin unsaved successfully", updatedUser });
  } catch (error) {
    console.error("❌ Error in unSavePin:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// export const unSavePin = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const { pinId } = req.params;
//     const user = await userModel.findById(loggedInUserId);

//     const isPinSaved = user.savedPins.some(
//       (savedPinId) => savedPinId.toString() === objectId.toString()
//     );

//     // If the pin isn't saved, throw an error
//     if (!isPinSaved) {
//       return res.status(400).json({ message: "Pin is not saved by the user" });
//     }

//     console.log(isPinSaved);
//     if (!isPinSaved) {
//       return res.send("no");
//     }
//     user.savedPins = user.savedPins.filter(
//       (id) => id.toString() !== pinId.toString()
//     );

//     await user.save();
//     res.status(200).json({ message: "Pin unsaved successfully", user });
//   } catch (error) {
//     console.error("❌ Error in unSavePin:", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query)
      return res.status(400).json({ message: "Search query is missing." });

    const posts = await pinModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res
      .status(200)
      .json({ message: "Posts fetched successfully", query, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
