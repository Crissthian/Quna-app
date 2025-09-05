import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const { Schema } = mongoose;
// esquema del usuario
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: { type: String, required: true, unique: true },
  listings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

export default mongoose.model("User", userSchema);
