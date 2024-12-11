const urlRepository = require("../repositories/urlRepository");
const { generateShortUrl } = require("../utils/validation");

const DEFAULT_EXPIRATION_DURATION = 5 * 365.25 * 24 * 60 * 60 * 1000;

//create shorten url
const shortenUrl = async (longUrl, expirationDuration = DEFAULT_EXPIRATION_DURATION) => {
  let url = await urlRepository.findByLongUrl(longUrl);

  if (url) {
    return url.short_url;
  }
  const shortUrl = await generateShortUrl(longUrl);

  const newUrl = await urlRepository.create(longUrl, shortUrl, expirationDuration);
  return newUrl.short_url;
};

//get the long url from the short URL
const getLongUrl = async (shortUrl) => {
  const url = await urlRepository.findByShortUrl(shortUrl);
  if (!url) throw new Error("Short URL not found");
  return url.long_url;
};

module.exports = { shortenUrl, getLongUrl };
