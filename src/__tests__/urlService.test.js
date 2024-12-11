const urlService = require("../services/urlService");
const urlRepository = require("../repositories/urlRepository");
const { generateShortUrl } = require("../utils/validation");

jest.mock("../repositories/urlRepository");
jest.mock("../utils/validation");

describe("urlService", () => {
  describe("shortenUrl", () => {
    const mockLongUrl = "https://example.com";
    const mockShortUrl = "abc123";
    const mockDefaultExpiration = 5 * 365.25 * 24 * 60 * 60 * 1000; // 5 years in milliseconds

    it("should return an existing short URL if the long URL is already in the database", async () => {
      const mockUrl = { long_url: mockLongUrl, short_url: mockShortUrl };
      urlRepository.findByLongUrl.mockResolvedValue(mockUrl);

      const result = await urlService.shortenUrl(mockLongUrl);

      expect(result).toBe(mockShortUrl);
      expect(urlRepository.findByLongUrl).toHaveBeenCalledWith(mockLongUrl);
      expect(urlRepository.create).not.toHaveBeenCalled();
    });

    it("should create a new short URL if the long URL is not in the database", async () => {
      urlRepository.findByLongUrl.mockResolvedValue(null);
      generateShortUrl.mockResolvedValue(mockShortUrl);
      const mockNewUrl = {
        long_url: mockLongUrl,
        short_url: mockShortUrl,
        expires_at: new Date(Date.now() + mockDefaultExpiration),
      };
      urlRepository.create.mockResolvedValue(mockNewUrl);

      const result = await urlService.shortenUrl(mockLongUrl);

      expect(result).toBe(mockShortUrl);
      expect(urlRepository.findByLongUrl).toHaveBeenCalledWith(mockLongUrl);
      expect(generateShortUrl).toHaveBeenCalledWith(mockLongUrl);
      expect(urlRepository.create).toHaveBeenCalledWith(
        mockLongUrl,
        mockShortUrl,
        mockDefaultExpiration
      );
    });

    it("should create a new short URL with a custom expiration duration if provided", async () => {
      const customExpiration = 7 * 24 * 60 * 60 * 1000; // 7 days
      urlRepository.findByLongUrl.mockResolvedValue(null);
      generateShortUrl.mockResolvedValue(mockShortUrl);
      const mockNewUrl = {
        long_url: mockLongUrl,
        short_url: mockShortUrl,
        expires_at: new Date(Date.now() + customExpiration),
      };
      urlRepository.create.mockResolvedValue(mockNewUrl);

      const result = await urlService.shortenUrl(mockLongUrl, customExpiration);

      expect(result).toBe(mockShortUrl);
      expect(urlRepository.findByLongUrl).toHaveBeenCalledWith(mockLongUrl);
      expect(generateShortUrl).toHaveBeenCalledWith(mockLongUrl);
      expect(urlRepository.create).toHaveBeenCalledWith(
        mockLongUrl,
        mockShortUrl,
        customExpiration
      );
    });
  });

  describe("getLongUrl", () => {
    const mockShortUrl = "abc123";
    const mockLongUrl = "https://example.com";

    it("should return the long URL for a valid short URL", async () => {
      const mockUrl = { long_url: mockLongUrl, short_url: mockShortUrl };
      urlRepository.findByShortUrl.mockResolvedValue(mockUrl);

      const result = await urlService.getLongUrl(mockShortUrl);

      expect(result).toBe(mockLongUrl);
      expect(urlRepository.findByShortUrl).toHaveBeenCalledWith(mockShortUrl);
    });

    it("should throw an error if the short URL is not found", async () => {
      urlRepository.findByShortUrl.mockResolvedValue(null);

      await expect(urlService.getLongUrl(mockShortUrl)).rejects.toThrow(
        "Short URL not found"
      );
      expect(urlRepository.findByShortUrl).toHaveBeenCalledWith(mockShortUrl);
    });
  });
});
