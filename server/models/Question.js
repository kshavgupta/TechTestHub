// import mongoose from "mongoose";

// const questionSchema = mongoose.Schema(
//   {
//     Company: {
//       type: String,
//       required: true,
//     },

//     Topic: {
//       type: String,
//       required: true,
//     },

//     Title: {
//       type: String,
//       required: true,
//     },

//     Question: {
//       type: String,
//     },

//     Image: {
//       type: String,
//       default: "",
//     },

//     Author: {
//       type: String,
//       required: true,
//     },

//     Comments: [
//       {
//         text: {
//           type: String,
//           required: true,
//         },
//         postedBy: {
//           type: String,
//           required: true,
//         },
//         likes: {
//           type: Number,
//           default: 0,
//         },
//         likedBy: [String],
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export const Questions = mongoose.model("Questions", questionSchema);

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
