import { Questions } from "../models/Question.js";
import { Users } from "../models/User.js";
import { Comments } from "../models/Comment.js";
import { setCache, invalidateCache } from "../middleware/cache.js";

export const viewProfile = async (request, response) => {
  try {
    const { _id } = request.user;
    const user = await Users.findById(_id);

    if (!user) {
      return response
        .status(404)
        .json({ success: false, message: "User no longer exists" });
    }

    const userDetails = {
      Name: user.Name,
      Username: user.Username,
      Email: user.Email,
      Reputation: user.Reputation,
      Questions: user.Questions.length,
    };

    return response.status(200).json(userDetails);
  } catch (error) {
    console.log(error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const addQuestion = async (request, response) => {
  try {
    const existingQuestion = await Questions.findOne({
      Title: request.body.Title,
    });
    if (existingQuestion) {
      return response.status(400).json({
        success: false,
        message: "Question with this title already exists.",
      });
    }

    const newQuestion = {
      Company: request.body.Company,
      Topic: request.body.Topic,
      Title: request.body.Title,
      Question: request.body.Question,
      Author: request.user._id,
      Image: request.body.Image,
    };

    const qst = await Questions.create(newQuestion);

    const author = await Users.findById(qst.Author);
    author.Questions.push(qst._id);
    await author.save();

    // Invalidate the cache for the specific company and topic
    invalidateCache("Companies", request.body.Company);
    invalidateCache("Topics", request.body.Topic);
    invalidateCache("Authors", request.user._id);

    // remove the keyword 'return'
    response.status(201).json({
      success: true,
      message: "You have uploaded the question.",
    });
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getQuestions = async (request, response) => {
  try {
    const { _id } = request.user;
    const user = await Users.findById(_id);
    const questionIds = user.Questions;

    const questions = await Questions.find(
      { _id: { $in: questionIds } },
      "Title Company Topic"
    ).sort({ createdAt: -1 });

    // if (!questions || questions.length === 0) {
    //   return response
    //     .status(404)
    //     .json({ message: "You have not uploaded any questions." });
    // }

    setCache("Authors", _id, questions, 30 * 24 * 60 * 60);

    return response.status(200).json({ questions });
  } catch (error) {
    console.log(error.message);
    response.status(500).json({
      success: false,
      message: "Internal server error. Failed to load questions.",
    });
  }
};

export const deleteQuestion = async (request, response) => {
  const { _id } = request.params; // Assuming _id is passed as a parameter

  try {
    // Find the question by its ID
    const question = await Questions.findById(_id);
    if (!question) {
      return response.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    // Invalidate cache for related entities
    invalidateCache("Companies", question.Company);
    invalidateCache("Topics", question.Topic);
    invalidateCache("Authors", request.user._id);

    // Comments Deleted
    const commentIds = question.Comments;
    for (const commentId of commentIds) {
      // Find each comment by its ID
      const comment = await Comments.findById(commentId); // Missing await
      if (comment) {
        // Find the user who posted the comment
        const user = await Users.findById(comment.postedBy); // Missing await
        if (user) {
          user.Reputation -= comment.likes;
          await user.save();
        }
        // Delete the comment
        await Comments.findByIdAndDelete(commentId); // Missing await
      }
    }

    // Delete the question
    await Questions.findByIdAndDelete(_id);

    // Remove the question ID from the author's questions array
    const author = await Users.findById(request.user._id);
    if (author) {
      author.Questions = author.Questions.filter((id) => id.toString() !== _id); // Ensure the types match
      await author.save();
    }

    // Send success response
    response.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    response.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
