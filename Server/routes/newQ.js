import express from "express";
import {
  newQuestion,
  questionsbyTopic,
  questionsbyCompany,
  oneQuestion,
  addComment,
  getComments,
} from "../controllers/newQ.js";

const router = express.Router();

router.post("/newQuestion", newQuestion);
router.post("/addComment/:Title", addComment);
router.get("/questionsbyCompany/:Company", questionsbyCompany);
router.get("/questionsbyTopic/:Topic", questionsbyTopic);
router.get("/oneQuestion/:Title", oneQuestion);
router.get("/getComments/:Title", getComments);
export default router;
