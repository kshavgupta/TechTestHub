import express from "express";
import { PORT, mongoDBURL } from "./database/connect.js";
import mongoose from "mongoose";
import newQ from "./routes/newQ.js";
import newUser from "./routes/newUser.js";
import cors from "cors";

const app = express();

// Middleware for parsing request body
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: "*",
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

/* Routes */
app.use("/api/question", newQ);
app.use("/api/auth", newUser);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
