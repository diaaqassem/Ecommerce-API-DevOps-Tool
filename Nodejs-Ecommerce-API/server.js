/* eslint-disable node/no-missing-require */
const express = require("express");
// app secure
const { rateLimit } = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const ApiError = require("./utils/apiError.js");
const { webhookCheckout } = require("./services/orderService.js");
// cors middleware enable other domain to access app
const cors = require("cors");
app.use(cors());
// pre-flight
app.options("*", cors());

// to compression res
const Compression = require("compression");

app.use(Compression());

// webhook for stripe
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 3001;
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

//  @desc   connect DB
require("./config/database").connectDB();

//  @dec  access routes
const { mountRoutes } = require("./routes");

// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  // Log to the console (handle logger)
  app.use(morgan("dev"));
}

// @desc  appp secure
// handle brute force

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: " too many requests",
});

// Apply the rate limiting middleware to all requests.
app.use("/api", limiter);

// middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());
// Add a second HPP middleware to apply the whitelist only to this route.

app.use(
  hpp({
    whitelist: ["ratingsQuantity", "ratingsAverage", "price", "sold"],
  })
);

//to prevet nosql query injection
app.use(mongoSanitize());

// to prevent xss (ignore script in input)
app.use(xss());

mountRoutes(app);

app.all("*", (req, res, next) => {
  //  generate error and send to middleware to handle
  // let err = new Error(`Not Found - ${req.method} to ${req.url}`);
  // err.status = 404;
  // next(err);
  next(new ApiError(`Not found - ${req.method} to ${req.url}`, 404));
});
//  global error handling middleware
app.use(require("./middlewares/errorMiddleware.js").globalError);

console.log(
  `mode : ${(process.env.NODE_ENV = process.argv[2] || "development")}`
);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} \n http://localhost:${PORT}/`);
});

// npm i nodemon -D

// handle  unhandled promise rejection , crash error ,handle global error outside express
process.on("unhandledRejection", (err) => {
  console.error(
    `Unhandled Rejection Error ! , path : ${err.name} , message : ${err.message}\n`
  );
  server.close(() => {
    console.error("Server closed ... Exiting now ... ");
    process.exit(1);
  });
});
