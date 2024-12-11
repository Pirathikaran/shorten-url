const urlRepository = require("../repositories/urlRepository");
const Url = require("../models/urlModel");

jest.mock("../models/urlModel");

describe("urlRepository", () => {
  beforeAll(() => {
    const mockNow = 1733934492351; 
    jest.spyOn(Date, "now").mockImplementation(() => mockNow);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("findByLongUrl", () => {
    it("should return a URL document if the long URL exists and is not expired", async () => {
      const mockLongUrl = "https://example.com";
      const mockUrl = {
        long_url: mockLongUrl,
        short_url: "abc123",
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24), 
      };

      Url.findOne.mockResolvedValue(mockUrl);

      const result = await urlRepository.findByLongUrl(mockLongUrl);

      expect(result).toEqual(mockUrl);
      expect(Url.findOne).toHaveBeenCalledWith({
        long_url: mockLongUrl,
        $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
      });
    });
    it("should return null if the long URL exists but is expired", async () => {
      const mockLongUrl = "https://expiredexample.com";
      const expiredUrl = {
        long_url: mockLongUrl,
        short_url: "expired123",
        expires_at: new Date(Date.now() - 1000), 
      };
    
      const mockNow = Date.now();
      jest.spyOn(global.Date, "now").mockImplementation(() => mockNow);
    
      Url.findOne.mockImplementation((query) => {
        const isExpired =
          query.$or.some(
            (condition) =>
              condition.expires_at &&
              condition.expires_at.$gt &&
              condition.expires_at.$gt <= mockNow
          ) === false;
        return isExpired ? expiredUrl : null;
      });
    
      const result = await urlRepository.findByLongUrl(mockLongUrl);
    
      expect(result).toBeNull();
    
      jest.restoreAllMocks();
    });
   
    it("should create a URL with expiration when expirationDuration is provided", async () => {
      const mockLongUrl = "https://example.com";
      const mockShortUrl = "abc123";
      const mockExpirationDuration = 7 * 24 * 60 * 60 * 1000; // 7 days
      const expectedExpiresAt = new Date(Date.now() + mockExpirationDuration);
      const mockNewUrl = {
        long_url: mockLongUrl,
        short_url: mockShortUrl,
        expires_at: expectedExpiresAt,
      };
    
      Url.prototype.save.mockResolvedValue(mockNewUrl);
    
      const result = await urlRepository.create(
        mockLongUrl,
        mockShortUrl,
        mockExpirationDuration
      );
    
      expect(result).toEqual(mockNewUrl);
      expect(Url.prototype.save).toHaveBeenCalled();
    });
    
    it("should create a URL without expiration when expirationDuration is not provided", async () => {
      const mockLongUrl = "https://example.com";
      const mockShortUrl = "abc123";
      const mockNewUrl = {
        long_url: mockLongUrl,
        short_url: mockShortUrl,
        expires_at: undefined,
      };
    
      Url.prototype.save.mockResolvedValue(mockNewUrl);
    
      const result = await urlRepository.create(mockLongUrl, mockShortUrl);
    
      expect(result).toEqual(mockNewUrl);
      expect(Url.prototype.save).toHaveBeenCalled();
    });
    

    it("should return null if the long URL is expired", async () => {
      const mockLongUrl = "https://example.com";

      Url.findOne.mockResolvedValue(null);

      const result = await urlRepository.findByLongUrl(mockLongUrl);

      expect(result).toBeNull();
      expect(Url.findOne).toHaveBeenCalledWith({
        long_url: mockLongUrl,
        $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
      });
    });
  });
});

describe("findByShortUrl", () => {
  it("should return a URL document if the short URL exists and is not expired", async () => {
    const mockShortUrl = "abc123";
    const mockUrl = {
      long_url: "https://example.com",
      short_url: mockShortUrl,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
    };

    Url.findOne.mockResolvedValue(mockUrl);

    const result = await urlRepository.findByShortUrl(mockShortUrl);

    expect(result).toEqual(mockUrl);
    expect(Url.findOne).toHaveBeenCalledWith({
      short_url: mockShortUrl,
      $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
    });
  });

  it("should return null if the short URL does not exist", async () => {
    const mockShortUrl = "nonexistent";
    
    Url.findOne.mockResolvedValue(null);

    const result = await urlRepository.findByShortUrl(mockShortUrl);

    expect(result).toBeNull();
    expect(Url.findOne).toHaveBeenCalledWith({
      short_url: mockShortUrl,
      $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
    });
  });
});

