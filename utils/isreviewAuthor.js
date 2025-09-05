import Review from "../models/reviews.js";

const isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "🚫 No tienes permiso para hacer eso!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

export default isReviewAuthor;
