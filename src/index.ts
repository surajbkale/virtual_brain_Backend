import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", authRoutes);







interface MainApp {
  (app: express.Express): Promise<void>;
}

const main: MainApp = async (app) => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);

    console.log("MongoDB connected!");

    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  } catch (error) {
    console.error("Failed to connect: ", error);
  }
};

main(app);
