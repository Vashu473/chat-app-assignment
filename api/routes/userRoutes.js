const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  getAllUsers,
  edituser,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/all").get(protect, getAllUsers);
router.route("/").post(registerUser);
router.route("/edit/:id").post(edituser);
router.post("/login", authUser);

module.exports = router;
