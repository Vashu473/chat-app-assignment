const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    // for your real project use .env file for db urls
    const conn = await mongoose.connect(
      "mongodb+srv://vmanishkumar04:vashudev@cluster0.8n7bdot.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    );

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;
