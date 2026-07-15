import dotenv from "dotenv";
dotenv.config();

// Helper function to validate required env variables
const requireEnv = (key) => {
  if (!process.env[key]) {
    throw new Error(`❌ ${key} is not defined in environment variables`);
  }
  return process.env[key];
};

const config = {
  PORT: process.env.PORT || 8080,

  // Database
  MONGO_URI: requireEnv("MONGODB_URI"),

  // JWT
  JWT_SECRET: requireEnv("JWT_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),

  // Email
  EMAIL_USER: requireEnv("EMAIL_USER"),
  PASS: requireEnv("PASS"),

  // APIs
  API_KEY: requireEnv("API_KEY"),
  News_API_KEY: requireEnv("News_API_KEY"),
  GROQ_API_KEY: requireEnv("GROQ_API_KEY"),

  // Google (optional - no force validation since you didn't always include them)
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_USER: process.env.GOOGLE_USER,

  // Angle One
  ANGLE_ONE_CLIENT_CODE: process.env.ANGLE_ONE_CLIENT_CODE,
  ANGLE_ONE_API_KEY: process.env.ANGLE_ONE_API_KEY,
  ANGLE_ONE_TOTP: process.env.ANGLE_ONE_TOTP,
  ANGLE_ONE_PIN: process.env.ANGLE_ONE_PIN,

  // Razorpay
  TEST_KEY_ID: process.env.TEST_KEY_ID,
  TEST_KEY_SECRET: process.env.TEST_KEY_SECRET,
  URL:process.env.URL
};

export default config;