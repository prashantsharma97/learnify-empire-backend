const User = require("../models/User");
const { generateToken } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");
const jwt = require("jsonwebtoken");


const registerUser = async (req, res) => {
  const { username, email, phone, password, confirmPassword, role, tenantId } = req.body;
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
      phone,
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

const userDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User details retrieved successfully", user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "instructor not found" });
        const { username, email, bio } = req.body;
        let profileImage = user.profileImage;
        if (req.file) {
            profileImage = req.file ? req.file.path.replace(/\\/g, "/") : null;
        }
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profileImage = profileImage;
        console.log("Updated profileImage:", user.profileImage); 
        await user.save();

        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const userObj = user.toObject({ getters: true, virtuals: false });

        if (userObj.profileImage) {
            userObj.profileImage = `${baseUrl}/${userObj.profileImage}`;
        }

        res.json({ message: "instructor details updated successfully", user: userObj });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

const changePassword = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const { currentPassword, newPassword } = req.body;
        console.log("passwords:", currentPassword, newPassword);
        const isMatch = await user.comparePassword(currentPassword);
        console.log("isMatch:", isMatch);
        if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password changed successfully" });
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
  updateUserDetails,
  userDetails,
  changePassword
};
