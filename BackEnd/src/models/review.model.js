import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
    description: {
      type: String,
    },
    ratings: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Review = mongoose.model("Review", reviewSchema);
