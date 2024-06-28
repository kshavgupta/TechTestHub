import express from "express";
import {
  getQuestion,
  getQuestionsbyTopic,
  getQuestionsbyCompany,
  getComments,
} from "../controllers/question.js";
import { checkCache } from "../middleware/cache.js";

const router = express.Router();

router.get("/getQuestion/:_id", getQuestion);
router.get(
  "/getQuestionsbyCompany/:Company",
  checkCache("Companies"),
  getQuestionsbyCompany
);
router.get(
  "/getQuestionsbyTopic/:Topic",
  checkCache("Topics"),
  getQuestionsbyTopic
);
router.get("/getComments/:_id", getComments);

export default router;
