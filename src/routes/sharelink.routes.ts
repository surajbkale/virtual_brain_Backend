import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ContentModel } from "../models/content.model";
import mongoose from "mongoose";
import { LinkModel } from "../models/link.model";
import { generateUniqueHash } from "../utils/createhash";
import { UserModel } from "../models/user.model";

const router = express.Router();

// Share brain
router.post("/brain/share", authMiddleware, async (req, res) => {
  try {
    const { share } = req.body;

    if (share) {
      const existingLink = await LinkModel.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }

      const hash = generateUniqueHash();
      await LinkModel.create({
        userId: req.userId,
        hash: hash,
      });

      res.status(201).json({
        hash,
      });
    } else {
      const result = await LinkModel.deleteOne({
        userId: req.userId,
      });

      if (result.deletedCount === 0) {
        res.status(404).json({
          message: "No link found to remove",
        });
        return;
      }

      res.status(200).json({
        message: "Link Removed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// access the shared public brain
router.get("/brain/:shareLink", async (req, res) => {
  try {
    const hash = req.params.shareLink;

    const shareLink = await LinkModel.findOne({ hash });

    if (!shareLink) {
      res.status(404).json({
        message: "Share link not found",
      });
      return;
    }

    const content = await ContentModel.find({
      userId: shareLink.userId,
    }).sort({ createdAt: -1 });

    const user = await UserModel.findById(shareLink.userId);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      username: user.name || user.email,
      content,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      //   error: error?.message || "Unknown Error",
    });
  }
});

export default router;
