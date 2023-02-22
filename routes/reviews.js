const express = require("express");
const {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");

// import review model
const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

// protect middleware
const { protect, authorize } = require("../middleware/auth");

// advancedResults middleware
const advancedResults = require("../middleware/advancedResults");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);
module.exports = router;
