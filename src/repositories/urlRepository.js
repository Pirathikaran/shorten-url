const Url = require("../models/urlModel");

// find a URL by its long URL
const findByLongUrl = async (longUrl) => {
  return await Url.findOne({
    long_url: longUrl,
    $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
  });
};

// find a URL by its short URL
const findByShortUrl = async (shortUrl) => {
  return await Url.findOne({
    short_url: shortUrl,
    $or: [{ expires_at: null }, { expires_at: { $gt: Date.now() } }],
  });
};

//create a Shorten URL
const create = async (longUrl, shortUrl, expirationDuration) => {
  const expiresAt = expirationDuration
    ? new Date(Date.now() + expirationDuration)
    : undefined; 

  const newUrl = new Url({
    long_url: longUrl,
    short_url: shortUrl,
    expires_at: expiresAt,
  });

  return await newUrl.save();
};

module.exports = { findByLongUrl, findByShortUrl, create };
