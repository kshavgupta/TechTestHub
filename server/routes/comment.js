import express from "express";
import { addComment, likeComment } from "../controllers/comment.js";

const router = express.Router();

router.post("/addComment/:_id", addComment);
router.patch("/likeComment/:commentId", likeComment);

//delete comment
export default router;
