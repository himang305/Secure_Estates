const express = require("express");
const router = express.Router();
const pool = require("../config/database");

async function processPayment(user_id, token_num) {
  // Placeholder function; replace with actual payment processing logic
  return { success: true, transactionId: "123abc" };
}

router.post("/make", async (req, res) => {
  try {
    const { user_id, property_id, payment_date, token_num } = req.body;

    const paymentResult = await processPayment(user_id, token_num);

    if (!paymentResult.success) {
      return res.status(400).json({
        status: "error",
        message: "Payment failed",
      });
    }

    // Check if a record with the same user_id and property_id exists
    const existingRecord = await pool.query(
      "SELECT * FROM user_token_info WHERE user_id = ? AND property_id = ?",
      [user_id, property_id]
    );

    console.log("Existing Record:", existingRecord);

    if (existingRecord[0].length > 0) {
      // If the record exists, update the token_amount
      console.log("hello");
      await pool.query(
        "UPDATE user_token_info SET token_amount = token_amount + ? WHERE user_id = ? AND property_id = ?",
        [token_num, user_id, property_id]
      );
    } else {
      // If the record doesn't exist, insert a new record
      console.log("hii");
      await pool.query(
        "INSERT INTO user_token_info (user_id, property_id, token_amount, created_by, modified_by) VALUES (?, ?, ?, ?, ?)",
        [user_id, property_id, token_num, user_id, user_id]
      );
    }

    // Deduct token_num from property_info table
    await pool.query(
      "UPDATE property_info SET num_tokens = num_tokens - ? WHERE property_id = ?",
      [token_num, property_id]
    );

    // Insert payment data into the payment_info table
    const result = await pool.query(
      "INSERT INTO payment_info (user_id, property_id, payment_date, token_num) VALUES (?, ?, ?, ?)",
      [
        user_id,
        property_id,
        payment_date,
        token_num,
        paymentResult.transactionId,
      ]
    );

    res.json({
      status: "success",
      message: "Payment successful",
      payment_id: result.insertId,
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
