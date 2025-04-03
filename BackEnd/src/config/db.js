import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected successfully");
  } catch (error) {
    console.log("DB Connection Error");
    process.exit(1);
  }
};

export default db;
