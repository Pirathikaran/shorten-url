const { generateShortUrl } = require("../utils/validation");
const urlRepository = require("../repositories/urlRepository");

jest.mock("../repositories/urlRepository");

describe("Utils: validation functions", () => {
  describe("generateShortUrl", () => {
    it("should generate a unique short URL", async () => {
      urlRepository.findByShortUrl.mockResolvedValueOnce(null);

      const longUrl = "https://example.com";
      const shortUrl = await generateShortUrl(longUrl);

      expect(shortUrl).toBeTruthy();
      expect(shortUrl).toHaveLength(8);
    });

    it("should retry generating a unique short URL if one already exists", async () => {
      const mockExistingShortUrl = "abc12345";

      urlRepository.findByShortUrl
        .mockResolvedValueOnce({ short_url: mockExistingShortUrl })
        .mockResolvedValueOnce(null);

      const longUrl = "https://example.com";
      const shortUrl = await generateShortUrl(longUrl);

      expect(shortUrl).not.toBe(mockExistingShortUrl);
      expect(shortUrl).toHaveLength(8);
    });
  });
});
