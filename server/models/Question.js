import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema(
  {
    Company: {
      type: String,
      required: true,
    },
    Topic: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
      unique: true,
    },
    Question: {
      type: String,
      default: "",
    },
    Image: {
      type: String,
      default: "",
    },
    Author: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    Comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const Questions = mongoose.model("Questions", QuestionSchema);
