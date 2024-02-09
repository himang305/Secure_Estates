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

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/form.html");
// });

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

// Import necessary modules
// const express = require("express");
// const bodyParser = require("body-parser");
// const db = require("./config/database"); // Import the database configuration
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json());

// // Middleware to handle MySQL connection from the pool
// app.use((req, res, next) => {
//   req.mysql = db;
//   next();
// });

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Specify the destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname); // Generate unique file names
//   },
// });

// const upload = multer({ storage: storage });

// // Import your route handlers here
// const userRoutes = require("./routes/user");
// const propertyRoutes = require("./routes/property");
// const paymentRoutes = require("./routes/payment");

// // Use the route handlers
// app.use("/api/user", userRoutes);
// app.use("/api/property", propertyRoutes);
// app.use("/api/payment", paymentRoutes);

// app.post("/api/upload", upload.single("image"), (req, res) => {
//   // File uploaded successfully
//   res.json({
//     status: "success",
//     message: "File uploaded successfully",
//     filename: req.file.filename, // Provide the uploaded file's filename
//   });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
