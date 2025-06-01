const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../utils/authUtils");
const { ROLES } = require("../types/roles");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/admin/dashboard", protect, authorize(ROLES.ADMIN), (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

router.get("/user", protect, getAllUsers);
router.get("/user/:id", protect, getUser);
router.put("/update/:id", protect, updateUser);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;
