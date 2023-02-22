const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/adminUserController");

const User = require("../models/User");
// const Course = require("../models/Course");

const router = express.Router({ mergeParams: true });

// protect middleware
const { protect, authorize } = require("../middleware/auth");

// advancedResults middleware
const advancedResults = require("../middleware/advancedResults");

// instead of passing these middleware on every single route like we did on first route (commented out),
// we just  initialized on the top using route.use() method and pass it in so anything below it, then these middleware will be applied
router.use(protect);
router.use(authorize("admin"));

// router.route("/").get(protect,authorize('admin'),advancedResults(User), getAllUsers);
router.route("/").get(advancedResults(User), getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
