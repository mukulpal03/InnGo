import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    roomType: {
      type: String,
    },
    pricePerNight: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

export const Room = mongoose.model("Room", roomSchema);
