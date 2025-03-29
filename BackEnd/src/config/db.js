import mongoose from "mongoose";

const db = async () => {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("DB Connected Sucessfully");
    })
    .catch(() => {
        console.log("DB Connection Failed");
    })
}

export default db;