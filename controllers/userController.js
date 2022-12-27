import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// @desc Authenticate the user and get token
// @route POST /api/users/login
// @access Public
export const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      likes: user.likes,
      yourGender: user.yourGender,
      lookingForGender: user.lookingForGender,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
export const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password, yourGender, lookingForGender } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  const user = await User.create({
    name,
    email,
    password,
    yourGender,
    lookingForGender
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      yourGender: user.yourGender,
      lookingForGender: user.lookingForGender,
      likes: [],
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      likes: user.likes,
      yourGender: user.yourGender,
      lookingForGender: user.lookingForGender
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.likes = req.body.likes || user.likes;
    user.yourGender = req.body.yourGender || user.yourGender;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      yourGender: updatedUser.yourGender,
      likes: updatedUser.likes,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc Fetch all users likes(arrays) excluding your own details
// @route GET /api/users/userslikes
// @access Public
export const getUsersLikes = expressAsyncHandler(async (req, res) => {
  const id = req.query.id;
  const myGender = req.query.gender
  const userslikes = await User.find({ _id: { $ne: id }, lookingForGender: myGender })
    .select("name")
    .select("likes");

  res.json(userslikes);
});
