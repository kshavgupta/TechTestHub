import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    Name: {
      type: String,
      required: true,
    },

    Email: {
      type: String,
      required: true,
    },

    Username: {
      type: String,
      required: true,
      unique: true,
    },

    Password: {
      type: String,
      required: true,
    },

    // GoogleId: {
    //   type: String,
    // },

    Questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Questions",
        default: [],
      },
    ],

    Reputation: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("Password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.Password, salt);
    this.Password = hashedPassword;
  }
  next();
  // try {
  //   if (!this.isModified("Password")) {
  //     return next();
  //   }

  //   const salt = await bcrypt.genSalt(10);
  //   const hashedPassword = await bcrypt.hash(this.Password, salt);

  //   this.Password = hashedPassword;
  //   next();
  // } catch (error) {
  //   next(error);
  // }
});

export const Users = mongoose.model("Users", UserSchema);
