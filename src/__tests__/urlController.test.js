const request = require("supertest");
const express = require("express");
const urlController = require("../controllers/urlController");
const urlService = require("../services/urlService");

const app = express();
app.use(express.json());
app.use("/api/v1", urlController);

jest.mock("../services/urlService");

describe("POST /v1/shorten", () => {
  it("should shorten a valid URL", async () => {
    const longUrl = "https://example.com";
    const shortUrl = "abc123";
    urlService.shortenUrl.mockResolvedValue(shortUrl);

    const response = await request(app)
      .post("/api/v1/shorten")
      .send({ long_url: longUrl });

    expect(response.status).toBe(200);

    expect(response.body.data).toHaveProperty(
      "short_url",
      `http://short.ly/${shortUrl}`
    );
  });

  it("should return 400 for invalid URL format", async () => {
    const invalidUrl = "invalid-url";

    const response = await request(app)
      .post("/api/v1/shorten")
      .send({ long_url: invalidUrl });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid URL format");
  });
});

describe("POST /api/v1/shorten", () => {
  it("should handle internal server error", async () => {
    const longUrl = "https://example.com";

    // Mock `urlService.shortenUrl` to throw an error
    urlService.shortenUrl.mockImplementation(() => {
      throw new Error("Something went wrong");
    });

    const response = await request(app)
      .post("/api/v1/shorten")
      .send({ long_url: longUrl });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Something went wrong");
  });
});


describe("GET /api/v1/:short_url", () => {
  it("should redirect to the long URL", async () => {
    const shortUrl = "abc123";
    const longUrl = "https://example.com";
    urlService.getLongUrl.mockResolvedValue(longUrl);

    const response = await request(app).get(`/api/v1/${shortUrl}`);

    expect(response.status).toBe(301);
    expect(response.header.location).toBe(longUrl);
  });

  it("should return 404 if short URL is not found", async () => {
    const shortUrl = "nonexistent";
    urlService.getLongUrl.mockRejectedValue(new Error("Short URL not found"));

    const response = await request(app).get(`/api/v1/${shortUrl}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Short URL not found");
  });
});
