import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import shareLinkRoutes from "./routes/sharelink.routes";
import connectDB from "./models/connectDB";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://virtual-brain.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", contentRoutes);
app.use("/api/v1", shareLinkRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port 3000`);
});
