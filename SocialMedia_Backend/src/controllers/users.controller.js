import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { v2 as cloudinary } from "cloudinary";
import { sendNotification } from "../utils/sendNotification.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generateRefreshTokenAndAccessToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};
const userRegister = asyncHandler(async (req, res) => {
  const { name, username, email, password, gender } = req.body;

  if (!name || !username || !email || !password || !gender) {
    throw new ApiError(400, "All fields are required");
  }
  const alreadyExistingUserWithUsername = await User.findOne({ username });
  if (alreadyExistingUserWithUsername) {
    throw new ApiError(409, "User with this username already exists");
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isEmailValid = emailRegex.test(email);
  if (!isEmailValid) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const alreadyExistingUserWithEmail = await User.findOne({ email });
  if (alreadyExistingUserWithEmail) {
    throw new ApiError(409, "User with this email already exists");
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,20}$/;
  const isPasswordValid = passwordRegex.test(password);
  if (!isPasswordValid) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    );
  }
  const validGenders = ["male", "female", "others"];

  if (!validGenders.includes(gender.toLowerCase())) {
    throw new ApiError(400, "Invalid gender value");
  }

  const normalizedGender =
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  const profilePicLocalPath = await req.file?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(400, "Profile pic file is required");
  }

  const userProfilePic = await uploadOnCloudinary(profilePicLocalPath);

  if (!userProfilePic) {
    throw new ApiError(400, "Failed to upload on cloudinary");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    gender: normalizedGender,
    name,
    password,
    userProfilePic: userProfilePic.url,
    userProfilePicPublicId: userProfilePic.public_id || "",
  });

  const createdUser = await User.findById(user?._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went while creating user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User with this email doesnot exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect password");
  }

  if (user.accountStatus === "deactivated") {
    user.accountStatus = "active";
    await user.save({ validateBeforeSave: false });
  }

  const { accessToken, refreshToken } =
    await generateRefreshTokenAndAccessToken(user?._id);

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken",
  );
  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while log in");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "Successfully Login",
      ),
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options) //clearing cookie
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
const changeEmail = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { oldEmail, newEmail } = req.body;

  if (!oldEmail || !newEmail) {
    throw new ApiError(400, "All fields are required");
  }

  if (oldEmail !== user.email) {
    throw new ApiError(400, "Current email does not match");
  }

  if (oldEmail === newEmail) {
    throw new ApiError(400, "New email must be different from current email");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(newEmail)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  const alreadyExistingUserWithEmail = await User.findOne({
    email: newEmail,
  });

  if (alreadyExistingUserWithEmail) {
    throw new ApiError(409, "Email already in use");
  }

  user.email = newEmail;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email changed successfully"));
});
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,20}$/;

  if (!passwordRegex.test(newPassword)) {
    throw new ApiError(
      400,
      "Password must be 8–20 characters and include uppercase, lowercase, number, and special character",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  user.password = newPassword;

  user.refreshToken = undefined;

  await user.save();

  const options = {
    httpOnly: true,
    secure: false,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password changed successfully. Please login again.",
      ),
    );
});
const changeUserProfilePic = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userProfilePicLocalPath = req.file?.path;
  if (!userProfilePicLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  const uploadedImage = await uploadOnCloudinary(userProfilePicLocalPath);
  if (!uploadedImage) {
    throw new ApiError(400, "User profile pic failed to upload on cloudinary");
  }
  if (user.userProfilePicPublicId) {
    try {
      await cloudinary.uploader.destroy(user.userProfilePicPublicId);
    } catch (error) {
      console.log("Old profile pic delete failed:", error);
    }
  }

  user.userProfilePic = uploadedImage.url;
  user.userProfilePicPublicId = uploadedImage.public_id;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { profilePic: user.userProfilePic },
        "Successfully updated user profile pic",
      ),
    );
});
const changeUsername = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { username } = req.body;
  if (!username) {
    throw new ApiError(400, "Username field is required");
  }
  if (user.username === username) {
    throw new ApiError(400, "You already have this username");
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(409, "Username already taken");
  }
  user.username = username.toLowerCase();
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newUsername: username.toLowerCase() },
        "Username successfully updated",
      ),
    );
});
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const currentUser = await User.findById(userId).select(
    "-password -refreshToken",
  );
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, currentUser, "Successfully fetched current user"),
    );
});
const getUserProfileById = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("followers", "username fullName userProfilePic")
    .populate("following", "username fullName userProfilePic");
  if (!user || user.accountStatus === "deactivated") {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully by profile"));
});
const getAllUsers = asyncHandler(async (req, res) => {
  const allUsers = await User.find().select("-password -refreshToken");
  if (!allUsers || allUsers.length === 0) {
    throw new ApiError(404, "Users not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allUsers, "Fetched all users successfully"));
});
const followUser = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user?._id;
  if (!loggedInUserId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const { id: userId } = req.params;
  if (!userId) {
    throw new ApiError(404, "User id not found");
  }
  if (loggedInUserId.toString() === userId) {
    throw new ApiError(400, "You cannot follow yourself");
  }
  const loggedInUser = await User.findById(loggedInUserId);
  const user = await User.findById(userId);
  if (!loggedInUser) {
    throw new ApiError(404, "Logged In user not found");
  }
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const alreadyFollowing = loggedInUser.following.includes(userId);
  if (alreadyFollowing) {
    throw new ApiError(400, "You are already following this user");
  }

  await User.findByIdAndUpdate(loggedInUserId, {
    $push: { following: userId },
  });

  await User.findByIdAndUpdate(userId, {
    $push: { followers: loggedInUserId },
  });

  await sendNotification({
    sender: loggedInUserId,
    receiver: userId,
    type: "follow",
    message: `${req.user.username} started following you`,
    link: `/userProfile/${loggedInUserId}`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User followed successfully"));
});
const unfollowUser = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const loggedInUserId = req?.user?._id;

  if (!userId || !loggedInUserId) {
    throw new ApiError(401, "Unauthorized access");
  }

  if (userId === loggedInUserId.toString()) {
    throw new ApiError(400, "You cannot unfollow yourself");
  }

  const loggedInUser = await User.findById(loggedInUserId);
  if (!loggedInUser) {
    throw new ApiError(404, "Logged In user not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const alreadyFollowing = loggedInUser.following.includes(userId);
  if (!alreadyFollowing) {
    throw new ApiError(400, "You are not following this user");
  }

  await User.findByIdAndUpdate(loggedInUserId, {
    $pull: { following: userId },
  });

  await User.findByIdAndUpdate(userId, {
    $pull: { followers: loggedInUserId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Unfollowed successfully"));
});
const deactivateAccount = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.accountStatus = "deactivated";
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "User account deactivated successfully"));
});
const getFollowers = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const user = await User.findById(userId).populate("followers");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.followers,
        "Fetched user followers successfully",
      ),
    );
});
const getFollowing = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized acess");
  }

  const user = await User.findById(userId).populate("following");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.following,
        "User following successfully fetched",
      ),
    );
});
const getFollowerCount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.followers.length, "user follower count"));
});
const getFollowingCount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.following.length,
        "User following count fetched",
      ),
    );
});
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    throw new ApiError(400, "Search query is required");
  }

  const regex = new RegExp(q.trim(), "i");

  const users = await User.find({
    $or: [{ username: regex }, { name: regex }],
  }).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getSuggestedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const me = await User.findById(userId).select("interests following");
  if (!me) throw new ApiError(404, "User not found");

  const interests = me.interests ?? [];
  const excludeIds = [userId, ...me.following];

  // No interests set — fall back to users they don't follow yet
  if (interests.length === 0) {
    const users = await User.find({
      _id: { $nin: excludeIds },
      accountStatus: { $ne: "deactivated" },
    })
      .select("username name userProfilePic interests")
      .limit(8)
      .lean();
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Suggested users fetched"));
  }

  const users = await User.aggregate([
    {
      $match: {
        _id: { $nin: excludeIds },
        interests: { $in: interests },
        accountStatus: { $ne: "deactivated" },
      },
    },
    {
      $addFields: {
        commonInterestsCount: {
          $size: {
            $filter: {
              input: { $ifNull: ["$interests", []] },
              as: "i",
              cond: { $in: ["$$i", interests] },
            },
          },
        },
      },
    },
    { $sort: { commonInterestsCount: -1 } },
    { $limit: 8 },
    {
      $project: {
        username: 1,
        name: 1,
        userProfilePic: 1,
        interests: 1,
        commonInterestsCount: 1,
      },
    },
  ]);

  if (users.length === 0) {
    const fallbackUsers = await User.find({
      _id: { $nin: excludeIds },
      accountStatus: { $ne: "deactivated" },
    })
      .select("username name userProfilePic interests")
      .limit(8)
      .lean();
    return res
      .status(200)
      .json(new ApiResponse(200, fallbackUsers, "Suggested users fetched"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Suggested users fetched"));
});

const saveInterests = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) throw new ApiError(401, "Unauthorized access");

  const { interests } = req.body;
  if (!Array.isArray(interests)) {
    throw new ApiError(400, "interests must be an array");
  }

  const cleaned = interests
    .map((i) => i.trim().toLowerCase())
    .filter((i) => i.length > 0);

  await User.findByIdAndUpdate(userId, {
    interests: cleaned,
    hasSelectedInterests: true,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { interests: cleaned },
        "Interests saved successfully",
      ),
    );
});
const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new ApiError(404, "Token not found");
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const email = payload.email;
  const name = payload.name;
  const picture = payload.picture;

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      username: name.toLowerCase(),
      name,
      email,
      userProfilePic: picture,
    });
  }
  const { accessToken, refreshToken } = generateRefreshTokenAndAccessToken(
    user?._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, user, "User loggedIn Successfully"));
});
export {
  userRegister,
  userLogin,
  logoutUser,
  changeEmail,
  changePassword,
  changeUserProfilePic,
  changeUsername,
  getCurrentUser,
  getUserProfileById,
  getAllUsers,
  followUser,
  unfollowUser,
  deactivateAccount,
  getFollowers,
  getFollowing,
  getFollowerCount,
  getFollowingCount,
  searchUsers,
  saveInterests,
  getSuggestedUsers,
};
