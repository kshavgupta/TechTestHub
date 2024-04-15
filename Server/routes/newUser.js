import express from "express";
import { getUser, newUser, userProfile } from "../controllers/newUser.js";

const router = express.Router();

router.post("/newUser", newUser);
router.post("/getUser", getUser);
router.get("/userProfile/:Username", userProfile);

export default router;
