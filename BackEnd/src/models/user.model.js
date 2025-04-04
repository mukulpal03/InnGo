import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: [6, "Password must be atleast 6 characters"],
    },
    phone_no: {
      type: String,
      required: true,
    },
    address: String,
    role: {
      type: String,
      enum: ["Guest", "Host", "Admin"],
      default: "Guest",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpiry: Date,
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
    },
    wishlist: {
      type: Schema.Types.ObjectId,
      ref: "WishList",
    },
    reviews: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

export default User;
