const express = require("express");
const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const router = express.Router({ mergeParams: true });

// protect middleware
const { protect, authorize } = require("../middleware/auth");

// advancedResults middleware
const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse); // add and get new routes

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse); // update routes

module.exports = router;
