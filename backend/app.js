const express = require("express");
const cors = require("cors");
const { env } = require("./src/config/env");
const { apiRouter } = require("./src/routes/api");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = Number(err.status || err.statusCode || 500);
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
});

app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});
