import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoute.js";
import dbConnect from "./utils/dbConnect.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";
import cors from "cors";
import pinRoutes from "./routes/pinRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://pin-nest.vercel.app/", // Your React app's origin
    credentials: true, // Allow cookies
  })
);
app.use("/api/auth", authRouter);
app.use("/api/user", userRoute);
app.use("/api/pin", pinRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
