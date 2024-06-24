import express from "express";
import {
  getQuestion,
  getQuestionsbyTopic,
  getQuestionsbyCompany,
  getComments,
} from "../controllers/question.js";
import { checkCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/getQuestion/:_id", getQuestion); //get question
router.get(
  "/getQuestionsbyCompany/:Company",
  checkCache("Companies"),
  getQuestionsbyCompany
); //get questionsbycompany
router.get(
  "/getQuestionsbyTopic/:Topic",
  checkCache("Topics"),
  getQuestionsbyTopic
); // by topic
router.get("/getComments/:_id", getComments);

export default router;
