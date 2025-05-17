require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import routes and middleware
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const Blog = require("./models/blogModel");
const { checkForAuthenticationCookie } = require("./middleWares/middleWareForAuthentication");

// Set port from env or default 8000
const port = process.env.PORT || 8000;

// MongoDB connection function
async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Stop the server if DB connection fails
  }
}

// Connect to MongoDB
connectMongoDB();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

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

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}/user/signUp`)
);
