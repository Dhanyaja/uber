import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://dhanyaja2003:Dhanyaja_2003@cluster0.hwqbcxu.mongodb.net/Uber"
    )
    .then(() => console.log("DB Connected"));
};

export default connectDB;
