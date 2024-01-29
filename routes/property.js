const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// Get Property List
router.get("/list", async (req, res) => {
  try {
    const properties = await pool.query("SELECT * FROM property_info");
    res.json({
      status: "success",
      properties: properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// Get Property Details
router.get("/details/:property_id", async (req, res) => {
  try {
    const propertyId = req.params.property_id;

    // Retrieve property details
    const property = await pool.query(
      "SELECT * FROM property_info WHERE property_id = ?",
      [propertyId]
    );

    if (property.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }

    // Retrieve ownership details from user_token_info
    const ownership = await pool.query(
      "SELECT user_id, token_amount FROM user_token_info WHERE property_id = ?",
      [propertyId]
    );

    res.json({
      status: "success",
      property: {
        ...property[0],
        // ownership: ownership,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// Add a new property
router.post("/add", async (req, res) => {
  try {
    const { property_name, address, description, status } = req.body;

    const result = await pool.query(
      "INSERT INTO property_info (property_name, address, description, status) VALUES (?, ?, ?, ?)",
      [property_name, address, description, status]
    );

    res.json({
      status: "success",
      message: "Property added successfully",
      property_id: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// Update property details
router.put("/update/:property_id", async (req, res) => {
  try {
    const propertyId = req.params.property_id;
    const { property_name, address, description, status } = req.body;

    const result = await pool.query(
      "UPDATE property_info SET property_name = ?, address = ?, description = ?, status = ? WHERE property_id = ?",
      [property_name, address, description, status, propertyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }

    res.json({
      status: "success",
      message: "Property updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// Delete a property
router.delete("/delete/:property_id", async (req, res) => {
  try {
    const propertyId = req.params.property_id;

    const result = await pool.query(
      "DELETE FROM property_info WHERE property_id = ?",
      [propertyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Property not found",
      });
    }

    res.json({
      status: "success",
      message: "Property deleted successfully",
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
