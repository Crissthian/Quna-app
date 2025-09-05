import mongoose from "mongoose";
import Review from "./reviews.js";

const { Schema } = mongoose;
// esquema de la coleccion
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  category: {
    type: String,
    enum: [
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
      "all",
    ],
    default: "all",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
