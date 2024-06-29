import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://tech-test-hub.vercel.app",
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*",
  optionSuccessStatus: 200,
};

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(cors(corsOptions));

import connectDB from "./database/connect.js";
import authRouter from "./routes/auth.js";
import commentRouter from "./routes/comment.js";
import questionRouter from "./routes/question.js";
import userRouter from "./routes/user.js";
import authenticateUser from "./middleware/authentication.js";
import notFoundMiddleware from "./middleware/notFound.js";

/* Routes */
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/comment", authenticateUser, commentRouter);
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/user", authenticateUser, userRouter);

app.use(notFoundMiddleware);

const port = process.env.PORT || 5555;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
