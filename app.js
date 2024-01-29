// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const db = require("./config/database"); // Import the database configuration
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware to handle MySQL connection from the pool
app.use((req, res, next) => {
  req.mysql = db;
  next();
});

// Import your route handlers here
const userRoutes = require("./routes/user");
const propertyRoutes = require("./routes/property");
const paymentRoutes = require("./routes/payment");

// Use the route handlers
app.use("/api/user", userRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
