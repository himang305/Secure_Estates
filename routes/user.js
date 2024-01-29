const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import the MySQL connection pool from app.js
const pool = require("../config/database");

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user with the given email already exists
    const existingUser = await pool.query(
      "SELECT * FROM user_info WHERE LOWER(email) = LOWER(?)",
      [email]
    );
    // console.log(existingUser);

    if (existingUser[0].length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
      });
    }

    // Hash the password before storing it in the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user data into the user_info table
    const result = await pool.query(
      "INSERT INTO user_info (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.json({
      status: "success",
      user_id: result.insertId,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
