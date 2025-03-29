import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import db from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 4000;

db()

app.get("/", (req, res) => {
    res.send("home page")
})

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})