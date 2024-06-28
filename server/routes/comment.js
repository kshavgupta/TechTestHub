import express from "express";
import {
  addComment,
  likeComment,
  deleteComment,
  dislikeComment,
} from "../controllers/comment.js";

const router = express.Router();

router.post("/addComment/:_id", addComment);
router.delete("/deleteComment/:_id", deleteComment);
router.patch("/likeComment/:commentId", likeComment);
router.patch("/dislikeComment/:commentId", dislikeComment);

export default router;
