import { Users } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const newUser = async (request, response) => {
  try {
    if (!request.body.Username || !request.body.Password) {
      return response.status(400).send({
        message: "Send all required fields",
      });
    }
    const newUser = {
      Name: request.body.Name,
      Email: request.body.Email,
      Username: request.body.Username,
      Password: request.body.Password,
    };

    const user = await Users.create(newUser);
    // remove the keyword 'return'
    response.status(201).send(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};

export const getUser = async (request, response) => {
  const { Username, Password } = request.body;

  try {
    // Find the user by username in the database
    const user = await Users.findOne({ Username });

    // Check if the user exists
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id }, "secret123", {
        expiresIn: "1h",
      });
      return response.status(200).json({ token });
    } else {
      return response
        .status(401)
        .json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
};

export const userProfile = async (request, response) => {
  try {
    const { Username } = request.params;

    const user = await Users.findOne({ Username });

    if (!user) {
      return response.status(404).json({ message: "User Not Found" });
    }

    const userDetails = {
      Name: user.Name,
      Email: user.Email,
      Contribution: user.Contribution,
    };

    return response.status(200).json(userDetails);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};
