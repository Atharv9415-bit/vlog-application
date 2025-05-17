require('dotenv').config();
const express=require("express");
const app=express();
const path=require("path");
const PORT=process.env.PORT ||8000;
const userRoutes=require("./routes/userRoutes");
const blogRoutes=require("./routes/blogRoutes");
const Blog=require("./models/blogModel");
const {checkForAuthenticationCookie}=require("./middleWares/middleWareForAuthentication");
const {connectMongoDB}=require('./connectMongoDB');
const cookieParser = require("cookie-parser");
connectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the app if DB fails
  });

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.join(__dirname, "public")));//main
app.use("/user",userRoutes);
app.use("/blog",blogRoutes);
app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({});//sort means arranging array in specific position
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
        PORT:PORT,

    });
});

app.listen(PORT,()=>console.log(`server started at http://localhost:${PORT}/user/signUp`));