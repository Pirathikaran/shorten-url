const validUrl = require("valid-url");
const crypto = require("crypto");

const urlRepository = require("../repositories/urlRepository");

// function validateUrl(url) {
//   return validUrl.isUri(url);
// }

async function generateShortUrl(longUrl) {
  let shortUrl;
  let exists = true;

  while (exists) {
    const hash = crypto
      .createHash("sha1")
      .update(longUrl + Date.now())
      .digest("hex");
    shortUrl = hash.substring(0, 8); // First 8 characters of the hash

    // Check if the generated short URL already exists in the database
    exists = await urlRepository.findByShortUrl(shortUrl);
  }

  return shortUrl;
}

module.exports = { generateShortUrl };
