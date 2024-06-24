import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
// import passport from "passport";
// import cookieSession from "cookie-session";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*",
  optionSuccessStatus: 200,
};

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(helmet());
app.use(cors(corsOptions));
// app.use(
//   cookieSession({
//     name: "session",
//     keys: [process.env.COOKIE_KEY], // Replace with your own session secret
//     maxAge: 24 * 60 * 60 * 1000,
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // Ensure this is set to true in production
//     sameSite: "strict",
//   })
// );
// app.use(function (request, response, next) {
//   if (request.session && !request.session.regenerate) {
//     request.session.regenerate = (cb) => {
//       cb();
//     };
//   }
//   if (request.session && !request.session.save) {
//     request.session.save = (cb) => {
//       cb();
//     };
//   }
//   next();
// });
// app.use(passport.initialize());
// app.use(passport.session());

// import { PORT, mongoDBURL } from "./database/db.js";
import connectDB from "./database/connect.js";
import redis from "./database/redis.js"; //Comment
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

// mongoose
//   .connect(mongoDBURL)
//   .then(() => {
//     console.log("App connected to database");
//     app.listen(PORT, () => {
//       console.log(`App is listening to port: ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

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
