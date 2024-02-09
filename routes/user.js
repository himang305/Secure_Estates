// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const pool = require("../config/database");

// // User Registration
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if the user with the given email already exists
//     const existingUser = await pool.query(
//       "SELECT * FROM user_info WHERE LOWER(email) = LOWER(?)",
//       [email]
//     );
//     // console.log(existingUser);

//     if (existingUser[0].length > 0) {
//       return res.status(400).json({
//         status: "error",
//         message: "Email already registered",
//       });
//     }

//     // Hash the password before storing it in the database
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insert user data into the user_info table
//     const result = await pool.query(
//       "INSERT INTO user_info (username, email, password_hash) VALUES (?, ?, ?)",
//       [username, email, hashedPassword]
//     );

//     res.json({
//       status: "success",
//       user_id: result.insertId,
//       message: "User registered successfully",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: "error",
//       message: "Internal Server Error",
//     });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../config/database");

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide a username, email, and password.",
      });
    }

    // Check if the user with the given email already exists
    const existingUser = await pool.query(
      "SELECT * FROM user_info WHERE LOWER(email) = LOWER(?)",
      [email]
    );

    if (existingUser[0] && existingUser[0].length > 0) {
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email exists
    const user = await pool.query(
      "SELECT * FROM user_info WHERE LOWER(email) = LOWER(?)",
      [email]
    );

    if (user[0].length === 0) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    // Validate password
    const hashedPassword = user[0][0].password_hash;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);

    if (!passwordMatch) {
      return res.status(400).json({
        status: "error",
        message: "Incorrect password",
      });
    }

    // Fetch properties associated with the user
    const properties = await pool.query(
      "SELECT * FROM user_token_info WHERE user_id = ?",
      [user[0][0].user_id]
    );

    // If the email and password are correct, return user information and properties
    res.json({
      status: "success",
      user_id: user[0][0].user_id,
      username: user[0][0].username,
      properties: properties[0],
      message: "Login successful",
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
