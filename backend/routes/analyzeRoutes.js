
const express = require("express");
const router = express.Router();

const {
  analyzeController
} = require("../controllers/analyzeController");

// Endpoint for URL analysis
router.post("/analyze", analyzeController);

module.exports = router;
