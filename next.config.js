require("dotenv").config();

function mongodb_uri() {
  if (process.env.NODE_ENV === "production") {
    return process.env.MONGODB_URI_PRODUCTION;
  }
  return process.env.MONGODB_URI_STAGING;
}

module.exports = {
  env: {
    MONGO_URI: mongodb_uri(),
    //MONGO_URI: process.env.MONGODB_URI,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_SCOPE: "openid profile email",
    REDIRECT_URI:
      process.env.REDIRECT_URI || "http://localhost:3000/api/callback",
    POST_LOGOUT_REDIRECT_URI:
      process.env.POST_LOGOUT_REDIRECT_URI || "http://localhost:3000/",
    SESSION_COOKIE_SECRET:
      // A default value is defined for development and CI
      // For production, a secure value should be defined as
      // explained here: https://martinfowler.com/articles/session-secret.html
      process.env.SESSION_COOKIE_SECRET ||
      "viloxyf_z2GW6K4CT-KQD_MoLEA2wqv5jWuq4Jd0P7ymgG5GJGMpvMneXZzhK3sL",
    SESSION_COOKIE_LIFETIME: 7200, // 2 hours
  },
};
