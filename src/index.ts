import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import shareLinkRoutes from "./routes/sharelink.routes";
import connectDB from "./models/connectDB";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", authRoutes);
app.use("/api/v1", contentRoutes);
app.use("/api/v1", shareLinkRoutes);

app.listen(3000, () => {
  connectDB();
  console.log(`Server is running on port 3000`);
});
