import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    paymentStatus: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
