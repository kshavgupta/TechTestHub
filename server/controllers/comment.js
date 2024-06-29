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
        .json({ success: false, message: "Question no longer exists" });
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

    return response.status(201).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    console.log(error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const deleteComment = async (request, response) => {
  const { _id } = request.params;
  const userId = request.user._id;
  try {
    const comment = await Comments.findById(_id);
    if (!comment) {
      return response.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    // Check if the user is the author of the comment
    if (comment.postedBy.toString() !== userId) {
      return response.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment.",
      });
    }

    // Find the user who posted the comment
    const user = await Users.findById(comment.postedBy);
    user.Reputation -= comment.likes;
    await user.save();

    // Delete the comment
    await Comments.findByIdAndDelete(_id);

    // Send success response
    response.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
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
        message: "You have already upvoted this comment",
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
      message: "You have upvoted the comment.",
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const dislikeComment = async (request, response) => {
  const userId = request.user._id;
  const { commentId } = request.params;

  try {
    const comment = await Comments.findById(commentId);

    if (!comment) {
      return response
        .status(404)
        .json({ success: false, message: "Comment not found." });
    }

    if (!comment.likedBy.includes(userId)) {
      return response.status(400).json({
        success: false,
        message: "You are not authorized to downvote this comment.",
      });
    }

    // Decrement likes and remove user ID from likedBy array
    comment.likes -= 1;
    comment.likedBy = comment.likedBy.filter((id) => id.toString() !== userId);

    const author = await Users.findById(comment.postedBy);
    author.Reputation -= 1;

    await author.save();
    await comment.save();

    response.status(200).json({
      success: true,
      message: "You have downvoted the comment.",
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
