// export const PORT = 5555;
// export const mongoDBURL =
//   "mongodb+srv://ayashika2624:IIITAllahabad@cluster0.0ubwtaq.mongodb.net/";
import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose.connect(url);
};

export default connectDB;
