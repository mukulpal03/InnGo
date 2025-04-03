import mongoose, { Schema } from "mongoose";
import { AvailableBookingEnum, BookingStatusEnum } from "../utils/constants.js";

const bookingSchema = new Schema(
  {
    transaction: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    check_in: {
      type: Date,
      required: true,
    },
    check_out: {
      type: Date,
      required: true,
    },
    bookingAmount: {
      type: Number,
    },
    status: {
      type: String,
      enum: AvailableBookingEnum,
      default: BookingStatusEnum.PENDING,
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
