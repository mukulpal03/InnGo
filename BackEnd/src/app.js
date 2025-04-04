import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    statusCode,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    success: false,
  });
});

export default app;
