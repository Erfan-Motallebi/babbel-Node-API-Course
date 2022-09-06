const express = require("express");
const cors = require("cors");
const {
  userRoutes,
  languageRoutes,
  lessonRoutes,
  courseRoutes,
} = require("./controllers");
const { errorHandler, notFound } = require("./middlewares");
const compression = require("compression");
const helmet = require("helmet");
const postgresql = require("./db/connection");
const path = require("path");

// Database Connection
postgresql();

const app = express();

app.use(
  express.json({ strict: true, limit: "150kb", type: "application/json" })
);
app.use(express.static(path.resolve("public")));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());

// User Routes
app.use("/user", userRoutes);
app.use("/language", languageRoutes);
app.use("/lesson", lessonRoutes);
app.use("/course", courseRoutes);

app.all("*", notFound);

// Error Handlers
app.use(errorHandler);

module.exports = {
  app,
};
