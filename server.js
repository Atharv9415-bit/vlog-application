require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

const port = process.env.PORT || 8000;

const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const Blog = require("./models/blogModel");
const { checkForAuthenticationCookie } = require("./middleWares/middleWareForAuthentication");
const { connectMongoDB } = require('./connectMongoDB');

// Connect to MongoDB without exiting the app on failure
connectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    // Don't exit here; app can start but DB won't work until fixed
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication middleware
app.use(checkForAuthenticationCookie("token"));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// Root route with error handling
app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
      PORT: port,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// General error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/user/signUp`);
});
