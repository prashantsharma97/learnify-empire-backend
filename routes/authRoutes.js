const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserDetails,
  userDetails,
  changePassword
} = require("../controllers/userController");
const { protect, authorize } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");
const uploadFile = require("multer-upload-helper");

const router = express.Router();

const upload = uploadFile({
    destination: "uploads/",
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: /jpeg|jpg|png|pdf/
});

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admin/dashboard", protect, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});
// all users routes
router.get("/user", protect, getAllUsers);
router.get("/user/:id", protect, getUser);
router.put("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);

// user details route
router.get("/user-details", protect, userDetails);
router.put("/update-user-details", protect, upload.single("profileImage"), updateUserDetails);
router.put("/change-password", protect, changePassword);



module.exports = router;
