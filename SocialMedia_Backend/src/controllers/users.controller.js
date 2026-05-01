import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
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
}

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
    /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,20}$/;
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
  const profilePicLocalPath =await req.file?.path;

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
    gender ,
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
 
export {userRegister,userLogin}