const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan"); // 3rd party logger
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// const logger = require("./middleware/logger"); <-- customer logger
// routes files

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const authUser = require("./routes/authUser");
const adminUser = require("./routes/adminUser");
const reviews = require("./routes/reviews");
// load env vars
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();

const app = express();

// body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// dev loggin middleware

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent cross site scripting attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent Http param pollution
app.use(hpp());

// Enable Cors
app.use(cors());
// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", authUser);
app.use("/api/v1/users", adminUser);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);
const PORT = process.env.PORT || 6000;

app.listen(PORT, console.log("server is running on port", PORT));
