import express from "express";
import reviewControlller from "../controllers/reviews.js";
import { reviewSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js";
import isLoggedIn from "../utils/isLoggedIn.js";
import isReviewAuthor from "../utils/isreviewAuthor.js";
import wrapAsync from "../utils/wrapAsync.js";
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewControlller.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControlller.destroyReview)
);

export default router;
