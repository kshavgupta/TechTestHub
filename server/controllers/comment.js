import { Comments } from "../models/Comment.js";
import { Questions } from "../models/Question.js";
import { Users } from "../models/User.js";

export const addComment = async (request, response) => {
  try {
    const { _id } = request.params;
    const question = await Questions.findById(_id);

    if (!question) {
      return response
        .status(404)
        .json({ message: "No question found with the specified Title" });
    }

    const newComment = {
      question: _id,
      text: request.body.text,
      postedBy: request.user._id,
      username: request.user.username,
    };

    const cmt = await Comments.create(newComment);
    question.Comments.push(cmt._id);
    await question.save();

    return response
      .status(201)
      .json({ message: "Comment added successfully", cmt, question }); // Remove cmt and question
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const likeComment = async (request, response) => {
  try {
    const userId = request.user._id;
    const { commentId } = request.params;
    const comment = await Comments.findById(commentId);

    if (!comment) {
      return response
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    if (comment.likedBy.includes(userId)) {
      return response.status(400).json({
        success: false,
        message: "You have already liked this comment",
      });
    }

    comment.likes = comment.likes + 1;
    comment.likedBy.push(userId);

    const author = await Users.findById(comment.postedBy);
    author.Reputation += 1;

    await author.save();
    await comment.save();

    response.status(200).json({
      success: true,
      message: "Comment liked successfully",
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
