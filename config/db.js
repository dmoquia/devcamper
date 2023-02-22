const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    const connention = mongoose.connection;
    connention.once("open", () => {
      console.log("mongoDB connected successfully");
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
