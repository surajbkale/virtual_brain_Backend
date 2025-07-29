import express from "express";
import { z } from "zod";
import { UserModel } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const requiredObj = z.object({
    name: z.string().min(3).max(20),
    email: z.string().email().min(3).max(100),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  });

  const parsedData = requiredObj.safeParse(req.body);
  if (!parsedData.success) {
    res.status(411).json({
      message: "Invalid inputs",
      error: parsedData.error,
    });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(403).json({
        message: "User already exsits with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Signed Up",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const response = await UserModel.findOne({
      email: email,
    });

    if (!response) {
      res.status(404).json({
        message: "User not found",
      });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      response?.password as string
    );

    if (!matchedPassword) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: response?._id,
      },
      process.env.JWT_USER_SECRET as string,
      { expiresIn: "96h" }
    );

    res.status(200).json({
      message: "Signed in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
