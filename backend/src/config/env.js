const dotenv = require("dotenv");

dotenv.config();

const allowedOrigins = String(
  process.env.ALLOWED_ORIGINS ||
    `${process.env.FRONTEND_ORIGIN || "http://localhost:5173"},http://localhost:5174`,
)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  allowedOrigins,
  databaseUrl: process.env.DATABASE_URL,
  pgHost: process.env.PGHOST || "localhost",
  pgPort: Number(process.env.PGPORT || 5432),
  pgUser: process.env.PGUSER || "postgres",
  pgPassword: process.env.PGPASSWORD || "postgres",
  pgDatabase: process.env.PGDATABASE || "flipkart_clone",
  jwtSecret: process.env.JWT_SECRET || "change-this-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  paymentCurrency: process.env.PAYMENT_CURRENCY || "inr",
  externalProductsApi:
    process.env.EXTERNAL_PRODUCTS_API || "https://dummyjson.com",
};

module.exports = { env };
