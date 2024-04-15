import mongoose from "mongoose";

const questionSchema = mongoose.Schema(
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
    },

    Question: {
      type: String,
      required: true,
    },

    Author: {
      type: String,
    },

    Image: {
      type: String,
    },

    Comments: [
      {
        text: {
          type: String,
          required: true,
        },
        postedBy: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Questions = mongoose.model("Questions", questionSchema);
