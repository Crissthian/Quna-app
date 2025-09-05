import Joi from "joi";

export const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid(
        "rooms",
        "cities",
        "mountains",
        "castles",
        "pools",
        "camping",
        "farms",
        "beach",
        "luxury",
        "cabins",
        "boats",
        "nature",
        "desert",
        "all"
      )
      .default("all"),
  }).required(),
});

export const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).default(1).required(),
    comment: Joi.string().required(),
  }).required(),
});
