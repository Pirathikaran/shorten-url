const express = require("express");
const urlService = require("../services/urlService");
const router = express.Router();
const validator = require("validator");
const responseHandler = require("../middlewares/responseHandler");

const shortDomain = process.env.SHORT_DOMAIN || "http://short.ly";

/**
 * @swagger
 * /api/v1/shorten:
 *   post:
 *     summary: Shorten a long URL
 *     description: Takes a long URL and returns a short URL
 *     parameters:
 *       - in: body
 *         name: long_url
 *         description: The long URL to shorten
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             long_url:
 *               type: string
 *               example: "https://example.com"
 *     responses:
 *       200:
 *         description: Successfully shortened URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 short_url:
 *                   type: string
 *                   example: "http://short.ly/abc123"
 *       400:
 *         description: Invalid URL format
 *       500:
 *         description: Internal server error
 *
 *  */

router.post("/shorten", async (req, res) => {
  try {
    const { long_url } = req.body;

    // Validate the URL
    if (!long_url || !validator.isURL(long_url)) {
      return responseHandler.error(res, "Invalid URL format", 400);
    }

    const shortUrl = await urlService.shortenUrl(long_url);
    responseHandler.success(res, "URL shortened successfully", {
      short_url: `${shortDomain}/${shortUrl}`,
    });
  } catch (error) {
    responseHandler.error(res, error.message, 500);
  }
});

/**
 * @swagger
 * /api/v1/{short_url}:
 *   get:
 *     summary: Redirect to the original long URL
 *     description: Takes a short URL and redirects to the original long URL
 *     parameters:
 *       - in: path
 *         name: short_url
 *         description: The short URL to resolve
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123"
 *     responses:
 *       200:
 *         description: Redirected to the long URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 long_url:
 *                   type: string
 *                   example: "https://example.com"
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */

router.get("/:short_url", async (req, res) => {
  try {
    const { short_url } = req.params;
    const longUrl = await urlService.getLongUrl(short_url);

    res.redirect(301, longUrl);
  } catch (error) {
    responseHandler.error(res, error.message, 404);
  }
});

module.exports = router;
