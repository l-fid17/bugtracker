const mongoose = require("mongoose");

const dbUsr = "DB_USER_HERE";
const dbPass = "DB_PASS_HERE";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbUsr}:${dbPass}@cluster0.zjjhm.mongodb.net/bugtracker?retryWrites=true&w=majority`
    );
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
