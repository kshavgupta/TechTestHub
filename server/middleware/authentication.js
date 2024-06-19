import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export default function authenticateToken(request, response, next) {
  const token = request.header("Authorization")?.split(" ")[1];

  if (!token) {
    return response
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const secretKey = process.env.JWT_SECRET || "secret123";
    const payload = jwt.verify(token, secretKey);

    request.user = payload;
    next();
  } catch (error) {
    return response.status(400).json({ message: "Invalid token." });
  }
}
