const User = require("../models/User");
const { generateToken } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");

const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, role, tenantId } =
    req.body;
  console.log(req.body, "body");
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (!Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({
      username,
      email,
      password,
      role,
      tenantId,
    });

    await newUser.save();
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "This email or UserId is already registered.",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password, tenantId } = req.body;
  console.log(req.body);

  if (!email || !password || !tenantId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email, tenantId });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    console.log(req.body);
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // const token = generateToken(user._id, user.role, user.tenantId);
    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    if (!updateUser) return res.status(404).json({ message: "User not found" });

    res.json(updateUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndDelete(req.params.id).select(
      "-password"
    );
    if (!deleteUser) return res.status(404).json({ message: "User not found" });

    res.json(deleteUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
