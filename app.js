const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./src/config/db");
const urlController = require("./src/controllers/urlController");
const setupSwagger = require("./src/config/swagger");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

// MongoDB connection
connectDB();

app.use(express.json());
app.use("/api/v1", urlController);

// Swagger API docs
setupSwagger(app);

// catch error unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "ERROR",
    code: 404,
    success: false,
    message: "Route not found",
  });
});

// central error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err); 
  res.status(500).json({
    status: "ERROR",
    code: 500,
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
