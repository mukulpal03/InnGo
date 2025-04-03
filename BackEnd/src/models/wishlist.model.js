import mongoose, { Schema } from "mongoose";

const wishListSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
    name: {
        type: String
    }
  },
  { timestamps: true },
);

export const WishList = mongoose.model("WishList", wishListSchema);
