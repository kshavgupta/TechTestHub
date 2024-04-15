import { Questions } from "../models/Question.js";

export const newQuestion = async (request, response) => {
  try {
    if (!request.body.Company || !request.body.Question) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }
    const newQuestion = {
      Company: request.body.Company,
      Topic: request.body.Topic,
      Title: request.body.Title,
      Question: request.body.Question,
      Author: request.body.Author,
      Image: request.body.Image,
    };

    const qst = await Questions.create(newQuestion);
    // remove the keyword 'return'
    response.status(201).send(qst);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const questionsbyTopic = async (request, response) => {
  try {
    const { Topic } = request.params;

    const ques = await Questions.find({ Topic }, { Company: 1, Title: 1 });

    if (!ques || ques.length === 0) {
      return response
        .status(404)
        .json({ message: "No question found with the specified topic" });
    }

    return response.status(200).json({
      data: ques.map((question) => ({
        Company: question.Company,
        Title: question.Title,
      })),
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const questionsbyCompany = async (request, response) => {
  try {
    const { Company } = request.params;

    const ques = await Questions.find({ Company }, { Topic: 1, Title: 1 });

    if (!ques || ques.length === 0) {
      return response
        .status(404)
        .json({ message: "No question found with the specified company" });
    }

    return response.status(200).json({
      data: ques.map((question) => ({
        Topic: question.Topic,
        Title: question.Title,
      })),
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const questionsbyAuthor = async (request, response) => {
  try {
    const { Author } = request.params;

    const ques = await Questions.find(
      { Author },
      { Company: 1, Topic: 1, Title: 1 }
    );

    if (!ques || ques.length === 0) {
      return response
        .status(404)
        .json({ message: "You have not uploaded any questions." });
    }

    return response.status(200).json({
      data: ques.map((question) => ({
        Topic: question.Topic,
        Company: question.Company,
        Title: question.Title,
      })),
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const oneQuestion = async (request, response) => {
  try {
    const { Title } = request.params;

    const ques = await Questions.find({ Title }, { Question: 1, Image: 1 });

    if (!ques) {
      return response
        .status(404)
        .json({ message: "No question found with the specified Topic" });
    }

    return response.status(200).json({
      data: ques.map((question) => ({
        Question: question.Question,
        Image: question.Image,
      })),
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};




export const addComment = async (request, response) => {
  try {
    const { Title } = request.params;
    const { text, postedBy } = request.body;

    const question = await Questions.findOne({ Title });

    if (!question) {
      return response
        .status(404)
        .json({ message: "No question found with the specified Title" });
    }

    // Ensure postedBy is saved as a string
    question.Comments.push({ text, postedBy: String(postedBy) });
    await question.save();

    return response.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};




export const getComments = async (request, response) => {
  try {
    const { Title } = request.params;

    // Use findOne() instead of find()
    const question = await Questions.findOne({ Title });

    if (!question) {
      return response.status(404).json({ message: "No question found with the specified Title" });
    }

    // Ensure that comments exist before attempting to map over them
    const comments = question.Comments.map(comment => ({
      text: comment.text,
      postedBy: comment.postedBy
    }));

    return response.status(200).json({ comments });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

