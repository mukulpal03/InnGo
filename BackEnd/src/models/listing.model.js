import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      url: {
        type: String,
        default:
          "https://www.pngkey.com/png/full/360-3608307_placeholder-hotel-house.png",
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export const Listing = mongoose.model("Listing", listingSchema);
