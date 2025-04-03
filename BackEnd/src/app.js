import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/users", userRoutes);

export default app;