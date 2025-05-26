import mongoose from "mongoose";

const connectToDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Databse connected successfully...");
  } catch (err) {
    console.log("Error while connecting to database: ", err.message);
  }
};
export default connectToDB;
