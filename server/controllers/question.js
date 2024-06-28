import { Questions } from "../models/Question.js";
import { Comments } from "../models/Comment.js";
import { setCache } from "../middleware/cache.js";

export const getQuestion = async (request, response) => {
  try {
    const { _id } = request.params;

    const ques = await Questions.find({ _id }, { Question: 1, Image: 1 });

    if (!ques) {
      return response
        .status(404)
        .json({ message: "No question found with the specified Topic" });
    }

    return response.status(200).json({
      data: ques.map((question) => ({
        Question: question.Question,
        Image: question.Image,
        _id: question._id,
      })),
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const getQuestionsbyTopic = async (request, response) => {
  try {
    const { Topic } = request.params;

    const ques = await Questions.find(
      { Topic },
      { _id: 1, Company: 1, Title: 1 }
    );

    if (!ques || ques.length === 0) {
      return response
        .status(404)
        .json({ message: "No question found with the specified topic" });
    }

    const data = ques.map((question) => ({
      _id: question._id,
      Company: question.Company,
      Title: question.Title,
    }));

    setCache("Topics", Topic, data, 7 * 24 * 60 * 60);

    return response.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const getQuestionsbyCompany = async (request, response) => {
  try {
    const { Company } = request.params;

    const ques = await Questions.find(
      { Company },
      { _id: 1, Topic: 1, Title: 1 }
    );

    if (!ques || ques.length === 0) {
      return response
        .status(404)
        .json({ message: "No question found with the specified company" });
    }

    const data = ques.map((question) => ({
      _id: question._id,
      Topic: question.Topic,
      Title: question.Title,
    }));

    setCache("Companies", Company, data, 2 * 24 * 60 * 60);

    return response.status(200).json({ data: data });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const getComments = async (request, response) => {
  try {
    const { _id } = request.params;

    const question = await Questions.findById(_id);

    if (question.length == 0) {
      return response
        .status(404)
        .json({ message: "No question found with the specified Title" });
    }

    const commentIds = question.Comments;

    const comments = await Comments.find(
      { _id: { $in: commentIds } },
      "text postedBy username likes"
    );

    return response.status(200).json({ comments });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};
