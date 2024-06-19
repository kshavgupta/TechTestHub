import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Questions",
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const Comments = mongoose.model("Comments", CommentSchema);
