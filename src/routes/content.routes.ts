import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ContentModel } from "../models/content.model";
import mongoose from "mongoose";

const router = express.Router();

// Add content
router.post("/content", authMiddleware, async (req, res) => {
  try {
    const { link, type, title, content } = req.body;

    const newContent = await ContentModel.create({
      link,
      type,
      title,
      content,
      userId: req.userId,
    });

    res.status(200).json({
      message: "Content Added",
      content: newContent,
    });
  } catch (error) {
    res.json(500).json({
      message: "Internal Server Error",
    });
  }
});

// Get content
router.get("/content", authMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    content,
  });
});

// delete content
router.delete("/content/:id", authMiddleware, async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({
        message: "Invalid content Id",
      });
    }

    const result = await ContentModel.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(contentId),
      userId: userId,
    });

    if (!result) {
      res.status(404).json({
        message: "Content not found or unauthorized",
      });
      return;
    }

    res.status(200).json({
      message: "Content deleted successfully",
      success: true,
      deletedId: contentId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

export default router;
