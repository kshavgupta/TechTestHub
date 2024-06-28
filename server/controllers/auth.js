import { Users } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export const register = async (request, response) => {
  try {
    const { Name, Email, Username, Password } = request.body;

    // Check if the email already exists
    const existingUser = await Users.findOne({ Email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }

    // Check if the username already exists
    const existingUsername = await Users.findOne({ Username });
    if (existingUsername) {
      return response.status(400).json({
        success: false,
        message: "Username is already in use.",
      });
    }

    // Create a new user object
    const newUser = {
      Name,
      Email,
      Username,
      Password,
    };

    // Save the new user to the database
    const user = await Users.create(newUser);
    response.status(201).json({
      user,
      success: true,
      message: "You have created your account successfully.",
    });
  } catch (error) {
    console.log(error.message);
    if (error.name === "ValidationError") {
      const errorMessage = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      response.status(400).json({ success: false, message: errorMessage });
    } else {
      response.status(500).json({ success: false, message: error.message });
    }
  }
};

export const login = async (request, response) => {
  const { Username, Password } = request.body;

  try {
    const user = await Users.findOne({ Username });

    if (!user) {
      return response
        .status(401)
        .json({ success: false, message: "Username does not exist." });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: user._id, username: Username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      return response.status(200).json({
        token,
        success: true,
        message: "You have signed in successfully.",
      });
    } else {
      return response
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
