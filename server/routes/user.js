import express from "express";
import { viewProfile, addQuestion, getQuestions } from "../controllers/user.js";
import { checkCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/viewProfile", viewProfile); //view profile
//edit profile
router.post("/addQuestion", addQuestion); //add question
router.get("/getQuestions", checkCache("Authors"), getQuestions); //get questions
//delete question

export default router;
