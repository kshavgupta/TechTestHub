import { Users } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
// import passport from "passport";
// import GoogleStrategy from "passport-google-oauth20";

export const register = async (request, response) => {
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

export const login = async (request, response) => {
  const { Username, Password } = request.body;

  try {
    const user = await Users.findOne({ Username });

    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(Password, user.Password);

    //Put the secret key and expires in .env later
    if (isPasswordValid) {
      const token = jwt.sign(
        { _id: user._id, username: Username },
        "secret123",
        {
          // expiresIn: "1h",
        }
      );
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

// // Google OAuth strategy setup
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/v1/auth/google/callback", // This is the route where Google will redirect after authentication
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user with Google ID exists
//         let user = await Users.findOne({ GoogleId: profile.id });

//         if (!user) {
//           // Create a new user if not found
//           const email = profile.emails[0].value;
//           const username = email.split("@")[0]; // Generate username from email

//           const newUser = {
//             Name: profile.displayName,
//             Email: email,
//             Username: username,
//             GoogleId: profile.id,
//           };

//           user = await Users.create(newUser);
//         }

//         return done(null, user); // Pass user data to serializeUser
//       } catch (error) {
//         console.error("Google OAuth error:", error);
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user._id); // Serialize user ID into session
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await Users.findById(id);
//     done(null, user); // Deserialize user from ID
//   } catch (error) {
//     done(error, null);
//   }
// });

// // Handle Google OAuth callback
// export const googleAuth = passport.authenticate("google", {
//   scope: ["profile", "email"],
// });

// export const googleAuthCallback = passport.authenticate("google", {
//   failureRedirect: "http://localhost:3000/SignIn",
// });

// export const googleAuthRedirect = (request, response) => {
//   // Successful authentication, redirect home or wherever you want
//   const token = jwt.sign(
//     { _id: request.user._id, username: request.user.Username },
//     process.env.JWT_SECRET, // Use your actual JWT secret from .env
//     {
//       // expiresIn: "1h",
//     }
//   );

//   // Send the token as JSON response
//   response.status(200).json({ token });
// };
