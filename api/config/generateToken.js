const jwt = require("jsonwebtoken");

// for your real project use .env file for secretes
const generateToken = (id) => {
  return jwt.sign({ id }, "process.env.JWT_SECRET", {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
