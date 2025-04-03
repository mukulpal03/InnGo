import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema({
    totalRooms: {
        type: Number,
        required: true  
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    maxGuests: {
        type: Number,
        required: true
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    listings: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }
}, { timestamps: true });

export const Hotel = mongoose.model("Hotel", hotelSchema);