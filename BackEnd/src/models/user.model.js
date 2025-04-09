import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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
    verificationTokenExpiry: Date,
    passwordResetToken: String,
    passwordResetExpiry: Date,
    refreshToken: {
      type: String
    },
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
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY },
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000;

  return { token, tokenExpiry };
};

const User = mongoose.model("User", userSchema);

export default User;
