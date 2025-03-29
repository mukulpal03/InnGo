import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: [6, "Password must be atleast 6 characters"]
    },
    phone_no: {
        type: String,
        required: true,
    },
    address: String,
    role: {
        type: String,
        enum: ["Guest", "Host", "Admin"],
        default: "Guest"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    passwordResetToken: String,
    passwordResetExpiry: Date,
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;