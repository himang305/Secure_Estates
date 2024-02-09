const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const multer = require("multer");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Generate unique file names
    console.log(req.file);
  },
});

const upload = multer({ storage: storage });

// Get Property List
router.get("/list", async (req, res) => {
  try {
    const properties = await pool.query("SELECT * FROM property_info");

    res.json({
      status: "success",
      properties: properties[0],
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

    res.json({
      status: "success",
      property: {
        ...property[0],
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
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { property_name, address, description, status } = req.body;
    let imgFilename = null;

    // Check if a file has been uploaded
    if (req.file) {
      imgFilename = req.file.filename; // Retrieve the file name of the uploaded image
    }

    const result = await pool.query(
      "INSERT INTO property_info (property_name, address, description, status, img_filename) VALUES (?, ?, ?, ?, ?)",
      [property_name, address, description, status, imgFilename]
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
// Update property details
router.put("/update/:property_id", upload.single("image"), async (req, res) => {
  try {
    const propertyId = req.params.property_id;
    const { property_name, address, description, status } = req.body;
    let imgFilename = null;

    // Check if a file has been uploaded
    if (req.file) {
      imgFilename = req.file.filename; // Retrieve the file name of the uploaded image
    }

    const result = await pool.query(
      "UPDATE property_info SET property_name = ?, address = ?, description = ?, status = ?, img_filename = ? WHERE property_id = ?",
      [property_name, address, description, status, imgFilename, propertyId]
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
