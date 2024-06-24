import { Questions } from "../models/Question.js";
import { Users } from "../models/User.js";
import { setCache, invalidateCache } from "../middleware/cache.js";

export const viewProfile = async (request, response) => {
  try {
    const { _id } = request.user;
    const user = await Users.findById(_id);

    if (!user) {
      return response.status(404).json({ message: "User Not Found" });
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
    response.status(500).send({ message: error.message });
  }
};

export const addQuestion = async (request, response) => {
  try {
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
    response.status(201).send(qst);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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
    );

    if (!questions || questions.length === 0) {
      return response
        .status(404)
        .json({ message: "You have not uploaded any questions." });
    }

    setCache("Authors", _id, questions, 30 * 24 * 60 * 60);

    return response.status(200).json({ questions });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};
