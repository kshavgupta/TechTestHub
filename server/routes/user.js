import express from "express";
import {
  viewProfile,
  addQuestion,
  getQuestions,
  deleteQuestion,
} from "../controllers/user.js";
import { checkCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/viewProfile", viewProfile);
//edit profile
router.post("/addQuestion", addQuestion);
router.get("/getQuestions", checkCache("Authors"), getQuestions);
router.delete("/deleteQuestion/:_id", deleteQuestion);

export default router;
