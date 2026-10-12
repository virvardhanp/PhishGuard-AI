
const { analyzeURL } = require("../services/analyzeService");

async function analyzeController(req, res) {
  try {
    const { url } = req.body;

    if (typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a website URL."
      });
    }

    if (url.length > 2048) {
      return res.status(400).json({
        success: false,
        message: "The URL is too long."
      });
    }

    let parsedURL;

    try {
      parsedURL = new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid URL."
      });
    }

    if (
      !["http:", "https:"].includes(parsedURL.protocol) ||
      !parsedURL.hostname.includes(".") ||
      parsedURL.hostname.startsWith(".")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid HTTP or HTTPS website URL."
      });
    }

    // Wait for the asynchronous OpenAI analysis
    const result = await analyzeURL(url);

    return res.status(200).json(result);

  } catch (error) {
    console.error("URL analysis error:", error);

    return res.status(500).json({
      success: false,
      message: "An error occurred while analyzing the URL."
    });
  }
}

module.exports = { analyzeController };
